export const generateOrderNumber = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Lấy 2 số cuối của năm
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 chữ số random
  
    return `OD${year}${month}${day}${randomPart}`;
  }
  