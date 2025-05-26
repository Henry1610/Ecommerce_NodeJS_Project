import fs from 'fs';
import path from 'path';

/**
 * Middleware cho tạo mới product:
 * - Tạo thư mục theo slug
 * - Di chuyển ảnh mới từ uploads/temp vào thư mục slug
 */
function moveFilesToSlugFolderForCreate(req, res, next) {
  const slug = req.slug || 'default-slug';
  const destFolder = path.join('uploads/products', slug);
  const hasFiles = req.files && req.files.length > 0;

  if (!hasFiles) return next(); // Không có ảnh thì bỏ qua

  fs.mkdirSync(destFolder, { recursive: true });

  req.files.forEach(file => {
    const oldPath = path.join('uploads/temp', file.filename);
    const newPath = path.join(destFolder, file.filename);

    fs.renameSync(oldPath, newPath);

    // Cập nhật lại file info để controller dùng nếu cần
    file.oldPath = oldPath;
    file.path = newPath;
    file.folder = slug;
  });

  next();
}

export default moveFilesToSlugFolderForCreate;
