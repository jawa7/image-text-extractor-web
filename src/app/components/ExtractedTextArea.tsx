import React from "react";
import { ClipboardCopy } from "lucide-react";

interface ExtractedTextAreaProps {
    extractedText: string;
    handleCopy: () => void;
}

export const ExtractedTextArea: React.FC<ExtractedTextAreaProps> = ({ extractedText, handleCopy }) => (
    <div className="relative mt-4 w-full">
        <button
            onClick={handleCopy}
            type="button"
            className="absolute top-2 right-2 p-1 rounded hover:bg-blue-200 transition"
            title="Copy text"
        >
            <ClipboardCopy className="w-5 h-5 text-blue-600" />
        </button>
        <textarea
            readOnly
            rows={10}
            value={extractedText}
            placeholder="Extracted text will appear here"
            className="w-full shadow-sm rounded-md sm:text-sm text-black p-3 border-2 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
);
