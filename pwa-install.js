console.log('🚀 PWA Install Script Loading...');

let deferredPrompt = null;

// Initialize when DOM is ready
function initPWAInstall() {
    console.log('📱 Initializing PWA Install...');
    
    // Check if already installed
    if (isAlreadyInstalled()) {
        console.log('✅ PWA already installed');
        return;
    }
    
    setupEventListeners();
}

function setupEventListeners() {
    console.log('📱 Setting up PWA event listeners...');
    
    // SINGLE beforeinstallprompt listener
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('🎯 beforeinstallprompt event fired!');
        
        e.preventDefault();
        deferredPrompt = e;
        showInstallUI();
        showNotification('📱 Backpack Optimizer can be installed! Click the install button.', 'info');
    });
    
    // Listen for successful installation
    window.addEventListener('appinstalled', (e) => {
        console.log('✅ PWA installed successfully!');
        hideInstallUI();
        deferredPrompt = null;
        showNotification('🎉 Backpack Optimizer installed! Check your home screen!', 'success');
    });
    
    // Add click handlers to install buttons
    const installButton = document.getElementById('installAppButton');
    const floatingButton = document.getElementById('floatingInstallBtn');
    
    if (installButton) {
        installButton.addEventListener('click', handleInstallClick);
    }
    
    if (floatingButton) {
        floatingButton.addEventListener('click', handleInstallClick);
    }
}

async function handleInstallClick() {
    console.log('📱 Install button clicked');
    
    if (!deferredPrompt) {
        showFallbackInstructions();
        return;
    }
    
    try {
        const result = await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
            showNotification('📱 Installing Backpack Optimizer...', 'info');
        } else {
            showNotification('📱 You can install anytime from browser menu!', 'info');
        }
        
    } catch (error) {
        console.error('❌ Install failed:', error);
        showNotification('❌ Installation failed. Try from browser menu.', 'error');
    }
    
    deferredPrompt = null;
}

function showInstallUI() {
    const installSection = document.getElementById('webappDownload');
    const floatingButton = document.getElementById('floatingInstallBtn');
    
    if (installSection) {
        installSection.style.display = 'block';
        console.log('📱 Install section shown');
    }
    
    if (floatingButton) {
        floatingButton.style.display = 'flex';
        console.log('📱 Floating button shown');
    }
}

function hideInstallUI() {
    const installSection = document.getElementById('webappDownload');
    const floatingButton = document.getElementById('floatingInstallBtn');
    
    if (installSection) installSection.style.display = 'none';
    if (floatingButton) floatingButton.style.display = 'none';
}

function isAlreadyInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true;
}

function showFallbackInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let instructions = '';
    if (isIOS) {
        instructions = 'To install on iOS: Tap Share (⬆️) → Add to Home Screen';
    } else if (isAndroid) {
        instructions = 'To install: Tap menu (⋮) → Add to Home screen';
    } else {
        instructions = 'To install: Click browser menu → Install Backpack Optimizer';
    }
    
    showNotification(`📱 ${instructions}`, 'info');
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.pwa-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'pwa-notification';
    notification.innerHTML = `
        <div style="
            position: fixed; top: 20px; right: 20px; background: white; 
            border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); 
            z-index: 10000; max-width: 400px; display: flex; align-items: center;
            border-left: 5px solid ${type === 'success' ? '#34C759' : type === 'error' ? '#FF3B30' : '#007AFF'};
        ">
            <span style="flex: 1; font-weight: 600;">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: none; border: none; font-size: 20px; cursor: pointer; margin-left: 15px;
            ">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) notification.remove();
    }, 8000);
}

// Global function for info button
window.showAppInfo = function() {
    showNotification('🚀 Installing gives you: ⚡ Instant loading, 📶 Works offline, 🔔 Push notifications, 🚀 Native experience!', 'info');
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPWAInstall);
} else {
    initPWAInstall();
}

console.log('✅ PWA Install Script Loaded!');
