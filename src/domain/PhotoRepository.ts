import type { Photo, UploadResult } from './Photo';

export interface PhotoRepository {
  uploadPhoto(photo: Photo): Promise<UploadResult>;
}
