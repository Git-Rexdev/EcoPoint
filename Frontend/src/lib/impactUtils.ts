import { RecyclingRecord } from '@/types';

// Environmental impact factors per kg of recycled material
const IMPACT_FACTORS = {
  // CO2 saved (kg CO2 per kg material)
  co2: {
    plastic: 2.0,    // Recycling 1kg plastic saves 2kg CO2
    paper: 1.7,      // Recycling 1kg paper saves 1.7kg CO2
    glass: 0.3,      // Recycling 1kg glass saves 0.3kg CO2
    metal: 1.5,      // Recycling 1kg metal saves 1.5kg CO2
    electronics: 3.0, // Recycling 1kg electronics saves 3kg CO2
    organic: 0.5,    // Composting 1kg organic saves 0.5kg CO2
  },
  
  // Water saved (liters per kg material)
  water: {
    plastic: 50,     // Recycling 1kg plastic saves 50L water
    paper: 60,       // Recycling 1kg paper saves 60L water
    glass: 2,        // Recycling 1kg glass saves 2L water
    metal: 40,       // Recycling 1kg metal saves 40L water
    electronics: 80, // Recycling 1kg electronics saves 80L water
    organic: 10,     // Composting 1kg organic saves 10L water
  },
  
  // Energy saved (kWh per kg material)
  energy: {
    plastic: 2.5,    // Recycling 1kg plastic saves 2.5 kWh
    paper: 4.0,      // Recycling 1kg paper saves 4.0 kWh
    glass: 0.2,      // Recycling 1kg glass saves 0.2 kWh
    metal: 6.0,      // Recycling 1kg metal saves 6.0 kWh
    electronics: 8.0, // Recycling 1kg electronics saves 8.0 kWh
    organic: 0.1,    // Composting 1kg organic saves 0.1 kWh
  },
};

// Trees saved calculation (primarily from paper)
const TREES_PER_KG_PAPER = 0.017; // 1kg paper = 0.017 trees saved

// Conversion factors
const CO2_TO_MILES = 0.404; // 1kg CO2 = 0.404 miles of driving
const KWH_TO_HOME_DAYS = 0.04; // 1 kWh = 0.04 days of average home power

export interface EnvironmentalImpact {
  co2Saved: number;
  waterConserved: number;
  energySaved: number;
  treesSaved: number;
  milesEquivalent: number;
  daysEquivalent: number;
  materialBreakdown: {
    type: string;
    weight: number;
    percentage: number;
  }[];
}

export function calculateEnvironmentalImpact(records: RecyclingRecord[]): EnvironmentalImpact {
  let totalCo2 = 0;
  let totalWater = 0;
  let totalEnergy = 0;
  let totalPaper = 0;
  
  // Calculate totals by material type
  const materialTotals: Record<string, number> = {};
  
  records.forEach(record => {
    const weight = record.weight || 0;
    const type = record.type.toLowerCase();
    
    // Accumulate material weights
    materialTotals[type] = (materialTotals[type] || 0) + weight;
    
    // Calculate environmental impacts
    if (IMPACT_FACTORS.co2[type as keyof typeof IMPACT_FACTORS.co2]) {
      totalCo2 += weight * IMPACT_FACTORS.co2[type as keyof typeof IMPACT_FACTORS.co2];
    }
    
    if (IMPACT_FACTORS.water[type as keyof typeof IMPACT_FACTORS.water]) {
      totalWater += weight * IMPACT_FACTORS.water[type as keyof typeof IMPACT_FACTORS.water];
    }
    
    if (IMPACT_FACTORS.energy[type as keyof typeof IMPACT_FACTORS.energy]) {
      totalEnergy += weight * IMPACT_FACTORS.energy[type as keyof typeof IMPACT_FACTORS.energy];
    }
    
    // Track paper for trees calculation
    if (type === 'paper') {
      totalPaper += weight;
    }
  });
  
  // Calculate derived metrics
  const treesSaved = totalPaper * TREES_PER_KG_PAPER;
  const milesEquivalent = totalCo2 * CO2_TO_MILES;
  const daysEquivalent = totalEnergy * KWH_TO_HOME_DAYS;
  
  // Calculate material breakdown percentages
  const totalWeight = Object.values(materialTotals).reduce((sum, weight) => sum + weight, 0);
  const materialBreakdown = Object.entries(materialTotals)
    .map(([type, weight]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      weight,
      percentage: totalWeight > 0 ? Math.round((weight / totalWeight) * 100) : 0,
    }))
    .sort((a, b) => b.weight - a.weight);
  
  return {
    co2Saved: Math.round(totalCo2 * 10) / 10, // Round to 1 decimal
    waterConserved: Math.round(totalWater),
    energySaved: Math.round(totalEnergy * 10) / 10, // Round to 1 decimal
    treesSaved: Math.round(treesSaved * 100) / 100, // Round to 2 decimals
    milesEquivalent: Math.round(milesEquivalent * 10) / 10, // Round to 1 decimal
    daysEquivalent: Math.round(daysEquivalent * 10) / 10, // Round to 1 decimal
    materialBreakdown,
  };
}

// Get color for material type
export function getMaterialColor(type: string): string {
  const colors: Record<string, string> = {
    plastic: 'bg-blue-500',
    paper: 'bg-green-500',
    glass: 'bg-amber-500',
    metal: 'bg-gray-500',
    electronics: 'bg-purple-500',
    organic: 'bg-orange-500',
  };
  
  return colors[type.toLowerCase()] || 'bg-gray-400';
}