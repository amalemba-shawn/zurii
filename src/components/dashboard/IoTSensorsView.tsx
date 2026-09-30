import React, { useState } from 'react';
import { IoTSensor, LivestockSector } from '../../types/farm';
import { iotDb } from '../../services/iotDb';
import { useTheme } from '../../context/ThemeContext';
import { sound } from '../../utils/audio';
import { 
  Radio, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Wifi, 
  Battery, 
  BatteryCharging, 
  BatteryWarning, 
  CheckCircle2, 
  AlertTriangle, 
  Droplets, 
  Thermometer, 
  Wind, 
  Zap, 
  Gauge, 
  ShieldCheck, 
  Filter,
  Activity,
  Check
} from 'lucide-react';

interface IoTSensorsViewProps {
  sensors: IoTSensor[];
  sectors: LivestockSector[];
  onAddSensor: (newSensor: IoTSensor) => void;
  onDeleteSensor: (sensorId: string) => void;
  onRefreshTelemetry: () => void;
}

export const IoTSensorsView: React.FC<IoTSensorsViewProps> = ({
  sensors,
  sectors,
  onAddSensor,
  onDeleteSensor,
  onRefreshTelemetry
}) => {
  const { isDark } = useTheme();

  const [filterType, setFilterType] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sensorToDelete, setSensorToDelete] = useState<string | null>(null);

  // New Sensor Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<IoTSensor['type']>('soil_moisture');
  const [location, setLocation] = useState('');
  const [sectorId, setSectorId] = useState('');
  const [protocol, setProtocol] = useState<IoTSensor['protocol']>('LoRaWAN 915MHz');
  const [metricName, setMetricName] = useState('Volumetric Water Content');
  const [initialValue, setInitialValue] = useState('28.5');
  const [metricUnit, setMetricUnit] = useState('% VWC');
  const [minThreshold, setMinThreshold] = useState('18');
  const [maxThreshold, setMaxThreshold] = useState('45');
  const [warningText, setWarningText] = useState('Soil Moisture Low Warning');
  const [formError, setFormError] = useState('');

  // Counts
  const onlineCount = sensors.filter(s => s.status === 'online').length;
  const warningCount = sensors.filter(s => s.status === 'warning').length;
  const offlineCount = sensors.filter(s => s.status === 'offline').length;

  const filteredSensors = filterType === 'all'
    ? sensors
    : sensors.filter(s => s.type === filterType);

  const getSensorIcon = (type: IoTSensor['type']) => {
    switch (type) {
      case 'climate':
        return <Thermometer className="w-5 h-5 text-amber-500" />;
      case 'soil_moisture':
        return <Droplets className="w-5 h-5 text-emerald-500" />;
      case 'water_level':
        return <Gauge className="w-5 h-5 text-sky-500" />;
      case 'air_quality':
        return <Wind className="w-5 h-5 text-teal-400" />;
      case 'flow_meter':
        return <Activity className="w-5 h-5 text-purple-400" />;
      case 'power_solar':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'rfid_gate':
        return <Radio className="w-5 h-5 text-indigo-400" />;
      default:
        return <Radio className="w-5 h-5 text-emerald-400" />;
    }
  };

  const handleTypeChange = (newType: IoTSensor['type']) => {
    setType(newType);
    switch (newType) {
      case 'climate':
        setMetricName('Temperature & Humidity');
        setInitialValue('68.5°F · 54% RH');
        setMetricUnit('');
        setWarningText('Barn Temperature High Alert');
        break;
      case 'soil_moisture':
        setMetricName('Volumetric Water Content');
        setInitialValue('31.2');
        setMetricUnit('% VWC');
        setWarningText('Root Zone Soil Moisture Depleted');
        break;
      case 'water_level':
        setMetricName('Trough Water Level');
        setInitialValue('85');
        setMetricUnit('% (1,700 L)');
        setWarningText('Livestock Water Depletion Alert');
        break;
      case 'air_quality':
        setMetricName('Ammonia & CO2');
        setInitialValue('10.2 ppm · 480 ppm');
        setMetricUnit('');
        setWarningText('Toxic Ammonia Threshold Exceeded');
        break;
      case 'flow_meter':
        setMetricName('Milk / Liquid Flow');
        setInitialValue('35.0');
        setMetricUnit('L/min');
        setWarningText('Line Clog / Flow Drop Alert');
        break;
      case 'power_solar':
        setMetricName('Solar Array Generation');
        setInitialValue('4.8');
        setMetricUnit('kW');
        setWarningText('Inverter Failure Alert');
        break;
      case 'rfid_gate':
        setMetricName('Animal RFID Passes');
        setInitialValue('54 head logged');
        setMetricUnit('');
        setWarningText('Gate Sensor Offline');
        break;
    }
  };

  const handleCreateSensor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter a descriptive sensor name');
      return;
    }

    const newSensor: IoTSensor = {
      id: `iot-${Date.now()}`,
      name: name.trim(),
      type,
      location: location.trim() || 'Central Farm Zone',
      sectorId: sectorId || undefined,
      status: 'online',
      lastReading: {
        metric: metricName,
        value: initialValue,
        unit: metricUnit,
        timestamp: 'Just now'
      },
      batteryLevel: 98,
      signalQuality: 'Excellent',
      protocol,
      thresholds: {
        min: minThreshold ? parseFloat(minThreshold) : undefined,
        max: maxThreshold ? parseFloat(maxThreshold) : undefined,
        warningText: warningText.trim() || undefined
      },
      installationDate: new Date().toISOString().split('T')[0]
    };

    sound.playSuccess();
    onAddSensor(newSensor);
    setIsAddModalOpen(false);
    setName('');
    setLocation('');
    setFormError('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
        isDark ? 'bg-[#131E17] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${
            isDark ? 'bg-sky-950/60 border border-sky-500/30 text-sky-400' : 'bg-sky-100 border border-sky-300 text-sky-800'
          }`}>
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">IoT Remote Telemetry & Sensors</h1>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
              Continuous real-time LoRaWAN & NB-IoT wireless monitoring across animal barns, pastures, silos, and crop fields.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onRefreshTelemetry}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isDark ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="Poll Telemetry Gateway"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add IoT Sensor</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className={`p-4 rounded-2xl border space-y-1 ${
          isDark ? 'bg-[#131E17] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono text-emerald-500">
            <span>Online Nodes</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono">{onlineCount} / {sensors.length}</div>
          <span className={`text-[11px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            Network Uptime: 99.8%
          </span>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1 ${
          isDark ? 'bg-[#131E17] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono text-amber-500">
            <span>Low Battery / Alert</span>
            <BatteryWarning className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono">{warningCount} Nodes</div>
          <span className={`text-[11px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            {warningCount > 0 ? 'Action Recommended' : 'All battery levels nominal'}
          </span>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1 ${
          isDark ? 'bg-[#131E17] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono text-sky-500">
            <span>Wireless Gateway</span>
            <Wifi className="w-4 h-4" />
          </div>
          <div className="text-sm font-semibold font-mono mt-1">LoRaWAN 915MHz</div>
          <span className={`text-[11px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            Base Station Signal: -78 dBm
          </span>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1 ${
          isDark ? 'bg-[#131E17] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono text-purple-400">
            <span>Solar Inverter Status</span>
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono">5.4 kW</div>
          <span className={`text-[11px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            Off-grid microgrid active
          </span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        <span className={`text-[10px] uppercase font-semibold flex items-center gap-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {[
          { id: 'all', label: 'All Sensors' },
          { id: 'climate', label: 'Climate' },
          { id: 'soil_moisture', label: 'Soil Moisture' },
          { id: 'water_level', label: 'Water Troughs' },
          { id: 'flow_meter', label: 'Milk Flow' },
          { id: 'air_quality', label: 'Air / Gas' },
          { id: 'power_solar', label: 'Solar & Power' },
          { id: 'rfid_gate', label: 'RFID Gates' }
        ].map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => setFilterType(chip.id)}
            className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-colors cursor-pointer ${
              filterType === chip.id
                ? isDark
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 font-semibold'
                  : 'bg-emerald-100 border-emerald-300 text-emerald-900 font-semibold'
                : isDark
                ? 'bg-black/20 hover:bg-white/5 border-white/10 text-white/60'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Sensors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSensors.map((sensor) => {
          const isWarning = sensor.status === 'warning';
          return (
            <div
              key={sensor.id}
              className={`p-5 rounded-3xl border flex flex-col justify-between transition-all ${
                isDark ? 'bg-[#131E17] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              } ${isWarning ? 'border-amber-500/40 ring-1 ring-amber-500/30' : ''}`}
            >
              <div className="space-y-3.5">
                {/* Header: Icon, Name & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl border ${
                      isDark ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                      {getSensorIcon(sensor.type)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold tracking-tight">{sensor.name}</h3>
                      <p className={`text-[11px] ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                        {sensor.location}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase ${
                    sensor.status === 'online'
                      ? isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : isDark ? 'bg-amber-950/80 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    ● {sensor.status}
                  </span>
                </div>

                {/* Primary Reading Box */}
                <div className={`p-3.5 rounded-2xl border font-mono space-y-1 ${
                  isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400">
                    <span>{sensor.lastReading.metric}</span>
                    <span className="text-[10px] opacity-75">{sensor.lastReading.timestamp}</span>
                  </div>
                  <div className="text-lg font-bold text-emerald-500">
                    {sensor.lastReading.value} {sensor.lastReading.unit}
                  </div>
                  {sensor.thresholds?.warningText && isWarning && (
                    <div className="text-[11px] text-amber-500 flex items-center gap-1 font-sans pt-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{sensor.thresholds.warningText}</span>
                    </div>
                  )}
                </div>

                {/* Telemetry Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200'
                  }`}>
                    <span className={`text-[10px] ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Protocol:</span>
                    <span className="font-semibold text-[11px] truncate">{sensor.protocol.split(' ')[0]}</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200'
                  }`}>
                    <span className={`text-[10px] flex items-center gap-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                      <Battery className="w-3 h-3" /> Battery:
                    </span>
                    <span className={`font-semibold text-[11px] ${
                      sensor.batteryLevel < 25 ? 'text-red-500 font-bold' : 'text-emerald-500'
                    }`}>
                      {sensor.batteryLevel}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className={`mt-4 pt-3 border-t flex items-center justify-between ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <span className={`text-[10px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                  Signal: <strong className={isDark ? 'text-white/70' : 'text-slate-700'}>{sensor.signalQuality}</strong>
                </span>

                {sensorToDelete === sensor.id ? (
                  <div className="flex items-center gap-1.5 animate-fade-in">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playBackspace();
                        onDeleteSensor(sensor.id);
                        setSensorToDelete(null);
                      }}
                      className="px-2 py-0.5 text-xs bg-red-600 text-white rounded font-medium cursor-pointer"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setSensorToDelete(null)}
                      className="px-2 py-0.5 text-xs rounded text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSensorToDelete(sensor.id)}
                    className="text-xs font-mono text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* MODAL: ADD IOT SENSOR                                    */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto ${
          isDark ? 'bg-black/85' : 'bg-slate-900/40'
        }`}>
          <div className={`relative w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 my-6 max-h-[92vh] overflow-y-auto border ${
            isDark ? 'bg-[#131E17] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-600 text-white">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Commission New IoT Sensor</h3>
                  <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                    Configure sensor hardware type, wireless link, and critical monitoring thresholds.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className={`p-1.5 rounded-lg ${isDark ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-500 font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateSensor} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px]">Sensor Node Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Pasture 4 Water Trough Level"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px]">Sensor Function / Type *</label>
                  <select
                    value={type}
                    onChange={(e) => handleTypeChange(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="soil_moisture" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>💧 Soil Moisture & Temp Probe</option>
                    <option value="water_level" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>🚰 Water Tank / Trough Ultrasonic Level</option>
                    <option value="climate" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>🌡️ Barn Climate & Humidity (VPD)</option>
                    <option value="air_quality" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>🌬️ Ammonia & CO2 Ambient Air Quality</option>
                    <option value="flow_meter" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>🥛 Milk Parlour / Fluid Flow Meter</option>
                    <option value="power_solar" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>⚡ Solar Inverter & Battery Gateway</option>
                    <option value="rfid_gate" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>🏷️ Animal RFID Herd Gate Counter</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px]">Installation Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Pasture 4, Barn B, Pivot Field 2"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px]">Wireless Protocol</label>
                  <select
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="LoRaWAN 915MHz" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>LoRaWAN 915MHz (Long Range 15 km)</option>
                    <option value="Cellular NB-IoT" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Cellular NB-IoT / LTE-M</option>
                    <option value="WiFi Mesh" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>WiFi Mesh (Barn & Milking Parlour)</option>
                    <option value="BLE 5.2" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Bluetooth Low Energy (Gate / Ear Tag)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px]">Metric Name</label>
                  <input
                    type="text"
                    value={metricName}
                    onChange={(e) => setMetricName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px]">Initial Value</label>
                  <input
                    type="text"
                    value={initialValue}
                    onChange={(e) => setInitialValue(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px]">Unit</label>
                  <input
                    type="text"
                    value={metricUnit}
                    onChange={(e) => setMetricUnit(e.target.value)}
                    placeholder="e.g. % VWC, ppm, °F"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold uppercase text-[11px]">Alert Threshold Warning Message</label>
                <input
                  type="text"
                  value={warningText}
                  onChange={(e) => setWarningText(e.target.value)}
                  placeholder="e.g. Critical Water Level Depleted"
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`px-4 py-2 rounded-xl border ${
                    isDark ? 'border-white/10 text-white/70' : 'border-slate-300 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Activate Sensor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
