"use client";

import { useState, useRef } from "react";
import { Loader2, Wand2, AlertTriangle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { analyzeCracker } from "@/ai/flows/analyzeCrackerFlow";
import type { AnalyzeCrackerOutput } from "@/ai/schemas/crackerAnalysis";

export type CrackerAnalysisResult = AnalyzeCrackerOutput;

type CrackerScannerProps = {
  onAnalysisComplete: (result: CrackerAnalysisResult) => void;
};

export default function CrackerScanner({ onAnalysisComplete }: CrackerScannerProps) {
  const [crackerImage, setCrackerImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CrackerAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCrackerImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAnalysisResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!crackerImage || !previewUrl) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please select an image of a cracker to analyze.",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeCracker({ photoDataUri: previewUrl });
      if (!result.isCracker) {
        setError(result.reason || "The image does not seem to contain a cracker.");
        setAnalysisResult(result);
      } else {
        setAnalysisResult(result);
        onAnalysisComplete(result);
      }
    } catch (e: any) {
      console.error(e);
      const errorMessage = e.message || "An unexpected error occurred during analysis.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: errorMessage,
      });
    }

    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-primary" />
          Cracker Scanner
        </CardTitle>
        <CardDescription>
          Upload an image of a firecracker to analyze its impact on your pollution budget.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex-grow"
          >
            <Upload className="mr-2 h-4 w-4" />
            {crackerImage ? crackerImage.name : "Choose an image"}
          </Button>
          <Button
            onClick={handleAnalyze}
            disabled={!crackerImage || isLoading}
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

        {previewUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden border">
            <img src={previewUrl} alt="Cracker preview" className="object-contain w-full h-full" />
          </div>
        )}

        {isLoading && (
          <div className="text-center p-4 rounded-lg bg-secondary">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm font-semibold">Analyzing your cracker... this might take a moment.</p>
          </div>
        )}

        {analysisResult && (
          <Card className={analysisResult.isCracker ? "bg-secondary" : "bg-destructive/10"}>
            <CardHeader>
              <CardTitle className="text-lg">
                {analysisResult.isCracker ? `Analysis for: ${analysisResult.crackerName}` : "Analysis Result"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold">Assessment</h4>
                <p className="text-muted-foreground">{analysisResult.reason}</p>
              </div>
              {analysisResult.isCracker && (
                <div>
                  <h4 className="font-semibold">Budget Impact</h4>
                  <p className="text-muted-foreground font-bold text-lg text-destructive">{analysisResult.pollutionPoints} points</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {error && !analysisResult?.isCracker && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
