import { LivestockSector, WeatherData, IndividualAnimal, AnimalPhysiologicalStatus, MilkingRecord, EggCollectionRecord } from '../types/farm';
import holsteinCowImg from '../assets/images/dairy_cow_portrait_1790781789369.jpg';
import jerseyCowImg from '../assets/images/jersey_cow_portrait_1790781816708.jpg';
import saanenGoatImg from '../assets/images/dairy_goat_portrait_1790781802696.jpg';
import boerGoatImg from '../assets/images/boer_goat_portrait_1790781830304.jpg';

export const INITIAL_LIVESTOCK_SECTORS: LivestockSector[] = [
  {
    id: 'cows-dairy',
    name: 'Dairy Cattle Sector',
    animalType: 'cows',
    category: 'dairy',
    headCount: 84,
    location: 'North Meadow & Milking Barn A',
    pastureOrPen: 'Pasture 3 (Rotational Clover-Rye)',
    healthStatus: 'Optimal',
    dailyOutput: {
      metricName: 'Daily Milk Volume',
      metricValue: '2,640 Liters',
      efficiency: 'Butterfat 4.15% · Somatic Cell < 120k'
    },
    feedInventoryKg: 14200,
    waterConsumptionL: 7560,
    housingTemp: 62,
    alerts: [
      'Morning milking cycle completed at 06:45 AM',
      'Rotational shift to Pasture 4 scheduled for 16:00'
    ],
    recentLogs: [
      { id: 'l1', timestamp: '06:45 AM', action: 'Logged AM Parlour Milk: 1,325 L', operator: 'Elena Vance' },
      { id: 'l2', timestamp: '05:30 AM', action: 'Total Mixed Ration (TMR) feed delivery to Barn A', operator: 'Marcus Holt' }
    ],
    animals: [
      {
        id: 'cow-1',
        sectorId: 'cows-dairy',
        name: 'Bessie',
        tagNumber: 'COW-0104',
        age: '3.5 yrs',
        categoryStatus: 'Milking',
        breed: 'Holstein Friesian',
        weightKg: 620,
        gender: 'Female',
        penOrPasture: 'Pasture 3 (Rotational Clover-Rye)',
        healthStatus: 'Healthy',
        lastMilkingYieldL: 34.2,
        dateRegistered: '2024-03-12',
        notes: 'Top tier producer. Milked in Parlour Bay 1.',
        photoUrl: holsteinCowImg
      },
      {
        id: 'cow-2',
        sectorId: 'cows-dairy',
        name: 'Daisy',
        tagNumber: 'COW-0118',
        age: '4.0 yrs',
        categoryStatus: 'Expecting',
        breed: 'Jersey',
        weightKg: 535,
        gender: 'Female',
        penOrPasture: 'Barn A Maternity Stall 2',
        healthStatus: 'Healthy',
        lastMilkingYieldL: 0,
        dateRegistered: '2023-11-20',
        notes: 'Expecting calf within 3 weeks. Calcium supplement active.',
        photoUrl: jerseyCowImg
      },
      {
        id: 'cow-3',
        sectorId: 'cows-dairy',
        name: 'Buttercup',
        tagNumber: 'COW-0145',
        age: '5.2 yrs',
        categoryStatus: 'Dried',
        breed: 'Holstein Friesian',
        weightKg: 645,
        gender: 'Female',
        penOrPasture: 'Dry Cow Paddock 2',
        healthStatus: 'Healthy',
        lastMilkingYieldL: 0,
        dateRegistered: '2023-04-15',
        notes: 'Dry period before next lactation cycle.'
      },
      {
        id: 'cow-4',
        sectorId: 'cows-dairy',
        name: 'Clover',
        tagNumber: 'COW-0172',
        age: '2.8 yrs',
        categoryStatus: 'Milking',
        breed: 'Guernsey',
        weightKg: 510,
        gender: 'Female',
        penOrPasture: 'Pasture 3 (Rotational Clover-Rye)',
        healthStatus: 'Healthy',
        lastMilkingYieldL: 29.5,
        dateRegistered: '2024-06-18',
        notes: 'High butterfat 4.8%. Golden milk line.'
      },
      {
        id: 'cow-5',
        sectorId: 'cows-dairy',
        name: 'Marigold',
        tagNumber: 'COW-0199',
        age: '1.8 yrs',
        categoryStatus: 'Heifer / Kid',
        breed: 'Jersey',
        weightKg: 420,
        gender: 'Female',
        penOrPasture: 'Heifer Training Run',
        healthStatus: 'Healthy',
        dateRegistered: '2025-01-10',
        notes: 'First time entering breeding schedule next month.'
      }
    ]
  },
  {
    id: 'goats-dairy',
    name: 'Dairy Goats Sector',
    animalType: 'goats',
    category: 'dairy',
    headCount: 46,
    location: 'Alpine Hillside & Dairy Shed B',
    pastureOrPen: 'Hillside Paddock 1',
    healthStatus: 'Optimal',
    dailyOutput: {
      metricName: 'Daily Goat Milk',
      metricValue: '185 Liters',
      efficiency: 'Protein 3.6% · Clean chilling 38°F'
    },
    feedInventoryKg: 4200,
    waterConsumptionL: 460,
    housingTemp: 64,
    alerts: [
      'Browse forage index high · Kudzu & browse clean',
      'Hoof trim inspection completed for 12 does'
    ],
    recentLogs: [
      { id: 'l3', timestamp: '07:15 AM', action: 'Milking run completed: 92 L AM batch', operator: 'Sarah Chen' },
      { id: 'l4', timestamp: '06:00 AM', action: 'Alfalfa hay supplement refilled in Shed B', operator: 'Elena Vance' }
    ],
    animals: [
      {
        id: 'gt-1',
        sectorId: 'goats-dairy',
        name: 'Nala',
        tagNumber: 'GTD-0042',
        age: '2.5 yrs',
        categoryStatus: 'Milking',
        breed: 'Saanen',
        weightKg: 66,
        gender: 'Female',
        penOrPasture: 'Hillside Paddock 1',
        healthStatus: 'Healthy',
        lastMilkingYieldL: 4.5,
        dateRegistered: '2024-04-18',
        notes: 'Gentle temperament, artisan cheese quality milk',
        photoUrl: saanenGoatImg
      },
      {
        id: 'gt-2',
        sectorId: 'goats-dairy',
        name: 'Willow',
        tagNumber: 'GTD-0056',
        age: '3.0 yrs',
        categoryStatus: 'Expecting',
        breed: 'Alpine',
        weightKg: 70,
        gender: 'Female',
        penOrPasture: 'Dairy Shed B Pen 3',
        healthStatus: 'Healthy',
        lastMilkingYieldL: 0,
        dateRegistered: '2023-09-20',
        notes: 'Ultrasound confirmed twin kids due mid October'
      },
      {
        id: 'gt-3',
        sectorId: 'goats-dairy',
        name: 'Pippa',
        tagNumber: 'GTD-0071',
        age: '1.5 yrs',
        categoryStatus: 'Dried',
        breed: 'Nubian',
        weightKg: 58,
        gender: 'Female',
        penOrPasture: 'Dry Does Pasture',
        healthStatus: 'Healthy',
        lastMilkingYieldL: 0,
        dateRegistered: '2025-01-14',
        notes: 'Resting doe, clean health certification'
      }
    ]
  },
  {
    id: 'cows-meat',
    name: 'Beef Cattle (Meat) Sector',
    animalType: 'cows',
    category: 'meat',
    headCount: 58,
    location: 'East Plateau Pastures',
    pastureOrPen: 'Valley Pasture 6 (Fescue & Orchard Grass)',
    healthStatus: 'Optimal',
    dailyOutput: {
      metricName: 'Average Daily Gain (ADG)',
      metricValue: '+1.42 kg / day',
      efficiency: '18 Head approaching 540kg target weight'
    },
    feedInventoryKg: 18500,
    waterConsumptionL: 4200,
    housingTemp: 65,
    alerts: [
      'Mineral lick blocks replenished in Valley 6',
      'Electrified perimeter fence voltage nominal: 8.2 kV'
    ],
    recentLogs: [
      { id: 'l5', timestamp: '08:00 AM', action: 'Pasture rotation verification & water trough flush', operator: 'Mateo Reyes' },
      { id: 'l6', timestamp: 'Yesterday', action: 'Weighed Batch B Steers: Avg 492 kg', operator: 'Mateo Reyes' }
    ],
    animals: [
      {
        id: 'beef-1',
        sectorId: 'cows-meat',
        name: 'Titan',
        tagNumber: 'BEEF-0201',
        age: '22 mos',
        categoryStatus: 'Finishing / Market Ready',
        breed: 'Black Angus',
        weightKg: 552,
        gender: 'Male',
        penOrPasture: 'Valley Pasture 6',
        healthStatus: 'Healthy',
        dateRegistered: '2023-12-05',
        notes: 'Target finished marbling, ready for market processing'
      },
      {
        id: 'beef-2',
        sectorId: 'cows-meat',
        name: 'Ranger',
        tagNumber: 'BEEF-0209',
        age: '16 mos',
        categoryStatus: 'Growing / Pasture',
        breed: 'Hereford Cross',
        weightKg: 465,
        gender: 'Male',
        penOrPasture: 'Valley Pasture 6',
        healthStatus: 'Healthy',
        dateRegistered: '2024-05-11',
        notes: 'Consistent daily weight gain of 1.48 kg'
      },
      {
        id: 'beef-3',
        sectorId: 'cows-meat',
        name: 'Stella',
        tagNumber: 'BEEF-0215',
        age: '3.2 yrs',
        categoryStatus: 'Breeding Stock',
        breed: 'Black Angus',
        weightKg: 585,
        gender: 'Female',
        penOrPasture: 'Breeding Herd Paddock',
        healthStatus: 'Healthy',
        dateRegistered: '2023-08-01',
        notes: 'Foundation brood cow with strong pedigree'
      }
    ]
  },
  {
    id: 'goats-meat',
    name: 'Meat Goats (Boer) Sector',
    animalType: 'goats',
    category: 'meat',
    headCount: 62,
    location: 'South Terraces & Woodlot',
    pastureOrPen: 'Terrace Paddock 2 (Browse Brush)',
    healthStatus: 'Optimal',
    dailyOutput: {
      metricName: 'Market Herd Readiness',
      metricValue: '24 Ready for Market',
      efficiency: 'Avg Weight 38.5 kg · ADG +220g'
    },
    feedInventoryKg: 3800,
    waterConsumptionL: 520,
    housingTemp: 66,
    alerts: [
      'Rotated from Woodlot A to Terrace 2 for brush control'
    ],
    recentLogs: [
      { id: 'l7', timestamp: '08:30 AM', action: 'Parasite FAMACHA eye-score check: all grade 1-2', operator: 'Sarah Chen' }
    ],
    animals: [
      {
        id: 'bmr-1',
        sectorId: 'goats-meat',
        name: 'Apollo',
        tagNumber: 'BMR-0012',
        age: '14 mos',
        categoryStatus: 'Finishing / Market Ready',
        breed: 'Boer',
        weightKg: 42,
        gender: 'Male',
        penOrPasture: 'Terrace Paddock 2',
        healthStatus: 'Healthy',
        dateRegistered: '2024-07-22',
        photoUrl: boerGoatImg
      },
      {
        id: 'bmr-2',
        sectorId: 'goats-meat',
        name: 'Mocha',
        tagNumber: 'BMR-0034',
        age: '2.1 yrs',
        categoryStatus: 'Breeding Stock',
        breed: 'Kalahari Red',
        weightKg: 54,
        gender: 'Female',
        penOrPasture: 'Terrace Paddock 2',
        healthStatus: 'Healthy',
        dateRegistered: '2024-02-14'
      }
    ]
  },
  {
    id: 'chicken',
    name: 'Poultry (Broilers & Meat)',
    animalType: 'chicken',
    category: 'meat',
    headCount: 420,
    location: 'Mobile Pasture Coops (Sectors 1 & 2)',
    pastureOrPen: 'Coop Range A (Pastured Poultry)',
    healthStatus: 'Optimal',
    dailyOutput: {
      metricName: 'Feed Conversion Ratio (FCR)',
      metricValue: '1.82 FCR',
      efficiency: 'Target Weight 2.4 kg at Day 48'
    },
    feedInventoryKg: 2800,
    waterConsumptionL: 680,
    housingTemp: 70,
    alerts: [
      'Mobile coop moved 40ft south to fresh pasture forage',
      'Automatic solar nipple waterers cleaned'
    ],
    recentLogs: [
      { id: 'l8', timestamp: '07:00 AM', action: 'Moved mobile range shelter to fresh grass', operator: 'Mateo Reyes' },
      { id: 'l9', timestamp: '06:15 AM', action: 'Organic grain feeder hopper filled', operator: 'Marcus Holt' }
    ],
    animals: [
      {
        id: 'chk-1',
        sectorId: 'chicken',
        name: 'Batch Alpha (Broilers)',
        tagNumber: 'CHK-B01',
        age: '38 days',
        categoryStatus: 'Broiler',
        breed: 'Cornish Cross',
        weightKg: 2.15,
        gender: 'Female',
        penOrPasture: 'Mobile Range Shelter 1',
        healthStatus: 'Healthy',
        dateRegistered: '2026-08-20',
        notes: 'Estimated harvest target at 48 days'
      },
      {
        id: 'chk-2',
        sectorId: 'chicken',
        name: 'Heritage Breeder Rooster',
        tagNumber: 'CHK-R09',
        age: '1.2 yrs',
        categoryStatus: 'Breeder',
        breed: 'Rhode Island Red',
        weightKg: 3.4,
        gender: 'Male',
        penOrPasture: 'Breeding Run 2',
        healthStatus: 'Healthy',
        dateRegistered: '2025-05-15'
      }
    ]
  },
  {
    id: 'ducks',
    name: 'Ducks (Waterfowl Meat) Sector',
    animalType: 'ducks',
    category: 'meat',
    headCount: 160,
    location: 'Wetland Bio-Swale & Duck Pavilion',
    pastureOrPen: 'Pond Paddock 3',
    healthStatus: 'Optimal',
    dailyOutput: {
      metricName: 'Flock Growth Metric',
      metricValue: 'Pekin Batch: 3.1 kg avg',
      efficiency: 'High foraging efficiency · Low fly pressure'
    },
    feedInventoryKg: 1950,
    waterConsumptionL: 1200,
    housingTemp: 68,
    alerts: [
      'Water filtration cycle in swimming run verified clear',
      'Night-lock predator door automated test passed'
    ],
    recentLogs: [
      { id: 'l10', timestamp: '07:30 AM', action: 'Flock released to aquatic foraging ditch', operator: 'Sarah Chen' }
    ],
    animals: [
      {
        id: 'dck-1',
        sectorId: 'ducks',
        name: 'Pekin Batch Prime',
        tagNumber: 'DCK-044',
        age: '45 days',
        categoryStatus: 'Broiler',
        breed: 'Pekin',
        weightKg: 3.2,
        gender: 'Female',
        penOrPasture: 'Pond Paddock 3',
        healthStatus: 'Healthy',
        dateRegistered: '2026-08-14'
      }
    ]
  },
  {
    id: 'rabbits',
    name: 'Cuniculture (Meat Rabbits)',
    animalType: 'rabbits',
    category: 'meat',
    headCount: 95,
    location: 'Climate-Controlled Barn Warren C',
    pastureOrPen: 'Tiered Hutch Pod 1 & 2',
    healthStatus: 'Optimal',
    dailyOutput: {
      metricName: 'Litter Survival & Growth',
      metricValue: '96.4% Kit Survival',
      efficiency: 'Target fryer harvest weight 2.2 kg'
    },
    feedInventoryKg: 1100,
    waterConsumptionL: 180,
    housingTemp: 65,
    alerts: [
      'Barn temperature steady at 65°F (optimal for rabbit heat sensitivity)',
      'Automated misting cooling system armed for noon'
    ],
    recentLogs: [
      { id: 'l11', timestamp: '08:15 AM', action: 'Weighed 3 litters in Pod 1: healthy growth curve', operator: 'Elena Vance' }
    ],
    animals: [
      {
        id: 'rab-1',
        sectorId: 'rabbits',
        name: 'Snowy Doe',
        tagNumber: 'RAB-009',
        age: '14 mos',
        categoryStatus: 'Breeding Stock',
        breed: 'New Zealand White',
        weightKg: 4.6,
        gender: 'Female',
        penOrPasture: 'Hutch Pod 1A',
        healthStatus: 'Healthy',
        dateRegistered: '2025-06-10'
      },
      {
        id: 'rab-2',
        sectorId: 'rabbits',
        name: 'Kit Fryer Batch 7',
        tagNumber: 'RAB-028',
        age: '7 weeks',
        categoryStatus: 'Nursery',
        breed: 'Californian',
        weightKg: 1.8,
        gender: 'Female',
        penOrPasture: 'Hutch Pod 2C',
        healthStatus: 'Healthy',
        dateRegistered: '2026-08-10'
      }
    ]
  }
];

export const INITIAL_WEATHER_DATA: WeatherData = {
  currentTemp: 64,
  feelsLike: 63,
  humidity: 68,
  dewPoint: 52,
  barometer: 1014,
  windSpeed: 6.5,
  windDirection: 'NW',
  uvIndex: 4,
  condition: 'Partly Cloudy',
  livestockAdvisory: 'Optimal grazing conditions across all open pastures. Low heat-stress risk (THI 62) for dairy cows.',
  hourlyForecast: [
    { time: '08:00', temp: 62, rainProb: 0, condition: 'Partly Cloudy' },
    { time: '10:00', temp: 66, rainProb: 5, condition: 'Sunny' },
    { time: '12:00', temp: 71, rainProb: 10, condition: 'Sunny' },
    { time: '14:00', temp: 73, rainProb: 15, condition: 'Partly Cloudy' },
    { time: '16:00', temp: 70, rainProb: 20, condition: 'Overcast' },
    { time: '18:00', temp: 67, rainProb: 20, condition: 'Partly Cloudy' },
    { time: '20:00', temp: 63, rainProb: 10, condition: 'Clear Night' }
  ],
  dailyForecast: [
    {
      day: 'Today',
      date: 'Tue Sep 29',
      tempHigh: 73,
      tempLow: 54,
      condition: 'Partly Cloudy',
      rainProbability: 10,
      windSpeed: 7,
      grazingIndex: 'Optimal',
      advisory: 'Unrestricted pasture access recommended for dairy cows & beef herd.'
    },
    {
      day: 'Wed',
      date: 'Sep 30',
      tempHigh: 75,
      tempLow: 56,
      condition: 'Sunny',
      rainProbability: 5,
      windSpeed: 6,
      grazingIndex: 'Optimal',
      advisory: 'Warm afternoon. Ensure shade shelters are accessible for meat rabbits & poultry.'
    },
    {
      day: 'Thu',
      date: 'Oct 01',
      tempHigh: 68,
      tempLow: 52,
      condition: 'Light Rain',
      rainProbability: 65,
      windSpeed: 14,
      grazingIndex: 'Fair',
      advisory: 'Afternoon rain showers. Keep broiler shelters dry; check duck biopond drainage.'
    },
    {
      day: 'Fri',
      date: 'Oct 02',
      tempHigh: 65,
      tempLow: 49,
      condition: 'Showers',
      rainProbability: 80,
      windSpeed: 16,
      grazingIndex: 'Shelter Recommended',
      advisory: 'Heavy morning squalls. Recommended to hold dairy herd in Barn A; engage hutch covers.'
    },
    {
      day: 'Sat',
      date: 'Oct 03',
      tempHigh: 67,
      tempLow: 48,
      condition: 'Partly Cloudy',
      rainProbability: 15,
      windSpeed: 9,
      grazingIndex: 'Optimal',
      advisory: 'Crisp, sunny autumn conditions. Excellent for rotational grazing.'
    }
  ]
};

const STORAGE_KEY_LIVESTOCK_V2 = 'farm_livestock_sectors_v2';

export const INITIAL_MILKING_RECORDS: MilkingRecord[] = [
  {
    id: 'milk-1',
    species: 'cows',
    animalId: 'cow-1',
    animalName: 'Bessie',
    tagNumber: 'COW-0104',
    breed: 'Holstein Friesian',
    lactationStage: 'Peak Lactation',
    date: '2026-09-29',
    morningLitres: 18.5,
    eveningLitres: 15.7,
    totalLitres: 34.2,
    butterfatPercentage: 4.15,
    parlourStall: 'Parlour Bay 1',
    healthNotes: 'Teats clean, pre-dip sanitized. Optimal milk letdown.',
    milkerOperator: 'Elena Vance',
    timestamp: '06:45 AM'
  },
  {
    id: 'milk-2',
    species: 'cows',
    animalId: 'cow-4',
    animalName: 'Clover',
    tagNumber: 'COW-0172',
    breed: 'Guernsey',
    lactationStage: 'Mid Lactation',
    date: '2026-09-29',
    morningLitres: 15.2,
    eveningLitres: 14.3,
    totalLitres: 29.5,
    butterfatPercentage: 4.80,
    parlourStall: 'Parlour Bay 2',
    healthNotes: 'High butterfat test. Strip cup clear.',
    milkerOperator: 'Elena Vance',
    timestamp: '06:55 AM'
  },
  {
    id: 'milk-3',
    species: 'goats',
    animalId: 'gt-1',
    animalName: 'Nala',
    tagNumber: 'GTD-0042',
    breed: 'Saanen',
    lactationStage: 'Mid Lactation',
    date: '2026-09-29',
    morningLitres: 2.4,
    eveningLitres: 2.1,
    totalLitres: 4.5,
    butterfatPercentage: 3.75,
    parlourStall: 'Goat Stand A-3',
    healthNotes: 'Gentle milker. Cheese-grade milk.',
    milkerOperator: 'Sarah Chen',
    timestamp: '07:15 AM'
  },
  {
    id: 'milk-4',
    species: 'cows',
    animalId: 'cow-1',
    animalName: 'Bessie',
    tagNumber: 'COW-0104',
    breed: 'Holstein Friesian',
    lactationStage: 'Peak Lactation',
    date: '2026-09-28',
    morningLitres: 18.2,
    eveningLitres: 15.4,
    totalLitres: 33.6,
    butterfatPercentage: 4.10,
    parlourStall: 'Parlour Bay 1',
    healthNotes: 'Routine collection',
    milkerOperator: 'Marcus Holt',
    timestamp: '06:40 AM'
  }
];

const STORAGE_KEY_MILKING_V1 = 'farm_milking_records_v1';

export const livestockDb = {
  getSectors(): LivestockSector[] {
    if (typeof window === 'undefined') return INITIAL_LIVESTOCK_SECTORS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_LIVESTOCK_V2);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Ignore
    }
    // Seed with clean initial livestock sectors if none stored yet
    localStorage.setItem(STORAGE_KEY_LIVESTOCK_V2, JSON.stringify(INITIAL_LIVESTOCK_SECTORS));
    return INITIAL_LIVESTOCK_SECTORS;
  },

  saveSector(updatedSector: LivestockSector): void {
    if (typeof window === 'undefined') return;
    const sectors = this.getSectors();
    const next = sectors.map(s => s.id === updatedSector.id ? updatedSector : s);
    localStorage.setItem(STORAGE_KEY_LIVESTOCK_V2, JSON.stringify(next));
  },

  addAnimal(sectorId: string, animal: IndividualAnimal, operatorName: string): void {
    if (typeof window === 'undefined') return;
    const sectors = this.getSectors();
    const next = sectors.map(s => {
      if (s.id === sectorId) {
        const existingAnimals = s.animals || [];
        const updatedAnimals = [animal, ...existingAnimals];
        const newLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: `Registered new animal ${animal.name} [TAG: ${animal.tagNumber}] (${animal.categoryStatus})`,
          operator: operatorName
        };
        return {
          ...s,
          headCount: s.headCount + 1,
          animals: updatedAnimals,
          recentLogs: [newLog, ...s.recentLogs.slice(0, 8)]
        };
      }
      return s;
    });
    localStorage.setItem(STORAGE_KEY_LIVESTOCK_V2, JSON.stringify(next));
  },

  updateAnimalStatus(
    sectorId: string, 
    animalId: string, 
    newStatus: AnimalPhysiologicalStatus, 
    operatorName: string
  ): void {
    if (typeof window === 'undefined') return;
    const sectors = this.getSectors();
    const next = sectors.map(s => {
      if (s.id === sectorId && s.animals) {
        let animalName = '';
        let oldStatus = '';
        const updatedAnimals = s.animals.map(a => {
          if (a.id === animalId) {
            animalName = a.name;
            oldStatus = a.categoryStatus;
            return { ...a, categoryStatus: newStatus };
          }
          return a;
        });

        const newLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: `Updated ${animalName} status: ${oldStatus} → ${newStatus}`,
          operator: operatorName
        };

        return {
          ...s,
          animals: updatedAnimals,
          recentLogs: [newLog, ...s.recentLogs.slice(0, 8)]
        };
      }
      return s;
    });
    localStorage.setItem(STORAGE_KEY_LIVESTOCK_V2, JSON.stringify(next));
  },

  updateAnimalPhoto(
    sectorId: string,
    animalId: string,
    photoUrl: string,
    operatorName: string
  ): void {
    if (typeof window === 'undefined') return;
    const sectors = this.getSectors();
    const next = sectors.map(s => {
      if (s.id === sectorId && s.animals) {
        let animalName = '';
        const updatedAnimals = s.animals.map(a => {
          if (a.id === animalId) {
            animalName = a.name;
            return { ...a, photoUrl };
          }
          return a;
        });
        const newLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: `Updated identification photo for ${animalName || 'animal'}`,
          operator: operatorName
        };
        return {
          ...s,
          animals: updatedAnimals,
          recentLogs: [newLog, ...s.recentLogs.slice(0, 8)]
        };
      }
      return s;
    });
    localStorage.setItem(STORAGE_KEY_LIVESTOCK_V2, JSON.stringify(next));
  },

  removeAnimal(sectorId: string, animalId: string, reason: string, operatorName: string): void {
    if (typeof window === 'undefined') return;
    const sectors = this.getSectors();
    const next = sectors.map(s => {
      if (s.id === sectorId && s.animals) {
        const target = s.animals.find(a => a.id === animalId);
        const updatedAnimals = s.animals.filter(a => a.id !== animalId);
        const newLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: `Transferred/removed ${target?.name || 'animal'} [TAG: ${target?.tagNumber || 'N/A'}] (${reason})`,
          operator: operatorName
        };
        return {
          ...s,
          headCount: Math.max(0, s.headCount - 1),
          animals: updatedAnimals,
          recentLogs: [newLog, ...s.recentLogs.slice(0, 8)]
        };
      }
      return s;
    });
    localStorage.setItem(STORAGE_KEY_LIVESTOCK_V2, JSON.stringify(next));
  },

  logActivity(sectorId: string, action: string, operatorName: string): void {
    if (typeof window === 'undefined') return;
    const sectors = this.getSectors();
    const next = sectors.map(s => {
      if (s.id === sectorId) {
        const newLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action,
          operator: operatorName
        };
        return {
          ...s,
          recentLogs: [newLog, ...s.recentLogs.slice(0, 8)]
        };
      }
      return s;
    });
    localStorage.setItem(STORAGE_KEY_LIVESTOCK_V2, JSON.stringify(next));
  },

  updateHeadCount(sectorId: string, delta: number): void {
    if (typeof window === 'undefined') return;
    const sectors = this.getSectors();
    const next = sectors.map(s => {
      if (s.id === sectorId) {
        return {
          ...s,
          headCount: Math.max(0, s.headCount + delta)
        };
      }
      return s;
    });
    localStorage.setItem(STORAGE_KEY_LIVESTOCK_V2, JSON.stringify(next));
  },

  getWeather(): WeatherData {
    return INITIAL_WEATHER_DATA;
  },

  getMilkingRecords(): MilkingRecord[] {
    if (typeof window === 'undefined') return INITIAL_MILKING_RECORDS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_MILKING_V1);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    localStorage.setItem(STORAGE_KEY_MILKING_V1, JSON.stringify(INITIAL_MILKING_RECORDS));
    return INITIAL_MILKING_RECORDS;
  },

  addMilkingRecord(record: MilkingRecord, operatorName: string): void {
    if (typeof window === 'undefined') return;
    const records = this.getMilkingRecords();
    const next = [record, ...records];
    localStorage.setItem(STORAGE_KEY_MILKING_V1, JSON.stringify(next));

    // Also update individual animal's lastMilkingYieldL if animal exists
    const targetSectorId = record.species === 'cows' ? 'cows-dairy' : 'goats-dairy';
    const sectors = this.getSectors();
    const updatedSectors = sectors.map(sec => {
      if (sec.id === targetSectorId && sec.animals) {
        const updatedAnimals = sec.animals.map(a => {
          if (a.tagNumber.toUpperCase() === record.tagNumber.toUpperCase() || a.id === record.animalId) {
            return {
              ...a,
              lastMilkingYieldL: record.totalLitres
            };
          }
          return a;
        });
        const newLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: `Recorded milking for ${record.animalName} [${record.tagNumber}]: AM ${record.morningLitres}L + PM ${record.eveningLitres}L = Total ${record.totalLitres}L`,
          operator: operatorName
        };
        return {
          ...sec,
          animals: updatedAnimals,
          recentLogs: [newLog, ...sec.recentLogs.slice(0, 8)]
        };
      }
      return sec;
    });
    localStorage.setItem(STORAGE_KEY_LIVESTOCK_V2, JSON.stringify(updatedSectors));
  },

  deleteMilkingRecord(recordId: string, operatorName: string): void {
    if (typeof window === 'undefined') return;
    const records = this.getMilkingRecords();
    const target = records.find(r => r.id === recordId);
    const next = records.filter(r => r.id !== recordId);
    localStorage.setItem(STORAGE_KEY_MILKING_V1, JSON.stringify(next));

    if (target) {
      const targetSectorId = target.species === 'cows' ? 'cows-dairy' : 'goats-dairy';
      this.logActivity(targetSectorId, `Revoked/deleted milking record for ${target.animalName} [${target.tagNumber}]`, operatorName);
    }
  },

  addSector(newSector: LivestockSector, operatorName: string): void {
    if (typeof window === 'undefined') return;
    const sectors = this.getSectors();
    const exists = sectors.some(s => s.id === newSector.id);
    const updated = exists ? sectors.map(s => s.id === newSector.id ? newSector : s) : [...sectors, newSector];
    localStorage.setItem(STORAGE_KEY_LIVESTOCK_V2, JSON.stringify(updated));
  },

  deleteSector(sectorId: string, operatorName: string): void {
    if (typeof window === 'undefined') return;
    const sectors = this.getSectors();
    const updated = sectors.filter(s => s.id !== sectorId);
    localStorage.setItem(STORAGE_KEY_LIVESTOCK_V2, JSON.stringify(updated));
  },

  getEggRecords(): EggCollectionRecord[] {
    if (typeof window === 'undefined') return INITIAL_EGG_RECORDS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_EGGS_V1);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    localStorage.setItem(STORAGE_KEY_EGGS_V1, JSON.stringify(INITIAL_EGG_RECORDS));
    return INITIAL_EGG_RECORDS;
  },

  addEggRecord(record: EggCollectionRecord, operatorName: string): void {
    if (typeof window === 'undefined') return;
    const records = this.getEggRecords();
    const next = [record, ...records];
    localStorage.setItem(STORAGE_KEY_EGGS_V1, JSON.stringify(next));

    this.logActivity(
      record.flockSectorId,
      `Logged egg collection (${record.sourceSpecies.toUpperCase()}): ${record.cleanEggsCount} clean + ${record.crackedEggsCount} cracked = ${record.totalEggsCount} eggs [${record.timeOfDay}]`,
      operatorName
    );
  },

  deleteEggRecord(recordId: string, operatorName: string): void {
    if (typeof window === 'undefined') return;
    const records = this.getEggRecords();
    const target = records.find(r => r.id === recordId);
    const next = records.filter(r => r.id !== recordId);
    localStorage.setItem(STORAGE_KEY_EGGS_V1, JSON.stringify(next));

    if (target) {
      this.logActivity(
        target.flockSectorId,
        `Revoked egg collection record (${target.sourceSpecies}) from ${target.date}`,
        operatorName
      );
    }
  }
};

const STORAGE_KEY_EGGS_V1 = 'solum_farm_egg_records_v1';

export const INITIAL_EGG_RECORDS: EggCollectionRecord[] = [
  {
    id: 'egg-rec-1',
    sourceSpecies: 'chicken',
    flockSectorId: 'chicken',
    date: new Date().toISOString().split('T')[0],
    timeOfDay: 'Morning (AM)',
    cleanEggsCount: 382,
    crackedEggsCount: 6,
    totalEggsCount: 388,
    eggGrade: 'Grade A Large',
    averageEggWeightGrams: 58.4,
    flatsCount: 12.5,
    storageLocation: 'Cold Room Packhouse A (45°F)',
    notes: 'Pasture Layer Flock 1. Excellent shell density.',
    operator: 'Elena Vance',
    timestamp: '07:15 AM'
  },
  {
    id: 'egg-rec-2',
    sourceSpecies: 'ducks',
    flockSectorId: 'ducks',
    date: new Date().toISOString().split('T')[0],
    timeOfDay: 'Morning (AM)',
    cleanEggsCount: 142,
    crackedEggsCount: 2,
    totalEggsCount: 144,
    eggGrade: 'Duck Free-Range',
    averageEggWeightGrams: 72.8,
    flatsCount: 4.8,
    storageLocation: 'Cold Room Packhouse B (Duck Bay)',
    notes: 'Heritage Khaki Campbell & Pekin. Rich golden yolks.',
    operator: 'Marcus Holt',
    timestamp: '08:00 AM'
  },
  {
    id: 'egg-rec-3',
    sourceSpecies: 'chicken',
    flockSectorId: 'chicken',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    timeOfDay: 'Morning (AM)',
    cleanEggsCount: 390,
    crackedEggsCount: 5,
    totalEggsCount: 395,
    eggGrade: 'Grade AA Jumbo',
    averageEggWeightGrams: 61.2,
    flatsCount: 13.0,
    storageLocation: 'Direct CSA Farm Stand',
    notes: 'Full harvest packed for Wednesday restaurant deliveries.',
    operator: 'Sarah Jenkins',
    timestamp: '07:30 AM'
  },
  {
    id: 'egg-rec-4',
    sourceSpecies: 'ducks',
    flockSectorId: 'ducks',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    timeOfDay: 'Afternoon (Noon)',
    cleanEggsCount: 35,
    crackedEggsCount: 1,
    totalEggsCount: 36,
    eggGrade: 'Duck Free-Range',
    averageEggWeightGrams: 74.0,
    flatsCount: 1.2,
    storageLocation: 'Hatchery Incubator Bay',
    notes: 'Selected fertile breeding duck eggs set for incubation.',
    operator: 'Liam Cooper',
    timestamp: '12:45 PM'
  }
];
