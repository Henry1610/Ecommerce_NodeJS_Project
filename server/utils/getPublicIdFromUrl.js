export const getPublicIdFromUrl = (url) => {
    try {
      const parts = url.split('/');
      const filenameWithExt = decodeURIComponent(parts[parts.length - 1]); // Giải mã %20 → space
      const nameWithoutExt = filenameWithExt.split('.')[0];
  
      const uploadIndex = parts.indexOf('upload');
      const folderPath = parts.slice(uploadIndex + 2, parts.length - 1).join('/'); // Bỏ 'v123456'
  
      return `${folderPath}/${nameWithoutExt}`;
    } catch (error) {
      console.error('❌ Lỗi khi tách publicId:', error);
      return null;
    }
  };
  