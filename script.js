// script.js

const tools = [
  {
    name: "ChatGPT",
    description: "An advanced AI chatbot developed by OpenAI.",
    url: "https://chat.openai.com/",
    category: "Chatbot"
  },
  {
    name: "Canva",
    description: "Design anything from logos to videos with ease.",
    url: "https://www.canva.com/",
    category: "Design"
  },
  {
    name: "Remove.bg",
    description: "Remove background from any image automatically.",
    url: "https://www.remove.bg/",
    category: "Image Editing"
  },
  {
    name: "Copy.ai",
    description: "Generate marketing copy using AI.",
    url: "https://www.copy.ai/",
    category: "Writing"
  },
  {
    name: "Krisp",
    description: "Remove background noise in real-time during calls.",
    url: "https://krisp.ai/",
    category: "Audio"
  },
  {
    name: "Runway ML",
    description: "AI tools for video, image, and creative workflows.",
    url: "https://runwayml.com/",
    category: "Video"
  },
  {
    name: "Notion AI",
    description: "AI integrated into Notion for productivity and writing.",
    url: "https://www.notion.so/product/ai",
    category: "Productivity"
  },
  {
    name: "VD6",
    description: "Download videos from Instagram and more.",
    url: "https://vd6s.com/en/",
    category: "Downloader"
  },
  {
    name: "PinDown",
    description: "Pinterest video downloader.",
    url: "https://pindown.io/",
    category: "Downloader"
  },
  {
    name: "FastDL",
    description: "Fast video downloader.",
    url: "https://fastdl.app/en",
    category: "Downloader"
  },
  {
    name: "ElevenLabs",
    description: "Realistic text-to-speech voice generator.",
    url: "https://www.elevenlabs.io/",
    category: "Voice"
  },
  {
    name: "Play.ht",
    description: "Create AI voiceovers in seconds.",
    url: "https://play.ht/",
    category: "Voice"
  },
  {
    name: "Pika",
    description: "AI video generator.",
    url: "https://www.pika.art/",
    category: "Video"
  },
  {
    name: "Leonardo AI",
    description: "AI image generation for creators.",
    url: "https://leonardo.ai/",
    category: "Image Generation"
  },
  {
    name: "Synthesia",
    description: "Create AI videos with avatars.",
    url: "https://www.synthesia.io/",
    category: "Video"
  }
];

function renderTools() {
  const container = document.getElementById("toolsContainer");
  container.innerHTML = "";

  tools.forEach(tool => {
    const card = document.createElement("div");
    card.className = "tool-card";
    card.innerHTML = `
      <h3>${tool.name}</h3>
      <p>${tool.description}</p>
      <a href="${tool.url}" target="_blank">Visit Tool</a>
    `;
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", renderTools);
