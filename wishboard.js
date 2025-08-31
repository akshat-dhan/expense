// 🔧 ENHANCED MOBILE NAVIGATION CLASS
class MobileNavigation {
    constructor() {
        this.sidebar = null;
        this.overlay = null;
        this.toggleBtn = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        console.log('🔧 Initializing Mobile Navigation...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
        this.overlay = document.getElementById('mobileOverlay') || document.querySelector('.mobile-overlay');
        this.toggleBtn = document.getElementById('mobileMenuToggle') || document.querySelector('.mobile-menu-toggle');

        if (!this.sidebar || !this.overlay || !this.toggleBtn) {
            console.error('❌ Mobile nav elements not found:', {
                sidebar: !!this.sidebar,
                overlay: !!this.overlay,
                toggleBtn: !!this.toggleBtn
            });
            return;
        }

        // Add multiple event types for better mobile support
        this.toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });

        this.toggleBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.toggle();
        }, { passive: false });

        this.overlay.addEventListener('click', () => this.close());
        this.overlay.addEventListener('touchstart', () => this.close(), { passive: true });

        // Setup nav links
        this.setupNavLinks();
        
        // Setup window events
        this.setupWindowEvents();

        console.log('✅ Mobile Navigation Ready');
    }

    setupNavLinks() {
        const navLinks = this.sidebar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    setTimeout(() => this.close(), 150);
                }
            });
        });
    }

    setupWindowEvents() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 768 && this.isOpen) {
                    this.close();
                }
            }, 100);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        console.log('📱 Toggling mobile menu');
        
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        console.log('📱 Opening mobile menu');
        
        this.isOpen = true;
        this.sidebar.classList.add('mobile-open');
        this.overlay.classList.add('show');
        this.toggleBtn.classList.add('active');
        this.toggleBtn.setAttribute('aria-expanded', 'true');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        console.log('✅ Mobile menu opened');
    }

    close() {
        console.log('📱 Closing mobile menu');
        
        this.isOpen = false;
        this.sidebar.classList.remove('mobile-open');
        this.overlay.classList.remove('show');
        this.toggleBtn.classList.remove('active');
        this.toggleBtn.setAttribute('aria-expanded', 'false');
        
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        
        console.log('✅ Mobile menu closed');
    }
}

// Initialize mobile navigation
const mobileNav = new MobileNavigation();

// ✅ CLEAN APPLICATION STATE - NO PREDEFINED DATA
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
let wishlist = JSON.parse(localStorage.getItem('backpack_wishlist') || '[]');

// ✅ CHECK AUTHENTICATION - REDIRECT IF NOT LOGGED IN
if (!currentUser) {
    window.location.href = 'index.html';
    throw new Error('User not authenticated');
}

// ✅ REAL USER PROFILE UPDATE - FIXED REG NUMBER
function updateUserProfile() {
    const campusNames = {
        'CHRIST_BLR': 'Christ University - BCA',
        'DU_DELHI': 'Delhi University',
        'VIT_VEL': 'VIT Vellore', 
        'BITS_PIL': 'BITS Pilani',
        'IIT_BOM': 'IIT Bombay',
        'IIT_DEL': 'IIT Delhi'
    };

    const nameElement = document.getElementById('userName');
    const campusElement = document.getElementById('userCampus');
    const regElement = document.getElementById('userRegNumber');
    const avatarElement = document.getElementById('userAvatar');

    if (nameElement) nameElement.textContent = currentUser.fullName || 'Student';
    if (campusElement) campusElement.textContent = campusNames[currentUser.campus] || currentUser.campus || 'University';
    if (regElement) regElement.textContent = `Reg: ${currentUser.regNumber || 'Not provided'}`; // ✅ FIXED - Shows real reg number
    if (avatarElement) avatarElement.textContent = (currentUser.fullName || 'S')[0].toUpperCase();
    
    console.log('✅ User Profile Updated with REAL data:', {
        name: currentUser.fullName,
        regNumber: currentUser.regNumber, // This shows actual user input
        campus: currentUser.campus
    });
}

// ✅ ENHANCED STATISTICS WITH REAL DATA ONLY
function updateStatistics() {
    const userWishes = wishlist.filter(w => w.userId === currentUser.id);
    const totalTarget = userWishes.reduce((sum, w) => sum + w.targetAmount, 0);
    const totalSaved = userWishes.reduce((sum, w) => sum + w.savedAmount, 0);
    const avgProgress = userWishes.length > 0 ? (totalSaved / totalTarget * 100) : 0;
    
    // Calculate average months to complete
    let totalMonths = 0;
    let validGoals = 0;
    userWishes.forEach(wish => {
        if (wish.targetDate && wish.savedAmount < wish.targetAmount) {
            const remaining = wish.targetAmount - wish.savedAmount;
            const monthsToTarget = Math.ceil((new Date(wish.targetDate) - new Date()) / (1000 * 60 * 60 * 24 * 30));
            if (monthsToTarget > 0) {
                totalMonths += monthsToTarget;
                validGoals++;
            }
        }
    });
    const avgMonths = validGoals > 0 ? Math.round(totalMonths / validGoals) : 0;

    // Animate all values
    animateValue('totalWishes', 0, userWishes.length, 1000);
    animateValue('totalTargetAmount', 0, totalTarget, 1500, '₹');
    animateValue('totalSavedAmount', 0, totalSaved, 1500, '₹');
    animateValue('averageProgress', 0, avgProgress, 2000, '', '%');
    animateValue('monthsToComplete', 0, avgMonths, 1000);
}

// Real-time Smart Suggestions Generator
function generateSmartSuggestions() {
    const amount = parseFloat(document.getElementById('wishAmount').value) || 0;
    const date = document.getElementById('wishDate').value;
    const saved = parseFloat(document.getElementById('wishSaved').value) || 0;
    const name = document.getElementById('wishName').value;
    
    if (amount <= 0) {
        document.getElementById('smartSuggestions').style.display = 'none';
        return;
    }

    const remaining = amount - saved;
    const monthlyBudget = currentUser.monthlyBudget || 20000;
    const savingsCapacity = currentUser.savingsCapacity || 3000;

    let monthsToTarget = 12;
    if (date) {
        const targetDate = new Date(date);
        const now = new Date();
        monthsToTarget = Math.max(1, Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24 * 30)));
    }

    const requiredMonthlySaving = Math.ceil(remaining / monthsToTarget);
    const feasibilityScore = calculateFeasibilityScore(requiredMonthlySaving, savingsCapacity);

    const suggestionContent = generateAdvancedSuggestions(amount, remaining, requiredMonthlySaving, monthsToTarget, feasibilityScore, name);
    
    document.getElementById('suggestionContent').innerHTML = suggestionContent;
    document.getElementById('suggestionContent').className = 'suggestion-content suggestion-visible';
    document.getElementById('smartSuggestions').style.display = 'block';
}

function calculateFeasibilityScore(required, capacity) {
    const ratio = required / capacity;
    if (ratio <= 0.5) return 'excellent';
    if (ratio <= 0.8) return 'good';
    if (ratio <= 1.2) return 'challenging';
    return 'difficult';
}

function generateAdvancedSuggestions(totalAmount, remaining, monthlyRequired, months, feasibility, itemName) {
    const weeklyRequired = Math.ceil(monthlyRequired / 4);
    const dailyRequired = Math.ceil(monthlyRequired / 30);
    const budgetPercentage = ((monthlyRequired / (currentUser.monthlyBudget || 20000)) * 100).toFixed(1);

    let feasibilityColor = '#34C759';
    let feasibilityText = 'Easily Achievable! 🎉';
    let feasibilityIcon = '✅';
    
    if (feasibility === 'good') {
        feasibilityColor = '#FF9500';
        feasibilityText = 'Achievable with focus 💪';
        feasibilityIcon = '⚠️';
    } else if (feasibility === 'challenging') {
        feasibilityColor = '#FF3B30';
        feasibilityText = 'Needs commitment 🔥';
        feasibilityIcon = '⚠️';
    } else if (feasibility === 'difficult') {
        feasibilityColor = '#FF3B30';
        feasibilityText = 'Very challenging 🚀';
        feasibilityIcon = '🔴';
    }

    return `
        <div class="savings-plan">
            <div class="plan-card">
                <div class="plan-value">₹${monthlyRequired.toLocaleString('en-IN')}</div>
                <div class="plan-label">Monthly Target</div>
            </div>
            <div class="plan-card">
                <div class="plan-value">₹${weeklyRequired.toLocaleString('en-IN')}</div>
                <div class="plan-label">Weekly Saving</div>
            </div>
            <div class="plan-card">
                <div class="plan-value">₹${dailyRequired.toLocaleString('en-IN')}</div>
                <div class="plan-label">Daily Amount</div>
            </div>
            <div class="plan-card">
                <div class="plan-value">${budgetPercentage}%</div>
                <div class="plan-label">Of Budget</div>
            </div>
            <div class="plan-card" style="border-color: ${feasibilityColor};">
                <div class="plan-value" style="color: ${feasibilityColor};">${feasibilityIcon}</div>
                <div class="plan-label">${feasibilityText}</div>
            </div>
        </div>
        
        <div class="tip-item">
            <strong>🎯 Smart Strategy for ${itemName || 'Your Goal'}:</strong><br>
            ${generateSpecificTips(totalAmount, monthlyRequired, feasibility)}
        </div>
        
        ${generateCategoryTips(document.getElementById('wishCategory').value, totalAmount)}
        
        <div class="tip-item">
            <strong>💡 Pro Financial Tips:</strong><br>
            ${generateProTips(monthlyRequired, (currentUser.monthlyBudget || 20000))}
        </div>
    `;
}

function generateSpecificTips(amount, monthlyRequired, feasibility) {
    let tips = '';
    
    if (feasibility === 'excellent') {
        tips = `Perfect fit for your budget! Set up automatic transfers of ₹${Math.ceil(monthlyRequired/2).toLocaleString('en-IN')} bi-weekly. Consider investing in SIP for better returns.`;
    } else if (feasibility === 'good') {
        tips = `Achievable with some lifestyle adjustments:<br>• Reduce dining out by ₹${Math.ceil(monthlyRequired * 0.3).toLocaleString('en-IN')}/month<br>• Cut entertainment expenses by 20%<br>• Look for student part-time opportunities`;
    } else if (feasibility === 'challenging') {
        tips = `Requires significant commitment:<br>• Extend target by 2-3 months for easier saving<br>• Explore part-time income (₹${Math.ceil(monthlyRequired * 0.4).toLocaleString('en-IN')}/month)<br>• Consider buying during major sales (save 15-30%)`;
    } else {
        tips = `Very aggressive target. Consider these options:<br>• Extend timeline by 6+ months<br>• Look for EMI options with 0% interest<br>• Consider pre-owned/refurbished options<br>• Increase monthly income through freelancing`;
    }
    
    return tips;
}

function generateCategoryTips(category, amount) {
    let categoryTips = '';
    
    switch(category) {
        case 'electronics':
            categoryTips = `<div class="tip-item"><strong>📱 Electronics Shopping Tips:</strong><br>• Wait for Diwali/Republic Day sales (20-40% off)<br>• Check for student discounts (5-15% additional)<br>• Consider refurbished from official stores<br>• Use credit card EMI for 0% interest<br>• Compare prices on Amazon, Flipkart, Croma</div>`;
            break;
        case 'travel':
            categoryTips = `<div class="tip-item"><strong>✈️ Travel Savings Tips:</strong><br>• Book flights 2-3 months in advance<br>• Use student travel cards for discounts<br>• Consider hostels over hotels<br>• Travel during off-peak seasons<br>• Look for group booking discounts</div>`;
            break;
        case 'education':
            categoryTips = `<div class="tip-item"><strong>📚 Education Investment Tips:</strong><br>• Apply for merit scholarships<br>• Use library resources first<br>• Buy second-hand textbooks<br>• Join online course sales<br>• Look for free alternatives first</div>`;
            break;
        default:
            categoryTips = `<div class="tip-item"><strong>🛍️ Smart Shopping Tips:</strong><br>• Wait for end-of-season sales<br>• Use cashback credit cards<br>• Compare prices across platforms<br>• Sign up for price drop alerts<br>• Consider buying in bulk for discounts</div>`;
    }
    
    return categoryTips;
}

function generateProTips(monthlyRequired, monthlyBudget) {
    const percentage = (monthlyRequired / monthlyBudget) * 100;
    
    if (percentage <= 15) {
        return `• Set up automatic savings transfer<br>• Invest in liquid funds for better returns<br>• Track progress with monthly reviews<br>• Celebrate milestones to stay motivated`;
    } else if (percentage <= 25) {
        return `• Use the 50-30-20 budgeting rule<br>• Cut non-essential subscriptions<br>• Cook more meals at home<br>• Use public transport vs private cabs<br>• Sell items you no longer use`;
    } else {
        return `• Consider increasing income through:<br>&nbsp;&nbsp;- Part-time tutoring (₹3,000-8,000/month)<br>&nbsp;&nbsp;- Freelance coding (₹5,000-15,000/month)<br>&nbsp;&nbsp;- Content writing (₹2,000-6,000/month)<br>• Negotiate payment plans with vendors<br>• Look for sponsorship opportunities`;
    }
}

function addWish(event) {
    event.preventDefault();
    
    const name = document.getElementById('wishName').value;
    const amount = parseFloat(document.getElementById('wishAmount').value);
    const date = document.getElementById('wishDate').value;
    const priority = document.getElementById('wishPriority').value;
    const category = document.getElementById('wishCategory').value;
    const saved = parseFloat(document.getElementById('wishSaved').value) || 0;
    const description = document.getElementById('wishDescription').value;

    const wish = {
        id: Date.now(),
        userId: currentUser.id,
        name,
        targetAmount: amount,
        savedAmount: saved,
        targetDate: date,
        priority,
        category,
        description,
        createdAt: new Date().toISOString()
    };

    wishlist.push(wish);
    localStorage.setItem('backpack_wishlist', JSON.stringify(wishlist));
    
    updateWishboard();
    updateStatistics();
    
    const progress = saved > 0 ? `You're already ${((saved/amount)*100).toFixed(1)}% there!` : 'Let the savings journey begin!';
    showFlashMessage(`"${name}" added to your dream board! ${progress} Your AI savings plan is ready! 🎯`);
    
    // Clear form and hide suggestions
    document.getElementById('wishForm').reset();
    document.getElementById('smartSuggestions').style.display = 'none';
}

// ✅ ENHANCED WISHBOARD DISPLAY WITH REAL DATA ONLY
function updateWishboard() {
    const container = document.getElementById('wishlistGrid');
    const userWishes = wishlist.filter(w => w.userId === currentUser.id)
                              .sort((a, b) => {
                                  const priorityOrder = { high: 3, medium: 2, low: 1 };
                                  if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                                      return priorityOrder[b.priority] - priorityOrder[a.priority];
                                  }
                                  return new Date(b.createdAt) - new Date(a.createdAt);
                              });

    if (userWishes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🌟</div>
                <div style="font-size: 28px; font-weight: 900; margin-bottom: 15px; color: var(--text-primary);">No Dreams Yet!</div>
                <div style="font-size: 18px; margin-bottom: 25px;">Start your journey by adding your first financial goal above!</div>
                <div style="font-size: 16px; color: var(--system-gray);">Every great achievement starts with a dream ✨</div>
            </div>
        `;
        return;
    }

    container.innerHTML = userWishes.map(wish => {
        const progress = (wish.savedAmount / wish.targetAmount) * 100;
        const remaining = wish.targetAmount - wish.savedAmount;
        const isCompleted = progress >= 100;
        
        let daysLeft = null;
        let monthsLeft = 12;
        let requiredMonthlySaving = 0;
        
        if (wish.targetDate && !isCompleted) {
            const targetDate = new Date(wish.targetDate);
            const now = new Date();
            daysLeft = Math.max(0, Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24)));
            monthsLeft = Math.max(1, Math.ceil(daysLeft / 30));
            requiredMonthlySaving = monthsLeft > 0 ? Math.ceil(remaining / monthsLeft) : remaining;
        }
        
        const feasibilityScore = calculateFeasibilityScore(requiredMonthlySaving, currentUser.savingsCapacity || 3000);
        
        return `
            <div class="wishlist-item priority-${wish.priority}">
                ${isCompleted ? '<div class="achievement-badge">🏆</div>' : ''}
                
                <div class="wish-header">
                    <div class="wish-title">
                        ${getCategoryIcon(wish.category)} ${wish.name}
                    </div>
                    <div class="priority-badge" style="background: ${getPriorityColor(wish.priority)};">
                        ${getPriorityIcon(wish.priority)} ${wish.priority.toUpperCase()}
                    </div>
                </div>
                
                <div class="wish-amount">₹${wish.targetAmount.toLocaleString('en-IN')}</div>
                
                <div class="progress-section">
                    <div class="progress-header">
                        <span class="progress-label">Dream Progress</span>
                        <span class="progress-percentage">${progress.toFixed(1)}% ${isCompleted ? '🎉' : ''}</span>
                    </div>
                    <div class="wish-progress">
                        <div class="wish-progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                    </div>
                </div>
                
                <div class="financial-summary">
                    <div class="summary-item" style="border-color: var(--success-green);">
                        <div class="summary-value">₹${wish.savedAmount.toLocaleString('en-IN')}</div>
                        <div class="summary-label">Saved</div>
                    </div>
                    <div class="summary-item" style="border-color: var(--danger-red);">
                        <div class="summary-value">₹${remaining.toLocaleString('en-IN')}</div>
                        <div class="summary-label">Remaining</div>
                    </div>
                    ${wish.targetDate ? `
                        <div class="summary-item" style="border-color: var(--warning-orange);">
                            <div class="summary-value">${monthsLeft}</div>
                            <div class="summary-label">Months Left</div>
                        </div>
                        <div class="summary-item" style="border-color: var(--primary-blue);">
                            <div class="summary-value">${daysLeft || 0}</div>
                            <div class="summary-label">Days Left</div>
                        </div>
                    ` : ''}
                </div>
                
                ${!isCompleted ? `
                    <div class="savings-intelligence">
                        <div class="intelligence-header">
                            <div class="intelligence-icon">🧠</div>
                            <div>
                                <strong style="color: var(--success-green);">AI Savings Intelligence</strong>
                                <div style="font-size: 12px; color: var(--system-gray);">Personalized plan for ${wish.name}</div>
                            </div>
                        </div>
                        
                        <div class="monthly-breakdown">
                            <div class="breakdown-item">
                                <div class="breakdown-value">₹${requiredMonthlySaving.toLocaleString('en-IN')}</div>
                                <div class="breakdown-label">Monthly</div>
                            </div>
                            <div class="breakdown-item">
                                <div class="breakdown-value">₹${Math.ceil(requiredMonthlySaving/4).toLocaleString('en-IN')}</div>
                                <div class="breakdown-label">Weekly</div>
                            </div>
                            <div class="breakdown-item">
                                <div class="breakdown-value">₹${Math.ceil(requiredMonthlySaving/30).toLocaleString('en-IN')}</div>
                                <div class="breakdown-label">Daily</div>
                            </div>
                            <div class="breakdown-item">
                                <div class="breakdown-value">${((requiredMonthlySaving/(currentUser.monthlyBudget||20000))*100).toFixed(1)}%</div>
                                <div class="breakdown-label">Budget %</div>
                            </div>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.8); padding: 15px; border-radius: 10px; margin-top: 15px;">
                            <strong>💡 Smart Tips for ${wish.name}:</strong><br>
                            ${generateGoalSpecificAdvice(wish, requiredMonthlySaving, feasibilityScore)}
                        </div>
                    </div>
                ` : `
                    <div style="text-align: center; padding: 25px; background: linear-gradient(135deg, rgba(52, 199, 89, 0.1), rgba(52, 199, 89, 0.05)); border-radius: 20px; margin: 25px 0;">
                        <div style="font-size: 32px; margin-bottom: 15px;">🎉🏆🎉</div>
                        <div style="font-size: 24px; font-weight: 900; color: var(--success-green); margin-bottom: 10px;">DREAM ACHIEVED!</div>
                        <div style="font-size: 16px; font-weight: 600;">Congratulations! You've successfully saved for ${wish.name}!</div>
                        <div style="font-size: 14px; color: var(--system-gray); margin-top: 10px;">Time to make that purchase and celebrate! 🥳</div>
                    </div>
                `}
                
                ${wish.targetDate ? `
                    <div style="text-align: center; margin: 20px 0; padding: 15px; background: rgba(0,122,255,0.1); border-radius: 15px;">
                        📅 <strong>Target Date:</strong> ${formatDate(wish.targetDate)}
                        ${daysLeft !== null ? ` • <strong>${daysLeft > 0 ? `${daysLeft} days to go` : 'Target date reached!'}</strong>` : ''}
                    </div>
                ` : ''}
                
                ${wish.description ? `
                    <div style="margin: 20px 0; padding: 20px; background: linear-gradient(135deg, rgba(0,122,255,0.1), rgba(88,86,214,0.1)); border-radius: 15px; border-left: 5px solid var(--primary-blue);">
                        <strong>💭 Why This Dream Matters:</strong><br>
                        <em style="font-size: 15px; line-height: 1.6;">${wish.description}</em>
                    </div>
                ` : ''}
                
                <div class="action-buttons">
                    ${!isCompleted ? `
                        <button class="btn btn-success" onclick="addSavings(${wish.id})" style="flex: 1;">
                            💰 Add Savings
                        </button>
                        <button class="btn btn-warning" onclick="editDream(${wish.id})">
                            ✏️ Edit Dream
                        </button>
                    ` : `
                        <button class="btn btn-success" onclick="markAsPurchased(${wish.id})" style="flex: 1;">
                            🛒 Mark as Purchased
                        </button>
                    `}
                    <button class="btn btn-danger" onclick="deleteWish(${wish.id})">
                        🗑️ Remove
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function generateGoalSpecificAdvice(wish, monthlyRequired, feasibility) {
    const budget = currentUser.monthlyBudget || 20000;
    let advice = '';

    // Category-specific advice
    if (wish.category === 'electronics') {
        advice += `• Wait for major sales (Diwali: 20-40% off)<br>• Check student discounts (additional 5-15%)<br>• Consider EMI options with 0% interest<br>`;
    } else if (wish.category === 'travel') {
        advice += `• Book 2-3 months in advance for best prices<br>• Use student travel packages<br>• Consider off-peak season travel<br>`;
    } else if (wish.category === 'education') {
        advice += `• Look for scholarships and grants<br>• Check for early bird discounts<br>• Consider online alternatives first<br>`;
    }

    // Feasibility-based advice
    if (feasibility === 'excellent') {
        advice += `• Perfect! Set automatic transfers<br>• Consider SIP investment for growth`;
    } else if (feasibility === 'good') {
        advice += `• Reduce dining out by ₹${Math.ceil(monthlyRequired*0.3).toLocaleString('en-IN')}/month<br>• Cut entertainment by 20%`;
    } else if (feasibility === 'challenging') {
        advice += `• Look for part-time income (₹${Math.ceil(monthlyRequired*0.4).toLocaleString('en-IN')}/month)<br>• Extend timeline by 2-3 months`;
    } else {
        advice += `• Consider extending timeline significantly<br>• Explore freelance opportunities<br>• Look for pre-owned options`;
    }

    return advice || '• Stay focused on your goal<br>• Track progress regularly<br>• Celebrate small milestones';
}

// Enhanced savings addition with smart suggestions
function addSavings(wishId) {
    const wish = wishlist.find(w => w.id === wishId);
    if (!wish) return;

    const remaining = wish.targetAmount - wish.savedAmount;
    const suggestionAmount = Math.min(remaining, Math.ceil(remaining * 0.1));
    
    const amount = prompt(`💰 Add Savings to "${wish.name}"\n\n📊 Current: ₹${wish.savedAmount.toLocaleString('en-IN')}\n🎯 Target: ₹${wish.targetAmount.toLocaleString('en-IN')}\n💎 Remaining: ₹${remaining.toLocaleString('en-IN')}\n\n💡 Suggested: ₹${suggestionAmount.toLocaleString('en-IN')}\n\nHow much would you like to add? (₹)`);
    
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
        const addAmount = parseFloat(amount);
        wish.savedAmount += addAmount;
        
        if (wish.savedAmount >= wish.targetAmount) {
            wish.savedAmount = wish.targetAmount;
            showFlashMessage(`🎉 INCREDIBLE! You've achieved your dream "${wish.name}"! 🏆 Time to celebrate and make that purchase! This is a testament to your amazing financial discipline! 🥳✨`);
        } else {
            const newProgress = ((wish.savedAmount / wish.targetAmount) * 100).toFixed(1);
            const newRemaining = wish.targetAmount - wish.savedAmount;
            showFlashMessage(`💰 Amazing! ₹${addAmount.toLocaleString('en-IN')} added to "${wish.name}"! 🎯 Progress: ${newProgress}% • Remaining: ₹${newRemaining.toLocaleString('en-IN')} • Keep pushing forward! 💪`);
        }
        
        localStorage.setItem('backpack_wishlist', JSON.stringify(wishlist));
        updateWishboard();
        updateStatistics();
    }
}

function editDream(wishId) {
    const wish = wishlist.find(w => w.id === wishId);
    if (!wish) return;

    const newAmount = prompt(`✏️ Edit Dream Target\n\nDream: ${wish.name}\nCurrent Target: ₹${wish.targetAmount.toLocaleString('en-IN')}\nSaved: ₹${wish.savedAmount.toLocaleString('en-IN')}\n\nNew target amount (₹):`);
    
    if (newAmount && !isNaN(newAmount) && parseFloat(newAmount) > 0) {
        const oldAmount = wish.targetAmount;
        wish.targetAmount = parseFloat(newAmount);
        localStorage.setItem('backpack_wishlist', JSON.stringify(wishlist));
        updateWishboard();
        updateStatistics();
        
        const change = wish.targetAmount > oldAmount ? 'increased' : 'decreased';
        showFlashMessage(`✏️ Dream "${wish.name}" target ${change} to ₹${wish.targetAmount.toLocaleString('en-IN')}! Your savings plan has been updated! 🎯`);
    }
}

function markAsPurchased(wishId) {
    const wish = wishlist.find(w => w.id === wishId);
    if (!wish) return;

    if (confirm(`🛒 Congratulations on achieving "${wish.name}"! 🎉\n\nMark this dream as purchased and remove from wishboard?\n\nThis is a celebration of your financial success! 🏆`)) {
        wishlist = wishlist.filter(w => w.id !== wishId);
        localStorage.setItem('backpack_wishlist', JSON.stringify(wishlist));
        updateWishboard();
        updateStatistics();
        showFlashMessage(`🛒 "${wish.name}" marked as purchased! 🎉 You've successfully turned your dream into reality! Your dedication to saving has paid off magnificently! 👏✨`);
    }
}

function deleteWish(wishId) {
    const wish = wishlist.find(w => w.id === wishId);
    if (!wish) return;

    if (confirm(`🗑️ Remove Dream?\n\nAre you sure you want to delete "${wish.name}"?\n\nSaved: ₹${wish.savedAmount.toLocaleString('en-IN')}\nTarget: ₹${wish.targetAmount.toLocaleString('en-IN')}\n\nThis action cannot be undone.`)) {
        wishlist = wishlist.filter(w => w.id !== wishId);
        localStorage.setItem('backpack_wishlist', JSON.stringify(wishlist));
        updateWishboard();
        updateStatistics();
        showFlashMessage(`🗑️ Dream "${wish.name}" removed from wishboard. Your other dreams await your attention! 💫`);
    }
}

// Utility functions
function getCategoryIcon(category) {
    const icons = {
        electronics: '📱',
        travel: '✈️',
        education: '📚',
        fashion: '👕',
        health: '🏥',
        vehicle: '🚗',
        entertainment: '🎮',
        other: '🌟'
    };
    return icons[category] || '🌟';
}

function getPriorityColor(priority) {
    const colors = {
        high: '#FF3B30',
        medium: '#FF9500',
        low: '#34C759'
    };
    return colors[priority] || '#8E8E93';
}

function getPriorityIcon(priority) {
    const icons = {
        high: '🔴',
        medium: '🟡',
        low: '🟢'
    };
    return icons[priority] || '⚪';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function animateValue(elementId, start, end, duration, prefix = '', suffix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const range = end - start;
    const startTime = Date.now();
    
    const updateValue = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + (range * progress);
        
        if (suffix === '%') {
            element.textContent = prefix + Math.round(current) + suffix;
        } else {
            element.textContent = prefix + Math.round(current).toLocaleString('en-IN') + suffix;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    };
    
    updateValue();
}

function showFlashMessage(message) {
    const existingFlash = document.querySelector('.flash-message');
    if (existingFlash) {
        existingFlash.remove();
    }

    const flash = document.createElement('div');
    flash.className = 'flash-message';
    
    flash.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <span style="font-size: 32px;">✨</span>
            <span style="flex: 1; font-size: 16px; line-height: 1.5;">${message}</span>
            <span onclick="this.parentElement.parentElement.remove()" style="cursor: pointer; font-size: 28px; font-weight: bold; opacity: 0.7; transition: opacity 0.3s; padding: 5px;">&times;</span>
        </div>
    `;
    
    document.body.appendChild(flash);
    
    setTimeout(() => {
        if (flash.parentNode) {
            flash.style.animation = 'slideOutRight 0.6s ease forwards';
            setTimeout(() => flash.remove(), 600);
        }
    }, 7000);
}

function logout() {
    if (confirm(`Are you sure you want to logout, ${currentUser.fullName || 'Student'}?\n\nYour dreams will be waiting for you when you return! 🌟`)) {
        localStorage.removeItem('currentUser');
        showFlashMessage('Logged out successfully! Keep dreaming big and achieving bigger! See you soon! 👋✨');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

// ✅ CLEAN INITIALIZATION - NO SAMPLE DATA
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎒 Wishboard Loading with CLEAN user data...');
    
    updateUserProfile();
    
    // ✅ NO PREDEFINED WISHLIST - Start with completely clean data
    updateWishboard();
    updateStatistics();
    
    console.log('✅ Wishboard loaded successfully!');
    console.log('✅ No sample wishes - completely clean start');
    console.log('✅ Roll number shows actual user data:', currentUser.regNumber);
});

// Export functions for global access
window.generateSmartSuggestions = generateSmartSuggestions;
window.addWish = addWish;
window.addSavings = addSavings;
window.editDream = editDream;
window.markAsPurchased = markAsPurchased;
window.deleteWish = deleteWish;
window.logout = logout;

console.log('🎯 Wishboard JavaScript Module Loaded Successfully!');
