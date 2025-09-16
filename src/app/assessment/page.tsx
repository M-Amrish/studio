import { Suspense } from 'react';
import { ResultsDashboard } from '@/components/assessment/results-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

type AssessmentParams = {
  projectName: string;
  location: string;
  familyMembers: string;
  roofLength: string;
  roofWidth: string;
  rooftopType: string;
  tankSpaceLength: string;
  tankSpaceWidth: string;
};

// Mock local data
const MOCK_RAINFALL = 800; // mm/year
const MOCK_GROUNDWATER_LEVEL = 10; // meters
const WATER_DEMAND_PER_PERSON = 135; // liters/day
const COST_PER_CUBIC_METER_STORAGE_RCC = 4000;
const COST_OF_WATER_PER_KL = 20; // INR per 1000 liters

function getRunoffCoefficient(rooftopType: string) {
    switch (rooftopType) {
        case 'flat':
            return 0.7;
        case 'sloped':
            return 0.8;
        case 'tiled':
            return 0.85;
        case 'metal':
            return 0.9;
        default:
            return 0.8;
    }
}

function performAssessment(params: AssessmentParams) {
  const roofLength = parseFloat(params.roofLength);
  const roofWidth = parseFloat(params.roofWidth);
  const familyMembers = parseInt(params.familyMembers);
  const runoffCoefficient = getRunoffCoefficient(params.rooftopType);

  const rooftopArea = roofLength * roofWidth;
  const waterCollectionEstimate = rooftopArea * (MOCK_RAINFALL / 1000) * runoffCoefficient * 1000; // in liters

  const dailyDemand = familyMembers * WATER_DEMAND_PER_PERSON;
  const annualDemand = dailyDemand * 365;

  const tankCapacityFromDemand = dailyDemand * 10; // 10 days of storage
  
  const tankSize = Math.min(waterCollectionEstimate * 0.2, tankCapacityFromDemand, 50000); // Max 50k L, or 20% of harvest, or 10 days demand
  const surplusWater = waterCollectionEstimate - tankSize;

  const investment = (tankSize / 1000) * COST_PER_CUBIC_METER_STORAGE_RCC;
  const annualSavings = (waterCollectionEstimate / 1000) * COST_OF_WATER_PER_KL;

  return {
    projectName: params.projectName,
    location: params.location,
    feasibility: 'YES',
    confidenceScore: 95.2,
    confidenceReason: 'Based on high rainfall & sufficient rooftop area.',
    structureType: 'Rooftop Rainwater Harvesting with Recharge Pit',
    tankMaterial: 'RCC (Reinforced Cement Concrete)',
    waterCollectionEstimate: Math.round(waterCollectionEstimate),
    groundwaterRechargePotential: Math.round(surplusWater > 0 ? surplusWater : 0),
    optimalTankSize: Math.round(tankSize),
    costEstimation: {
      investment: Math.round(investment),
      annualSavings: Math.round(annualSavings),
    },
    localRainfall: MOCK_RAINFALL,
    groundwaterLevel: MOCK_GROUNDWATER_LEVEL,
    rooftopArea,
    annualDemand: Math.round(annualDemand),
  };
}

export default function AssessmentResultsPage({
  searchParams,
}: {
  searchParams: AssessmentParams;
}) {
  const assessmentData = performAssessment(searchParams);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-6">Feasibility Report</h1>
        <Suspense fallback={<DashboardSkeleton />}>
            <ResultsDashboard data={assessmentData} />
        </Suspense>
    </div>
  );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-64 w-full lg:col-span-2" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    )
}
