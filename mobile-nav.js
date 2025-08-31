// 🔥 ENHANCED DIRECT PWA INSTALLATION

class DirectPWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalling = false;
        this.init();
    }

    init() {
        // Capture the install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault(); // Prevent browser's default prompt
            this.deferredPrompt = e;
            console.log('🎯 PWA install ready!');
            this.showInstallButton();
        });

        // Handle successful installation
        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA installed successfully!');
            this.handleInstallSuccess();
        });
    }

    showInstallButton() {
        // Make sure install button is visible and working
        const installBtns = document.querySelectorAll('[onclick*="installWebApp"], .webapp-install-btn, #installPWA');
        installBtns.forEach(btn => {
            btn.style.display = 'block';
            btn.disabled = false;
        });
    }

    async installDirectly() {
        if (this.isInstalling) {
            console.log('⏳ Installation already in progress...');
            return;
        }

        if (!this.deferredPrompt) {
            console.log('❌ Install prompt not available');
            this.showManualInstructions();
            return;
        }

        try {
            this.isInstalling = true;
            this.showInstallProgress();

            // Trigger installation immediately
            console.log('🚀 Starting direct installation...');
            this.deferredPrompt.prompt();

            // Wait for user choice
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('✅ User accepted installation');
                this.showSuccessMessage();
            } else {
                console.log('❌ User cancelled installation');
                this.showCancelMessage();
            }

            // Clean up
            this.deferredPrompt = null;
            this.isInstalling = false;

        } catch (error) {
            console.error('❌ Installation error:', error);
            this.showErrorMessage();
            this.isInstalling = false;
        }
    }

    showInstallProgress() {
        const buttons = document.querySelectorAll('.webapp-install-btn');
        buttons.forEach(btn => {
            btn.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <span>Installing...</span>
                </div>
            `;
            btn.disabled = true;
        });
    }

    showSuccessMessage() {
        const message = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: linear-gradient(135deg, #34C759, #30D158); color: white; 
                        padding: 30px; border-radius: 20px; text-align: center; z-index: 10000;
                        box-shadow: 0 20px 60px rgba(52, 199, 89, 0.4); max-width: 400px;">
                <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
                <h3 style="margin: 0 0 15px 0; font-size: 24px;">App Installed Successfully!</h3>
                <p style="margin: 0 0 20px 0;">Backpack Optimizer is now on your home screen!</p>
                <button onclick="this.parentElement.remove()" 
                        style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); 
                               color: white; padding: 10px 20px; border-radius: 10px; cursor: pointer;">
                    ✨ Awesome!
                </button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', message);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            const popup = document.querySelector('[style*="position: fixed"][style*="top: 50%"]');
            if (popup) popup.remove();
        }, 5000);
    }

    showCancelMessage() {
        const message = `
            <div style="position: fixed; top: 20px; right: 20px; 
                        background: #FF9500; color: white; padding: 20px; 
                        border-radius: 15px; z-index: 10000; max-width: 300px;
                        box-shadow: 0 10px 30px rgba(255, 149, 0, 0.4);">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="font-size: 24px;">ℹ️</span>
                    <div>
                        <strong>Installation Cancelled</strong><br>
                        <small>You can install anytime by clicking the install button!</small>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', message);
        
        setTimeout(() => {
            const popup = document.querySelector('[style*="background: #FF9500"]');
            if (popup) popup.remove();
        }, 4000);
    }

    showErrorMessage() {
        this.showManualInstructions();
    }

    showManualInstructions() {
        const instructions = this.getManualInstructions();
        const modal = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                        background: rgba(0,0,0,0.8); z-index: 10001; display: flex; 
                        align-items: center; justify-content: center; padding: 20px;" 
                 onclick="this.remove()">
                <div style="background: white; border-radius: 25px; padding: 40px; max-width: 500px; 
                           position: relative;" onclick="event.stopPropagation()">
                    <button onclick="this.parentElement.parentElement.remove()" 
                            style="position: absolute; top: 15px; right: 20px; background: none; 
                                   border: none; font-size: 24px; cursor: pointer;">×</button>
                    
                    <h3 style="margin: 0 0 25px 0; color: #007AFF; text-align: center;">
                        📱 Install Backpack Optimizer
                    </h3>
                    
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="font-size: 80px; margin-bottom: 20px;">${instructions.icon}</div>
                        <h4 style="color: #333; margin: 0 0 20px 0;">${instructions.title}</h4>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin: 20px 0;">
                        ${instructions.steps.map((step, index) => `
                            <div style="display: flex; align-items: flex-start; gap: 15px; margin: 15px 0;">
                                <div style="background: #007AFF; color: white; width: 25px; height: 25px; 
                                           border-radius: 50%; display: flex; align-items: center; 
                                           justify-content: center; font-weight: bold; font-size: 12px;">
                                    ${index + 1}
                                </div>
                                <div style="flex: 1; line-height: 1.5;">${step}</div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <p style="color: #666; font-size: 14px;">
                            Once installed, you'll have instant access from your home screen! 🚀
                        </p>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modal);
    }

    getManualInstructions() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        if (isIOS) {
            return {
                icon: '🍎',
                title: 'Install on iPhone/iPad',
                steps: [
                    'Tap the <strong>Share button</strong> (□↗) at the bottom',
                    'Scroll down and tap <strong>"Add to Home Screen"</strong>',
                    'Tap <strong>"Add"</strong> to install the app',
                    'Find the app icon on your home screen!'
                ]
            };
        } else if (isAndroid) {
            return {
                icon: '🤖',
                title: 'Install on Android',
                steps: [
                    'Tap the <strong>3-dot menu</strong> in your browser',
                    'Select <strong>"Add to Home screen"</strong>',
                    'Tap <strong>"Add"</strong> to confirm',
                    'The app will appear on your home screen!'
                ]
            };
        } else {
            return {
                icon: '💻',
                title: 'Install on Desktop',
                steps: [
                    'Look for the <strong>install icon</strong> in your address bar',
                    'Or click the <strong>3-dot menu</strong> → "Install Backpack Optimizer"',
                    'Click <strong>"Install"</strong> to confirm',
                    'The app will open in its own window!'
                ]
            };
        }
    }

    handleInstallSuccess() {
        // Hide install buttons
        const installBtns = document.querySelectorAll('.webapp-install-btn, #installPWA');
        installBtns.forEach(btn => {
            btn.style.display = 'none';
        });

        // Show success state
        this.showSuccessMessage();
    }
}

// Initialize the enhanced installer
const pwaInstaller = new DirectPWAInstaller();

// Global function for button clicks
function installWebApp() {
    pwaInstaller.installDirectly();
}

// Also add CSS for spinner animation
const spinnerCSS = `
<style>
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.webapp-install-btn {
    background: linear-gradient(135deg, #00C9FF, #92FE9D) !important;
    color: white !important;
    border: none !important;
    padding: 20px 40px !important;
    border-radius: 25px !important;
    font-size: 18px !important;
    font-weight: 800 !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 8px 25px rgba(0, 201, 255, 0.4) !important;
    position: relative !important;
    overflow: hidden !important;
}

.webapp-install-btn:hover {
    transform: translateY(-3px) scale(1.05) !important;
    box-shadow: 0 15px 40px rgba(0, 201, 255, 0.6) !important;
}
</style>
`;

