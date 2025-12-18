"use client";

import { useState, useRef, type DragEvent } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, Wand2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeCrackerImage } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { type AnalyzeCrackerPollutionOutput } from "@/ai/flows/analyze-cracker-pollution";

export type AnalysisResult = AnalyzeCrackerPollutionOutput;

type CrackerAnalysisProps = {
  onAnalysisComplete: (result: AnalysisResult, adjustment: number) => void;
};

export default function CrackerAnalysis({ onAnalysisComplete }: CrackerAnalysisProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisResult(null);
      setError(null);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Please select a valid image file.",
      });
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const parseBudgetAdjustment = (text: string): number => {
    const reductionMatch = text.match(/(reduce|deduct|decrease) by (\d+)/i);
    if (reductionMatch) return -parseInt(reductionMatch[2], 10);

    const additionMatch = text.match(/(increase|add|award) by (\d+)/i);
    if (additionMatch) return parseInt(additionMatch[2], 10);
    
    // Fallback if no clear instruction is found, assume a negative impact
    const numberMatch = text.match(/(\d+)/);
    if(numberMatch) return -parseInt(numberMatch[0], 10);

    return -50; // Default penalty
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      const result = await analyzeCrackerImage({ photoDataUri: base64Data });

      if (result.success) {
        setAnalysisResult(result.data);
        const adjustment = parseBudgetAdjustment(result.data.budgetAdjustment);
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
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-primary" />
          Cracker Pollution Analysis
        </CardTitle>
        <CardDescription>
          Upload a photo of a firecracker to estimate its pollution impact.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
            className="hidden"
            accept="image/*"
          />
          <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            Click or drag an image here to upload.
          </p>
        </div>

        {previewUrl && (
          <div className="relative w-full max-w-sm mx-auto aspect-video rounded-lg overflow-hidden border">
            <Image src={previewUrl} alt="Cracker preview" fill style={{ objectFit: 'contain' }} />
          </div>
        )}

        <Button
          onClick={handleAnalyze}
          disabled={!selectedImage || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Analyze Cracker
        </Button>

        {isLoading && (
          <div className="text-center p-4 rounded-lg bg-secondary">
             <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
             <p className="mt-2 text-sm font-semibold">AI is analyzing... please wait.</p>
          </div>
        )}
        
        {analysisResult && (
          <Card className="bg-secondary">
            <CardHeader>
              <CardTitle className="text-lg">Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold">Estimated Pollution</h4>
                <p className="text-muted-foreground">{analysisResult.estimatedPollution}</p>
              </div>
              <div>
                <h4 className="font-semibold">Budget Impact</h4>
                <p className="text-muted-foreground">{analysisResult.budgetAdjustment}</p>
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
