/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

const WORKER_URL = "https://dark-cherry-630d.ericken.workers.dev"; // replace with your Cloudflare Worker URL
const systemPrompt = `You are a friendly L’Oréal Skincare Product Advisor, specializing in personalized skincare recommendations. You help users understand their skin type, identify their concerns, and choose the most suitable L’Oréal products — including cleansers, serums, moisturizers, sunscreens, and targeted treatments. Provide clear, helpful explanations about ingredients, usage routines, and how products work together. If a user's query is unrelated to skincare or L’Oréal products, politely respond by stating that you do not know.`;
let messages = [{ role: "system", content: systemPrompt }];

function addMessage(content, sender) {
  const msg = document.createElement("div");
  msg.classList.add("msg", sender); // sender = "user" or "ai"
  msg.textContent = content;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Set initial message
addMessage(
  "👋 Hello! I’m your L’Oréal skincare advisor. How can I help you today?",
  "ai"
);

/* Handle user submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = userInput.value.trim();
  if (!text) return;

  // show user's message
  addMessage(text, "user");

  // add to conversation memory
  messages.push({ role: "user", content: text });

  // clear input
  userInput.value = "";

  // show "typing..." placeholder
  const thinkingMsg = document.createElement("div");
  thinkingMsg.classList.add("msg", "ai");
  thinkingMsg.textContent = "Thinking…";
  chatWindow.appendChild(thinkingMsg);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  /* Call Cloudflare Worker */
  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    const aiReply = data.choices[0].message.content;

    // update placeholder
    thinkingMsg.remove();
    addMessage(aiReply, "ai");

    // save AI reply to conversation
    messages.push({ role: "assistant", content: aiReply });
  } catch (err) {
    thinkingMsg.remove();
    addMessage(
      "⚠️ Sorry — I couldn't reach the assistant. Try again in a moment.",
      "ai"
    );
    console.error(err);
  }
});
