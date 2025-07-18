const safeDate = (value) => {
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};


const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = safeDate(dateString);
  if (!date) return '';

  try {
    const formatter = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return formatter.format(date);
  } catch (e) {
    console.error('Intl formatting failed:', e);
    return date.toISOString(); // fallback
  }
};

export default formatDateTime;
