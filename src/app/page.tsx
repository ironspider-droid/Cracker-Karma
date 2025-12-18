"use client";

import { useState, useEffect } from "react";
import { Leaf, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BudgetDisplay from "@/components/cracker-karma/BudgetDisplay";
import CrackerAnalysis from "@/components/cracker-karma/CrackerAnalysis";
import CrackerScanner, {
  type CrackerAnalysisResult,
} from "@/components/cracker-karma/CrackerScanner";
import ActivityTracker from "@/components/cracker-karma/ActivityTracker";
import EcoActions from "@/components/cracker-karma/EcoActions";
import CrackerGuide from "@/components/cracker-karma/CrackerGuide";
import { useUser, useAuth, useFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { ThemeToggle } from "@/components/theme-toggle";

type UserProfile = {
  id: string;
  email: string;
  budget: number;
  theme: "light" | "dark" | "system";
};

export default function Home() {
  const { user, isUserLoading } = useUser();
  const { firestore, auth } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

  const [budget, setBudget] = useState(1000);

  // Redirect if user is not logged in
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  const handleBudgetUpdate = (amount: number, message: string) => {
    const newBudget = Math.max(0, budget + amount);
    setBudget(newBudget);

    if (user && firestore) {
      const userRef = doc(firestore, "users", user.uid);
      setDocumentNonBlocking(userRef, { budget: newBudget }, { merge: true });
    }

    toast({
      title: message,
      description: `Your budget is now ${newBudget.toLocaleString()} points.`,
      duration: 3000,
    });
  };

  const handleCrackerAnalysisComplete = (result: CrackerAnalysisResult) => {
    handleBudgetUpdate(
      result.pollutionPoints,
      `Cracker Analyzed: ${result.crackerName}`
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "Could not log you out. Please try again.",
      });
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p>Loading...</p>
      </div>
    );
  }

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
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2 space-y-8">
            <BudgetDisplay budget={budget} />
            <CrackerAnalysis />
            <CrackerScanner
              onAnalysisComplete={handleCrackerAnalysisComplete}
            />
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
          <p>
            &copy; {new Date().getFullYear()} Cracker Karma. Burst responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
}
