"use client";

import { useState, useRef } from "react";
import { RadioInputMethod } from "./components/RadioInputMethod";
import { ImageInput } from "./components/ImageInput";
import { ExtractedTextArea } from "./components/ExtractedTextArea";
import { LoadingSpinner } from "./components/LoadingSpinner";
import type { PreSignedUrlResponse, TextFromImageResponse, ErrorResponse } from '../types/api';

export default function ImageText() {
  const [inputMethod, setInputMethod] = useState<"upload" | "url">("upload");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [extractedText, setExtractedText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null!);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    } else {
      setImage(null);
    }
  };

  const isImageUrl = (url: string) => {
    return /\.(jpe?g|png|webp)$/i.test(url.trim());
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const getPreSignedUrl = async (fileName: string): Promise<PreSignedUrlResponse> => {
    try {
      const res = await fetch('/api/get-presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
      });
      if (!res.ok) {
        const errorData: ErrorResponse = await res.json();
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }
      return res.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw new Error('Failed to get pre-signed URL');
    }
  }

  const uploadImage = async (fileOrBlob: File | Blob, filename: string): Promise<string> => {
    const { fileId, url }: PreSignedUrlResponse = await getPreSignedUrl(filename);
    const upload = await fetch(url, {
      method: 'PUT',
      body: fileOrBlob,
    });
    if (!upload.ok) {
      throw new Error('Upload failed.');
    }
    return fileId
  };

  const extractText = async (fileId: string): Promise<string> => {
    try {
      const res = await fetch('/api/extract-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId }),
      });
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }
      const data: TextFromImageResponse = await res.json();
      return data.text;
    } catch (error) {
      console.error('Fetch error:', error);
      return "Something went wrong while extracting text, please try again later.";
    }
  }

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      if (image && image.size > 0) {
        const fileId = await uploadImage(image, image.name);
        const extractedText = await extractText(fileId);
        setExtractedText(extractedText);
      } else if (imageUrl && isImageUrl(imageUrl)) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const fileId = await uploadImage(blob, 'image-from-url-' + crypto.randomUUID());
        const extractedText = await extractText(fileId);
        setExtractedText(extractedText);
      } else if (imageUrl && !isImageUrl(imageUrl)) {
        alert('Please enter a valid image URL (jpg, png, webp)');
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during processing.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText || '');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full max-w-md px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Image Text Extraction
        </h1>

        <p className="text-center text-gray-600 mb-4">
          Upload an image or provide an image URL to extract text from your picture instantly.
        </p>

        {/* Radio buttons */}
        <RadioInputMethod inputMethod={inputMethod} setInputMethod={setInputMethod} />

        {/* Input */}
        <ImageInput
          inputMethod={inputMethod}
          imageUrl={imageUrl}
          handleImageChange={handleImageChange}
          handleImageUrlChange={handleImageUrlChange}
          removeImage={removeImage}
          fileInputRef={fileInputRef}
        />

        {/* Extract button (conditionally hidden while loading) */}
        {!isLoading && !image && !imageUrl && (
          <button
            className="relative px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Extract Text
          </button>
        )}

        {!isLoading && (image || imageUrl) && (
          <button
            onClick={onSubmit}
            className="relative px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Extract Text
          </button>
        )}

        {/* Loading spinner */}
        {isLoading && <LoadingSpinner />}

        {/* Extracted Text Area with Copy Button */}
        <ExtractedTextArea extractedText={extractedText} handleCopy={handleCopy} />
      </main>
    </div>
  );
}