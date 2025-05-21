// import multer from 'multer';
// import path from 'path';

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/brands/');
//     },
//     filename: function (req, file, cb) {
//         const ext = path.extname(file.originalname);
//         cb(null, `${Date.now()}${ext}`);
//     }
// });

// const upload = multer({
//     storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, 
//     fileFilter: (req, file, cb) => {
//         const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//         if (!allowedTypes.includes(file.mimetype)) {
//             cb(new Error('Chỉ chấp nhận định dạng ảnh jpeg, jpg, png'));
//         } else {
//             cb(null, true);
//         }
//     }
// });

// export default upload;
// middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'uploads/others/';

    if (req.baseUrl.includes('/admin/products')) {
      folder = 'uploads/products/';
    } else if (req.baseUrl.includes('/admin/brands')) {
      folder = 'uploads/brands/';
    }

    // Tạo folder nếu chưa tồn tại
    fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

module.exports = upload;

