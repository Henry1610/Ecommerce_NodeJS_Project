import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload ảnh brand (1 ảnh)
export const brandImageUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'brands',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
    }
  })
});

// Upload ảnh sản phẩm (nhiều ảnh)
export const productImageUploader = (slug) => multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `products/${slug}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
    }
  })
});
export const productImageUploaderTemp =()=> multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'products/temp',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
    }
  })
});

// Upload ảnh review (tối đa 3 ảnh)
export const reviewImageUploader = (slug, userId) => multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: async () => ({
      folder: `reviews/${slug}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      public_id: `${userId}-${Date.now()}`
    })
  }),
  limits: { files: 3 }
});
