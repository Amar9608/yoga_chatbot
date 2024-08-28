"use client";

import React from "react";
import { useChat } from "ai/react";
import InputForm from "./component/inputForm"; 
import Messages from "./component/messages";  

export default function Home() {
 
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    api: "/api/genai/", 
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-900 text-white">
      <div className="w-full max-w-4xl p-4 bg-gray-800 rounded-lg shadow-lg">
        <div className="p-4 text-lg font-semibold bg-gray-700 rounded-t-lg">
          Yoga Chatbot
        </div>

        <div className="flex-grow overflow-y-auto p-4">
          <Messages messages={messages} isLoading={isLoading} />
        </div>

        <div className="p-4 bg-gray-800 rounded-b-lg">
          <InputForm
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
          />
        </div>
      </div>
    </main>
  );
}
