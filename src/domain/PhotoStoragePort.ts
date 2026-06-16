import type { Photo, UploadResult } from './Photo';

export interface PhotoStoragePort {
  uploadPhoto(photo: Photo): Promise<UploadResult>;
}
