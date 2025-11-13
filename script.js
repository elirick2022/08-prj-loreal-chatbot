/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

/* Handle form submit */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // When using Cloudflare, you'll need to POST a `messages` array in the body,
  // and handle the response using: data.choices[0].message.content

  // Show message
  chatWindow.innerHTML = "Connect to the OpenAI API for a response!";
});

async function main() {
  // Send a POST request to the OpenAI Chat Completions endpoint
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // we're sending JSON
        Authorization: `Bearer ${API_KEY}`, // API_KEY should come from secrets.js
      },
      // Provide the model and the messages array
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a friendly L’Oréal Skincare Product Advisor, specializing in personalized skincare recommendations. You help users understand their skin type, identify their concerns, and choose the most suitable L’Oréal products — including cleansers, serums, moisturizers, sunscreens, and targeted treatments. Provide clear, helpful explanations about ingredients, usage routines, and how products work together. If a user's query is unrelated to skincare or L’Oréal products, respond by stating that you do not know.",
          },
          {
            role: "user",
            content: "what is a good moisturiser for dry skin?",
          },
        ],
      }),
    });

    // Parse the JSON response
    const data = await response.json();

    // Log and display the assistant's reply (Cloudflare and standard responses use this path)
    console.log(data.choices[0].message.content);
    chatWindow.textContent = data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    chatWindow.textContent = "Sorry — there was an error contacting the API.";
  }
}

main();
