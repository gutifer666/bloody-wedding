import type { PhotoRepository } from '../domain/PhotoRepository.ts';
import type { Photo, UploadResult } from '../domain/Photo';

export class PhotoUploadService {
  private readonly storage: PhotoRepository;

  constructor(storage: PhotoRepository) {
    this.storage = storage;
  }

  async upload(file: File): Promise<UploadResult> {
    try {
      const photo = await this.processFile(file);
      return await this.storage.uploadPhoto(photo);
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido al procesar la foto'
      };
    }
  }

  private async processFile(file: File): Promise<Photo> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('No se pudo obtener el contexto del canvas'));
            return;
          }

          let width = img.width;
          let height = img.height;
          const MAX_DIMENSION = 1920;

          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width > height) {
              height = Math.round((height * MAX_DIMENSION) / width);
              width = MAX_DIMENSION;
            } else {
              width = Math.round((width * MAX_DIMENSION) / height);
              height = MAX_DIMENSION;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          const base64 = compressedDataUrl.split(',')[1] || '';

          const timestamp = new Date().getTime();
          const cleanName = file.name
            .replace(/\.[^/.]+$/, "")
            .replace(/[^a-zA-Z0-9]/g, '_')
            .toLowerCase();
          
          const filename = `boda_${timestamp}_${cleanName || 'foto'}.jpg`;

          resolve({
            filename,
            mimeType: 'image/jpeg',
            base64
          });
        };

        img.onerror = () => reject(new Error('Error al cargar la imagen'));
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsDataURL(file);
    });
  }
}
