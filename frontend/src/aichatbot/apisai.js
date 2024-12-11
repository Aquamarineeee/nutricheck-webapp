export const callGeminiAPI = async (prompt) => {
    const API_KEY = "AIzaSyBlWb70DPaTVAKpfqS8o_z0MtGd6SqUte0";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
    const body = JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  