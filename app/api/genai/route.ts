import { StreamingTextResponse, GoogleGenerativeAIStream, Message } from "ai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();

    if (!reqBody || !reqBody.messages) {
      return new Response(
        JSON.stringify({ error: "Invalid request data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const images: string[] = reqBody.data?.images ? JSON.parse(reqBody.data.images) : [];
    const imageParts = filesArrayToGenerativeParts(images);
    const messages: Message[] = reqBody.messages || [];

    const keywordResponses = {
      "greeting": "Hello! I am a yoga instructor chatbot. How can I assist you with your yoga-related queries today?",
      "nonYoga": "I specialize in yoga. Please ask me something related to yoga.",
      "yoga": "I can assist you with various aspects of yoga. Please specify your query or let me know which type of yoga you are interested in."
    };

    const basicGreetings = ["hello", "hi", "hey", "greetings"];
    const yogaKeywords = [
      "asana", "pranayama", "shirshasana", "meditation", "mindfulness", "vinyasa", "hatha", "kundalini",
      "yoga", "yogic", "breathing", "yogic breathing", "posture", "alignment", "chakra",
      "yoga poses", "yoga practice", "yoga sequence", "yoga class", "yoga routine", "yoga therapy",
      "yoga benefits", "yoga for beginners", "yoga for flexibility", "yoga for strength", "yoga for relaxation",
      "sun salutations", "yoga nidra", "yoga sutras", "yoga philosophy", "yoga history", "yoga styles",
      "power yoga", "gentle yoga", "restorative yoga", "yoga techniques", "yoga exercises",
      "yoga postures", "yoga stretching", "yoga meditation", "yoga awareness", "yoga breathing exercises"
    ];

    const lastUserMessage = messages
      .filter((message) => message.role === "user")
      .pop()?.content?.toLowerCase();

    console.log("Last User Message:", lastUserMessage); // Log user input for debugging

    const isBasicGreeting = basicGreetings.some((greeting) =>
      lastUserMessage?.includes(greeting)
    );

    console.log("Is Basic Greeting:", isBasicGreeting); // Log result of basic greeting check

    const isYogaRelated = yogaKeywords.some((keyword) =>
      lastUserMessage?.includes(keyword)
    );

    console.log("Is Yoga Related:", isYogaRelated); // Log result of yoga-related check

    if (isBasicGreeting) {
      return new Response(JSON.stringify({ content: keywordResponses.greeting }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!isYogaRelated) {
      return new Response(JSON.stringify({ content: keywordResponses.nonYoga }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    let modelName: string;
    let promptWithParts: any;

    if (imageParts.length > 0) {
      modelName = "gemini-pro-vision";
      const prompt = [...messages].filter((message) => message.role === "user").pop()?.content;
      promptWithParts = [prompt, ...imageParts];
    } else {
      modelName = "gemini-pro";
      promptWithParts = buildGoogleGenAIPrompt(messages);
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: modelName });

    const streamingResponse = await model.generateContentStream(promptWithParts);
    return new StreamingTextResponse(GoogleGenerativeAIStream(streamingResponse));
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function buildGoogleGenAIPrompt(messages: Message[]) {
  return {
    contents: messages
      .filter((message) => message.role === "user" || message.role === "assistant")
      .map((message) => ({
        role: message.role === "user" ? "user" : "model",
        parts: [{ text: message.content }],
      })),
  };
}

function filesArrayToGenerativeParts(images: string[]) {
  return images.map((imageData) => ({
    inlineData: {
      data: imageData.split(",")[1],
      mimeType: imageData.substring(imageData.indexOf(":") + 1, imageData.lastIndexOf(";")),
    },
  }));
}
