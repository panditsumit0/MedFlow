import {
  Facility,
  Medicine,
  InventoryItem,
  EnrichedInventoryItem,
  RiskLevel,
  RegionalShortageAlert,
  RedistributionRecommendation,
  AlertItem,
  FacilitySummary,
  MedicineSummary,
  SimulationResultItem,
} from '@/types';

/**
 * Shortage Risk Estimation Engine - Single Source of Truth
 *
 * Explains:
 * 1. Simple, transparent inventory math without black-box complexity.
 * 2. Edge case handling (0 consumption, 0 stock, incoming deliveries).
 * 3. Categorization into CRITICAL (0-3d), HIGH (4-7d), WARNING (8-14d), SAFE (15+d).
 * 4. Regional cluster detection across multiple districts.
 * 5. Decision-support redistribution recommendation using geographic distance & surplus.
 */

export function calculateDaysRemaining(stock: number, dailyConsumption: number): number {
  const cleanStock = Math.max(0, stock);

  if (dailyConsumption <= 0) {
    return cleanStock === 0 ? 0 : 999;
  }

  const days = cleanStock / dailyConsumption;
  return Math.round(days * 10) / 10;
}

export function classifyRisk(daysRemaining: number): RiskLevel {
  if (daysRemaining <= 3) return 'CRITICAL';
  if (daysRemaining <= 7) return 'HIGH';
  if (daysRemaining <= 14) return 'WARNING';
  return 'SAFE';
}

// Alias for backward compatibility / explicit naming
export const calculateRiskLevel = classifyRisk;

/**
 * Calculate distance in kilometers between two geographic coordinates using the Haversine formula
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function enrichInventoryItem(
  item: InventoryItem,
  facility: Facility,
  medicine: Medicine
): EnrichedInventoryItem {
  const currentStock = Math.max(0, item.current_stock);
  const incomingStock = Math.max(0, item.incoming_stock);
  const dailyConsumption = Math.max(0, item.daily_consumption);

  const daysRemaining = calculateDaysRemaining(currentStock, dailyConsumption);
  const projectedAvailableStock = currentStock + incomingStock;
  const projectedDaysRemaining = calculateDaysRemaining(projectedAvailableStock, dailyConsumption);
  const riskLevel = classifyRisk(daysRemaining);

  let summary = '';
  if (riskLevel === 'CRITICAL') {
    summary = `Projected shortage in approximately ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}. Immediate replenishment or stock redistribution required.`;
  } else if (riskLevel === 'HIGH') {
    summary = `Stock will run out in ${daysRemaining} days. Reorder or prepare transfer before stock hits critical buffer.`;
  } else if (riskLevel === 'WARNING') {
    summary = `Inventory is within standard reorder threshold (${daysRemaining} days remaining).`;
  } else {
    summary = `Stock is stable with ${daysRemaining >= 900 ? '90+' : daysRemaining} days of supply remaining.`;
  }

  return {
    ...item,
    current_stock: currentStock,
    incoming_stock: incomingStock,
    daily_consumption: dailyConsumption,
    facility,
    medicine,
    days_remaining: daysRemaining,
    projected_available_stock: projectedAvailableStock,
    projected_days_remaining: projectedDaysRemaining,
    risk_level: riskLevel,
    explanation: {
      stockFormula: `Current Stock (${currentStock.toLocaleString()} units) ÷ Daily Consumption (${dailyConsumption} units/day) = ${daysRemaining} days`,
      consumptionInfo:
        incomingStock > 0
          ? `Incoming shipment of ${incomingStock.toLocaleString()} units extends projected runway to ${projectedDaysRemaining} days.`
          : `No pending incoming replenishment recorded for this facility.`,
      summary,
    },
  };
}

/**
 * Detects regional shortage risks across the network.
 * A regional shortage risk triggers when 2 or more facilities are projected to run low (<= 7 days) on the same medicine.
 */
export function detectRegionalShortages(
  enrichedItems: EnrichedInventoryItem[]
): RegionalShortageAlert[] {
  const byMedicine = new Map<string, EnrichedInventoryItem[]>();
  enrichedItems.forEach((item) => {
    const list = byMedicine.get(item.medicine.id) || [];
    list.push(item);
    byMedicine.set(item.medicine.id, list);
  });

  const alerts: RegionalShortageAlert[] = [];

  byMedicine.forEach((items, medicineId) => {
    const medicineName = items[0].medicine.name;
    const atRiskItems = items.filter((i) => i.days_remaining <= 7);
    const criticalItems = items.filter((i) => i.days_remaining <= 3);
    const surplusItems = items.filter(
      (i) => i.days_remaining >= 15 && i.current_stock > i.reorder_level
    );

    if (atRiskItems.length >= 2) {
      const severity: 'CRITICAL' | 'HIGH' | 'MODERATE' =
        criticalItems.length >= 2 ? 'CRITICAL' : criticalItems.length === 1 ? 'HIGH' : 'MODERATE';

      const facilityNames = atRiskItems.map((i) => i.facility.city).join(', ');

      alerts.push({
        id: `reg-alert-${medicineId}`,
        medicine_id: medicineId,
        medicine_name: medicineName,
        affected_facilities_count: atRiskItems.length,
        critical_facilities_count: criticalItems.length,
        risk_severity: severity,
        headline: `Regional ${medicineName} Supply Vulnerability (${atRiskItems.length} Facilities at Risk)`,
        explanation: `Multiple facilities (${facilityNames}) are projected to experience low ${medicineName} availability within 7 days. Declining stock across multiple districts signals systemic regional shortage risk rather than isolated stockouts.`,
        facilities: atRiskItems.map((i) => ({
          facility_id: i.facility.id,
          facility_name: i.facility.name,
          city: i.facility.city,
          days_remaining: i.days_remaining,
          risk_level: i.risk_level,
          current_stock: i.current_stock,
        })),
        surplus_facilities: surplusItems.map((i) => ({
          facility_id: i.facility.id,
          facility_name: i.facility.name,
          city: i.facility.city,
          days_remaining: i.days_remaining,
          surplus_stock: Math.max(0, i.current_stock - i.reorder_level),
        })),
      });
    }
  });

  return alerts.sort((a, b) => b.critical_facilities_count - a.critical_facilities_count);
}

/**
 * Find facilities that have surplus stock of a given medicine.
 * Surplus = current_stock - reorder_level (where surplus > 0 and days_remaining >= 15)
 */
export function findSurplusFacilities(
  medicineId: string,
  enrichedItems: EnrichedInventoryItem[]
): EnrichedInventoryItem[] {
  return enrichedItems.filter(
    (item) =>
      item.medicine.id === medicineId &&
      item.current_stock > item.reorder_level &&
      item.days_remaining >= 15
  );
}

/**
 * Redistribution Recommendation Engine
 * Connects critical destination facilities to nearest surplus donor facilities.
 */
export function generateRedistributionRecommendations(
  enrichedItems: EnrichedInventoryItem[]
): RedistributionRecommendation[] {
  const recommendations: RedistributionRecommendation[] = [];

  // Group items by medicine
  const byMedicine = new Map<string, EnrichedInventoryItem[]>();
  enrichedItems.forEach((item) => {
    const list = byMedicine.get(item.medicine.id) || [];
    list.push(item);
    byMedicine.set(item.medicine.id, list);
  });

  byMedicine.forEach((items) => {
    // Critical or High risk destinations (<= 7 days)
    const needyFacilities = items
      .filter((i) => i.days_remaining <= 7)
      .sort((a, b) => a.days_remaining - b.days_remaining);

    // Potential donors with positive surplus (current_stock > reorder_level and days >= 15)
    const donorCandidates = items
      .filter((i) => i.current_stock > i.reorder_level && i.days_remaining >= 15)
      .map((donor) => ({
        item: donor,
        availableSurplus: donor.current_stock - donor.reorder_level,
      }))
      .filter((d) => d.availableSurplus > 0)
      .sort((a, b) => b.availableSurplus - a.availableSurplus);

    if (donorCandidates.length === 0) return;

    needyFacilities.forEach((dest) => {
      // Find the best donor: shortest distance with sufficient surplus
      const scoredDonors = donorCandidates
        .map((donorObj) => {
          const dist = calculateHaversineDistance(
            donorObj.item.facility.latitude,
            donorObj.item.facility.longitude,
            dest.facility.latitude,
            dest.facility.longitude
          );
          return {
            ...donorObj,
            distance: dist,
          };
        })
        .sort((a, b) => a.distance - b.distance);

      const bestDonor = scoredDonors[0];
      if (!bestDonor || bestDonor.availableSurplus < 20) return;

      // Calculate suggested transfer quantity:
      // Destination needs enough to reach ~14 days (or at least safe buffer)
      const targetStock = dest.daily_consumption * 14;
      const unitsNeeded = Math.max(0, targetStock - dest.current_stock);
      // Take at most 50% of donor surplus to ensure donor never drops near reorder level
      const maxTransferable = Math.floor(bestDonor.availableSurplus * 0.5);
      // Pick round number
      const rawTransfer = Math.min(unitsNeeded, maxTransferable);
      const suggestedTransfer = Math.max(50, Math.round(rawTransfer / 10) * 10);

      if (suggestedTransfer <= 0) return;

      const destDaysAfter = calculateDaysRemaining(
        dest.current_stock + suggestedTransfer,
        dest.daily_consumption
      );
      const sourceDaysAfter = calculateDaysRemaining(
        bestDonor.item.current_stock - suggestedTransfer,
        bestDonor.item.daily_consumption
      );

      // Deduct from temporary surplus pool
      bestDonor.availableSurplus -= suggestedTransfer;

      recommendations.push({
        id: `rec-${dest.medicine.id}-${bestDonor.item.facility.id}-${dest.facility.id}`,
        medicine: dest.medicine,
        source_facility: bestDonor.item.facility,
        destination_facility: dest.facility,
        source_stock: bestDonor.item.current_stock,
        destination_stock: dest.current_stock,
        source_surplus: bestDonor.item.current_stock - bestDonor.item.reorder_level,
        suggested_transfer_quantity: suggestedTransfer,
        estimated_distance_km: bestDonor.distance,
        destination_days_remaining: dest.days_remaining,
        source_days_remaining: bestDonor.item.days_remaining,
        destination_days_after_transfer: destDaysAfter,
        source_days_after_transfer: sourceDaysAfter,
        reason: `${dest.facility.city} is projected to run out in ${dest.days_remaining} days, while ${bestDonor.item.facility.city} has ${bestDonor.item.days_remaining} days surplus (~${bestDonor.distance} km away).`,
        status: 'TRANSFER RECOMMENDED',
      });
    });
  });

  return recommendations.sort((a, b) => a.destination_days_remaining - b.destination_days_remaining);
}

/**
 * Aggregates inventory by Facility for the Facilities Overview page
 */
export function getFacilitySummaries(
  facilities: Facility[],
  enrichedItems: EnrichedInventoryItem[]
): FacilitySummary[] {
  return facilities.map((facility) => {
    const items = enrichedItems.filter((i) => i.facility.id === facility.id);
    const criticalCount = items.filter((i) => i.risk_level === 'CRITICAL').length;
    const highCount = items.filter((i) => i.risk_level === 'HIGH').length;
    const atRiskCount = criticalCount + highCount;
    const safeCount = items.filter((i) => i.risk_level === 'SAFE').length;

    // Overall facility risk is dictated by worst-case medicine
    let overallRisk: RiskLevel = 'SAFE';
    if (criticalCount > 0) overallRisk = 'CRITICAL';
    else if (highCount > 0) overallRisk = 'HIGH';
    else if (items.some((i) => i.risk_level === 'WARNING')) overallRisk = 'WARNING';

    const sortedByDays = [...items].sort((a, b) => a.days_remaining - b.days_remaining);
    const mostUrgent = sortedByDays[0];

    return {
      facility,
      total_medicines_monitored: items.length,
      critical_medicines_count: criticalCount,
      at_risk_medicines_count: atRiskCount,
      safe_medicines_count: safeCount,
      overall_risk: overallRisk,
      most_urgent_medicine: mostUrgent
        ? {
            name: mostUrgent.medicine.name,
            days_remaining: mostUrgent.days_remaining,
            risk_level: mostUrgent.risk_level,
          }
        : undefined,
      inventory: items,
    };
  });
}

/**
 * Aggregates inventory by Medicine for the Medicines Overview page
 */
export function getMedicineSummaries(
  medicines: Medicine[],
  enrichedItems: EnrichedInventoryItem[],
  regionalAlerts: RegionalShortageAlert[]
): MedicineSummary[] {
  return medicines.map((med) => {
    const items = enrichedItems.filter((i) => i.medicine.id === med.id);
    const totalStock = items.reduce((sum, i) => sum + i.current_stock, 0);
    const avgConsumption =
      items.length > 0
        ? Math.round(
            (items.reduce((sum, i) => sum + i.daily_consumption, 0) / items.length) * 10
          ) / 10
        : 0;
    const atRiskCount = items.filter((i) => i.days_remaining <= 7).length;

    const alert = regionalAlerts.find((a) => a.medicine_id === med.id);
    const regionalRisk = alert ? alert.risk_severity : 'NONE';

    const sortedByDays = [...items].sort((a, b) => a.days_remaining - b.days_remaining);
    const lowest = sortedByDays[0];
    const highest = sortedByDays[sortedByDays.length - 1];

    return {
      medicine: med,
      total_stock: totalStock,
      avg_daily_consumption: avgConsumption,
      facilities_at_risk_count: atRiskCount,
      total_facilities_monitored: items.length,
      regional_risk: regionalRisk,
      lowest_stock_facility: lowest
        ? {
            facility_name: lowest.facility.name,
            city: lowest.facility.city,
            days_remaining: lowest.days_remaining,
            current_stock: lowest.current_stock,
            risk_level: lowest.risk_level,
          }
        : undefined,
      highest_stock_facility: highest
        ? {
            facility_name: highest.facility.name,
            city: highest.facility.city,
            days_remaining: highest.days_remaining,
            current_stock: highest.current_stock,
            risk_level: highest.risk_level,
          }
        : undefined,
      inventory: items,
    };
  });
}

/**
 * Generate Unified Alert Center records
 */
export function generateAlerts(
  enrichedItems: EnrichedInventoryItem[],
  regionalAlerts: RegionalShortageAlert[],
  recommendations: RedistributionRecommendation[]
): AlertItem[] {
  const alerts: AlertItem[] = [];

  // 1. Regional Shortage Alerts
  regionalAlerts.forEach((reg) => {
    alerts.push({
      id: `alert-reg-${reg.id}`,
      category: 'Regional Shortage',
      severity: reg.risk_severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      medicine_name: reg.medicine_name,
      facility_name: `${reg.affected_facilities_count} Facilities across Rajasthan`,
      projected_shortage: 'Depletion within 2–7 days',
      explanation: reg.explanation,
      recommended_action:
        'Initiate inter-facility stock rebalancing and notify State Medical Services Corporation.',
      timestamp: 'Active Monitoring',
    });
  });

  // 2. Critical Facility Shortages (<= 3 days)
  enrichedItems
    .filter((i) => i.risk_level === 'CRITICAL')
    .forEach((item) => {
      alerts.push({
        id: `alert-crit-${item.id}`,
        category: 'Critical Shortage',
        severity: 'CRITICAL',
        medicine_name: item.medicine.name,
        facility_name: item.facility.name,
        city: item.facility.city,
        projected_shortage: `${item.days_remaining} day${item.days_remaining === 1 ? '' : 's'} remaining`,
        explanation: `${item.facility.name} has only ${item.current_stock} units with daily consumption of ${item.daily_consumption} units/day.`,
        recommended_action: 'Dispatch emergency transfer from nearest surplus facility.',
        timestamp: 'Immediate Attention',
      });
    });

  // 3. High Risk Shortages (4-7 days)
  enrichedItems
    .filter((i) => i.risk_level === 'HIGH')
    .forEach((item) => {
      alerts.push({
        id: `alert-high-${item.id}`,
        category: 'High Risk',
        severity: 'HIGH',
        medicine_name: item.medicine.name,
        facility_name: item.facility.name,
        city: item.facility.city,
        projected_shortage: `${item.days_remaining} days remaining`,
        explanation: `${item.facility.name} will reach critical threshold within ${item.days_remaining} days.`,
        recommended_action: 'Place replenishment order or prepare secondary transfer route.',
        timestamp: 'Active Forecast',
      });
    });

  // 4. Redistribution Opportunities
  recommendations.slice(0, 4).forEach((rec) => {
    alerts.push({
      id: `alert-rec-${rec.id}`,
      category: 'Redistribution Opportunity',
      severity: 'INFO',
      medicine_name: rec.medicine.name,
      facility_name: `${rec.source_facility.city} → ${rec.destination_facility.city}`,
      city: rec.destination_facility.city,
      projected_shortage: `Resolve ${rec.destination_days_remaining}d deficit`,
      explanation: `Transfer ${rec.suggested_transfer_quantity} units of ${rec.medicine.name} from ${rec.source_facility.name} (${rec.source_stock} in stock).`,
      recommended_action: `Approve logistics route (${rec.estimated_distance_km} km). Extends runway from ${rec.destination_days_remaining}d to ${rec.destination_days_after_transfer}d.`,
      timestamp: 'Optimization Engine',
    });
  });

  return alerts;
}

/**
 * Simulates What-If Demand change (+0%, +10%, +20%, +30%, +50%) in-memory
 */
export function runDemandSimulation(
  enrichedItems: EnrichedInventoryItem[],
  demandPercentageIncrease: number
): {
  results: SimulationResultItem[];
  newlyCriticalCount: number;
  worsenedRiskCount: number;
  baselineCriticalCount: number;
  simulatedCriticalCount: number;
} {
  const multiplier = 1 + demandPercentageIncrease / 100;
  let newlyCriticalCount = 0;
  let worsenedRiskCount = 0;
  let baselineCriticalCount = 0;
  let simulatedCriticalCount = 0;

  const results: SimulationResultItem[] = enrichedItems.map((item) => {
    const baselineDaily = item.daily_consumption;
    const baselineDays = item.days_remaining;
    const baselineRisk = item.risk_level;

    if (baselineRisk === 'CRITICAL') baselineCriticalCount++;

    const simDaily = Math.round(baselineDaily * multiplier * 10) / 10;
    const simDays = calculateDaysRemaining(item.current_stock, simDaily);
    const simRisk = classifyRisk(simDays);

    if (simRisk === 'CRITICAL') simulatedCriticalCount++;

    const isNewlyCritical = baselineRisk !== 'CRITICAL' && simRisk === 'CRITICAL';
    const hasRiskWorsened =
      (baselineRisk === 'SAFE' && simRisk !== 'SAFE') ||
      (baselineRisk === 'WARNING' && (simRisk === 'HIGH' || simRisk === 'CRITICAL')) ||
      (baselineRisk === 'HIGH' && simRisk === 'CRITICAL');

    if (isNewlyCritical) newlyCriticalCount++;
    if (hasRiskWorsened) worsenedRiskCount++;

    return {
      id: `sim-${item.id}`,
      medicine: item.medicine,
      facility: item.facility,
      current_stock: item.current_stock,
      baseline_consumption: baselineDaily,
      baseline_days_remaining: baselineDays,
      baseline_risk: baselineRisk,
      simulated_consumption: simDaily,
      simulated_days_remaining: simDays,
      simulated_risk: simRisk,
      days_change: Math.round((simDays - baselineDays) * 10) / 10,
      is_newly_critical: isNewlyCritical,
      has_risk_worsened: hasRiskWorsened,
    };
  });

  return {
    results: results.sort((a, b) => a.simulated_days_remaining - b.simulated_days_remaining),
    newlyCriticalCount,
    worsenedRiskCount,
    baselineCriticalCount,
    simulatedCriticalCount,
  };
}
