import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "sonar-pro",
      messages: [{ role: "user", content: message }]
    })
  };

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", options);
    const data = await response.json();
    
    //console.log("Perplexity API Response:", JSON.stringify(data, null, 2));

    const content = data?.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content from API");

    return content;

  } catch (err) {
    console.error("Error:", err.message || err);
    return "Sorry, I couldn't understand that.";
  }
};

export default getOpenAIAPIResponse;
