import { v2 as cloudinary } from 'cloudinary';

export const deleteCloudinaryFolder = async (folderPath) => {
    console.log("👉 Bắt đầu xoá folder Cloudinary:", folderPath);

  try {
    // Xóa tất cả ảnh trong folder
    await cloudinary.api.delete_resources_by_prefix(folderPath);

    // Xóa folder nếu không còn ảnh
    await cloudinary.api.delete_folder(folderPath);

    console.log(`Đã xoá folder: ${folderPath}`);
  } catch (err) {
    console.error('Lỗi xoá folder Cloudinary:', err.message);
  }
};
