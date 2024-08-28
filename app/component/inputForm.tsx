import React, { FormEvent } from "react";

type Props = {
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  stop: () => void;
};

const InputForm = ({ input, handleInputChange, handleSubmit, isLoading, stop }: Props) => {
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        disabled={isLoading}
        placeholder="Type your message..."
        className="flex-grow p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        {isLoading ? "Sending..." : "Send"}
      </button>
      <button
        type="button"
        onClick={stop}
        disabled={isLoading}
        className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Stop
      </button>
    </form>
  );
};

export default InputForm;
