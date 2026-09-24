/**
 * Verified High-Quality Authentic Crop Photographs
 * Maps every produce item to its accurate agricultural photograph.
 */

export const CROP_IMAGES = {
  Rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
  Wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
  Cotton: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop&q=80',
  Tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
  Onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
  Maize: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80',
  Potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
  Chilli: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80',
  Pulses: 'https://images.unsplash.com/photo-1585994192701-f1a505c8574a?w=800&auto=format&fit=crop&q=80',
  Mustard: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&auto=format&fit=crop&q=80',
  Soybean: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
  Other: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'
};

export const getCropImage = (cropName) => {
  if (!cropName) return CROP_IMAGES.Rice;
  const name = cropName.toLowerCase();
  if (name.includes('rice') || name.includes('paddy')) return CROP_IMAGES.Rice;
  if (name.includes('wheat') || name.includes('sharbati')) return CROP_IMAGES.Wheat;
  if (name.includes('cotton')) return CROP_IMAGES.Cotton;
  if (name.includes('tomato')) return CROP_IMAGES.Tomato;
  if (name.includes('onion')) return CROP_IMAGES.Onion;
  if (name.includes('maize') || name.includes('corn')) return CROP_IMAGES.Maize;
  if (name.includes('potato')) return CROP_IMAGES.Potato;
  if (name.includes('chilli') || name.includes('pepper')) return CROP_IMAGES.Chilli;
  if (name.includes('pulse') || name.includes('dal') || name.includes('gram')) return CROP_IMAGES.Pulses;
  if (name.includes('mustard')) return CROP_IMAGES.Mustard;
  if (name.includes('soy') || name.includes('bean')) return CROP_IMAGES.Soybean;
  return CROP_IMAGES.Other;
};
