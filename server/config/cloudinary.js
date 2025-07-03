import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import slugify from 'slugify';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// 📦 1. Upload Brand Image — CREATE
export const uploadBrandImageForCreate = () =>
  multer({
    storage: new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => {
        const name = String(req.body.name || 'default');
        const slug = slugify(name, { lower: true, strict: true });
        req.body.slug = slug; // optional: lưu lại slug cho controller dùng

        return {
          folder: `brands/${slug}`,
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
        };
      },
    }),
  });

// 🟦 2. Upload Product Image — CREATE
export const uploadProductImageForCreate = () =>
  multer({
    storage: new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => {
        const slug = req.body.slug;
        if (!slug) throw new Error('Slug is required in req.body');

        return {
          folder: `products/${slug}`,
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
        };
      },
    }),
  });

// 🟨 3. Upload Product Image — UPDATE (slug truyền từ controller)
// ✅ Upload Product Image for Update (slug lấy trong middleware)
export const uploadProductImageForUpdate = () =>
  multer({
    storage: new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => {
        const slug = req.body.slug || req.params.slug;
        if (!slug) throw new Error('Slug is required');

        return {
          folder: `products/${slug}`,
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
        };
      },
    }),
  });


// ⚪️ 4. (Optional) Brand Simple Upload — Không tách folder theo slug
export const uploadBrandImageWithSlug = () =>
  multer({
    storage: new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => {
        const name = req.body.name || 'default';
        const slug = slugify(name, { lower: true, strict: true });

        return {
          folder: `brands/${slug}`,
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          public_id: file.originalname.split('.')[0], // tên file không có đuôi
        };
      },
    }),
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

// Upload avatar for user profile
export const uploadAvatar = () =>
  multer({
    storage: new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => ({
        folder: `avatars`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        public_id: `${req.user ? req.user.id : 'guest'}-${Date.now()}`
      }),
    }),
  });
