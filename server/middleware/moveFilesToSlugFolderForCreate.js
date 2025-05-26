import fs from 'fs';
import path from 'path';

/**
 * Middleware cho tạo mới product:
 * - Tạo thư mục theo slug
 * - Di chuyển ảnh mới từ uploads/temp vào thư mục slug
 */
function moveFilesToSlugFolderForCreate(req, res,next) {
  try{
    const product = req.product;
    const destFolder = path.join('uploads/products', product._id.toString());
  
  
    const hasFiles = req.files && req.files.length > 0;
    if (!hasFiles)   res.status(200).json(product);
  
  
    fs.mkdirSync(destFolder, { recursive: true });
  
    req.files.forEach(file => {
      const oldPath = path.join('uploads/temp', file.filename);
      const newPath = path.join(destFolder, file.filename);
  
      fs.renameSync(oldPath, newPath);
  
      // Cập nhật lại file info để controller dùng nếu cần
      file.oldPath = oldPath;
      file.path = newPath;
      file.folder = product._id.toString();
    });
    res.status(200).json(product);
  }
  catch(error){
    next(error)
  }
}

export default moveFilesToSlugFolderForCreate;
