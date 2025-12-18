"use client";

import Image from "next/image";
import { useState } from "react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sparkles, MinusCircle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const crackerTypes = [
  { id: "cracker-sparkler", name: "Sparklers", cost: 10 },
  { id: "cracker-fountain", name: "Fountains", cost: 50 },
  { id: "cracker-rocket", name: "Rockets", cost: 100 },
  { id: "cracker-wheel", name: "Wheels", cost: 75 },
];

type CrackerGuideProps = {
  budget: number;
  onBudgetUpdate: (amount: number, message: string) => void;
};

export default function CrackerGuide({ budget, onBudgetUpdate }: CrackerGuideProps) {
    const [warningOpen, setWarningOpen] = useState(false);

    const handleBurst = (cost: number, name: string) => {
        if (budget < cost) {
            setWarningOpen(true);
        } else {
            onBudgetUpdate(-cost, `You burst a ${name}!`);
        }
    }

  return (
    <Card className="shadow-lg mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Cracker Category Guide</CardTitle>
        <p className="text-muted-foreground">See how many crackers you can burst with your budget.</p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {crackerTypes.map((cracker) => {
          const image = PlaceHolderImages.find((img) => img.id === cracker.id);
          const canAfford = budget >= cracker.cost;
          const howMany = canAfford ? Math.floor(budget / cracker.cost) : 0;
          return (
            <Card key={cracker.id} className="flex flex-col overflow-hidden">
              <CardHeader className="p-0">
                 {image && (
                    <div className="relative aspect-video">
                        <Image
                            src={image.imageUrl}
                            alt={image.description}
                            data-ai-hint={image.imageHint}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                <div className="p-4">
                     <CardTitle className="text-xl">{cracker.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5"><MinusCircle className="w-4 h-4" /> Cost:</span>
                    <span className="font-bold text-destructive">{cracker.cost} pts</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-accent" /> You can burst:</span>
                    <span className="font-bold text-primary">{howMany}</span>
                 </div>
              </CardContent>
              <CardFooter>
                 <AlertDialog open={warningOpen && !canAfford} onOpenChange={setWarningOpen}>
                    <Button 
                        className="w-full" 
                        onClick={() => handleBurst(cracker.cost, cracker.name)}
                        disabled={!canAfford && !warningOpen} // Allow click to trigger dialog
                    >
                        <Sparkles className="w-4 h-4 mr-2" /> Burst One
                    </Button>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Budget Exceeded!</AlertDialogTitle>
                        <AlertDialogDescription>
                            You don't have enough points to burst this cracker. Complete more eco-friendly actions to increase your budget for next year.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Got it</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
