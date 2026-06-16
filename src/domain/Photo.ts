export interface Photo {
  filename: string;
  mimeType: string;
  base64: string;
}

export interface UploadResult {
  status: 'success' | 'error';
  fileId?: string;
  url?: string;
  message?: string;
}
