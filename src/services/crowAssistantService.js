import genAI from './geminiClient';

/**
 * System context for the Crow Assistant
 */
const CROW_SYSTEM_CONTEXT = `You are Crow, a helpful and intelligent assistant for the Tether Wallet application. 
You help users with wallet management, cryptocurrency transactions, security tips, and general crypto guidance.
Always be friendly, concise, and security-conscious in your responses.
When discussing transactions or security, emphasize best practices and safety.`;

/**
 * Manages a chat session with the Crow Assistant using Gemini.
 * @param {string} prompt - The user's input prompt.
 * @param {Array} history - The chat history.
 * @returns {Promise<{response: string, updatedHistory: Array}>} The response and updated history.
 */
export async function chatWithCrow(prompt, history = []) {
  try {
    const model = genAI?.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // Add system context to the beginning of history if it's a new conversation
    const conversationHistory = history?.length === 0 
      ? [{ role: 'user', parts: [{ text: CROW_SYSTEM_CONTEXT }] }]
      : history;

    const chat = model?.startChat({ history: conversationHistory });
    const result = await chat?.sendMessage(prompt);
    const response = await result?.response;
    const text = response?.text();

    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', parts: [{ text: prompt }] },
      { role: 'model', parts: [{ text }] },
    ];

    return { response: text, updatedHistory };
  } catch (error) {
    console.error('Error in Crow chat:', error);
    throw error;
  }
}

/**
 * Streams a response from the Crow Assistant.
 * @param {string} prompt - The user's input prompt.
 * @param {Array} history - The chat history.
 * @param {Function} onChunk - Callback to handle each streamed chunk.
 * @returns {Promise<Array>} Updated history after streaming.
 */
export async function streamCrowResponse(prompt, history = [], onChunk) {
  try {
    const model = genAI?.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const conversationHistory = history?.length === 0 
      ? [{ role: 'user', parts: [{ text: CROW_SYSTEM_CONTEXT }] }]
      : history;

    const chat = model?.startChat({ history: conversationHistory });
    const result = await chat?.sendMessageStream(prompt);

    let fullText = '';
    for await (const chunk of result?.stream) {
      const text = chunk?.text();
      if (text) {
        fullText += text;
        onChunk(text);
      }
    }

    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', parts: [{ text: prompt }] },
      { role: 'model', parts: [{ text: fullText }] },
    ];

    return updatedHistory;
  } catch (error) {
    console.error('Error in streaming Crow response:', error);
    throw error;
  }
}

/**
 * Handles common Gemini API errors with user-friendly messages.
 * @param {Error} error - The error object from the API.
 * @returns {string} User-friendly error message.
 */
export function handleCrowError(error) {
  console.error('Crow Assistant Error:', error);

  if (error?.message?.includes('429')) {
    return 'I\'m receiving too many requests right now. Please wait a moment and try again.';
  }
  
  if (error?.message?.includes('SAFETY')) {
    return 'I can\'t respond to that request. Please try rephrasing your question.';
  }
  
  if (error?.message?.includes('API key')) {
    return 'I\'m having trouble connecting. Please check the API configuration.';
  }
  
  return 'I encountered an error. Please try again or rephrase your question.';
}