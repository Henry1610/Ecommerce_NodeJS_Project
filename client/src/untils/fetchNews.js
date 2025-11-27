export const fetchNews= async (category = "world")=> {
    const apiKey = "pub_0f9b911628524d2eb9d7d97a60aa349c";
    const country = "vi";
    const language = "vi";
  
    const url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&country=${country}&language=${language}&category=${category}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Lỗi khi fetch tin tức:", error);
      return null;
    }
  }
