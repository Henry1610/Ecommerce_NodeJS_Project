import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tempDir = 'uploads/temp';


    fs.mkdirSync(tempDir, { recursive: true });
    cb(null, tempDir);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

export default upload;
