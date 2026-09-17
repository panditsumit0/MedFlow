import { Facility, Medicine, InventoryItem, DashboardStats } from '@/types';
import { enrichInventoryItem, detectRegionalShortages } from '@/lib/riskEngine';

/**
 * SIMULATION DATASET: Rajasthan Healthcare Network
 * 
 * DISCLAIMER:
 * This is simulated demonstration data generated strictly for testing the MedFlow MVP.
 * It does NOT represent actual government inventory or confidential healthcare data.
 */

export const SIMULATION_FACILITIES: Facility[] = [
  {
    id: 'fac-jaipur',
    name: 'Jaipur Government Hospital',
    city: 'Jaipur',
    facility_type: 'Medical College Hospital',
    latitude: 26.9124,
    longitude: 75.7873,
  },
  {
    id: 'fac-ajmer',
    name: 'Ajmer District Hospital',
    city: 'Ajmer',
    facility_type: 'District Hospital',
    latitude: 26.4499,
    longitude: 74.6399,
  },
  {
    id: 'fac-kota',
    name: 'Kota Government Hospital',
    city: 'Kota',
    facility_type: 'Government Hospital',
    latitude: 25.2138,
    longitude: 75.8648,
  },
  {
    id: 'fac-jodhpur',
    name: 'Jodhpur Government Hospital',
    city: 'Jodhpur',
    facility_type: 'District Hospital',
    latitude: 26.2389,
    longitude: 73.0243,
  },
  {
    id: 'fac-udaipur',
    name: 'Udaipur District Hospital',
    city: 'Udaipur',
    facility_type: 'District Hospital',
    latitude: 24.5854,
    longitude: 73.7125,
  },
  {
    id: 'fac-alwar',
    name: 'Alwar PHC (Primary Health Center)',
    city: 'Alwar',
    facility_type: 'Primary Health Center (PHC)',
    latitude: 27.5530,
    longitude: 76.6346,
  },
  {
    id: 'fac-bikaner',
    name: 'Bikaner District Hospital',
    city: 'Bikaner',
    facility_type: 'District Hospital',
    latitude: 28.0229,
    longitude: 73.3119,
  },
  {
    id: 'fac-sikar',
    name: 'Sikar Government Hospital',
    city: 'Sikar',
    facility_type: 'Government Hospital',
    latitude: 27.6094,
    longitude: 75.1398,
  },
  {
    id: 'fac-bharatpur',
    name: 'Bharatpur Hospital',
    city: 'Bharatpur',
    facility_type: 'District Hospital',
    latitude: 27.2152,
    longitude: 77.4930,
  },
  {
    id: 'fac-bhilwara',
    name: 'Bhilwara District Hospital',
    city: 'Bhilwara',
    facility_type: 'District Hospital',
    latitude: 25.3407,
    longitude: 74.6313,
  },
];

export const SIMULATION_MEDICINES: Medicine[] = [
  {
    id: 'med-paracetamol',
    name: 'Paracetamol (500mg)',
    category: 'Analgesic / Antipyretic',
    criticality: 'Essential',
  },
  {
    id: 'med-insulin',
    name: 'Insulin (Human Regular 100IU)',
    category: 'Endocrine / Diabetes',
    criticality: 'High',
  },
  {
    id: 'med-amoxicillin',
    name: 'Amoxicillin (500mg)',
    category: 'Antibiotic',
    criticality: 'High',
  },
  {
    id: 'med-ors',
    name: 'ORS (Oral Rehydration Salts)',
    category: 'Oral Rehydration',
    criticality: 'Essential',
  },
  {
    id: 'med-azithromycin',
    name: 'Azithromycin (500mg)',
    category: 'Antibiotic',
    criticality: 'High',
  },
  {
    id: 'med-metformin',
    name: 'Metformin (500mg)',
    category: 'Endocrine / Diabetes',
    criticality: 'Medium',
  },
  {
    id: 'med-cefixime',
    name: 'Cefixime (200mg)',
    category: 'Antibiotic',
    criticality: 'High',
  },
  {
    id: 'med-ivfluids',
    name: 'IV Fluids (Normal Saline 0.9% 500ml)',
    category: 'Intravenous Fluids',
    criticality: 'Essential',
  },
];

export const SIMULATION_INVENTORY: InventoryItem[] = [
  // PARACETAMOL - Key Demonstration Flow
  // Jaipur: Critical (2 days)
  {
    id: 'inv-1',
    facility_id: 'fac-jaipur',
    medicine_id: 'med-paracetamol',
    current_stock: 50,
    daily_consumption: 25,
    incoming_stock: 0,
    reorder_level: 200,
    last_updated: '2026-09-17T10:00:00Z',
  },
  // Ajmer: Critical (3 days)
  {
    id: 'inv-2',
    facility_id: 'fac-ajmer',
    medicine_id: 'med-paracetamol',
    current_stock: 90,
    daily_consumption: 30,
    incoming_stock: 0,
    reorder_level: 250,
    last_updated: '2026-09-17T09:30:00Z',
  },
  // Alwar: High Risk (6 days)
  {
    id: 'inv-3',
    facility_id: 'fac-alwar',
    medicine_id: 'med-paracetamol',
    current_stock: 120,
    daily_consumption: 20,
    incoming_stock: 40,
    reorder_level: 150,
    last_updated: '2026-09-17T08:45:00Z',
  },
  // Kota: High Surplus (50 days) - Primary Redistribution Source
  {
    id: 'inv-4',
    facility_id: 'fac-kota',
    medicine_id: 'med-paracetamol',
    current_stock: 1500,
    daily_consumption: 30,
    incoming_stock: 200,
    reorder_level: 300,
    last_updated: '2026-09-17T11:15:00Z',
  },
  // Jodhpur: Safe (21 days)
  {
    id: 'inv-5',
    facility_id: 'fac-jodhpur',
    medicine_id: 'med-paracetamol',
    current_stock: 600,
    daily_consumption: 28,
    incoming_stock: 0,
    reorder_level: 250,
    last_updated: '2026-09-17T07:30:00Z',
  },
  // Bikaner: Safe (25 days)
  {
    id: 'inv-6',
    facility_id: 'fac-bikaner',
    medicine_id: 'med-paracetamol',
    current_stock: 450,
    daily_consumption: 18,
    incoming_stock: 0,
    reorder_level: 180,
    last_updated: '2026-09-17T09:00:00Z',
  },

  // INSULIN - Regional Vulnerability #2
  // Udaipur: Critical (2 days)
  {
    id: 'inv-7',
    facility_id: 'fac-udaipur',
    medicine_id: 'med-insulin',
    current_stock: 30,
    daily_consumption: 15,
    incoming_stock: 0,
    reorder_level: 100,
    last_updated: '2026-09-17T09:15:00Z',
  },
  // Bhilwara: High Risk (5 days)
  {
    id: 'inv-8',
    facility_id: 'fac-bhilwara',
    medicine_id: 'med-insulin',
    current_stock: 60,
    daily_consumption: 12,
    incoming_stock: 20,
    reorder_level: 90,
    last_updated: '2026-09-17T10:30:00Z',
  },
  // Jodhpur: Safe (45 days)
  {
    id: 'inv-9',
    facility_id: 'fac-jodhpur',
    medicine_id: 'med-insulin',
    current_stock: 450,
    daily_consumption: 10,
    incoming_stock: 100,
    reorder_level: 120,
    last_updated: '2026-09-17T08:00:00Z',
  },
  // Jaipur: Safe (20 days)
  {
    id: 'inv-10',
    facility_id: 'fac-jaipur',
    medicine_id: 'med-insulin',
    current_stock: 320,
    daily_consumption: 16,
    incoming_stock: 0,
    reorder_level: 150,
    last_updated: '2026-09-17T11:00:00Z',
  },

  // IV FLUIDS - Regional Vulnerability #3
  // Sikar: Critical (2.7 days)
  {
    id: 'inv-11',
    facility_id: 'fac-sikar',
    medicine_id: 'med-ivfluids',
    current_stock: 80,
    daily_consumption: 30,
    incoming_stock: 0,
    reorder_level: 250,
    last_updated: '2026-09-17T07:15:00Z',
  },
  // Bharatpur: High Risk (5.2 days)
  {
    id: 'inv-12',
    facility_id: 'fac-bharatpur',
    medicine_id: 'med-ivfluids',
    current_stock: 130,
    daily_consumption: 25,
    incoming_stock: 50,
    reorder_level: 200,
    last_updated: '2026-09-17T09:45:00Z',
  },
  // Bikaner: Surplus (42.5 days)
  {
    id: 'inv-13',
    facility_id: 'fac-bikaner',
    medicine_id: 'med-ivfluids',
    current_stock: 850,
    daily_consumption: 20,
    incoming_stock: 0,
    reorder_level: 200,
    last_updated: '2026-09-17T08:20:00Z',
  },

  // AMOXICILLIN
  // Jaipur: Warning (10 days)
  {
    id: 'inv-14',
    facility_id: 'fac-jaipur',
    medicine_id: 'med-amoxicillin',
    current_stock: 350,
    daily_consumption: 35,
    incoming_stock: 150,
    reorder_level: 300,
    last_updated: '2026-09-17T10:10:00Z',
  },
  // Ajmer: Safe (18 days)
  {
    id: 'inv-15',
    facility_id: 'fac-ajmer',
    medicine_id: 'med-amoxicillin',
    current_stock: 450,
    daily_consumption: 25,
    incoming_stock: 0,
    reorder_level: 200,
    last_updated: '2026-09-17T09:50:00Z',
  },
  // Kota: High Risk (6 days)
  {
    id: 'inv-16',
    facility_id: 'fac-kota',
    medicine_id: 'med-amoxicillin',
    current_stock: 120,
    daily_consumption: 20,
    incoming_stock: 0,
    reorder_level: 180,
    last_updated: '2026-09-17T11:20:00Z',
  },

  // ORS - General supply is healthy
  // Alwar: Safe (30 days)
  {
    id: 'inv-17',
    facility_id: 'fac-alwar',
    medicine_id: 'med-ors',
    current_stock: 600,
    daily_consumption: 20,
    incoming_stock: 100,
    reorder_level: 200,
    last_updated: '2026-09-17T09:00:00Z',
  },
  // Jaipur: Safe (24 days)
  {
    id: 'inv-18',
    facility_id: 'fac-jaipur',
    medicine_id: 'med-ors',
    current_stock: 1200,
    daily_consumption: 50,
    incoming_stock: 0,
    reorder_level: 400,
    last_updated: '2026-09-17T10:00:00Z',
  },

  // AZITHROMYCIN
  // Jodhpur: Warning (9 days)
  {
    id: 'inv-19',
    facility_id: 'fac-jodhpur',
    medicine_id: 'med-azithromycin',
    current_stock: 180,
    daily_consumption: 20,
    incoming_stock: 0,
    reorder_level: 150,
    last_updated: '2026-09-17T08:30:00Z',
  },
  // Bhilwara: Critical (3 days)
  {
    id: 'inv-20',
    facility_id: 'fac-bhilwara',
    medicine_id: 'med-azithromycin',
    current_stock: 45,
    daily_consumption: 15,
    incoming_stock: 0,
    reorder_level: 100,
    last_updated: '2026-09-17T10:15:00Z',
  },

  // METFORMIN
  // Udaipur: Safe (25 days)
  {
    id: 'inv-21',
    facility_id: 'fac-udaipur',
    medicine_id: 'med-metformin',
    current_stock: 500,
    daily_consumption: 20,
    incoming_stock: 100,
    reorder_level: 200,
    last_updated: '2026-09-17T09:20:00Z',
  },
  // Sikar: Safe (35 days)
  {
    id: 'inv-22',
    facility_id: 'fac-sikar',
    medicine_id: 'med-metformin',
    current_stock: 700,
    daily_consumption: 20,
    incoming_stock: 0,
    reorder_level: 200,
    last_updated: '2026-09-17T07:45:00Z',
  },

  // CEFIXIME
  // Bharatpur: Warning (11 days)
  {
    id: 'inv-23',
    facility_id: 'fac-bharatpur',
    medicine_id: 'med-cefixime',
    current_stock: 220,
    daily_consumption: 20,
    incoming_stock: 50,
    reorder_level: 150,
    last_updated: '2026-09-17T10:05:00Z',
  },
  // Kota: Safe (28 days)
  {
    id: 'inv-24',
    facility_id: 'fac-kota',
    medicine_id: 'med-cefixime',
    current_stock: 560,
    daily_consumption: 20,
    incoming_stock: 0,
    reorder_level: 180,
    last_updated: '2026-09-17T11:30:00Z',
  },
];

/**
 * Returns fully calculated inventory items with facilities and medicine data attached.
 */
export function getEnrichedInventory() {
  const facilityMap = new Map(SIMULATION_FACILITIES.map(f => [f.id, f]));
  const medicineMap = new Map(SIMULATION_MEDICINES.map(m => [m.id, m]));

  return SIMULATION_INVENTORY.map(item => {
    const facility = facilityMap.get(item.facility_id) || {
      id: item.facility_id,
      name: 'Unknown Facility',
      city: 'Unknown',
      facility_type: 'Government Hospital',
      latitude: 26.9,
      longitude: 75.8,
    };
    const medicine = medicineMap.get(item.medicine_id) || {
      id: item.medicine_id,
      name: 'Unknown Medicine',
      category: 'Analgesic / Antipyretic',
      criticality: 'Essential',
    };
    return enrichInventoryItem(item, facility, medicine);
  });
}

/**
 * Calculates high-level summary KPIs for the top statistic cards
 */
export function getDashboardStats(): DashboardStats {
  const enriched = getEnrichedInventory();
  const regionalAlerts = detectRegionalShortages(enriched);

  // Critical medicines: medicines that have at least 1 facility at CRITICAL risk
  const criticalMedicineIds = new Set(
    enriched.filter(item => item.risk_level === 'CRITICAL').map(item => item.medicine.id)
  );

  // Facilities at risk: facilities with at least 1 item at CRITICAL or HIGH risk
  const facilitiesAtRiskIds = new Set(
    enriched.filter(item => item.risk_level === 'CRITICAL' || item.risk_level === 'HIGH').map(item => item.facility.id)
  );

  return {
    totalFacilities: SIMULATION_FACILITIES.length,
    totalMedicines: SIMULATION_MEDICINES.length,
    criticalMedicinesCount: criticalMedicineIds.size,
    facilitiesAtRiskCount: facilitiesAtRiskIds.size,
    regionalShortageAlertsCount: regionalAlerts.length,
  };
}
