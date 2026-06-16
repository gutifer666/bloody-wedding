import type { Photo, UploadResult } from '../domain/Photo';
import type { PhotoStoragePort } from '../domain/PhotoStoragePort';

export class GoogleDriveStorageAdapter implements PhotoStoragePort {
  private readonly apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async uploadPhoto(photo: Photo): Promise<UploadResult> {
    if (!this.apiUrl) {
      console.warn("APPS_SCRIPT_URL no está configurada. Simulando éxito.");
      return { status: 'success', message: 'Simulated success (no URL)' };
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(photo),
      });

      // Nota: Con 'no-cors' la respuesta es opaca. 
      // Si llegamos aquí sin excepción, asumimos éxito como en el código original.
      return { status: 'success' };
    } catch (error) {
      console.error("Error al enviar la imagen:", error);
      return { 
        status: 'error', 
        message: error instanceof Error ? error.message : String(error) 
      };
    }
  }
}
