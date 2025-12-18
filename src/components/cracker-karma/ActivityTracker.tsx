"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footprints, Cloud, Bike, Trees } from "lucide-react";

export default function ActivityTracker() {
  // Mock data for demonstration purposes
  const dailyData = {
    steps: 8230,
    carbonFootprint: 2.5, // in kg CO2e
    commute: "Bicycle",
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trees className="w-6 h-6 text-primary"/>
          Today's Eco-Stats
        </CardTitle>
        <CardDescription>From your connected fitness devices.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center p-3 -m-3 rounded-lg hover:bg-secondary/50 transition-colors">
          <Footprints className="h-8 w-8 text-primary/80 mr-4" />
          <div>
            <p className="font-bold text-lg">{dailyData.steps.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Steps Taken</p>
          </div>
        </div>
        <div className="flex items-center p-3 -m-3 rounded-lg hover:bg-secondary/50 transition-colors">
          <Cloud className="h-8 w-8 text-primary/80 mr-4" />
          <div>
            <p className="font-bold text-lg">{dailyData.carbonFootprint} kg <span className="text-sm font-normal">CO2e</span></p>
            <p className="text-sm text-muted-foreground">Carbon Footprint</p>
          </div>
        </div>
        <div className="flex items-center p-3 -m-3 rounded-lg hover:bg-secondary/50 transition-colors">
          <Bike className="h-8 w-8 text-primary/80 mr-4" />
          <div>
            <p className="font-bold text-lg">{dailyData.commute}</p>
            <p className="text-sm text-muted-foreground">Zero-Emission Commute</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
