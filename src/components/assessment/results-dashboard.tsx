'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  TrendingUp,
  Droplets,
  Container,
  BarChart,
  FileText,
  DollarSign,
  Download,
  ShieldCheck
} from 'lucide-react';
import { PotentialChart } from './potential-chart';
import { CostBenefitChart } from './cost-benefit-chart';

type ResultsDashboardProps = {
  data: {
    projectName: string;
    location: string;
    feasibility: string;
    confidenceScore: number;
    structureType: string;
    tankMaterial: string;
    waterCollectionEstimate: number;
    groundwaterRechargePotential: number;
    optimalTankSize: number;
    costEstimation: {
      investment: number;
      annualSavings: number;
    };
    localRainfall: number;
    groundwaterLevel: number;
    rooftopArea: number;
    annualDemand: number;
  };
};

export function ResultsDashboard({ data }: ResultsDashboardProps) {
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <Card className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Feasibility Report: {data.projectName}</CardTitle>
          <CardDescription className="text-primary-foreground/80">{data.location}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="h-16 w-16" />
            <div>
              <p className="text-5xl font-bold">{data.feasibility}</p>
              <p className="text-lg">for Rainwater Harvesting</p>
            </div>
          </div>
          <div className="text-center md:text-right">
             <p className="text-sm">CONFIDENCE SCORE</p>
             <p className="text-6xl font-bold">{data.confidenceScore}%</p>
          </div>
        </CardContent>
         <CardFooter className="flex justify-end">
            <Button variant="secondary" onClick={handlePrint} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
         </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary"><Droplets /> Water Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {data.waterCollectionEstimate.toLocaleString()} L/year
            </div>
            <p className="text-muted-foreground">Estimated annual collection from a {data.rooftopArea} m² roof.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary"><TrendingUp /> Recharge Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {data.groundwaterRechargePotential.toLocaleString()} L/year
            </div>
            <p className="text-muted-foreground">Surplus water available for recharging groundwater.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary"><Container /> Recommended Tank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {data.optimalTankSize.toLocaleString()} Liters
            </div>
            <p className="text-muted-foreground">Optimal tank size based on demand and harvest.</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary"><BarChart /> Annual Water Balance</CardTitle>
            </CardHeader>
            <CardContent>
                <PotentialChart 
                    harvested={data.waterCollectionEstimate}
                    demand={data.annualDemand}
                    stored={data.optimalTankSize}
                    recharged={data.groundwaterRechargePotential}
                />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary"><FileText /> System Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <h4 className="font-semibold">Structure Type</h4>
                    <p className="text-muted-foreground">{data.structureType}</p>
                </div>
                 <div>
                    <h4 className="font-semibold">Tank Material</h4>
                    <p className="text-muted-foreground">{data.tankMaterial}</p>
                </div>
                <div>
                    <h4 className="font-semibold">Local Rainfall</h4>
                    <p className="text-muted-foreground">{data.localRainfall} mm/year</p>
                </div>
                <div>
                    <h4 className="font-semibold">Groundwater Level</h4>
                    <p className="text-muted-foreground">{data.groundwaterLevel} meters deep</p>
                </div>
            </CardContent>
          </Card>
       </div>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary"><DollarSign /> Cost & Savings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                 <div>
                    <h4 className="font-semibold">Estimated Investment</h4>
                    <p className="text-muted-foreground text-2xl font-bold text-destructive">₹ {data.costEstimation.investment.toLocaleString()}</p>
                </div>
                 <div>
                    <h4 className="font-semibold">Projected Annual Savings</h4>
                    <p className="text-muted-foreground text-2xl font-bold text-green-600">₹ {data.costEstimation.annualSavings.toLocaleString()}</p>
                </div>
                <div>
                    <h4 className="font-semibold">Return on Investment</h4>
                    <p className="text-muted-foreground">Approx. {(data.costEstimation.investment / data.costEstimation.annualSavings).toFixed(1)} years</p>
                </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary"><ShieldCheck /> Cost-Benefit Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                <CostBenefitChart 
                    investment={data.costEstimation.investment}
                    savings={data.costEstimation.annualSavings}
                />
            </CardContent>
          </Card>
       </div>

    </div>
  );
}
