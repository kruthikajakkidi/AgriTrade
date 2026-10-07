/**
 * Verified High-Quality Authentic Crop Photographs
 * Maps every produce item to its accurate agricultural photograph.
 */

export const CROP_IMAGES = {
  Rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
  Wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
  Cotton: 'https://images.unsplash.com/photo-1509783236416-c9ad59bae472?w=800&auto=format&fit=crop&q=80',
  Tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
  Onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
  Maize: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80',
  Potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
  Chilli: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80',
  Pulses: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80',
  Mustard: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&auto=format&fit=crop&q=80',
  Soybean: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
  Turmeric: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
  Groundnut: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=800&auto=format&fit=crop&q=80',
  Vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
  Other: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'
};

export const getCropImage = (cropName) => {
  if (!cropName || typeof cropName !== 'string') return CROP_IMAGES.Rice;
  const name = cropName.toLowerCase().trim();

  if (name.includes('rice') || name.includes('paddy') || name.includes('sona') || name.includes('basmati')) return CROP_IMAGES.Rice;
  if (name.includes('wheat') || name.includes('sharbati') || name.includes('gehu')) return CROP_IMAGES.Wheat;
  if (name.includes('cotton') || name.includes('kapas')) return CROP_IMAGES.Cotton;
  if (name.includes('tomato') || name.includes('tamatar')) return CROP_IMAGES.Tomato;
  if (name.includes('onion') || name.includes('pyaz') || name.includes('nashik')) return CROP_IMAGES.Onion;
  if (name.includes('maize') || name.includes('corn') || name.includes('makka')) return CROP_IMAGES.Maize;
  if (name.includes('potato') || name.includes('aloo') || name.includes('kufri')) return CROP_IMAGES.Potato;
  if (name.includes('chilli') || name.includes('chili') || name.includes('mirchi') || name.includes('pepper')) return CROP_IMAGES.Chilli;
  if (
    name.includes('pulse') ||
    name.includes('dal') ||
    name.includes('lentil') ||
    name.includes('gram') ||
    name.includes('toor') ||
    name.includes('moong') ||
    name.includes('urad') ||
    name.includes('chana')
  ) {
    return CROP_IMAGES.Pulses;
  }
  if (name.includes('mustard') || name.includes('sarson') || name.includes('rai')) return CROP_IMAGES.Mustard;
  if (name.includes('soy') || name.includes('soya') || name.includes('bean')) return CROP_IMAGES.Soybean;
  if (name.includes('turmeric') || name.includes('haldi')) return CROP_IMAGES.Turmeric;
  if (name.includes('groundnut') || name.includes('peanut') || name.includes('mungfali')) return CROP_IMAGES.Groundnut;
  if (name.includes('vegetable') || name.includes('sabzi')) return CROP_IMAGES.Vegetables;

  return CROP_IMAGES.Other;
};

export const resolveLotImage = (lot) => {
  if (!lot) return CROP_IMAGES.Rice;
  const cropImageFallback = getCropImage(lot.cropName || lot.produce || lot.commodity);
  if (lot.images && Array.isArray(lot.images) && lot.images[0]) {
    const img = lot.images[0];
    if (
      typeof img === 'string' &&
      img.trim() &&
      !img.includes('photo-1585994192701') &&
      !img.includes('photo-1606041008023')
    ) {
      return img;
    }
  }
  return cropImageFallback;
};
