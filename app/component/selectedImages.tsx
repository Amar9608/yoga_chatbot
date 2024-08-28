import React, { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { X } from "lucide-react";

type Props = {
  images: string[];
  setImages: Dispatch<SetStateAction<string[]>>;
};

const SelectedImages = ({ images, setImages }: Props) => {
  const maxImageDisplayed = 5;

  const handleRemoveImages = () => setImages([]);

  return (
    <div className="relative flex flex-row gap-2 mt-4">
      <div className="flex flex-row gap-2 overflow-hidden">
        {images.slice(0, maxImageDisplayed).map((img, idx) => (
          <Image
            key={img}
            className="h-24 w-auto shadow-md hover:h-32 max-w-96 hover:z-10 hover:shadow-2xl transition-transform transform hover:scale-110"
            width={100}
            height={100}
            src={img}
            alt={`Selected image ${idx + 1}`}
          />
        ))}
        {images.length > maxImageDisplayed && (
          <span className="flex items-center text-xs w-14 text-left">
            {`${images.length - maxImageDisplayed} more`}
          </span>
        )}
      </div>
      {images.length > 0 && (
        <X
          className="absolute -top-2 -right-2 cursor-pointer rounded-full h-6 w-6 p-1 shadow-md bg-white"
          onClick={handleRemoveImages}
          aria-label="Clear images"
        />
      )}
    </div>
  );
};

export default SelectedImages;
