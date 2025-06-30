export const getPublicIdFromUrl = (url) => {
    const parts = url.split('/');
    const filename = parts[parts.length - 1]; // ảnh.png
    const nameWithoutExt = filename.split('.')[0]; // bỏ đuôi .png

    // Lấy phần sau 'upload' đến trước filename (bỏ version v...)
    const uploadIndex = parts.indexOf('upload');
    const folderPath = parts.slice(uploadIndex + 2, parts.length - 1).join('/'); // bỏ v123456

    return `${folderPath}/${nameWithoutExt}`;
};