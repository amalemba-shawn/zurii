import { IoTSensor } from '../types/farm';

const STORAGE_KEY_IOT = 'solum_farm_iot_sensors_v1';

export const INITIAL_IOT_SENSORS: IoTSensor[] = [
  {
    id: 'iot-barn-a-air',
    name: 'Barn A Ambient Gas & Climate Node',
    type: 'air_quality',
    location: 'Barn A · Dairy Parlour Bay',
    sectorId: 'cows-dairy',
    status: 'online',
    lastReading: {
      metric: 'NH3 / Temp',
      value: '11.8 ppm · 62.4°F',
      unit: '',
      timestamp: 'Just now'
    },
    batteryLevel: 94,
    signalQuality: 'Excellent',
    protocol: 'LoRaWAN 915MHz',
    thresholds: {
      max: 25,
      warningText: 'High Ammonia Hazard'
    },
    installationDate: '2024-02-10'
  },
  {
    id: 'iot-parlour-flow',
    name: 'Smart Milk Harvest Inline Flow Meter',
    type: 'flow_meter',
    location: 'Parlour Milk Bulk Tank Inflow',
    sectorId: 'cows-dairy',
    status: 'online',
    lastReading: {
      metric: 'Flow Rate',
      value: 38.6,
      unit: 'L/min',
      timestamp: '2 min ago'
    },
    batteryLevel: 99,
    signalQuality: 'Excellent',
    protocol: 'WiFi Mesh',
    thresholds: {
      min: 5,
      max: 60,
      warningText: 'Milk Flow Anomaly'
    },
    installationDate: '2024-01-15'
  },
  {
    id: 'iot-soil-field1',
    name: 'Pivot 1 Multi-Depth Soil Moisture Probe',
    type: 'soil_moisture',
    location: 'North Pivot Field 1 (Silage Corn)',
    status: 'online',
    lastReading: {
      metric: 'Volumetric Water Content',
      value: 32.5,
      unit: '% VWC',
      timestamp: '5 min ago'
    },
    batteryLevel: 87,
    signalQuality: 'Good',
    protocol: 'LoRaWAN 915MHz',
    thresholds: {
      min: 22,
      max: 45,
      warningText: 'Critical Soil Dryness'
    },
    installationDate: '2024-03-01'
  },
  {
    id: 'iot-water-pasture3',
    name: 'Pasture 3 Trough Ultrasonic Level Sensor',
    type: 'water_level',
    location: 'Pasture 3 (Rotational Clover-Rye)',
    sectorId: 'cows-dairy',
    status: 'online',
    lastReading: {
      metric: 'Reservoir Level',
      value: 88,
      unit: '% (1,760 L)',
      timestamp: '1 min ago'
    },
    batteryLevel: 81,
    signalQuality: 'Good',
    protocol: 'LoRaWAN 915MHz',
    thresholds: {
      min: 25,
      warningText: 'Water Supply Depleted'
    },
    installationDate: '2024-04-12'
  },
  {
    id: 'iot-greenhouse-climate',
    name: 'Greenhouse Alpha Vapor Pressure Deficit Node',
    type: 'climate',
    location: 'Greenhouse Bay 2 · Heirloom Crops',
    status: 'online',
    lastReading: {
      metric: 'VPD & Temp',
      value: '1.15 kPa · 74.2°F',
      unit: '',
      timestamp: '4 min ago'
    },
    batteryLevel: 92,
    signalQuality: 'Excellent',
    protocol: 'WiFi Mesh',
    thresholds: {
      min: 0.8,
      max: 1.5,
      warningText: 'Transpiration Stress'
    },
    installationDate: '2024-01-20'
  },
  {
    id: 'iot-solar-gateway',
    name: 'Perimeter Solar Telemetry & Battery Gateway',
    type: 'power_solar',
    location: 'South Substation Array',
    status: 'online',
    lastReading: {
      metric: 'Solar Power Inverter',
      value: 5.4,
      unit: 'kW Generation',
      timestamp: 'Just now'
    },
    batteryLevel: 100,
    signalQuality: 'Excellent',
    protocol: 'Cellular NB-IoT',
    thresholds: {
      min: 1.0,
      warningText: 'Inverter Grid Dropped'
    },
    installationDate: '2023-11-05'
  },
  {
    id: 'iot-paddock-rfid',
    name: 'Terrace Paddock 2 RFID Gate Counter',
    type: 'rfid_gate',
    location: 'Terrace Paddock 2 · Meat Goats',
    sectorId: 'goats-meat',
    status: 'warning',
    lastReading: {
      metric: 'Tag Transits',
      value: '42 animals logged today',
      unit: '',
      timestamp: '18 min ago'
    },
    batteryLevel: 19,
    signalQuality: 'Fair',
    protocol: 'BLE 5.2',
    thresholds: {
      warningText: 'Sensor Battery Low (<20%)'
    },
    installationDate: '2024-05-18'
  }
];

export const iotDb = {
  getSensors(): IoTSensor[] {
    if (typeof window === 'undefined') return INITIAL_IOT_SENSORS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_IOT);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Ignore
    }
    localStorage.setItem(STORAGE_KEY_IOT, JSON.stringify(INITIAL_IOT_SENSORS));
    return INITIAL_IOT_SENSORS;
  },

  addSensor(sensor: IoTSensor): IoTSensor[] {
    const sensors = this.getSensors();
    const updated = [sensor, ...sensors];
    localStorage.setItem(STORAGE_KEY_IOT, JSON.stringify(updated));
    return updated;
  },

  updateSensor(updatedSensor: IoTSensor): IoTSensor[] {
    const sensors = this.getSensors();
    const updated = sensors.map(s => s.id === updatedSensor.id ? updatedSensor : s);
    localStorage.setItem(STORAGE_KEY_IOT, JSON.stringify(updated));
    return updated;
  },

  deleteSensor(sensorId: string): IoTSensor[] {
    const sensors = this.getSensors();
    const updated = sensors.filter(s => s.id !== sensorId);
    localStorage.setItem(STORAGE_KEY_IOT, JSON.stringify(updated));
    return updated;
  }
};
