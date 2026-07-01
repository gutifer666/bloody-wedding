import { testing } from '../src/app';

describe('Share Link Logic', () => {
    let elements: any;

    beforeEach(() => {
        // Setup minimal DOM for app.ts elements
        document.body.innerHTML = `
            <div id="guest-view"></div>
            <div id="admin-view" class="hidden"></div>
            <input type="file" id="photo-input">
            <button id="upload-trigger-btn"></button>
            <div id="preview-card"></div>
            <img id="image-preview">
            <button id="cancel-btn"></button>
            <button id="send-btn"></button>
            <div id="password-modal" class="hidden">
                <div class="modal-card"></div>
            </div>
            <input id="admin-password-input">
            <div id="password-error" class="hidden"></div>
            <button id="password-cancel-btn"></button>
            <button id="password-submit-btn"></button>
            <button id="close-password-modal"></button>
            <div id="loader-overlay" class="hidden"></div>
            <div id="loader-title"></div>
            <div id="loader-subtitle"></div>
            <div id="upload-progress"></div>
            <div id="notification-overlay" class="hidden"></div>
            <div id="notification-title"></div>
            <div id="notification-message"></div>
            <button id="notification-close-btn"></button>
            <button id="admin-login-trigger"></button>
            <button id="admin-back-btn"></button>
            <select id="qr-size-select"><option value="256">256</option></select>
            <button id="print-btn"></button>
            <div id="print-url-text"></div>
            <div id="qrcode"></div>
            <div id="selection-modal" class="hidden"></div>
            <button id="close-selection-modal"></button>
            <button id="option-camera"></button>
            <button id="option-gallery"></button>
            <button id="share-link-btn"></button>
        `;

        // Mock navigator
        Object.defineProperty(navigator, 'share', {
            value: jest.fn(),
            configurable: true,
            writable: true
        });
        
        Object.defineProperty(navigator, 'clipboard', {
            value: {
                writeText: jest.fn().mockResolvedValue(undefined)
            },
            configurable: true,
            writable: true
        });

        // Update elements to point to the new DOM
        testing.updateElements();
        elements = testing.getElements();
        testing.initEventListeners();
    });

    it('should use navigator.share when available', async () => {
        const shareSpy = navigator.share as jest.Mock;
        shareSpy.mockResolvedValue(undefined);

        // Click the share button
        elements.shareLinkBtn.click();

        expect(shareSpy).toHaveBeenCalledWith({
            title: 'Nuestra Boda',
            text: '¡Sube tus fotos a nuestra boda!',
            url: window.location.href
        });
    });

    it('should fallback to clipboard when navigator.share is not available', async () => {
        // Remove navigator.share
        Object.defineProperty(navigator, 'share', {
            value: undefined,
            configurable: true
        });
        
        const writeTextSpy = navigator.clipboard.writeText as jest.Mock;
        
        // Mock showModal to verify it's called
        const showModalSpy = jest.spyOn(testing, 'showModal');

        elements.shareLinkBtn.click();

        // Need to wait for async clipboard action and event loop
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(writeTextSpy).toHaveBeenCalledWith(window.location.href);
        expect(elements.notificationOverlay.classList.contains('active')).toBe(true);
        expect(elements.notificationTitle.innerText).toBe('Enlace copiado');
    });

    it('should trigger window.print when print button is clicked', () => {
        const printSpy = jest.spyOn(window, 'print').mockImplementation(() => {});
        elements.printBtn.click();
        expect(printSpy).toHaveBeenCalled();
    });
});
