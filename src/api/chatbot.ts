import axios from 'axios';

// Chatbot API usando OpenAI GPT-3

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotResponse {
  message: string;
}

// API Key de OpenAI (Asegúrate de configurarla de manera segura)
const OPENAI_API_KEY = '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'; // Asegúrate de reemplazarlo con tu clave real

// Función para enviar el mensaje a la API de OpenAI
async function sendToOpenAI(message: string): Promise<ChatbotResponse> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003', // Modelo de OpenAI para completar
        prompt: message,          // El mensaje que el usuario envía
        max_tokens: 150,          // Longitud máxima de la respuesta
        temperature: 0.7,         // Controla la creatividad de la respuesta
      },
      {
        headers: {
          'Authorization': `Bearer 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}`, // Autorización con tu API Key
          'Content-Type': 'application/json',
        },
      }
    );

    // Respuesta del modelo de OpenAI
    const botMessage = response.data.choices[0].text.trim();

    return { message: botMessage };
  } catch (error) {
    console.error("Error al comunicarse con OpenAI:", error);
    return { message: 'Lo siento, ocurrió un error al procesar tu mensaje.' };
  }
}

// Función principal del chatbot que ahora usa la API de OpenAI
export async function sendChatMessage(message: string): Promise<ChatbotResponse> {
  // Simulamos un pequeño retraso antes de enviar el mensaje (puedes ajustarlo si lo deseas)
  await new Promise(resolve => setTimeout(resolve, 500));

  // Llamamos a la API de OpenAI para obtener una respuesta en base al mensaje del usuario
  const chatbotResponse = await sendToOpenAI(message);

  return chatbotResponse;
}

// Exportar tipos para usar en otras partes del código
export type { ChatMessage, ChatbotResponse };
