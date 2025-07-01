export function generateSlug(str) {
    return str
      .toLowerCase()
      .normalize('NFD')                  // bỏ dấu tiếng Việt
      .replace(/[\u0300-\u036f]/g, '')   // xóa dấu unicode
      .replace(/[^a-z0-9 -]/g, '')       // xóa ký tự đặc biệt
      .replace(/\s+/g, '-')              // thay khoảng trắng bằng dấu gạch ngang
      .replace(/-+/g, '-')               // gộp nhiều dấu gạch ngang lại
      .replace(/^-+|-+$/g, '');          // xóa dấu gạch ngang ở đầu/cuối
  }
  