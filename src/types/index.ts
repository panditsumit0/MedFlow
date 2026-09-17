// MedFlow Types - Simple and well-commented for healthcare operations

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'WARNING' | 'SAFE';

export interface Facility {
  id: string;
  name: string;
  city: string;
  facility_type: 'District Hospital' | 'Government Hospital' | 'Primary Health Center (PHC)' | 'Medical College Hospital';
  latitude: number;
  longitude: number;
}

export interface Medicine {
  id: string;
  name: string;
  category: 'Analgesic / Antipyretic' | 'Endocrine / Diabetes' | 'Antibiotic' | 'Oral Rehydration' | 'Intravenous Fluids';
  criticality: 'High' | 'Medium' | 'Essential';
}

export interface InventoryItem {
  id: string;
  facility_id: string;
  medicine_id: string;
  current_stock: number;
  daily_consumption: number;
  incoming_stock: number;
  reorder_level: number;
  last_updated: string;
}

// Enriched Inventory combines InventoryItem with Medicine & Facility details + calculated shortage risk
export interface EnrichedInventoryItem {
  id: string;
  facility: Facility;
  medicine: Medicine;
  current_stock: number;
  daily_consumption: number;
  incoming_stock: number;
  reorder_level: number;
  last_updated: string;
  days_remaining: number;
  projected_available_stock: number;
  projected_days_remaining: number;
  risk_level: RiskLevel;
  explanation: {
    stockFormula: string;
    consumptionInfo: string;
    summary: string;
  };
}

export interface RegionalShortageAlert {
  id: string;
  medicine_id: string;
  medicine_name: string;
  affected_facilities_count: number;
  critical_facilities_count: number;
  facilities: {
    facility_id: string;
    facility_name: string;
    city: string;
    days_remaining: number;
    risk_level: RiskLevel;
    current_stock: number;
  }[];
  surplus_facilities: {
    facility_id: string;
    facility_name: string;
    city: string;
    days_remaining: number;
    surplus_stock: number;
  }[];
  risk_severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  headline: string;
  explanation: string;
}

export interface DashboardStats {
  totalFacilities: number;
  totalMedicines: number;
  criticalMedicinesCount: number;
  facilitiesAtRiskCount: number;
  regionalShortageAlertsCount: number;
}

export interface RedistributionRecommendation {
  id: string;
  medicine: Medicine;
  source_facility: Facility;
  destination_facility: Facility;
  source_stock: number;
  destination_stock: number;
  source_surplus: number;
  suggested_transfer_quantity: number;
  estimated_distance_km: number;
  destination_days_remaining: number;
  source_days_remaining: number;
  source_days_after_transfer: number;
  destination_days_after_transfer: number;
  reason: string;
  status: 'TRANSFER RECOMMENDED';
}

export interface AlertItem {
  id: string;
  category: 'Critical Shortage' | 'High Risk' | 'Regional Shortage' | 'Redistribution Opportunity';
  severity: 'CRITICAL' | 'HIGH' | 'WARNING' | 'INFO';
  medicine_name: string;
  facility_name: string;
  city?: string;
  projected_shortage: string;
  explanation: string;
  recommended_action: string;
  timestamp: string;
}

export interface FacilitySummary {
  facility: Facility;
  total_medicines_monitored: number;
  critical_medicines_count: number;
  at_risk_medicines_count: number;
  safe_medicines_count: number;
  overall_risk: RiskLevel;
  most_urgent_medicine?: {
    name: string;
    days_remaining: number;
    risk_level: RiskLevel;
  };
  inventory: EnrichedInventoryItem[];
}

export interface MedicineSummary {
  medicine: Medicine;
  total_stock: number;
  avg_daily_consumption: number;
  facilities_at_risk_count: number;
  total_facilities_monitored: number;
  regional_risk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'NONE';
  lowest_stock_facility?: {
    facility_name: string;
    city: string;
    days_remaining: number;
    current_stock: number;
    risk_level: RiskLevel;
  };
  highest_stock_facility?: {
    facility_name: string;
    city: string;
    days_remaining: number;
    current_stock: number;
    risk_level: RiskLevel;
  };
  inventory: EnrichedInventoryItem[];
}

export interface SimulationResultItem {
  id: string;
  medicine: Medicine;
  facility: Facility;
  current_stock: number;
  baseline_consumption: number;
  baseline_days_remaining: number;
  baseline_risk: RiskLevel;
  simulated_consumption: number;
  simulated_days_remaining: number;
  simulated_risk: RiskLevel;
  days_change: number;
  is_newly_critical: boolean;
  has_risk_worsened: boolean;
}
