import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer memory storage (stores file in memory as Buffer for direct streaming)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WEBP, etc.) are permitted!'), false);
    }
  }
});

/**
 * Upload an image buffer directly to Cloudinary.
 * If Cloudinary environment variables are missing, provides a safe Data URI fallback
 * so the application remains fully functional in local offline mode.
 */
export const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const isCloudinaryConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name';

    if (!isCloudinaryConfigured) {
      // Offline fallback: convert buffer to base64 Data URI
      const base64Data = buffer.toString('base64');
      const dataUri = `data:image/jpeg;base64,${base64Data}`;
      return resolve({
        secure_url: dataUri,
        url: dataUri,
        public_id: `local_${Date.now()}`,
        format: 'base64',
        fallback: true,
        message: 'Cloudinary environment variables not configured. Served via local Data URI.'
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'agritrade/uploads',
        resource_type: 'auto',
        transformation: options.transformation || [{ quality: 'auto', fetch_format: 'auto' }],
        ...options
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

export default cloudinary;
