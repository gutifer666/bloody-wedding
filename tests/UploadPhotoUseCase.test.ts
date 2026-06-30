import { UploadPhotoUseCase } from '../src/application/upload-photo/UploadPhotoUseCase';
import { InMemoryPhotoStorageAdapter } from './mocks/InMemoryPhotoStorageAdapter';

describe('UploadPhotoUseCase', () => {
  let useCase: UploadPhotoUseCase;
  let mockStorage: InMemoryPhotoStorageAdapter;

  beforeEach(() => {
    mockStorage = new InMemoryPhotoStorageAdapter();
    useCase = new UploadPhotoUseCase(mockStorage);

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

  it('should process and upload a photo correctly', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const result = await useCase.execute(file);

    expect(result.status).toBe('success');
    expect(mockStorage.photos.length).toBe(1);
    expect(mockStorage.photos[0]!.filename).toMatch(/^boda_\d+_test\.jpg$/);
    expect(mockStorage.photos[0]!.base64).toBe('Q09NUFJFU1NFRF9CQVNFNjQ=');
  });

  it('should handle upload errors', async () => {
    mockStorage.shouldFail = true;
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const result = await useCase.execute(file);

    expect(result.status).toBe('error');
    expect(result.message).toBe('Falla simulada');
  });
});
