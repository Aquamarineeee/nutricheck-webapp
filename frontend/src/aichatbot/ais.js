import React, { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import { callGeminiAPI } from "./apisai";

const Chatbot = () => {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");

    const handleSend = async () => {
        try {
        const result = await callGeminiAPI(prompt);
        setResponse(result.response); // Xử lý kết quả
        } catch (error) {
        console.error(error);
        setResponse("Đã xảy ra lỗi!");
        }
    };

    return (
        <div>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <button onClick={handleSend}>Send</button>
        <p>Response: {response}</p>
        </div>
    );
};

export default Chatbot;
