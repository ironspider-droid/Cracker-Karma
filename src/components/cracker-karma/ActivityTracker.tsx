"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { HeartPulse, Battery, Bluetooth, BluetoothConnected, BluetoothSearching, XCircle, Loader2 } from "lucide-react";
import { connectToDevice, disconnectDevice, type FitnessDevice } from "@/lib/bluetooth";
import { Progress } from "@/components/ui/progress";

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export default function ActivityTracker() {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [device, setDevice] = useState<FitnessDevice | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { toast } = useToast();

  const handleConnect = async () => {
    setStatus("connecting");
    setErrorMessage(null);

    // Check for Bluetooth availability
    if (typeof navigator === "undefined" || !navigator.bluetooth) {
      const errorMsg = "Web Bluetooth is not available in your browser.";
      setErrorMessage(errorMsg);
      setStatus("error");
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: errorMsg,
      });
      return;
    }

    try {
      const fitnessDevice = await connectToDevice({
        onDisconnect: () => {
          setStatus("disconnected");
          setDevice(null);
          setHeartRate(null);
          setBatteryLevel(null);
          toast({
            title: "Device Disconnected",
            description: "The fitness band has been disconnected.",
          });
        },
        onHeartRateChanged: (newHeartRate) => {
          setHeartRate(newHeartRate);
        },
      });

      setDevice(fitnessDevice);
      setStatus("connected");
      toast({
        title: "Device Connected!",
        description: `Connected to ${fitnessDevice.name}.`,
      });

      // Fetch initial battery level
      if (fitnessDevice.services.battery) {
        const level = await fitnessDevice.services.battery.getBatteryLevel();
        setBatteryLevel(level);
      }

    } catch (error: any) {
      const errorMsg = error.message || "Failed to connect to the device.";
      setErrorMessage(errorMsg);
      setStatus("error");
      console.error("[Web Bluetooth Error]", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: errorMsg,
      });
    }
  };

  const handleDisconnect = async () => {
    if (device) {
      await disconnectDevice(device);
    }
  };
  
  const renderContent = () => {
    switch(status) {
      case "connecting":
        return (
          <div className="text-center flex flex-col items-center gap-4 py-4">
            <BluetoothSearching className="w-12 h-12 text-primary/80 animate-pulse" />
            <p className="text-muted-foreground text-sm font-semibold">
              Searching for devices...
            </p>
            <p className="text-muted-foreground text-xs px-4">
              Please select your fitness band from the browser pop-up.
            </p>
          </div>
        );
      case "connected":
        return (
          <>
            <div className="flex items-center p-3 -m-3 rounded-lg hover:bg-secondary/50 transition-colors">
              <HeartPulse className="h-8 w-8 text-red-500 mr-4" />
              <div>
                <p className="font-bold text-lg">
                  {heartRate !== null ? (
                    <>
                      {heartRate} <span className="text-sm font-normal">BPM</span>
                    </>
                  ) : (
                    <Loader2 className="w-5 h-5 animate-spin"/>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Heart Rate</p>
              </div>
            </div>

            {batteryLevel !== null && (
              <div className="flex items-center p-3 -m-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <Battery className="h-8 w-8 text-primary/80 mr-4" />
                <div className="w-full">
                   <div className="flex justify-between items-baseline mb-1">
                      <p className="text-sm text-muted-foreground">Battery</p>
                      <p className="font-bold text-lg">{batteryLevel}%</p>
                   </div>
                  <Progress value={batteryLevel} className="h-2" />
                </div>
              </div>
            )}
            
            <Button variant="outline" onClick={handleDisconnect} className="w-full">
              <BluetoothConnected className="w-4 h-4 mr-2"/>
              Disconnect
            </Button>
          </>
        )
      case "error":
         return (
            <div className="text-center flex flex-col items-center gap-4 py-4">
                <XCircle className="w-12 h-12 text-destructive" />
                <p className="text-destructive text-sm font-semibold">
                    Connection Error
                </p>
                <p className="text-muted-foreground text-xs px-4">
                  {errorMessage || "An unknown error occurred."}
                </p>
                <Button onClick={handleConnect}>
                    <Bluetooth className="w-4 h-4 mr-2"/>
                    Try Again
                </Button>
            </div>
        );
      case "disconnected":
      default:
        return (
            <div className="text-center flex flex-col items-center gap-4 py-4">
                <HeartPulse className="w-12 h-12 text-primary/30" />
                <p className="text-muted-foreground text-sm">
                    Sync your activity to see its impact on your cracker budget.
                </p>
                <Button onClick={handleConnect}>
                    <Bluetooth className="w-4 h-4 mr-2"/>
                    Connect Fitness Data
                </Button>
            </div>
        );
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status === 'connected' ? <BluetoothConnected className="w-6 h-6 text-primary"/> : <Bluetooth className="w-6 h-6 text-primary"/>}
          Real-time Activity
        </CardTitle>
        <CardDescription>
          {status === 'connected' ? `Connected to ${device?.name}` : "Connect your BLE fitness band."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
