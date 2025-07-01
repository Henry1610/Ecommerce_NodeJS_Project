import { v2 as cloudinary } from 'cloudinary';

export const deleteCloudinaryFolder = async (folderPath) => {
  console.log("👉 Bắt đầu xoá folder Cloudinary:", folderPath);

  try {
    const result = await cloudinary.api.delete_resources_by_prefix(folderPath);
    console.log("📁 Kết quả xoá file theo prefix:", result);

    const folderDeleteResult = await cloudinary.api.delete_folder(folderPath);
    console.log("✅ Đã xoá folder:", folderDeleteResult);
  } catch (err) {
    console.error('❌ Lỗi xoá folder Cloudinary:', err.message);
  }
};
