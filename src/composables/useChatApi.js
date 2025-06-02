// src/composables/useChatApi.js
const API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

export async function callGeminiAPI(messagesPayload, modelId, apiKey, temperature, systemInstruction) {
  if (!apiKey) {
    return Promise.reject(new Error("API Key not set"));
  }

  const apiUrl = `${API_BASE_URL}${modelId}:generateContent?key=${apiKey}`;
  const requestBody = {
    contents: messagesPayload,
    generationConfig: { temperature: parseFloat(temperature) }, // Ensure temperature is a number
  };

  if (systemInstruction && systemInstruction.trim() && modelId.includes("gemini")) { // Or check specific model capabilities
    requestBody.systemInstruction = {
      parts: [{ text: systemInstruction.trim() }],
    };
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({ error: { message: "Lỗi API không xác định" } }));
      let errMsg = `Lỗi API (${response.status}): ${errData.error?.message || response.statusText || "Không thể lấy phản hồi."}`;
      if (response.status === 400 && errMsg.includes("API key not valid")) {
        errMsg += " Vui lòng kiểm tra API key.";
        // Optionally, emit an event or use a callback to trigger settings modal
      }
      if (response.status === 404 && errMsg.includes("not found")) {
        errMsg += ` Model '${modelId}' có thể không tồn tại.`;
      }
      throw new Error(errMsg);
    }

    const data = await response.json();
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    if (data.candidates?.[0]?.finishReason && data.candidates[0].finishReason !== "STOP") {
      return `(Phản hồi bị chặn/không hoàn chỉnh. Lý do: ${data.candidates[0].finishReason})`;
    }
    console.warn("No text content in API response:", data);
    return "(AI không trả về nội dung văn bản)";
  } catch (error) {
    console.error("callGeminiAPI error:", error);
    throw error; // Re-throw to be caught by the caller
  }
}