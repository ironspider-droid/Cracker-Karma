"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Footprints, Cloud, Bike, Trees, HeartPulse } from "lucide-react";

export default function ActivityTracker() {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = () => {
    setIsConnected(true);
    toast({
      title: "Fitness Data Connected!",
      description: "Your daily activity is now syncing.",
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast({
      title: "Fitness Data Disconnected",
      description: "Your activity data is no longer syncing.",
    });
  };

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
        <CardDescription>
          {isConnected
            ? "From your connected fitness devices."
            : "Connect your fitness band to sync your daily activity."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isConnected ? (
          <>
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
            <Button variant="outline" onClick={handleDisconnect} className="w-full">
              Disconnect
            </Button>
          </>
        ) : (
            <div className="text-center flex flex-col items-center gap-4 py-4">
                <HeartPulse className="w-12 h-12 text-primary/30" />
                <p className="text-muted-foreground text-sm">
                    Sync your activity to see its impact on your cracker budget.
                </p>
                <Button onClick={handleConnect}>
                    <HeartPulse className="w-4 h-4 mr-2"/>
                    Connect Fitness Data
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
