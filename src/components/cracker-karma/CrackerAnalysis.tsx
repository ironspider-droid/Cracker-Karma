"use client";

import { useState, useRef } from "react";
import { Loader2, Wand2, AlertTriangle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAirQuality } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

export type AnalysisResult = {
  aqi: number;
  city: string;
  recommendation: string;
};

type CrackerAnalysisProps = {
  onAnalysisComplete: (result: AnalysisResult, adjustment: number) => void;
};

export default function CrackerAnalysis({ onAnalysisComplete }: CrackerAnalysisProps) {
  const [location, setLocation] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const parseBudgetAdjustment = (aqi: number): number => {
    if (aqi > 150) return -200; // Unhealthy
    if (aqi > 100) return -100; // Moderate
    if (aqi > 50) return -25; // Sensitive groups
    return 0; // Good
  };

  const handleAnalyze = async () => {
    if (!location) {
        toast({
            variant: "destructive",
            title: "Location required",
            description: "Please enter a city name.",
        });
        return;
    };

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const result = await getAirQuality(location);

    if (result.success) {
      setAnalysisResult(result.data);
      const adjustment = parseBudgetAdjustment(result.data.aqi);
      onAnalysisComplete(result.data, adjustment);
    } else {
      setError(result.error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: result.error,
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          Air Quality Check
        </CardTitle>
        <CardDescription>
          Enter a city to check the current air quality and its impact on your budget.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
            <Input
                type="text"
                placeholder="E.g., 'Delhi' or 'New York'"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isLoading}
            />
            <Button
              onClick={handleAnalyze}
              disabled={!location || isLoading}
              className="whitespace-nowrap"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Analyze
            </Button>
        </div>

        {isLoading && (
          <div className="text-center p-4 rounded-lg bg-secondary">
             <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
             <p className="mt-2 text-sm font-semibold">Checking air quality... please wait.</p>
          </div>
        )}
        
        {analysisResult && (
          <Card className="bg-secondary">
            <CardHeader>
              <CardTitle className="text-lg">Analysis for {analysisResult.city}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold">Current Air Quality Index (AQI)</h4>
                <p className="text-muted-foreground font-bold text-lg">{analysisResult.aqi}</p>
              </div>
              <div>
                <h4 className="font-semibold">Recommendation</h4>
                <p className="text-muted-foreground">{analysisResult.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <p className="text-sm font-medium">{error}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
