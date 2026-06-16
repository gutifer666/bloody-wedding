import { GoogleDriveStorageAdapter } from './infrastructure/GoogleDriveStorageAdapter';
import { PhotoUploadService } from './application/PhotoUploadService';

// --- Configuration ---
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7AinWlHsVdeDcTEIJrkVK-N38Xil10_z6_h0QVUKSQUKTrVjuHub14ZXS3AY0Lddc/exec";

// --- Dependency Injection ---
const storageAdapter = new GoogleDriveStorageAdapter(APPS_SCRIPT_URL);
const uploadService = new PhotoUploadService(storageAdapter);

// --- UI Logic ---

// State
let selectedFile: File | null = null;
let qrCodeInstance: any = null;

// DOM Elements
const elements = {
    guestView: document.getElementById('guest-view')!,
    adminView: document.getElementById('admin-view')!,
    photoInput: document.getElementById('photo-input') as HTMLInputElement,
    uploadTriggerBtn: document.getElementById('upload-trigger-btn')!,
    previewCard: document.getElementById('preview-card')!,
    imagePreview: document.getElementById('image-preview') as HTMLImageElement,
    cancelBtn: document.getElementById('cancel-btn')!,
    sendBtn: document.getElementById('send-btn')!,
    passwordModal: document.getElementById('password-modal')!,
    adminPasswordInput: document.getElementById('admin-password-input') as HTMLInputElement,
    passwordError: document.getElementById('password-error')!,
    passwordCancelBtn: document.getElementById('password-cancel-btn')!,
    passwordSubmitBtn: document.getElementById('password-submit-btn')!,
    closePasswordModal: document.getElementById('close-password-modal')!,
    loaderOverlay: document.getElementById('loader-overlay')!,
    loaderTitle: document.getElementById('loader-title')!,
    loaderSubtitle: document.getElementById('loader-subtitle')!,
    uploadProgress: document.getElementById('upload-progress')!,
    notificationOverlay: document.getElementById('notification-overlay')!,
    notificationTitle: document.getElementById('notification-title')!,
    notificationMessage: document.getElementById('notification-message')!,
    notificationCloseBtn: document.getElementById('notification-close-btn')!,
    adminLoginTrigger: document.getElementById('admin-login-trigger')!,
    adminBackBtn: document.getElementById('admin-back-btn')!,
    qrSizeSelect: document.getElementById('qr-size-select') as HTMLSelectElement,
    printBtn: document.getElementById('print-btn')!,
    printUrlText: document.getElementById('print-url-text')!,
    qrcodeContainer: document.getElementById('qrcode')!,
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
});

function initEventListeners() {
    elements.uploadTriggerBtn.addEventListener('click', () => elements.photoInput.click());
    elements.photoInput.addEventListener('change', handlePhotoSelection);
    elements.cancelBtn.addEventListener('click', resetGuestUploadView);
    elements.sendBtn.addEventListener('click', handleUpload);

    elements.adminLoginTrigger.addEventListener('click', () => {
        if (sessionStorage.getItem('isAdminAuthorized') === 'true') {
            switchView('admin');
        } else {
            showModal(elements.passwordModal);
        }
    });

    elements.closePasswordModal.addEventListener('click', closePasswordModal);
    elements.passwordCancelBtn.addEventListener('click', closePasswordModal);
    elements.passwordSubmitBtn.addEventListener('click', handlePasswordSubmit);
    elements.adminPasswordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handlePasswordSubmit();
    });

    elements.adminBackBtn.addEventListener('click', () => switchView('guest'));
    elements.qrSizeSelect.addEventListener('change', (e) => {
        const size = parseInt((e.target as HTMLSelectElement).value, 10);
        generateQRCode(size);
    });

    elements.printBtn.addEventListener('click', () => window.print());
    elements.notificationCloseBtn.addEventListener('click', () => {
        hideModal(elements.notificationOverlay);
        resetGuestUploadView();
    });
}

// --- View Switching ---
function switchView(viewName: 'admin' | 'guest') {
    if (viewName === 'admin') {
        elements.guestView.classList.replace('active', 'hidden');
        elements.adminView.classList.replace('hidden', 'active');
        const initialSize = parseInt(elements.qrSizeSelect.value, 10) || 256;
        generateQRCode(initialSize);
    } else {
        elements.adminView.classList.replace('active', 'hidden');
        elements.guestView.classList.replace('hidden', 'active');
    }
}

// --- Modals & Overlays ---
function showModal(modalElement: HTMLElement) {
    modalElement.classList.remove('hidden');
    void modalElement.offsetHeight; // force reflow
    modalElement.classList.add('active');
    if (modalElement === elements.passwordModal) {
        setTimeout(() => elements.adminPasswordInput.focus(), 100);
    }
}

function hideModal(modalElement: HTMLElement) {
    modalElement.classList.remove('active');
    setTimeout(() => modalElement.classList.add('hidden'), 300);
}

function closePasswordModal() {
    hideModal(elements.passwordModal);
    elements.adminPasswordInput.value = '';
    elements.passwordError.classList.add('hidden');
}

function handlePasswordSubmit() {
    if (elements.adminPasswordInput.value === '1234') {
        sessionStorage.setItem('isAdminAuthorized', 'true');
        closePasswordModal();
        switchView('admin');
    } else {
        elements.passwordError.classList.remove('hidden');
        elements.adminPasswordInput.focus();
        elements.adminPasswordInput.select();
        const card = elements.passwordModal.querySelector('.modal-card') as HTMLElement;
        if (card) {
            card.style.animation = 'shake 0.3s ease-in-out';
            setTimeout(() => card.style.animation = '', 300);
        }
    }
}

// --- Photo Selection & Preview ---
function handlePhotoSelection(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido.');
        resetGuestUploadView();
        return;
    }

    selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        elements.imagePreview.src = e.target?.result as string;
        elements.previewCard.classList.remove('hidden');
        elements.previewCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
    reader.readAsDataURL(file);
}

function resetGuestUploadView() {
    elements.photoInput.value = '';
    selectedFile = null;
    elements.previewCard.classList.add('hidden');
    elements.imagePreview.src = '';
}

// --- Core Upload Orchestration ---
async function handleUpload() {
    if (!selectedFile) return;

    showStatusOverlay('Procesando imagen...', 'Redimensionando y optimizando para carga móvil...');
    animateProgressBar(0, 30, 800);

    const result = await uploadService.upload(selectedFile);
    
    if (result.status === 'success') {
        animateProgressBar(30, 100, 1000);
        setTimeout(() => {
            hideModal(elements.loaderOverlay);
            showNotification(
                "¡Muchas Gracias!", 
                result.message || "Tu foto se ha subido correctamente al álbum de la boda."
            );
        }, 1100);
    } else {
        hideModal(elements.loaderOverlay);
        alert(result.message || "Ocurrió un error al intentar subir tu foto.");
    }
}

// --- QR Generation ---
declare const QRCode: any;

function generateQRCode(size = 256) {
    elements.qrcodeContainer.innerHTML = '';
    const currentUrl = window.location.href;
    elements.printUrlText.innerText = currentUrl;

    try {
        qrCodeInstance = new QRCode(elements.qrcodeContainer, {
            text: currentUrl,
            width: size,
            height: size,
            colorDark: "#2C3E50",
            colorLight: "#FFFFFF",
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch (err) {
        console.error("No se pudo generar el código QR:", err);
        elements.qrcodeContainer.innerText = "Error al generar el código QR.";
    }
}

// --- Status & Animation Helpers ---
function showStatusOverlay(title: string, subtitle: string) {
    elements.loaderTitle.innerText = title;
    elements.loaderSubtitle.innerText = subtitle;
    (elements.uploadProgress as HTMLElement).style.width = '0%';
    showModal(elements.loaderOverlay);
}

function showNotification(title: string, message: string) {
    elements.notificationTitle.innerText = title;
    elements.notificationMessage.innerText = message;
    showModal(elements.notificationOverlay);
}

function animateProgressBar(fromVal: number, toVal: number, duration: number) {
    const startTime = performance.now();
    function updateProgress(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progressRate = Math.min(elapsed / duration, 1);
        const easedRate = progressRate * (2 - progressRate);
        const currentProgress = fromVal + (toVal - fromVal) * easedRate;
        (elements.uploadProgress as HTMLElement).style.width = `${currentProgress}%`;
        if (progressRate < 1) requestAnimationFrame(updateProgress);
    }
    requestAnimationFrame(updateProgress);
}

// Shake animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
    }
`;
document.head.appendChild(style);
