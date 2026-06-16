import { PhotoUploadService } from '../src/application/PhotoUploadService';
import { InMemoryPhotoStorageAdapter } from './mocks/InMemoryPhotoStorageAdapter';

describe('PhotoUploadService', () => {
  let service: PhotoUploadService;
  let mockStorage: InMemoryPhotoStorageAdapter;

  beforeEach(() => {
    mockStorage = new InMemoryPhotoStorageAdapter();
    service = new PhotoUploadService(mockStorage);

    // Mock global components needed for processFile
    global.FileReader = class {
      onload: any;
      onerror: any;
      readAsDataURL() {
        setTimeout(() => {
          this.onload({ target: { result: 'data:image/jpeg;base64,VEVTVF9CQVNFNjQ=' } });
        }, 0);
      }
    } as any;

    global.Image = class {
      onload: any;
      onerror: any;
      set src(value: string) {
        setTimeout(() => this.onload(), 0);
      }
      width = 100;
      height = 100;
    } as any;

    // Mock document.createElement for canvas
    document.createElement = jest.fn().mockImplementation((tag) => {
      if (tag === 'canvas') {
        return {
          getContext: () => ({
            drawImage: jest.fn(),
          }),
          toDataURL: () => 'data:image/jpeg;base64,Q09NUFJFU1NFRF9CQVNFNjQ=',
          width: 0,
          height: 0,
        };
      }
      return {};
    });
  });

  it('debe procesar y subir una foto correctamente', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const result = await service.upload(file);

    expect(result.status).toBe('success');
    expect(mockStorage.photos.length).toBe(1);
    expect(mockStorage.photos[0]!.filename).toMatch(/^boda_\d+_test\.jpg$/);
    expect(mockStorage.photos[0]!.base64).toBe('Q09NUFJFU1NFRF9CQVNFNjQ=');
  });

  it('debe manejar errores de subida', async () => {
    mockStorage.shouldFail = true;
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const result = await service.upload(file);

    expect(result.status).toBe('error');
    expect(result.message).toBe('Falla simulada');
  });
});
