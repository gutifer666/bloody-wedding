import type { PhotoStoragePort } from '../../src/domain/PhotoStoragePort';
import type { Photo, UploadResult } from '../../src/domain/Photo';

export class InMemoryPhotoStorageAdapter implements PhotoStoragePort {
  public photos: Photo[] = [];
  public shouldFail = false;

  async uploadPhoto(photo: Photo): Promise<UploadResult> {
    if (this.shouldFail) {
      return { status: 'error', message: 'Falla simulada' };
    }
    this.photos.push(photo);
    return { status: 'success', fileId: 'fake-id', url: 'https://fake-url.com' };
  }
}
