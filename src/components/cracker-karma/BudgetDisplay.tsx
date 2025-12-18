"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

type BudgetDisplayProps = {
  budget: number;
};

export default function BudgetDisplay({ budget }: BudgetDisplayProps) {
  const [displayBudget, setDisplayBudget] = useState(budget);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (budget !== displayBudget) {
      setIsAnimating(true);
      const difference = budget - displayBudget;
      const duration = 500; // ms
      let startTimestamp: number | null = null;

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setDisplayBudget(Math.floor(displayBudget + difference * progress));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setDisplayBudget(budget);
          setTimeout(() => setIsAnimating(false), 200);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [budget]);

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium text-foreground/80">
          Your Cracker Budget for Next Year
        </CardTitle>
        <TrendingUp className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent>
        <div
          className={`text-5xl font-bold font-headline text-primary transition-all duration-200 ${
            isAnimating ? "scale-110 text-accent" : ""
          }`}
        >
          {displayBudget.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground pt-1">
          Pollution Points Available
        </p>
      </CardContent>
    </Card>
  );
}
