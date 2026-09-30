import holsteinCowImg from '../assets/images/dairy_cow_portrait_1790781789369.jpg';
import jerseyCowImg from '../assets/images/jersey_cow_portrait_1790781816708.jpg';
import saanenGoatImg from '../assets/images/dairy_goat_portrait_1790781802696.jpg';
import boerGoatImg from '../assets/images/boer_goat_portrait_1790781830304.jpg';
import pastureCowsImg from '../assets/images/livestock_cows_pasture_1790708243606.jpg';

export interface AnimalPhotoPreset {
  id: string;
  title: string;
  animalType: 'cows' | 'goats' | 'chicken' | 'ducks' | 'rabbits';
  category: 'dairy' | 'meat' | 'all';
  url: string;
}

export const ANIMAL_PHOTO_PRESETS: AnimalPhotoPreset[] = [
  {
    id: 'cow-holstein',
    title: 'Holstein Friesian (Dairy)',
    animalType: 'cows',
    category: 'dairy',
    url: holsteinCowImg
  },
  {
    id: 'cow-jersey',
    title: 'Jersey (Dairy Fawn)',
    animalType: 'cows',
    category: 'dairy',
    url: jerseyCowImg
  },
  {
    id: 'cow-pasture',
    title: 'Pasture Cow (Beef/Commercial)',
    animalType: 'cows',
    category: 'all',
    url: pastureCowsImg
  },
  {
    id: 'goat-saanen',
    title: 'Saanen (Dairy White)',
    animalType: 'goats',
    category: 'dairy',
    url: saanenGoatImg
  },
  {
    id: 'goat-boer',
    title: 'Boer (Meat Brown/White)',
    animalType: 'goats',
    category: 'meat',
    url: boerGoatImg
  }
];

export const getPhotoPresetsForSector = (
  animalType: string,
  category: string
): AnimalPhotoPreset[] => {
  return ANIMAL_PHOTO_PRESETS.filter(
    (p) => p.animalType === animalType && (p.category === category || p.category === 'all')
  );
};

/**
 * Resizes and compresses an uploaded image file into a compact Data URL
 * suitable for localStorage and instantaneous rendering on mobile and desktop.
 */
export const processUploadedAnimalImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select an image file (JPEG, PNG, WebP)'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image data'));
      img.onload = () => {
        // Create an offscreen canvas to scale down high-res phone pictures
        const canvas = document.createElement('canvas');
        const MAX_DIM = 800; // 800x800 is sharp yet light in storage
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Output compressed JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
