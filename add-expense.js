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
        console.log('🔧 Initializing Mobile Navigation System...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Get elements with multiple fallback selectors
        this.sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
        this.overlay = document.getElementById('mobileOverlay') || document.querySelector('.mobile-overlay');
        this.toggleBtn = document.getElementById('mobileMenuToggle') || document.querySelector('.mobile-menu-toggle');

        if (!this.sidebar || !this.overlay || !this.toggleBtn) {
            console.error('❌ Mobile nav elements missing:', {
                sidebar: !!this.sidebar,
                overlay: !!this.overlay,
                toggleBtn: !!this.toggleBtn
            });
            return;
        }

        // Add event listeners with multiple event types for better mobile support
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

        // Close on nav link clicks for mobile
        this.setupNavLinks();

        // Handle window events
        this.setupWindowEvents();

        console.log('✅ Mobile Navigation System Ready');
    }

    setupNavLinks() {
        const navLinks = this.sidebar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    setTimeout(() => this.close(), 150); // Small delay for better UX
                }
            });
        });
    }

    setupWindowEvents() {
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 768 && this.isOpen) {
                    this.close();
                }
            }, 100);
        });

        // Handle ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        console.log('📱 Toggling mobile menu, currently:', this.isOpen ? 'open' : 'closed');
        
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
        
        console.log('✅ Mobile menu opened successfully');
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
        
        console.log('✅ Mobile menu closed successfully');
    }
}

// Initialize mobile navigation system
const mobileNav = new MobileNavigation();

// Application state management
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
let expenses = JSON.parse(localStorage.getItem('backpack_expenses') || '[]');

// Check authentication
if (!currentUser) {
    console.log('❌ User not authenticated, redirecting...');
    window.location.href = 'index.html';
}

// 👤 USER PROFILE MANAGEMENT
function updateUserProfile() {
    console.log('👤 Updating user profile...');
    
    const userNameEl = document.getElementById('userName');
    const userCampusEl = document.getElementById('userCampus');
    const userAvatarEl = document.getElementById('userAvatar');

    if (userNameEl) {
        userNameEl.textContent = currentUser.fullName || currentUser.username || 'User';
    }
    
    if (userCampusEl) {
        userCampusEl.textContent = currentUser.campus || 'University';
    }
    
    if (userAvatarEl) {
        const name = currentUser.fullName || currentUser.username || 'U';
        userAvatarEl.textContent = name[0].toUpperCase();
    }

    updateBudgetStatus();
    console.log('✅ User profile updated');
}

function updateBudgetStatus() {
    console.log('💰 Updating budget status...');
    
    const userExpenses = expenses.filter(e => e.userId === currentUser.id);
    const totalSpent = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budget = currentUser.monthlyBudget || 20000;
    const remaining = budget - totalSpent;

    const budgetEl = document.getElementById('monthlyBudgetDisplay');
    const spentEl = document.getElementById('spentSoFarDisplay');
    const remainingEl = document.getElementById('remainingDisplay');

    if (budgetEl) budgetEl.textContent = budget.toLocaleString('en-IN');
    if (spentEl) spentEl.textContent = totalSpent.toLocaleString('en-IN');
    if (remainingEl) remainingEl.textContent = remaining.toLocaleString('en-IN');
    
    console.log('✅ Budget status updated:', { budget, totalSpent, remaining });
}

// 💸 EXPENSE MANAGEMENT
function addExpense(event) {
    event.preventDefault();
    console.log('💸 Adding new expense...');
    
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;
    const description = document.getElementById('expenseDescription').value.trim();
    const mood = document.getElementById('expenseMood').value;
    const paymentMethod = document.getElementById('expensePayment').value;
    const notes = document.getElementById('expenseNotes').value.trim();

    // Validation
    if (!amount || amount <= 0) {
        showFlashMessage('⚠️ Please enter a valid amount!', 'warning');
        return;
    }

    if (!category || !description) {
        showFlashMessage('⚠️ Please fill all required fields!', 'warning');
        return;
    }

    // Create expense object
    const expense = {
        id: Date.now(),
        userId: currentUser.id,
        amount,
        category,
        description,
        mood,
        paymentMethod,
        notes,
        date: new Date().toISOString(),
        timestamp: Date.now()
    };

    // Save to storage
    expenses.push(expense);
    localStorage.setItem('backpack_expenses', JSON.stringify(expenses));
    
    console.log('✅ Expense saved:', expense);
    
    // Show success message
    showFlashMessage(`💸 Expense of ₹${amount.toFixed(2)} recorded successfully! 🌟`, 'success');
    
    // Reset form
    document.getElementById('expenseForm').reset();
    document.getElementById('expenseMood').value = 'neutral';
    document.getElementById('expensePayment').value = 'upi';
    
    // Update budget display
    updateBudgetStatus();
}

// 🔔 FLASH MESSAGE SYSTEM
function showFlashMessage(message, type = 'success') {
    console.log(`🔔 Showing flash message: ${message}`);
    
    // Remove existing messages
    const existingFlash = document.querySelector('.flash-message');
    if (existingFlash) {
        existingFlash.remove();
    }

    const flash = document.createElement('div');
    flash.className = `flash-message flash-${type}`;
    flash.style.cssText = `
        position: fixed; 
        top: 20px; 
        right: 20px; 
        z-index: 2000;
        background: white; 
        padding: 20px 25px; 
        border-radius: 15px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15); 
        border-left: 5px solid ${type === 'success' ? '#34C759' : type === 'warning' ? '#FF9500' : '#FF3B30'};
        font-weight: 600;
        font-size: 16px;
        max-width: 400px;
        animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        line-height: 1.4;
    `;
    
    flash.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <span style="font-size: 24px;">
                ${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '❌'}
            </span>
            <span style="flex: 1;">${message}</span>
            <span onclick="this.parentElement.parentElement.remove()" 
                  style="cursor: pointer; font-size: 20px; opacity: 0.7; font-weight: bold; padding: 5px;">×</span>
        </div>
    `;
    
    document.body.appendChild(flash);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (flash.parentNode) {
            flash.style.animation = 'slideOutRight 0.4s ease forwards';
            setTimeout(() => flash.remove(), 400);
        }
    }, 5000);
}

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%) scale(0.9);
            opacity: 0;
        }
        to {
            transform: translateX(0) scale(1);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0) scale(1);
            opacity: 1;
        }
        to {
            transform: translateX(100%) scale(0.9);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 🚪 LOGOUT FUNCTION
function logout() {
    const userName = currentUser.fullName || currentUser.username || 'User';
    
    if (confirm(`Are you sure you want to logout, ${userName}?\n\nYour expense data will be saved for next time! 💾`)) {
        console.log('🚪 User logging out...');
        localStorage.removeItem('currentUser');
        showFlashMessage('👋 Logged out successfully! See you soon!', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// 🚀 APPLICATION INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Add Expense Page Initializing...');
    
    // Update user interface
    updateUserProfile();
    
    // Setup form validation
    const amountInput = document.getElementById('expenseAmount');
    if (amountInput) {
        amountInput.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    }
    
    console.log('✅ Add Expense Page Ready!');
    console.log('✅ Mobile navigation working');
    console.log('✅ Form validation enabled');
    console.log('✅ User data loaded:', currentUser.fullName || 'Unknown');
});

// Export functions for global access
window.addExpense = addExpense;
window.logout = logout;
window.showFlashMessage = showFlashMessage;

console.log('🎯 Add Expense JavaScript Module Loaded Successfully!');
