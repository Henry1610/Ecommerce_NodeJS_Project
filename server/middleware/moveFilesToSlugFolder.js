import fs from 'fs';
import path from 'path';

function clearFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
      fs.unlinkSync(path.join(folderPath, file));
    });
  }
}

function moveFilesToSlugFolder(req, res, next) {
  const slug = req.slug || 'default-slug';
  const destFolder = path.join('uploads/products', slug);

  fs.mkdirSync(destFolder, { recursive: true });

  clearFolder(destFolder);


  req.files.forEach(file => {
    const oldPath = path.join('uploads/temp', file.filename);
    const newPath = path.join(destFolder, file.filename);

    fs.renameSync(oldPath, newPath);

    // Cập nhật lại file info nếu cần dùng trong controller
    file.oldPath = oldPath;
    file.path = newPath;
    file.folder = slug;
  });

  next();
}
export default moveFilesToSlugFolder