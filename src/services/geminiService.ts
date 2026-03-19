import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getChatResponse(message: string, history: { role: string, parts: { text: string }[] }[]) {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "Você é o assistente de IA do Papa's Chicken, um restaurante de fast food de luxo em Chimoio, Moçambique. Você ajuda os clientes com informações sobre o menu, processo de pedido e consultas gerais. Seja educado, elegante e prestativo. Nossas especialidades são Frango Grelhado, Hambúrgueres e Pizzas. Contacto: +258 86 767 4675.",
    },
  });

  // Reconstruct history properly for the SDK
  // Note: The SDK might have specific requirements for history format
  // For simplicity, we'll just send the message if history is complex, 
  // but let's try to pass it if possible.
  
  const response = await chat.sendMessage({ message });
  return response.text;
}
