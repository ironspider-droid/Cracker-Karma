"use client";

import { useState } from "react";
import { Sparkles, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BudgetDisplay from "@/components/cracker-karma/BudgetDisplay";
import CrackerAnalysis, { type AnalysisResult } from "@/components/cracker-karma/CrackerAnalysis";
import ActivityTracker from "@/components/cracker-karma/ActivityTracker";
import EcoActions from "@/components/cracker-karma/EcoActions";
import CrackerGuide from "@/components/cracker-karma/CrackerGuide";

export default function Home() {
  const [budget, setBudget] = useState(1000);
  const { toast } = useToast();

  const handleBudgetUpdate = (amount: number, message: string) => {
    setBudget((prev) => Math.max(0, prev + amount));
    toast({
      title: message,
      description: `Your budget is now ${Math.max(
        0,
        budget + amount
      ).toLocaleString()} points.`,
      duration: 3000,
    });
  };

  const handleAnalysisComplete = (result: AnalysisResult, adjustment: number) => {
    handleBudgetUpdate(adjustment, "Cracker Analyzed!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Leaf className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold font-headline text-foreground">
                Cracker Karma
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2 space-y-8">
            <BudgetDisplay budget={budget} />
            <CrackerAnalysis onAnalysisComplete={handleAnalysisComplete} />
          </div>
          <div className="space-y-8">
            <ActivityTracker />
            <EcoActions onBudgetUpdate={handleBudgetUpdate} />
          </div>
        </div>

        <div className="mt-8">
          <CrackerGuide budget={budget} onBudgetUpdate={handleBudgetUpdate} />
        </div>
      </main>

      <footer className="py-6 border-t mt-8">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Cracker Karma. Burst responsibly.</p>
        </div>
      </footer>
    </div>
  );
}
