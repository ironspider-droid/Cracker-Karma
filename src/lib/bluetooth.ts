
// GATT Service and Characteristic UUIDs
const HEART_RATE_SERVICE_UUID = "heart_rate"; // 0x180D
const HEART_RATE_CHARACTERISTIC_UUID = "heart_rate_measurement"; // 0x2A37
const BATTERY_SERVICE_UUID = "battery_service"; // 0x180F
const BATTERY_LEVEL_CHARACTERISTIC_UUID = "battery_level"; // 0x2A19

export interface FitnessDevice {
  device: BluetoothDevice;
  server: BluetoothRemoteGATTServer;
  name: string;
  services: {
    heartRate?: HeartRateService;
    battery?: BatteryService;
  };
}

interface ConnectionOptions {
  onDisconnect: () => void;
  onHeartRateChanged: (heartRate: number) => void;
}

interface Service<T> {
  service: BluetoothRemoteGATTService;
  characteristic: BluetoothRemoteGATTCharacteristic;
  startNotifications: (listener: (data: T) => void) => Promise<void>;
  stopNotifications: () => Promise<void>;
}

class HeartRateService implements Service<number> {
  service: BluetoothRemoteGATTService;
  characteristic: BluetoothRemoteGATTCharacteristic;

  constructor(service: BluetoothRemoteGATTService, characteristic: BluetoothRemoteGATTCharacteristic) {
    this.service = service;
    this.characteristic = characteristic;
  }

  private handleHeartRateChanged = (event: Event) => {
    const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
    if (!value) return;
    const heartRate = this.parseHeartRate(value);
    this.listener?.(heartRate);
  };

  private listener: ((heartRate: number) => void) | null = null;

  async startNotifications(listener: (heartRate: number) => void) {
    this.listener = listener;
    await this.characteristic.startNotifications();
    this.characteristic.addEventListener("characteristicvaluechanged", this.handleHeartRateChanged);
  }

  async stopNotifications() {
    await this.characteristic.stopNotifications();
    this.characteristic.removeEventListener("characteristicvaluechanged", this.handleHeartRateChanged);
    this.listener = null;
  }

  parseHeartRate(value: DataView): number {
    const flags = value.getUint8(0);
    const rate16Bits = flags & 0x1;
    let heartRate: number;
    if (rate16Bits) {
      heartRate = value.getUint16(1, true); // true for little-endian
    } else {
      heartRate = value.getUint8(1);
    }
    return heartRate;
  }
}

class BatteryService {
    service: BluetoothRemoteGATTService;
    characteristic: BluetoothRemoteGATTCharacteristic;

    constructor(service: BluetoothRemoteGATTService, characteristic: BluetoothRemoteGATTCharacteristic) {
        this.service = service;
        this.characteristic = characteristic;
    }

    async getBatteryLevel(): Promise<number> {
        const value = await this.characteristic.readValue();
        return value.getUint8(0);
    }
}


export async function connectToDevice(options: ConnectionOptions): Promise<FitnessDevice> {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: [HEART_RATE_SERVICE_UUID] }],
    optionalServices: [BATTERY_SERVICE_UUID],
  });

  if (!device.gatt) {
    throw new Error("GATT server not available on this device.");
  }
  
  device.addEventListener("gattserverdisconnected", options.onDisconnect);

  const server = await device.gatt.connect();

  let fitnessDevice: FitnessDevice = {
    device,
    server,
    name: device.name || "Unknown Device",
    services: {},
  };

  // --- Heart Rate Service ---
  try {
    const hrService = await server.getPrimaryService(HEART_RATE_SERVICE_UUID);
    const hrCharacteristic = await hrService.getCharacteristic(HEART_RATE_CHARACTERISTIC_UUID);
    const heartRateService = new HeartRateService(hrService, hrCharacteristic);
    await heartRateService.startNotifications(options.onHeartRateChanged);
    fitnessDevice.services.heartRate = heartRateService;
  } catch (error) {
    console.warn("Heart Rate service not found or failed to start.", error);
    // This is not a fatal error, we can continue without it.
  }

  // --- Battery Service ---
  try {
    const batteryService = await server.getPrimaryService(BATTERY_SERVICE_UUID);
    const batteryCharacteristic = await batteryService.getCharacteristic(BATTERY_LEVEL_CHARACTERISTIC_UUID);
    fitnessDevice.services.battery = new BatteryService(batteryService, batteryCharacteristic);
  } catch (error) {
    console.warn("Battery service not found.", error);
  }
  
  return fitnessDevice;
}

export async function disconnectDevice(fitnessDevice: FitnessDevice) {
    if (fitnessDevice.services.heartRate) {
        try {
            await fitnessDevice.services.heartRate.stopNotifications();
        } catch (error) {
            console.error("Error stopping heart rate notifications:", error);
        }
    }

    if (fitnessDevice.server.connected) {
        fitnessDevice.server.disconnect();
    }
}
