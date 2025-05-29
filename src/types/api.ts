// Shared TypeScript interfaces for API responses

export interface PreSignedUrlResponse {
  fileId: string;
  url: string;
}

export interface TextFromImageResponse {
  text: string;
}

export type ErrorResponse = { error: string };
