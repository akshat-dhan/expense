// 🚀 ENHANCED PWA INSTALLATION MANAGER WITH FIXES
class WebAppInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.installButton = null;
        this.init();
    }

    init() {
        console.log('🔧 PWA Installer initializing...');
        
        // Check if already installed
        this.checkInstallStatus();
        
        // Setup install prompt capture
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('💡 Install prompt available');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Handle successful installation
        window.addEventListener('appinstalled', () => {
            console.log('✅ App installed successfully');
            this.handleInstallSuccess();
        });

        // Setup initial button state
        setTimeout(() => {
            this.setupInitialState();
        }, 1000);
    }

    checkInstallStatus() {
        // Check if running as PWA
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           window.navigator.standalone === true;
        
        if (isStandalone) {
            console.log('✅ Already running as PWA');
            this.isInstalled = true;
            this.showInstalledState();
        } else {
            console.log('📱 Web version - install available');
        }
    }

    setupInitialState() {
        const installBtn = document.getElementById('installAppBtn');
        const section = document.getElementById('webappDownload');
        
        if (this.isInstalled) {
            this.showInstalledState();
        } else if (this.deferredPrompt) {
            this.showInstallButton();
        } else {
            // Show manual instructions for browsers that don't support PWA
            this.showManualInstructions();
        }
    }

    showInstallButton() {
        const installBtn = document.getElementById('installAppBtn');
        if (installBtn) {
            installBtn.innerHTML = `
                <span class="install-text">📥 Install App</span>
                <span class="install-size">~2MB</span>
            `;
            installBtn.style.background = 'var(--gradient-success)';
            installBtn.disabled = false;
        }
    }

    showInstalledState() {
        const section = document.getElementById('webappDownload');
        if (section) {
            section.innerHTML = `
                <div class="webapp-card">
                    <div class="webapp-icon">✅</div>
                    <div class="webapp-content">
                        <h3>App Successfully Installed!</h3>
                        <p>You're using the web app version. Enjoy the native experience!</p>
                        <div class="webapp-benefits">
                            <span>🚀 Running as App</span>
                            <span>⚡ Optimized Performance</span>
                            <span>📶 Offline Ready</span>
                            <span>🎯 Native Experience</span>
                        </div>
                    </div>
                    <div class="webapp-actions">
                        <button class="webapp-install-btn webapp-installed">
                            <span class="install-text">🎉 App Active</span>
                            <span class="install-size">Installed</span>
                        </button>
                    </div>
                </div>
            `;
        }
    }

    showManualInstructions() {
        const installBtn = document.getElementById('installAppBtn');
        if (installBtn) {
            const browser = this.detectBrowser();
            installBtn.innerHTML = `
                <span class="install-text">📱 Install Guide</span>
                <span class="install-size">${browser}</span>
            `;
            installBtn.onclick = () => this.showBrowserGuide(browser);
        }
    }

    detectBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
        if (ua.includes('Edg')) return 'Edge';
        if (ua.includes('Firefox')) return 'Firefox';
        return 'Browser';
    }

    async performInstallation() {
        if (!this.deferredPrompt) {
            console.log('❌ No install prompt available');
            this.showBrowserGuide();
            return false;
        }

        try {
            console.log('🚀 Starting installation...');
            this.showInstallProgress();
            
            // Show the install prompt
            this.deferredPrompt.prompt();
            
            // Wait for user response
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('✅ User accepted installation');
                showAdvancedFlashMessage('🎉 Installing app... Please wait!', 'success');
                return true;
            } else {
                console.log('❌ User declined installation');
                this.hideInstallProgress();
                showAdvancedFlashMessage('ℹ️ Installation cancelled. Try again anytime!', 'info');
                return false;
            }
            
        } catch (error) {
            console.error('❌ Installation failed:', error);
            this.hideInstallProgress();
            showAdvancedFlashMessage('❌ Installation failed. Please try manual installation.', 'error');
            this.showBrowserGuide();
            return false;
        } finally {
            this.deferredPrompt = null;
        }
    }

    showInstallProgress() {
        const button = document.getElementById('installAppBtn');
        if (button) {
            button.classList.add('webapp-installing');
            button.innerHTML = `
                <span class="install-text">📥 Installing...</span>
                <span class="install-size">Please wait</span>
            `;
            button.disabled = true;
        }
    }

    hideInstallProgress() {
        const button = document.getElementById('installAppBtn');
        if (button) {
            button.classList.remove('webapp-installing');
            button.innerHTML = `
                <span class="install-text">📥 Install App</span>
                <span class="install-size">~2MB</span>
            `;
            button.disabled = false;
        }
    }

    handleInstallSuccess() {
        this.isInstalled = true;
        showAdvancedFlashMessage('🎉 App installed successfully! Access from your home screen.', 'success');
        setTimeout(() => {
            this.showInstalledState();
        }, 1000);
    }

    showBrowserGuide(browser = null) {
        const detectedBrowser = browser || this.detectBrowser();
        const instructions = this.getBrowserInstructions(detectedBrowser);
        
        const modal = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10001; display: flex; align-items: center; justify-content: center;" onclick="this.remove()">
                <div style="background: white; border-radius: 25px; padding: 40px; max-width: 600px; margin: 20px; position: relative;" onclick="event.stopPropagation()">
                    <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
                    <h3 style="margin-top: 0; color: var(--primary-blue);">📱 How to Install (${detectedBrowser})</h3>
                    <div style="margin: 25px 0;">
                        ${instructions.steps.map(step => `<p style="margin: 15px 0; padding: 10px; background: #f5f5f5; border-radius: 10px; line-height: 1.6;">${step}</p>`).join('')}
                    </div>
                    <p style="color: var(--system-gray); font-size: 14px; text-align: center; margin-top: 30px;">
                        ✨ Once installed, the app will work offline and load instantly!
                    </p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modal);
    }

    getBrowserInstructions(browser) {
        const instructions = {
            Chrome: {
                steps: [
                    '1. Click the 3-dot menu (⋮) in Chrome',
                    '2. Select "Install Backpack Optimizer..."',
                    '3. Click "Install" to confirm',
                    '4. App will appear on your home screen/desktop'
                ]
            },
            Safari: {
                steps: [
                    '1. Tap the Share button (□↗) in Safari',
                    '2. Scroll down and tap "Add to Home Screen"',
                    '3. Customize the name if needed',
                    '4. Tap "Add" to install on home screen'
                ]
            },
            Edge: {
                steps: [
                    '1. Click the 3-dot menu in Edge',
                    '2. Go to Apps → Install this site as an app',
                    '3. Click "Install"',
                    '4. App will be available in your apps'
                ]
            }
        };
        
        return instructions[browser] || {
            steps: [
                '1. Look for install option in browser menu',
                '2. Or bookmark this page for quick access',
                '3. Enable notifications for updates',
                '4. Use regularly for best experience'
            ]
        };
    }
}

// 🎯 MAIN INSTALL FUNCTION (called by button click)
async function installWebApp() {
    console.log('🚀 Install button clicked');
    
    if (!window.webAppInstaller) {
        window.webAppInstaller = new WebAppInstaller();
    }
    
    const installer = window.webAppInstaller;
    const success = await installer.performInstallation();
    
    if (!success && !installer.deferredPrompt) {
        // Show manual instructions if automatic install not available
        installer.showBrowserGuide();
    }
}

function showAppInfo() {
    const infoModal = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;" onclick="this.remove()">
            <div style="background: white; border-radius: 25px; padding: 40px; max-width: 500px; margin: 20px; position: relative;" onclick="event.stopPropagation()">
                <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
                <h3 style="margin-top: 0; color: var(--primary-blue); font-size: 24px;">📱 Why Install Our Web App?</h3>
                <div style="margin: 20px 0; line-height: 1.8;">
                    <p><strong>⚡ Lightning Fast:</strong> Instant loading with cached data</p>
                    <p><strong>📶 Works Offline:</strong> Access your data without internet</p>
                    <p><strong>🔔 Push Notifications:</strong> Never miss budget alerts</p>
                    <p><strong>🚀 Native Feel:</strong> Just like a regular mobile app</p>
                    <p><strong>💾 Secure Storage:</strong> Your data stays on your device</p>
                    <p><strong>🎯 Quick Access:</strong> Home screen icon for instant access</p>
                </div>
                <button onclick="installWebApp(); this.parentElement.parentElement.remove();" style="background: var(--gradient-success); color: white; border: none; padding: 15px 30px; border-radius: 20px; font-weight: 700; cursor: pointer; width: 100%;">
                    🚀 Install Now
                </button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', infoModal);
}

// 💰 FINANCIAL DATA MANAGEMENT
let userProfile = {
    name: 'Akshat Maheshwari',
    regNumber: '2343104',
    campus: 'Christ University - Bangalore Campus',
    email: 'akshat.maheshwari@christuniversity.in',
    course: 'BCA (Bachelor of Computer Applications)',
    year: '2nd Year',
    avatar: 'A',
    joinDate: new Date('2023-07-15'),
    personality: 'Ultimate Smart Budgeter',
    preferences: {
        currency: 'INR',
        theme: 'advanced',
        notifications: true,
        autoSave: true
    }
};

let budget = 50000;
let expenses = JSON.parse(localStorage.getItem('backpack_expenses')) || [];
let aiConversations = JSON.parse(localStorage.getItem('backpack_conversations')) || [];

// 🎯 DASHBOARD UPDATE FUNCTIONS
function updateDashboard() {
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const remaining = budget - totalSpent;
    const savingsRate = budget > 0 ? ((remaining / budget) * 100) : 100;
    const spentPercentage = budget > 0 ? ((totalSpent / budget) * 100) : 0;

    // Update main stats
    animateValue('budgetAmount', budget, '₹');
    animateValue('spentAmount', totalSpent, '₹');
    animateValue('remainingAmount', remaining, '₹');
    animateValue('savingsRate', savingsRate, '%');

    // Update trends
    const spentTrendEl = document.getElementById('spentTrend');
    const remainingTrendEl = document.getElementById('remainingTrend');
    
    if (spentTrendEl) {
        spentTrendEl.textContent = `${spentPercentage.toFixed(1)}% of budget`;
        spentTrendEl.className = spentPercentage > 80 ? 'trend-down' : spentPercentage > 60 ? 'trend-neutral' : 'trend-up';
    }
    
    if (remainingTrendEl) {
        remainingTrendEl.textContent = `${(100 - spentPercentage).toFixed(1)}% available`;
        remainingTrendEl.className = remaining < budget * 0.2 ? 'trend-down' : remaining < budget * 0.4 ? 'trend-neutral' : 'trend-up';
    }

    // Update progress bar
    updateProgressBar(spentPercentage, totalSpent);
    
    // Update metrics grid
    updateMetricsGrid();
    
    // Update AI insights
    updateAIInsights();
    
    // Update recent expenses
    updateRecentExpenses();
    
    // Update category recommendations
    updateCategoryRecommendations();
}

function animateValue(elementId, finalValue, prefix = '', suffix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;

    const startValue = parseFloat(element.textContent.replace(/[^\d.-]/g, '')) || 0;
    const duration = 1000;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = startValue + (finalValue - startValue) * progress;

        if (prefix === '₹') {
            element.textContent = `₹${Math.round(currentValue).toLocaleString('en-IN')}`;
        } else if (suffix === '%') {
            element.textContent = `${currentValue.toFixed(1)}%`;
        } else {
            element.textContent = `${prefix}${Math.round(currentValue).toLocaleString('en-IN')}${suffix}`;
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

function updateProgressBar(percentage, amount) {
    const progressBar = document.getElementById('budgetProgressBar');
    const progressText = document.getElementById('progressText');
    const progressMiddle = document.getElementById('progressMiddle');
    const budgetMax = document.getElementById('budgetMax');

    if (progressBar) {
        progressBar.style.width = `${Math.min(percentage, 100)}%`;
        
        // Change color based on percentage
        if (percentage > 80) {
            progressBar.style.background = 'var(--gradient-warning)';
        } else if (percentage > 60) {
            progressBar.style.background = 'var(--gradient-info)';
        } else {
            progressBar.style.background = 'var(--gradient-primary)';
        }
    }

    if (progressText) {
        progressText.textContent = `₹${amount.toLocaleString('en-IN')} spent (${percentage.toFixed(1)}%)`;
    }

    if (progressMiddle) {
        progressMiddle.textContent = `₹${(budget / 2).toLocaleString('en-IN')} mid-point`;
    }

    if (budgetMax) {
        budgetMax.textContent = `₹${budget.toLocaleString('en-IN')}`;
    }
}

function updateMetricsGrid() {
    const container = document.getElementById('metricsGridContent');
    if (!container) return;

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const avgDaily = expenses.length > 0 ? totalSpent / Math.max(getDaysSinceFirstExpense(), 1) : 0;
    const categoryCounts = getCategoryCounts();
    const topCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b, 'food');
    const recentTrend = getRecentTrend();

    const metrics = [
        {
            icon: '📈',
            label: 'Daily Average',
            value: `₹${avgDaily.toFixed(0)}`,
            trend: recentTrend > 0 ? 'up' : recentTrend < 0 ? 'down' : 'neutral'
        },
        {
            icon: '🎯',
            label: 'Top Category',
            value: getCategoryEmoji(topCategory) + ' ' + topCategory.charAt(0).toUpperCase() + topCategory.slice(1),
            trend: 'neutral'
        },
        {
            icon: '📊',
            label: 'Total Transactions',
            value: expenses.length,
            trend: 'up'
        },
        {
            icon: '⏱️',
            label: 'This Month',
            value: `₹${getCurrentMonthExpenses().toLocaleString('en-IN')}`,
            trend: 'neutral'
        },
        {
            icon: '🏆',
            label: 'Best Day',
            value: getBestSavingsDay(),
            trend: 'up'
        },
        {
            icon: '📅',
            label: 'Days Active',
            value: getDaysSinceFirstExpense(),
            trend: 'up'
        }
    ];

    container.innerHTML = metrics.map(metric => `
        <div class="metric-card">
            <div class="metric-header">
                <div class="metric-icon">${metric.icon}</div>
                <div class="metric-value">${metric.value}</div>
            </div>
            <div class="metric-label">${metric.label}</div>
            <div class="metric-trend trend-${metric.trend}">
                ${metric.trend === 'up' ? '↗️ Good' : metric.trend === 'down' ? '↘️ Monitor' : '➡️ Stable'}
            </div>
        </div>
    `).join('');
}

function updateAIInsights() {
    const container = document.getElementById('aiInsightsContainer');
    if (!container) return;

    const insights = generateAIInsights();
    
    container.innerHTML = insights.map(insight => `
        <div class="ai-insight-item">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 12px;">
                <div style="font-size: 24px;">${insight.icon}</div>
                <div>
                    <h4 style="margin: 0; color: var(--primary-blue); font-weight: 800;">${insight.title}</h4>
                    <p style="margin: 0; color: var(--text-secondary); font-size: 13px;">${insight.category}</p>
                </div>
            </div>
            <p style="margin: 0; line-height: 1.6; font-weight: 500;">${insight.message}</p>
            ${insight.action ? `<button onclick="${insight.action}" style="margin-top: 12px; padding: 8px 16px; background: var(--gradient-primary); color: white; border: none; border-radius: 12px; font-size: 12px; font-weight: 600; cursor: pointer;">${insight.actionText}</button>` : ''}
        </div>
    `).join('');
}

function generateAIInsights() {
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const spentPercentage = (totalSpent / budget) * 100;
    const categoryCounts = getCategoryCounts();
    const insights = [];

    // Budget status insight
    if (spentPercentage < 20) {
        insights.push({
            icon: '🎯',
            title: 'Excellent Budget Control',
            category: 'Budget Management',
            message: `You've only used ${spentPercentage.toFixed(1)}% of your budget. You're doing great at controlling expenses!`,
        });
    } else if (spentPercentage > 80) {
        insights.push({
            icon: '⚠️',
            title: 'Budget Alert',
            category: 'Risk Management',
            message: `You've used ${spentPercentage.toFixed(1)}% of your budget. Consider reducing non-essential expenses.`,
            action: 'showBudgetTips()',
            actionText: 'Get Tips'
        });
    }

    // Category analysis
    const topCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b, 'food');
    insights.push({
        icon: getCategoryEmoji(topCategory),
        title: `${topCategory.charAt(0).toUpperCase() + topCategory.slice(1)} is Your Top Category`,
        category: 'Spending Pattern',
        message: `${categoryCounts[topCategory]} transactions in ${topCategory}. ${getCategoryTip(topCategory)}`,
    });

    // Recent activity insight
    const recentExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return expDate >= threeDaysAgo;
    });

    if (recentExpenses.length === 0) {
        insights.push({
            icon: '💡',
            title: 'No Recent Activity',
            category: 'Activity Reminder',
            message: 'You haven\'t logged any expenses in the past 3 days. Remember to track your spending for better insights!',
            action: 'focusQuickExpenseForm()',
            actionText: 'Add Expense'
        });
    }

    return insights;
}

function updateRecentExpenses() {
    const container = document.getElementById('recentExpensesList');
    const countContainer = document.getElementById('expenseCount');
    
    if (!container) return;

    if (countContainer) {
        countContainer.textContent = `${expenses.length} TRANSACTIONS`;
    }

    if (expenses.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-tertiary);">
                <div style="font-size: 64px; margin-bottom: 20px;">💸</div>
                <h3 style="margin: 0 0 10px 0; color: var(--text-secondary);">No expenses yet</h3>
                <p style="margin: 0;">Start tracking your spending to see insights here!</p>
            </div>
        `;
        return;
    }

    const recentExpenses = expenses.slice(-5).reverse();
    
    container.innerHTML = recentExpenses.map(expense => `
        <div style="display: flex; align-items: center; gap: 20px; padding: 20px; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); border-radius: 18px; margin-bottom: 15px; transition: var(--transition); border-left: 4px solid var(--primary-blue);" onmouseover="this.style.transform='translateX(8px) scale(1.02)'" onmouseout="this.style.transform='none'">
            <div style="font-size: 32px; background: var(--gradient-primary); color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0, 122, 255, 0.3);">
                ${getCategoryEmoji(expense.category)}
            </div>
            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <h4 style="margin: 0; font-weight: 800; color: var(--text-primary);">${expense.description}</h4>
                    <span style="font-size: 20px; font-weight: 900; color: var(--danger-red);">₹${expense.amount.toLocaleString('en-IN')}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: var(--text-secondary); font-weight: 600; text-transform: capitalize;">${expense.category}</span>
                    <span style="color: var(--text-tertiary); font-size: 13px;">${formatDate(expense.date)}</span>
                </div>
                ${expense.mood ? `<div style="margin-top: 5px;"><span style="font-size: 12px; background: rgba(0, 122, 255, 0.1); color: var(--primary-blue); padding: 4px 10px; border-radius: 10px;">${getMoodEmoji(expense.mood)} ${expense.mood}</span></div>` : ''}
            </div>
        </div>
    `).join('');
}

function updateCategoryRecommendations() {
    const container = document.getElementById('categoryRecommendations');
    if (!container) return;

    const categories = ['food', 'transport', 'entertainment', 'education', 'shopping', 'healthcare'];
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const recommendations = [];

    categories.forEach(category => {
        const categorySpent = expenses.filter(exp => exp.category === category).reduce((sum, exp) => sum + exp.amount, 0);
        const percentage = totalSpent > 0 ? (categorySpent / totalSpent) * 100 : 0;
        const recommendedPercentage = getRecommendedPercentage(category);
        
        recommendations.push({
            category,
            spent: categorySpent,
            percentage,
            recommended: recommendedPercentage,
            status: percentage > recommendedPercentage ? 'over' : percentage < recommendedPercentage * 0.5 ? 'under' : 'good'
        });
    });

    container.innerHTML = recommendations.map(rec => `
        <div style="background: white; border-radius: 15px; padding: 20px; box-shadow: var(--shadow-light); border-left: 4px solid ${getStatusColor(rec.status)};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 24px;">${getCategoryEmoji(rec.category)}</span>
                    <div>
                        <h4 style="margin: 0; font-weight: 800; text-transform: capitalize;">${rec.category}</h4>
                        <p style="margin: 0; font-size: 12px; color: var(--text-tertiary);">Recommended: ${rec.recommended}%</p>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 18px; font-weight: 800; color: var(--text-primary);">₹${rec.spent.toLocaleString('en-IN')}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">${rec.percentage.toFixed(1)}%</div>
                </div>
            </div>
            <div style="background: var(--system-gray6); height: 6px; border-radius: 3px; margin-bottom: 10px;">
                <div style="width: ${Math.min(rec.percentage, 100)}%; height: 100%; background: ${getStatusColor(rec.status)}; border-radius: 3px; transition: var(--transition);"></div>
            </div>
            <p style="margin: 0; font-size: 13px; color: var(--text-secondary);">
                ${getCategoryRecommendation(rec)}
            </p>
        </div>
    `).join('');
}

// 🎨 UTILITY FUNCTIONS
function getCategoryCounts() {
    const counts = {};
    expenses.forEach(exp => {
        counts[exp.category] = (counts[exp.category] || 0) + 1;
    });
    return counts;
}

function getCategoryEmoji(category) {
    const emojis = {
        food: '🍕',
        transport: '🚗',
        entertainment: '🎬',
        education: '📚',
        shopping: '🛍️',
        clothing: '👕',
        healthcare: '🏥',
        utilities: '⚡',
        other: '🔄'
    };
    return emojis[category] || '💰';
}

function getMoodEmoji(mood) {
    const emojis = {
        happy: '😊',
        neutral: '😐',
        sad: '😢',
        excited: '🤩',
        confident: '😎',
        worried: '😰'
    };
    return emojis[mood] || '😐';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short' 
    });
}

function getDaysSinceFirstExpense() {
    if (expenses.length === 0) return 0;
    const firstExpense = new Date(Math.min(...expenses.map(exp => new Date(exp.date))));
    const now = new Date();
    return Math.max(1, Math.ceil((now - firstExpense) / (1000 * 60 * 60 * 24)));
}

function getCurrentMonthExpenses() {
    const now = new Date();
    return expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    }).reduce((sum, exp) => sum + exp.amount, 0);
}

function getRecentTrend() {
    if (expenses.length < 2) return 0;
    const recent = expenses.slice(-7);
    const older = expenses.slice(-14, -7);
    const recentAvg = recent.reduce((sum, exp) => sum + exp.amount, 0) / recent.length;
    const olderAvg = older.reduce((sum, exp) => sum + exp.amount, 0) / older.length;
    return recentAvg - olderAvg;
}

function getBestSavingsDay() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyExpenses = {};
    
    expenses.forEach(exp => {
        const day = new Date(exp.date).getDay();
        dailyExpenses[day] = (dailyExpenses[day] || 0) + exp.amount;
    });
    
    const bestDay = Object.keys(dailyExpenses).reduce((a, b) => 
        (dailyExpenses[a] || Infinity) < (dailyExpenses[b] || Infinity) ? a : b
    );
    
    return days[bestDay] || 'Mon';
}

function getCategoryTip(category) {
    const tips = {
        food: 'Try meal planning and cooking at home to reduce costs.',
        transport: 'Consider carpooling or public transport for savings.',
        entertainment: 'Look for student discounts and free campus events.',
        education: 'Invest wisely in learning resources that add real value.',
        shopping: 'Make a list before shopping to avoid impulse purchases.',
        healthcare: 'Maintain good health habits to reduce medical costs.',
        utilities: 'Use energy-efficient practices to lower bills.'
    };
    return tips[category] || 'Track this category closely for better budgeting.';
}

function getRecommendedPercentage(category) {
    const recommended = {
        food: 30,
        transport: 15,
        entertainment: 10,
        education: 20,
        shopping: 10,
        healthcare: 5,
        utilities: 10
    };
    return recommended[category] || 15;
}

function getStatusColor(status) {
    const colors = {
        good: 'var(--success-green)',
        over: 'var(--danger-red)',
        under: 'var(--warning-orange)'
    };
    return colors[status] || 'var(--system-gray)';
}

function getCategoryRecommendation(rec) {
    if (rec.status === 'over') {
        return `You're spending ${(rec.percentage - rec.recommended).toFixed(1)}% more than recommended. Try to reduce expenses in this category.`;
    } else if (rec.status === 'under') {
        return `You're spending less than expected. This could be good savings or you might want to invest more here.`;
    } else {
        return `Great balance! You're spending within the recommended range for this category.`;
    }
}

// 💸 EXPENSE MANAGEMENT
function addQuickExpense(event) {
    event.preventDefault();
    
    const amount = parseFloat(document.getElementById('quickAmount').value);
    const category = document.getElementById('quickCategory').value;
    const description = document.getElementById('quickDescription').value.trim();
    const mood = document.getElementById('quickMood').value;
    const payment = document.getElementById('quickPayment').value;
    const location = document.getElementById('quickLocation').value.trim();

    if (!amount || amount <= 0 || !category || !description) {
        showAdvancedFlashMessage('⚠️ Please fill all required fields correctly!', 'warning');
        return;
    }

    if (amount > budget) {
        showAdvancedFlashMessage('🚨 This expense exceeds your total budget! Are you sure?', 'warning');
    }

    const expense = {
        id: Date.now(),
        amount,
        category,
        description,
        mood,
        payment,
        location,
        date: new Date().toISOString(),
        timestamp: Date.now()
    };

    expenses.push(expense);
    saveToLocalStorage();
    updateDashboard();
    
    // Reset form
    document.getElementById('quickExpenseForm').reset();
    document.getElementById('quickMood').value = 'neutral';
    document.getElementById('quickPayment').value = 'upi';
    
    showAdvancedFlashMessage('🎉 Expense added successfully!', 'success');
}

function refreshExpenses() {
    updateDashboard();
    showAdvancedFlashMessage('🔄 Dashboard refreshed!', 'info');
}

function saveToLocalStorage() {
    localStorage.setItem('backpack_expenses', JSON.stringify(expenses));
    localStorage.setItem('backpack_conversations', JSON.stringify(aiConversations));
    localStorage.setItem('backpack_budget', budget.toString());
    localStorage.setItem('backpack_profile', JSON.stringify(userProfile));
}

function loadFromLocalStorage() {
    const savedBudget = localStorage.getItem('backpack_budget');
    const savedProfile = localStorage.getItem('backpack_profile');
    
    if (savedBudget) {
        budget = parseFloat(savedBudget);
    }
    
    if (savedProfile) {
        userProfile = { ...userProfile, ...JSON.parse(savedProfile) };
    }
}

// 📄 EXPORT FUNCTIONS
function exportToCSV() {
    if (expenses.length === 0) {
        showAdvancedFlashMessage('📄 No expenses to export!', 'warning');
        return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Date,Category,Description,Amount,Payment Method,Location,Mood\n';
    
    expenses.forEach(exp => {
        const date = new Date(exp.date).toLocaleDateString('en-IN');
        csvContent += `"${date}","${exp.category}","${exp.description}",${exp.amount},"${exp.payment || 'N/A'}","${exp.location || 'N/A'}","${exp.mood || 'neutral'}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `backpack-expenses-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAdvancedFlashMessage('📊 CSV exported successfully!', 'success');
}

function exportToPDF() {
    if (expenses.length === 0) {
        showAdvancedFlashMessage('📄 No expenses to export!', 'warning');
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20);
        doc.text('🎒 Backpack Optimizer - Expense Report', 20, 20);
        
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 20, 30);
        doc.text(`Total Expenses: ₹${expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString('en-IN')}`, 20, 40);
        doc.text(`Budget: ₹${budget.toLocaleString('en-IN')}`, 20, 50);
        
        // Expenses
        let y = 70;
        doc.text('Recent Expenses:', 20, y);
        y += 10;
        
        expenses.slice(-20).forEach((exp, index) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            
            const date = new Date(exp.date).toLocaleDateString('en-IN');
            doc.text(`${date} - ${exp.category} - ₹${exp.amount} - ${exp.description}`, 20, y);
            y += 8;
        });
        
        doc.save(`backpack-expenses-${new Date().toISOString().split('T')[0]}.pdf`);
        showAdvancedFlashMessage('📄 PDF exported successfully!', 'success');
        
    } catch (error) {
        console.error('PDF export error:', error);
        showAdvancedFlashMessage('❌ PDF export failed. Please try again.', 'error');
    }
}

function shareViaEmail() {
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const subject = encodeURIComponent('🎒 My Backpack Optimizer Expense Report');
    const body = encodeURIComponent(`
Hi!

Here's my expense summary from Backpack Optimizer:

💰 Total Budget: ₹${budget.toLocaleString('en-IN')}
💸 Total Spent: ₹${totalSpent.toLocaleString('en-IN')}
🎯 Remaining: ₹${(budget - totalSpent).toLocaleString('en-IN')}
📊 Savings Rate: ${((budget - totalSpent) / budget * 100).toFixed(1)}%

Recent Expenses:
${expenses.slice(-10).map(exp => 
    `• ${new Date(exp.date).toLocaleDateString('en-IN')} - ${exp.category} - ₹${exp.amount} - ${exp.description}`
).join('\n')}

Generated by Backpack Optimizer - AI Financial Assistant for Students
    `);
    
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    showAdvancedFlashMessage('📧 Email app opened!', 'info');
}

function shareViaWhatsApp() {
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const message = encodeURIComponent(`
🎒 *Backpack Optimizer Report*

💰 Budget: ₹${budget.toLocaleString('en-IN')}
💸 Spent: ₹${totalSpent.toLocaleString('en-IN')}
🎯 Remaining: ₹${(budget - totalSpent).toLocaleString('en-IN')}
📊 Savings: ${((budget - totalSpent) / budget * 100).toFixed(1)}%

*Recent Expenses:*
${expenses.slice(-5).map(exp => 
    `${getCategoryEmoji(exp.category)} ₹${exp.amount} - ${exp.description}`
).join('\n')}

_AI-powered financial tracking for students!_
    `);
    
    window.open(`https://wa.me/?text=${message}`, '_blank');
    showAdvancedFlashMessage('📱 WhatsApp opened!', 'info');
}

// 🤖 AI CHAT SYSTEM
let isChatOpen = false;
let isTyping = false;

function toggleAIChat() {
    const chatContainer = document.getElementById('aiChat');
    const trigger = document.querySelector('.ai-trigger');
    
    if (isChatOpen) {
        chatContainer.classList.remove('show');
        trigger.classList.remove('chat-open');
        isChatOpen = false;
    } else {
        chatContainer.classList.add('show');
        trigger.classList.add('chat-open');
        isChatOpen = true;
        
        // Initialize chat if empty
        initializeAIChat();
        hideUnreadBadge();
    }
}

function initializeAIChat() {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer || messagesContainer.children.length > 0) return;

    const welcomeMessage = {
        type: 'ai',
        message: `Hey ${userProfile.name}! 👋 I'm your AI financial assistant. I can help you with budgeting, spending analysis, financial advice, and even chat about life and F1! 

I remember our conversations and have access to your expense data for personalized insights. What would you like to explore today?`,
        timestamp: Date.now()
    };

    displayMessage(welcomeMessage);
    aiConversations.push(welcomeMessage);
    saveToLocalStorage();
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const userMessage = {
        type: 'user',
        message,
        timestamp: Date.now()
    };
    
    displayMessage(userMessage);
    aiConversations.push(userMessage);
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Generate AI response
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        hideTypingIndicator();
        displayMessage(aiResponse);
        aiConversations.push(aiResponse);
        saveToLocalStorage();
    }, 1500 + Math.random() * 1000);
}

function sendQuickMessage(message) {
    document.getElementById('chatInput').value = message;
    sendMessage();
}

function displayMessage(messageObj) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    
    if (messageObj.type === 'user') {
        messageDiv.innerHTML = `
            <div class="user-message">
                <div class="message-text">${formatMessageText(messageObj.message)}</div>
                <div class="message-time">${formatTime(messageObj.timestamp)}</div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="ai-message">
                <div class="ai-avatar-small">🤖</div>
                <div class="ai-response">
                    <div class="message-text">${formatMessageText(messageObj.message)}</div>
                    <div class="message-time">${formatTime(messageObj.timestamp)}</div>
                </div>
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const remaining = budget - totalSpent;
    const spentPercentage = (totalSpent / budget) * 100;
    
    let response = '';
    
    // Budget and financial queries
    if (message.includes('budget') || message.includes('money') || message.includes('spend')) {
        if (message.includes('status') || message.includes('how much')) {
            response = `📊 **Your Financial Status:**

💰 **Budget**: ₹${budget.toLocaleString('en-IN')}
💸 **Spent**: ₹${totalSpent.toLocaleString('en-IN')} (${spentPercentage.toFixed(1)}%)
🎯 **Remaining**: ₹${remaining.toLocaleString('en-IN')}

${spentPercentage > 80 ? '⚠️ **Alert**: You\'ve used most of your budget! Consider reducing expenses.' : spentPercentage > 60 ? '⚡ **Caution**: You\'re on track but monitor your spending.' : '✅ **Great job**: You\'re managing your budget well!'}

Would you like specific tips for any category?`;
        } else if (message.includes('save') || message.includes('saving')) {
            response = `💰 **Smart Savings Tips for Students:**

1. **🍕 Food (30% rule)**: Meal prep and cook in bulk
2. **🚗 Transport**: Use student discounts and carpooling
3. **🎬 Entertainment**: Look for free campus events
4. **📚 Education**: Buy used books or rent them
5. **🛍️ Shopping**: Wait 24 hours before non-essential purchases

**Your current savings rate: ${((remaining / budget) * 100).toFixed(1)}%**

Want me to analyze your specific spending patterns?`;
        } else {
            response = `I can help you with budgeting! Here's what I can do:

📊 Check your budget status
💡 Give personalized saving tips  
📈 Analyze spending patterns
🎯 Set financial goals
⚡ Quick expense tracking tips

What specific aspect of your finances would you like to explore?`;
        }
    }
    // Category analysis
    else if (message.includes('category') || message.includes('breakdown')) {
        const categoryCounts = getCategoryCounts();
        const topCategories = Object.entries(categoryCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3);
            
        response = `📂 **Your Spending Breakdown:**

**Top Categories:**
${topCategories.map(([cat, count]) => 
    `${getCategoryEmoji(cat)} **${cat.charAt(0).toUpperCase() + cat.slice(1)}**: ${count} transactions`
).join('\n')}

**Recommendations:**
• Focus on your top spending category for maximum impact
• Track daily expenses in your highest category
• Set weekly limits for discretionary spending

Want detailed tips for any specific category?`;
    }
    // F1 related queries
    else if (message.includes('f1') || message.includes('formula') || message.includes('racing')) {
        response = `🏎️ **F1 & Your Budget:**

As a fellow F1 fan, I get the excitement! But let's be smart about it:

**Budget-Friendly F1 Enjoyment:**
• 📺 Watch races with friends (split snacks cost)
• 🎮 F1 games instead of expensive merchandise  
• 📱 Follow free content on social media
• 🏆 Join student F1 clubs for group activities

**Current Status**: ${spentPercentage > 70 ? 'Maybe skip expensive F1 merch this month?' : 'You could budget some F1 fun money!'}

Who's your favorite driver? And want tips on enjoying F1 on a student budget?`;
    }
    // Life advice and motivation
    else if (message.includes('life') || message.includes('advice') || message.includes('motivation') || message.includes('help')) {
        response = `🌟 **Life Advice from Your AI Friend:**

Hey ${userProfile.name}, here's some real talk:

**Student Life Balance:**
• 📚 Studies are important, but so is financial literacy
• 💪 Building good money habits now = freedom later
• 🎯 Small consistent actions > big dramatic changes
• 🧠 Learn from every financial mistake

**Your Financial Journey:**
You're already ahead by using Backpack Optimizer! Most students don't track expenses at all.

**Remember**: Every rupee you save now is a rupee that can help you reach bigger dreams later.

What's your biggest goal after graduation? Let's make sure your finances support it! 💫`;
    }
    // Technical issues
    else if (message.includes('issue') || message.includes('problem') || message.includes('bug') || message.includes('error')) {
        response = `🔧 **Technical Support:**

I'm here to help! Common issues and solutions:

**App Issues:**
• Try refreshing the page (Ctrl+F5)
• Clear browser cache and cookies
• Make sure JavaScript is enabled

**Data Issues:**
• Your data is stored locally in your browser
• Export your data regularly as backup
• Check if localStorage is enabled

**Contact Admin:**
If the issue persists, contact Akshat Maheshwari:
• Email: akshat.maheshwari@christuniversity.in
• Note: Include error details and your browser info

Is there a specific problem I can help you troubleshoot?`;
    }
    // General conversation
    else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        response = `Hey there! 👋 Great to see you using Backpack Optimizer! 

I'm your AI financial assistant, and I'm here to help with:
• 💰 Budget analysis and tips
• 📊 Spending pattern insights  
• 🏎️ F1 discussions (if you're into that!)
• 🌟 Life advice and motivation
• 🔧 Technical support

What's on your mind today? Need help with your finances, or want to chat about something else?`;
    }
    // Admin contact
    else if (message.includes('admin') || message.includes('contact') || message.includes('developer')) {
        response = `👨‍💼 **Contact Information:**

**Developer**: Akshat Maheshwari  
**Registration**: 2343104  
**Institution**: Christ University - BCA  
**Campus**: Bangalore, Karnataka

**Contact Methods:**
📧 **Email**: akshat.maheshwari@christuniversity.in  
🏛️ **Campus**: Christ University Bangalore Campus  
💬 **Support**: Available for technical queries

**About the Developer:**
• BCA student passionate about fintech
• Built Backpack Optimizer to help fellow students
• Specializes in AI-powered financial solutions

Need me to help with anything specific, or would you like me to forward a message?`;
    }
    // Default response
    else {
        const responses = [
            `That's interesting! As your financial AI, I'm always learning. Can you tell me more about what you'd like to know?`,
            `I want to help you with that! Could you be more specific? I'm great with budgeting, expenses, and financial planning.`,
            `Hmm, I'm not sure about that specific topic, but I'm excellent at financial advice! What's your main concern about money management?`,
            `I'm constantly learning! While I figure that out, want to check your budget status or get some financial tips?`,
            `That's a great question! I'm best at financial guidance though. Need help with expenses, budgeting, or savings goals?`
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
    }
    
    return {
        type: 'ai',
        message: response,
        timestamp: Date.now()
    };
}

function formatMessageText(text) {
    // Convert **bold** to HTML
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert line breaks to HTML
    text = text.replace(/\n/g, '<br>');
    return text;
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message typing-indicator';
    typingDiv.innerHTML = `
        <div class="ai-message">
            <div class="ai-avatar-small">🤖</div>
            <div class="ai-response">
                <div class="typing-dots">
                    AI is thinking <div class="dots"><span></span><span></span><span></span></div>
                </div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    isTyping = true;
}

function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isTyping = false;
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function startVoiceInput() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';
        
        recognition.onstart = function() {
            showAdvancedFlashMessage('🎤 Listening... Speak now!', 'info');
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('chatInput').value = transcript;
            showAdvancedFlashMessage('✅ Voice input received!', 'success');
        };
        
        recognition.onerror = function() {
            showAdvancedFlashMessage('❌ Voice input failed. Please try again.', 'error');
        };
        
        recognition.start();
    } else {
        showAdvancedFlashMessage('❌ Voice input not supported in this browser.', 'error');
    }
}

function hideUnreadBadge() {
    const badge = document.getElementById('unreadCount');
    if (badge) {
        badge.style.display = 'none';
    }
}

// 📱 MOBILE NAVIGATION
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    const toggleBtn = document.getElementById('mobileMenuToggle');
    
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('show');
    toggleBtn.classList.toggle('active');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    const toggleBtn = document.getElementById('mobileMenuToggle');
    
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('show');
    toggleBtn.classList.remove('active');
}

// 🔔 FLASH MESSAGES
function showAdvancedFlashMessage(message, type = 'success') {
    // Remove any existing flash messages
    const existingMessages = document.querySelectorAll('.flash-message');
    existingMessages.forEach(msg => msg.remove());
    
    const flashMessage = document.createElement('div');
    flashMessage.className = `flash-message ${type}`;
    flashMessage.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <div style="font-size: 24px;">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
            </div>
            <div style="flex: 1;">
                <div style="font-weight: 800; margin-bottom: 5px;">${getFlashTitle(type)}</div>
                <div>${message}</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 20px; cursor: pointer; opacity: 0.7;">&times;</button>
        </div>
    `;
    
    document.body.appendChild(flashMessage);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (flashMessage.parentNode) {
            flashMessage.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => flashMessage.remove(), 300);
        }
    }, 5000);
}

function getFlashTitle(type) {
    const titles = {
        success: 'Success!',
        error: 'Error!',
        warning: 'Warning!',
        info: 'Information'
    };
    return titles[type] || 'Notification';
}

// 🎯 HELPER FUNCTIONS
function showBudgetTips() {
    const modal = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;" onclick="this.remove()">
            <div style="background: white; border-radius: 25px; padding: 40px; max-width: 600px; margin: 20px; position: relative; max-height: 80vh; overflow-y: auto;" onclick="event.stopPropagation()">
                <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
                <h3 style="margin-top: 0; color: var(--primary-blue); font-size: 24px;">💡 Smart Budget Tips</h3>
                <div style="margin: 25px 0; line-height: 1.8;">
                    <h4>🍕 Food & Dining (Target: 30%)</h4>
                    <p>• Cook meals in bulk and meal prep<br>• Use student dining discounts<br>• Avoid expensive coffee shops daily</p>
                    
                    <h4>🚗 Transportation (Target: 15%)</h4>
                    <p>• Use public transport and student passes<br>• Walk or cycle for short distances<br>• Carpool with classmates</p>
                    
                    <h4>🎬 Entertainment (Target: 10%)</h4>
                    <p>• Look for student discounts<br>• Attend free campus events<br>• Have movie nights at home</p>
                    
                    <h4>📚 Education (Target: 20%)</h4>
                    <p>• Buy used textbooks<br>• Use library resources<br>• Share study materials</p>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modal);
}

function focusQuickExpenseForm() {
    document.getElementById('quickAmount').focus();
    document.getElementById('quickAmount').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function logout() {
    if (confirm('Are you sure you want to logout? Your data will be saved locally.')) {
        showAdvancedFlashMessage('👋 Logged out successfully! See you soon!', 'info');
        // In a real app, you would redirect to login page
        // For now, just refresh the page
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
}

// 🎯 USER PROFILE MANAGEMENT
function updateUserProfile() {
    const nameEl = document.getElementById('userName');
    const campusEl = document.getElementById('userCampus');
    const regEl = document.getElementById('userRegNumber');
    const avatarEl = document.getElementById('userAvatar');
    const personalityEl = document.getElementById('userPersonality');
    const welcomeEl = document.getElementById('welcomeMessage');
    const footerEl = document.getElementById('footerCredit');

    if (nameEl) nameEl.textContent = userProfile.name;
    if (campusEl) campusEl.textContent = userProfile.campus;
    if (regEl) regEl.textContent = `Reg: ${userProfile.regNumber}`;
    if (avatarEl) avatarEl.textContent = userProfile.avatar;
    if (personalityEl) personalityEl.textContent = `🌟 ${userProfile.personality}`;
    
    if (welcomeEl) {
        welcomeEl.textContent = `Welcome back, ${userProfile.name}! Your most advanced financial companion with world-class AI insights.`;
    }
    
    if (footerEl) {
        footerEl.textContent = `Developed by ${userProfile.name} (${userProfile.regNumber}) - Christ University BCA | Bangalore, Karnataka`;
    }
}

// 🚀 APPLICATION INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Ultimate Advanced Dashboard Initializing...');
    
    // Initialize PWA installer
    window.webAppInstaller = new WebAppInstaller();
    
    // Load saved data
    loadFromLocalStorage();
    
    // Update user profile
    updateUserProfile();
    
    // Update dashboard
    updateDashboard();
    
    // Initialize AI chat
    if (aiConversations.length === 0) {
        // Add welcome message to conversations but don't display yet
        const welcomeMessage = {
            type: 'ai',
            message: `Welcome to Backpack Optimizer, ${userProfile.name}! 🎒 I'm your AI financial assistant, ready to help you manage money, provide insights, and even chat about F1 racing! Click the chat button anytime to start our conversation.`,
            timestamp: Date.now()
        };
        aiConversations.push(welcomeMessage);
        saveToLocalStorage();
    }
    
    // Show welcome flash message
    setTimeout(() => {
        showAdvancedFlashMessage(`🎉 Welcome back, ${userProfile.name}! Your dashboard is ready.`, 'success');
    }, 1000);
    
    console.log('✅ Dashboard initialized successfully');
});

// 🔄 Auto-save functionality
setInterval(() => {
    saveToLocalStorage();
}, 30000); // Save every 30 seconds

// 📱 Handle page visibility changes (PWA support)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page became visible, refresh dashboard
        updateDashboard();
    }
});

// 🌐 Handle online/offline status
window.addEventListener('online', function() {
    showAdvancedFlashMessage('🌐 You\'re back online!', 'success');
});

window.addEventListener('offline', function() {
    showAdvancedFlashMessage('📶 You\'re offline. Data will sync when reconnected.', 'info');
});

// 🎯 Export all main functions to global scope for HTML onclick handlers
window.installWebApp = installWebApp;
window.showAppInfo = showAppInfo;
window.addQuickExpense = addQuickExpense;
window.refreshExpenses = refreshExpenses;
window.exportToCSV = exportToCSV;
window.exportToPDF = exportToPDF;
window.shareViaEmail = shareViaEmail;
window.shareViaWhatsApp = shareViaWhatsApp;
window.toggleAIChat = toggleAIChat;
window.sendMessage = sendMessage;
window.sendQuickMessage = sendQuickMessage;
window.handleChatKeyPress = handleChatKeyPress;
window.startVoiceInput = startVoiceInput;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.showBudgetTips = showBudgetTips;
window.focusQuickExpenseForm = focusQuickExpenseForm;
window.logout = logout;

console.log('🎒 Backpack Optimizer fully loaded and ready!');
