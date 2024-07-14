window.onload = function() {
    initMap();
}
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCNjlQYV3tOcIc_ijARSin2QQXde6iAakc";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


let map;
let markers = [];


document.getElementById('send-chat').addEventListener('click', async function() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message) {
        addChatMessage('User', message);
        input.value = '';
        await sendToGemini(message);
    }
});

document.getElementById('close-chat').addEventListener('click', function() {
    document.getElementById('chat-container').classList.add('hidden');
    document.getElementById('open-chat').classList.add('show');
});

document.getElementById('open-chat').addEventListener('click', function() {
    document.getElementById('chat-container').classList.remove('hidden');
    document.getElementById('open-chat').classList.remove('show');
});


function addChatMessage(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


async function sendToGemini(message) {
    try {
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = await response.text();
        addChatMessage('Gemini', text);
    } catch (error) {
        console.error('Error:', error);
        addChatMessage('Gemini', 'Sorry, something went wrong.');
    }
}
