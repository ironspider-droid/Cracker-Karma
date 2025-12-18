"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Recycle, LightbulbOff } from "lucide-react";

type EcoActionsProps = {
  onBudgetUpdate: (amount: number, message: string) => void;
};

const actions = [
  {
    name: "Plant a Tree",
    reward: 150,
    icon: Leaf,
  },
  {
    name: "Recycle Waste",
    reward: 50,
    icon: Recycle,
  },
  {
    name: "Energy Saving Day",
    reward: 75,
    icon: LightbulbOff,
  },
];

export default function EcoActions({ onBudgetUpdate }: EcoActionsProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Boost Your Budget!</CardTitle>
        <CardDescription>Complete eco-friendly actions to earn points.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Button
            key={action.name}
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => onBudgetUpdate(action.reward, `${action.name} complete!`)}
          >
            <action.icon className="h-5 w-5 text-green-500" />
            <span className="flex-1 text-left">{action.name}</span>
            <span className="font-bold text-accent">+{action.reward}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
