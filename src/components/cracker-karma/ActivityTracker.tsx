"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footprints, Cloud, Bike } from "lucide-react";

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
        <CardTitle>Today's Eco-Stats</CardTitle>
        <CardDescription>From your connected devices.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <Footprints className="h-6 w-6 text-primary mr-4" />
          <div>
            <p className="font-semibold">{dailyData.steps.toLocaleString()} Steps</p>
            <p className="text-sm text-muted-foreground">Good for you and the planet!</p>
          </div>
        </div>
        <div className="flex items-center">
          <Cloud className="h-6 w-6 text-primary mr-4" />
          <div>
            <p className="font-semibold">{dailyData.carbonFootprint} kg CO2e</p>
            <p className="text-sm text-muted-foreground">Your daily carbon footprint.</p>
          </div>
        </div>
        <div className="flex items-center">
          <Bike className="h-6 w-6 text-primary mr-4" />
          <div>
            <p className="font-semibold">{dailyData.commute} Commute</p>
            <p className="text-sm text-muted-foreground">Zero-emission travel rocks!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
