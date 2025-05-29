import React from "react";

interface RadioInputMethodProps {
    inputMethod: "upload" | "url";
    setInputMethod: (method: "upload" | "url") => void;
}

export const RadioInputMethod: React.FC<RadioInputMethodProps> = ({ inputMethod, setInputMethod }) => (
    <div className="mb-4 flex items-center space-x-4">
        {[
            { value: "upload", label: "Upload Image" },
            { value: "url", label: "Enter Image URL" },
        ].map((method) => (
            <label key={method.value} className="inline-flex items-center">
                <input
                    type="radio"
                    className="form-radio text-blue-500"
                    value={method.value}
                    checked={inputMethod === method.value}
                    onChange={() => setInputMethod(method.value as "upload" | "url")}
                />
                <span className="ml-2 text-gray-700">{method.label}</span>
            </label>
        ))}
    </div>
);
