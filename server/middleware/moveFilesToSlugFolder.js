import fs from 'fs';
import path from 'path';


/**
 * Middleware xử lý việc:
 * - Tạo thư mục đích theo slug
 * - Giữ hoặc xóa ảnh cũ nếu trong quá trình move có ảnh trùng (req.body.oldImages)
 * - Di chuyển ảnh mới từ uploads/temp vào thư mục đích
 * - Trường hợp không có ảnh nào  được upload thì xóa các file trong folder product-slug đó
 */
function moveFilesToSlugFolder(req, res, next) {
  try {
    const product = req.product || 'default-id';
    const destFolder = path.join('uploads/products', product._id.toString());

    fs.mkdirSync(destFolder, { recursive: true });
    const hasFiles = req.files && req.files.length > 0;

    // Lấy danh sách ảnh cũ cần giữ lại từ req.body.oldImages
    let imagesToKeep = [];
    try {
      imagesToKeep = JSON.parse(req.body.oldImages || '[]');
    } catch (e) {
      console.error('Invalid oldImages JSON');
    }
    //lấy ra mảng file upload hiện tại
    const existingFiles = fs.readdirSync(destFolder);
    //xét trường hợp nếu mảng được truyền vào rỗng thì xóa hết file trong folder đó
    if (!imagesToKeep && hasFiles) {
      req.files.forEach(file => {
        const tempPath = path.join('uploads/temp', file.filename);
        fs.unlinkSync(tempPath);
      });
    }

    //kiểm tra mảng trong folder đã có , có file nào không có trong mảng cũ vừa upload lên thì xóa đi(xóa các phần tử cũ mà req gửi lên sever không có)
    existingFiles.forEach(file => {
      if (!imagesToKeep.includes(file)) {
        fs.unlinkSync(path.join(destFolder, file));
      }
    });
    //Di chuyển file

    req.files.forEach(file => {
      const oldPath = path.join('uploads/temp', file.filename);
      const newPath = path.join(destFolder, file.filename);

      fs.renameSync(oldPath, newPath);

      // Cập nhật lại file info nếu cần dùng trong controller
      file.oldPath = oldPath;
      file.path = newPath;
      file.folder = product._id.toString();;
    });
    res.status(200).json({ message: 'Cập nhật thành công', product: req.product });
  } catch (error) {
    next(error);

  }
}
export default moveFilesToSlugFolder


