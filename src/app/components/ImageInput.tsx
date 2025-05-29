import React from "react";
import { X } from "lucide-react";

interface ImageInputProps {
    inputMethod: "upload" | "url";
    imageUrl: string;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleImageUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeImage: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

export const ImageInput: React.FC<ImageInputProps> = ({
    inputMethod,
    imageUrl,
    handleImageChange,
    handleImageUrlChange,
    removeImage,
    fileInputRef,
}) => (
    <div className="mb-4 w-full relative">
        <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={
                inputMethod === "upload"
                    ? "block w-full text-sm text-gray-500 border-2 p-1 border-blue-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    : "hidden"
            }
            tabIndex={inputMethod === "upload" ? 0 : -1}
            aria-hidden={inputMethod !== "upload"}
        />
        <input
            type="text"
            placeholder="Enter image URL (must end with .jpg, .png, .webp)"
            value={imageUrl}
            onChange={handleImageUrlChange}
            className={
                inputMethod === "url"
                    ? "block w-full text-sm text-gray-800 border-2 border-blue-300 rounded-lg p-3"
                    : "hidden"
            }
            tabIndex={inputMethod === "url" ? 0 : -1}
            aria-hidden={inputMethod !== "url"}
        />
        <button
            onClick={removeImage}
            type="button"
            className="absolute top-2.5 right-2 p-1 rounded hover:bg-blue-200 transition"
            title="Remove image"
        >
            <X className="w-5 h-5 text-blue-600" />
        </button>
    </div>
);
