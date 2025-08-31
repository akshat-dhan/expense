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
let expenses = JSON.parse(localStorage.getItem('backpack_expenses') || '[]');

// ✅ CHECK AUTHENTICATION
if (!currentUser) {
    window.location.href = 'index.html';
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

// ✅ STATISTICS WITH REAL DATA ONLY
function updateStatistics(expenseList = null) {
    const userExpenses = expenseList || expenses.filter(e => e.userId === currentUser.id);
    const totalAmount = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const avgAmount = userExpenses.length > 0 ? totalAmount / userExpenses.length : 0;
    
    // Calculate this month's expenses
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthExpenses = userExpenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });
    const thisMonthAmount = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Update display with animation
    animateValue('totalExpenses', 0, userExpenses.length, 1000);
    animateValue('totalAmount', 0, totalAmount, 1000, '₹');
    animateValue('avgExpense', 0, avgAmount, 1000, '₹');
    animateValue('thisMonth', 0, thisMonthAmount, 1000, '₹');

    document.getElementById('expenseCount').textContent = userExpenses.length;
}

// Enhanced filtering with search functionality
function filterExpenses() {
    const filter = document.getElementById('expenseFilter').value;
    const sort = document.getElementById('expenseSort').value;
    const search = document.getElementById('searchInput').value.toLowerCase();
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;

    let userExpenses = expenses.filter(e => e.userId === currentUser.id);

    // Apply search filter
    if (search) {
        userExpenses = userExpenses.filter(e => 
            e.description.toLowerCase().includes(search) ||
            (e.notes && e.notes.toLowerCase().includes(search)) ||
            e.amount.toString().includes(search) ||
            e.category.toLowerCase().includes(search)
        );
    }

    // Apply category filter
    if (filter !== 'all') {
        userExpenses = userExpenses.filter(e => e.category === filter);
    }

    // Apply date range filter
    if (dateFrom) {
        userExpenses = userExpenses.filter(e => new Date(e.date) >= new Date(dateFrom));
    }
    if (dateTo) {
        userExpenses = userExpenses.filter(e => new Date(e.date) <= new Date(dateTo + 'T23:59:59'));
    }

    // Apply sort
    const sortFunctions = {
        'date-desc': (a, b) => new Date(b.date) - new Date(a.date),
        'date-asc': (a, b) => new Date(a.date) - new Date(b.date),
        'amount-desc': (a, b) => b.amount - a.amount,
        'amount-asc': (a, b) => a.amount - b.amount
    };

    userExpenses.sort(sortFunctions[sort]);

    displayExpenses(userExpenses);
    updateStatistics(userExpenses);
}

// ✅ EXPENSE DISPLAY - REAL DATA ONLY
function displayExpenses(expenseList) {
    const container = document.getElementById('expensesList');

    if (expenseList.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📊</div>
                <div style="font-size: 20px; font-weight: 700; margin-bottom: 12px;">No expenses found</div>
                <div style="margin-bottom: 20px;">Try adjusting your filter criteria or add some expenses to get started!</div>
                <a href="add-expense.html" class="btn btn-success">➕ Add Your First Expense</a>
            </div>
        `;
        return;
    }

    container.innerHTML = expenseList.map(expense => `
        <div class="expense-item">
            <div class="expense-info">
                <div class="expense-desc">${expense.description}</div>
                <div class="expense-meta">
                    <span class="category-badge category-${expense.category}">
                        ${getCategoryIcon(expense.category)} ${expense.category.toUpperCase()}
                    </span>
                    <span style="display: flex; align-items: center; gap: 5px;">
                        📅 ${formatDate(expense.date)}
                    </span>
                    <span style="display: flex; align-items: center; gap: 5px;">
                        ${getMoodIcon(expense.mood)} ${expense.mood}
                    </span>
                    <span style="display: flex; align-items: center; gap: 5px;">
                        💳 ${expense.paymentMethod || 'card'}
                    </span>
                </div>
                ${expense.notes ? `
                    <div class="expense-notes">
                        💭 ${expense.notes}
                    </div>
                ` : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <div class="expense-amount">₹${expense.amount.toFixed(2)}</div>
                <button class="btn btn-danger" onclick="deleteExpense(${expense.id})" title="Delete expense">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

// Delete expense with confirmation
function deleteExpense(expenseId) {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;

    if (confirm(`Are you sure you want to delete this expense?\n\n"${expense.description}" - ₹${expense.amount.toFixed(2)}\n\nThis action cannot be undone.`)) {
        expenses = expenses.filter(e => e.id !== expenseId);
        localStorage.setItem('backpack_expenses', JSON.stringify(expenses));
        filterExpenses(); // Refresh the list
        showFlashMessage(`Expense "${expense.description}" deleted successfully! 🗑️`);
    }
}

// ✅ EXPORT FUNCTIONS WITH REAL DATA
function exportToCSV() {
    const userExpenses = expenses.filter(e => e.userId === currentUser.id);
    
    if (userExpenses.length === 0) {
        showFlashMessage('No expenses to export! Add some expenses first.', 'error');
        return;
    }
    
    let csv = 'Date,Description,Amount,Category,Mood,Payment Method,Notes\n';
    userExpenses.forEach(exp => {
        const date = new Date(exp.date).toLocaleDateString('en-IN');
        const notes = (exp.notes || '').replace(/,/g, ';');
        csv += `${date},"${exp.description}",${exp.amount},${exp.category},${exp.mood},${exp.paymentMethod || 'N/A'},"${notes}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `backpack-expenses-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showFlashMessage('📊 CSV exported successfully! Check your downloads folder.');
}

function exportToPDF() {
    const userExpenses = expenses.filter(e => e.userId === currentUser.id);
    const totalSpent = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budgetAmount = currentUser.monthlyBudget || 0;
    
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write(`
        <html>
        <head>
            <title>Backpack Optimizer - Expense Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 30px; color: #333; }
                .header { text-align: center; border-bottom: 3px solid #007AFF; padding-bottom: 25px; margin-bottom: 35px; }
                .summary { background: #f8f9ff; padding: 25px; border-radius: 12px; margin-bottom: 35px; }
                .expense-item { border-bottom: 1px solid #eee; padding: 18px 0; display: flex; justify-content: space-between; }
                .amount { font-weight: bold; color: #FF3B30; font-size: 16px; }
                .category { background: #007AFF; color: white; padding: 4px 12px; border-radius: 8px; font-size: 12px; }
                .notes { font-style: italic; color: #666; margin-top: 8px; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1 style="color: #007AFF; margin-bottom: 10px;">🎒 Backpack Optimizer</h1>
                <h2 style="color: #333;">Comprehensive Expense Report</h2>
                <p style="color: #666;"><strong>Generated on:</strong> ${new Date().toLocaleDateString('en-IN', { 
                    year: 'numeric', month: 'long', day: 'numeric' 
                })}</p>
                <div style="margin-top: 15px;">
                    <p><strong>Student:</strong> ${currentUser.fullName || 'Student'} (Reg: ${currentUser.regNumber || 'Not provided'})</p>
                    <p><strong>University:</strong> Christ University - BCA, Bangalore</p>
                </div>
            </div>
            
            <div class="summary">
                <h3 style="color: #007AFF; margin-bottom: 20px;">📊 Financial Summary</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <p><strong>Monthly Budget:</strong> ₹${budgetAmount.toLocaleString('en-IN')}</p>
                        <p><strong>Total Expenses:</strong> ${userExpenses.length}</p>
                        <p><strong>Budget Utilization:</strong> ${budgetAmount > 0 ? ((totalSpent/budgetAmount)*100).toFixed(1) : '0'}%</p>
                    </div>
                    <div>
                        <p><strong>Total Spent:</strong> ₹${totalSpent.toLocaleString('en-IN')}</p>
                        <p><strong>Remaining:</strong> ₹${(budgetAmount - totalSpent).toLocaleString('en-IN')}</p>
                        <p><strong>Average Expense:</strong> ₹${userExpenses.length > 0 ? (totalSpent/userExpenses.length).toFixed(0) : '0'}</p>
                    </div>
                </div>
            </div>
            
            <h3 style="color: #007AFF;">📋 Detailed Expense List</h3>
            ${userExpenses.map(exp => `
                <div class="expense-item">
                    <div>
                        <div style="font-weight: bold; margin-bottom: 5px;">${exp.description}</div>
                        <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 5px;">
                            <span class="category">${exp.category.toUpperCase()}</span>
                            <span style="color: #666;">${new Date(exp.date).toLocaleDateString('en-IN')}</span>
                            <span style="color: #666;">${exp.mood}</span>
                        </div>
                        ${exp.notes ? `<div class="notes">Notes: ${exp.notes}</div>` : ''}
                    </div>
                    <div class="amount">₹${exp.amount.toFixed(2)}</div>
                </div>
            `).join('')}
            
            <div style="margin-top: 50px; text-align: center; color: #666; border-top: 1px solid #eee; padding-top: 30px;">
                <p><strong>Generated by Backpack Optimizer</strong></p>
                <p>AI-Powered Financial Assistant for Students</p>
                <p style="font-size: 12px; margin-top: 10px;">Report generated on ${new Date().toLocaleString('en-IN')}</p>
            </div>
        </body>
        </html>
    `);
    
    reportWindow.document.close();
    setTimeout(() => {
        reportWindow.print();
    }, 1000);
    
    showFlashMessage('📄 PDF report opened! You can print or save it from the new window.');
}

function shareViaWhatsApp() {
    const userExpenses = expenses.filter(e => e.userId === currentUser.id);
    const totalSpent = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budgetAmount = currentUser.monthlyBudget || 0;
    
    const message = `🎒 *Backpack Optimizer - Expense Summary*\n\n👨‍🎓 *${currentUser.fullName || 'Student'} (${currentUser.regNumber || 'Reg: Not provided'})*\n🏫 *Christ University - BCA*\n\n💰 Monthly Budget: ₹${budgetAmount.toLocaleString('en-IN')}\n💸 Total Spent: ₹${totalSpent.toLocaleString('en-IN')}\n📊 Budget Remaining: ₹${(budgetAmount - totalSpent).toLocaleString('en-IN')}\n📈 Total Expenses: ${userExpenses.length}\n🎯 Budget Utilization: ${budgetAmount > 0 ? ((totalSpent/budgetAmount)*100).toFixed(1) : '0'}%\n\n${totalSpent < budgetAmount * 0.5 ? '✅ Excellent financial control!' : totalSpent < budgetAmount * 0.8 ? '👍 Good budget management!' : '⚠️ Monitor spending closely!'}\n\n*Smart expense tracking with Backpack Optimizer!*`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    showFlashMessage('📱 WhatsApp opened! Share your expense summary.');
}

function shareViaEmail() {
    const userExpenses = expenses.filter(e => e.userId === currentUser.id);
    const totalSpent = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budgetAmount = currentUser.monthlyBudget || 0;
    
    const subject = `Backpack Optimizer - Expense Report - ${new Date().toLocaleDateString('en-IN')}`;
    const body = `Hello!\n\nHere's my detailed expense summary from Backpack Optimizer:\n\n📊 EXPENSE OVERVIEW:\n• Total Expenses Tracked: ${userExpenses.length}\n• Total Amount Spent: ₹${totalSpent.toLocaleString('en-IN')}\n• Monthly Budget: ₹${budgetAmount.toLocaleString('en-IN')}\n• Budget Remaining: ₹${(budgetAmount - totalSpent).toLocaleString('en-IN')}\n• Budget Utilization: ${budgetAmount > 0 ? ((totalSpent/budgetAmount)*100).toFixed(1) : '0'}%\n\n🎓 STUDENT INFO:\n• Name: ${currentUser.fullName || 'Student'}\n• Registration: ${currentUser.regNumber || 'Not provided'}\n• University: Christ University\n• Course: BCA\n• Location: Bangalore\n\n📈 FINANCIAL ANALYSIS:\n${totalSpent < budgetAmount * 0.5 ? 'Excellent financial discipline! Well on track with savings goals.' : totalSpent < budgetAmount * 0.8 ? 'Good budget management with healthy spending patterns.' : 'Need to monitor spending more carefully to stay within budget.'}\n\nI'm using Backpack Optimizer to maintain smart financial habits and track my spending patterns effectively.\n\nBest regards,\n${currentUser.fullName || 'Student'}\n\n---\nGenerated by Backpack Optimizer\nAI-Powered Financial Management Platform`;
    
    const mailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailUrl;
    
    showFlashMessage('📧 Email client opened! Your detailed expense report is ready to send.');
}

// Utility functions
function getCategoryIcon(category) {
    const icons = {
        food: '🍕',
        transport: '🚗',
        entertainment: '🎬',
        education: '📚',
        shopping: '🛍️',
        clothing: '👕',
        other: '🔄'
    };
    return icons[category] || '🔄';
}

function getMoodIcon(mood) {
    const icons = {
        happy: '😊',
        sad: '😢',
        excited: '🤩',
        neutral: '😐',
        regretful: '😔'
    };
    return icons[mood] || '😐';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays === 0) return 'Today';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays/7)} weeks ago`;

    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function animateValue(elementId, start, end, duration, prefix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const range = end - start;
    const startTime = Date.now();
    
    const updateValue = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + (range * progress);
        element.textContent = prefix + Math.round(current).toLocaleString('en-IN');
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    };
    
    updateValue();
}

function showFlashMessage(message, type = 'success') {
    const existingFlash = document.querySelector('.flash-message');
    if (existingFlash) {
        existingFlash.remove();
    }

    const flash = document.createElement('div');
    flash.className = 'flash-message';
    if (type === 'error') {
        flash.style.borderLeftColor = 'var(--danger-red)';
    }
    
    flash.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <span style="font-size: 28px;">${type === 'success' ? '✅' : '❌'}</span>
            <span style="flex: 1;">${message}</span>
            <span onclick="this.parentElement.parentElement.remove()" style="cursor: pointer; font-size: 24px; font-weight: bold; opacity: 0.7; transition: opacity 0.3s;">&times;</span>
        </div>
    `;
    
    document.body.appendChild(flash);
    
    setTimeout(() => {
        if (flash.parentNode) {
            flash.style.animation = 'slideOutRight 0.5s ease forwards';
            setTimeout(() => flash.remove(), 500);
        }
    }, 6000);
}

function logout() {
    if (confirm(`Are you sure you want to logout, ${currentUser.fullName || 'Student'}?`)) {
        localStorage.removeItem('currentUser');
        showFlashMessage('Logged out successfully! See you soon! 👋');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// ✅ CLEAN INITIALIZATION - NO SAMPLE DATA
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎒 Expenses page loading with CLEAN user data...');
    
    updateUserProfile();
    
    // ✅ NO PREDEFINED EXPENSES - Start with completely clean data
    filterExpenses();
    
    console.log('✅ Expenses page loaded successfully!');
    console.log('✅ No sample expenses - completely clean start');
    console.log('✅ Roll number shows actual user data:', currentUser.regNumber);
});

// Export functions for global access
window.filterExpenses = filterExpenses;
window.deleteExpense = deleteExpense;
window.exportToCSV = exportToCSV;
window.exportToPDF = exportToPDF;
window.shareViaEmail = shareViaEmail;
window.shareViaWhatsApp = shareViaWhatsApp;
window.logout = logout;

console.log('🎯 Expenses JavaScript Module Loaded Successfully!');
