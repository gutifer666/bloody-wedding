import { handleUploadTrigger, testing } from '../src/app';

describe('Mobile Selection Logic', () => {
    let elements: any;

    beforeEach(() => {
        // Setup minimal DOM for app.ts elements
        document.body.innerHTML = `
            <div id="guest-view"></div>
            <div id="admin-view"></div>
            <input type="file" id="photo-input">
            <button id="upload-trigger-btn"></button>
            <div id="preview-card"></div>
            <img id="image-preview">
            <button id="cancel-btn"></button>
            <button id="send-btn"></button>
            <div id="password-modal">
                <div class="modal-card"></div>
            </div>
            <input id="admin-password-input">
            <div id="password-error"></div>
            <button id="password-cancel-btn"></button>
            <button id="password-submit-btn"></button>
            <button id="close-password-modal"></button>
            <div id="loader-overlay"></div>
            <div id="loader-title"></div>
            <div id="loader-subtitle"></div>
            <div id="upload-progress"></div>
            <div id="notification-overlay"></div>
            <div id="notification-title"></div>
            <div id="notification-message"></div>
            <button id="notification-close-btn"></button>
            <button id="admin-login-trigger"></button>
            <button id="admin-back-btn"></button>
            <select id="qr-size-select"><option value="256">256</option></select>
            <button id="print-btn"></button>
            <div id="print-url-text"></div>
            <div id="qrcode"></div>
            <div id="selection-modal"></div>
            <button id="close-selection-modal"></button>
            <button id="option-camera"></button>
            <button id="option-gallery"></button>
            <button id="share-link-btn"></button>
        `;

        // Mock navigator.userAgent
        Object.defineProperty(navigator, 'userAgent', {
            value: '',
            configurable: true,
            writable: true
        });

        // Update elements to point to the new DOM
        testing.updateElements();
        elements = testing.getElements();
    });

    it('should click the input directly on desktop', () => {
        const spy = jest.spyOn(elements.photoInput, 'click');
        const setAttributeSpy = jest.spyOn(elements.photoInput, 'setAttribute');
        const removeAttributeSpy = jest.spyOn(elements.photoInput, 'removeAttribute');
        
        // Mock userAgent for Desktop
        Object.defineProperty(navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            configurable: true
        });

        handleUploadTrigger();

        expect(removeAttributeSpy).toHaveBeenCalledWith('capture');
        expect(spy).toHaveBeenCalled();
    });

    it('should show selection modal on mobile', () => {
        const spy = jest.spyOn(elements.selectionModal.classList, 'add');
        
        // Mock userAgent for Mobile
        Object.defineProperty(navigator, 'userAgent', {
            value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
            configurable: true
        });

        handleUploadTrigger();

        expect(elements.selectionModal.classList.contains('active')).toBe(true);
    });

    it('should set capture attribute when camera option is clicked', () => {
        testing.initEventListeners();
        
        const setAttributeSpy = jest.spyOn(elements.photoInput, 'setAttribute');
        const clickSpy = jest.spyOn(elements.photoInput, 'click');
        
        elements.optionCamera.click();
        
        expect(setAttributeSpy).toHaveBeenCalledWith('capture', 'environment');
        expect(clickSpy).toHaveBeenCalled();
        expect(elements.selectionModal.classList.contains('active')).toBe(false);
    });

    it('should remove capture attribute when gallery option is clicked', () => {
        testing.initEventListeners();
        
        const removeAttributeSpy = jest.spyOn(elements.photoInput, 'removeAttribute');
        const clickSpy = jest.spyOn(elements.photoInput, 'click');
        
        elements.optionGallery.click();
        
        expect(removeAttributeSpy).toHaveBeenCalledWith('capture');
        expect(clickSpy).toHaveBeenCalled();
        expect(elements.selectionModal.classList.contains('active')).toBe(false);
    });
});
