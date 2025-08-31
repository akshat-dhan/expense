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

// ✅ CLEAN APPLICATION STATE - NO PREDEFINED USER DATA
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
let expenses = JSON.parse(localStorage.getItem('backpack_expenses') || '[]');
let wishlist = JSON.parse(localStorage.getItem('backpack_wishlist') || '[]');

// ✅ CHECK AUTHENTICATION - REDIRECT IF NOT LOGGED IN
if (!currentUser) {
    window.location.href = 'index.html';
    throw new Error('User not authenticated');
}

// ✅ REAL USER PROFILE UPDATE - USES ACTUAL USER DATA
function updateUserProfile() {
    const campusNames = {
        'CHRIST_BLR': 'Christ University - BCA',
        'DU_DELHI': 'Delhi University',
        'VIT_VEL': 'VIT Vellore', 
        'BITS_PIL': 'BITS Pilani',
        'IIT_BOM': 'IIT Bombay',
        'IIT_DEL': 'IIT Delhi'
    };

    // Update sidebar
    document.getElementById('userName').textContent = currentUser.fullName || 'Student';
    document.getElementById('userCampus').textContent = campusNames[currentUser.campus] || currentUser.campus || 'University';
    document.getElementById('userRegNumber').textContent = `Reg: ${currentUser.regNumber || 'Not provided'}`;

    // Update main profile display
    document.getElementById('profileDisplayName').textContent = currentUser.fullName || 'Student';
    document.getElementById('profileDisplayCampus').textContent = campusNames[currentUser.campus] || currentUser.campus || 'University';
    document.getElementById('profileDisplayRegNumber').textContent = `Register No: ${currentUser.regNumber || 'Not provided'}`;
    document.getElementById('profileDisplayEmail').textContent = `📧 ${currentUser.email || 'No email provided'}`;
    
    // Display profile images
    displayProfileImages();
    
    // Update personality
    const personality = determinePersonality();
    document.getElementById('profilePersonality').textContent = personality;
    
    // Update all statistics
    updateProfileStats();
    updateProgressTracking();

    console.log('✅ User Profile Updated with REAL data:', {
        name: currentUser.fullName,
        regNumber: currentUser.regNumber, // This shows actual user input
        campus: currentUser.campus,
        email: currentUser.email
    });
}

// Enhanced Profile Image Functions
function showImageOptions() {
    document.getElementById('imageModal').style.display = 'flex';
}

function hideImageOptions() {
    document.getElementById('imageModal').style.display = 'none';
}

function chooseFromFiles() {
    document.getElementById('fileInput').click();
}

function captureFromCamera() {
    document.getElementById('cameraInput').click();
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Enhanced validation
    if (file.size > 5 * 1024 * 1024) {
        showFlashMessage('📸 Image size must be less than 5MB! Please choose a smaller image.', 'error');
        event.target.value = '';
        return;
    }

    if (!file.type.startsWith('image/')) {
        showFlashMessage('📸 Please select a valid image file (JPG, PNG, WebP)', 'error');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageBase64 = e.target.result;
        
        // Update current user with new image
        currentUser.profileImage = imageBase64;
        
        // Update in users array if exists
        let users = JSON.parse(localStorage.getItem('backpack_users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].profileImage = imageBase64;
            localStorage.setItem('backpack_users', JSON.stringify(users));
        }
        
        // Update current user storage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update UI immediately with smooth animation
        displayProfileImages();
        
        // Hide modal
        hideImageOptions();
        
        showFlashMessage('📸 Profile picture updated successfully! Looking great! ✨');
    };
    
    reader.onerror = function() {
        showFlashMessage('📸 Error reading the image file. Please try again.', 'error');
    };
    
    reader.readAsDataURL(file);
}

function displayProfileImages() {
    const profileAvatarLarge = document.getElementById('profileAvatarLarge');
    const sidebarAvatar = document.getElementById('userAvatar');
    
    if (currentUser.profileImage && currentUser.profileImage.length > 100) {
        // Display uploaded image with smooth transition
        profileAvatarLarge.innerHTML = `<img src="${currentUser.profileImage}" class="profile-image" alt="Profile Picture">`;
        sidebarAvatar.innerHTML = `<img src="${currentUser.profileImage}" class="sidebar-profile-image" alt="Profile Picture">`;
    } else {
        // Display initials
        const initials = (currentUser.fullName || currentUser.username || 'S')[0].toUpperCase();
        profileAvatarLarge.textContent = initials;
        sidebarAvatar.textContent = initials;
    }
}

function updateProfileStats() {
    const userExpenses = expenses.filter(e => e.userId === currentUser.id);
    const totalCount = userExpenses.length;
    const totalSpent = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const avgPerExpense = totalCount > 0 ? totalSpent / totalCount : 0;
    
    // Find top category
    const categories = {};
    userExpenses.forEach(exp => {
        categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
    });
    const topCategory = Object.keys(categories).reduce((a, b) => 
        categories[a] > categories[b] ? a : b, 'none'
    );
    
    // Calculate budget utilization
    const budgetUsed = (totalSpent / (currentUser.monthlyBudget || 20000)) * 100;
    const remainingPercentage = Math.max(0, 100 - budgetUsed);
    
    // Calculate streak (simplified)
    const streak = Math.min(totalCount * 2, 30);
    
    // Animate values
    animateValue('profileTotalExpenses', 0, totalCount, 1000);
    animateValue('profileSavingsRate', 0, Math.round(remainingPercentage), 1500, '', '%');
    animateValue('profileStreak', 0, streak, 1200);
    
    document.getElementById('profileAvgDaily').textContent = '₹' + Math.round(avgPerExpense).toLocaleString('en-IN');
    document.getElementById('profileTopCategory').textContent = 
        topCategory !== 'none' ? getCategoryIcon(topCategory) + ' ' + getCategoryLabel(topCategory) : '🔄 None';
}

function updateProgressTracking() {
    const userExpenses = expenses.filter(e => e.userId === currentUser.id);
    const totalSpent = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budget = currentUser.monthlyBudget || 20000;
    
    const monthlyProgress = Math.min(100, (totalSpent / budget) * 100);
    const monthlySavings = Math.max(0, budget - totalSpent);
    const efficiencyScore = Math.max(0, 100 - monthlyProgress);
    
    const userWishlist = wishlist.filter(w => w.userId === currentUser.id);
    const completedGoals = userWishlist.filter(w => w.savedAmount >= w.targetAmount).length;
    const totalGoals = userWishlist.length;
    
    // Animate progress values
    animateValue('monthlyProgress', 0, Math.round(monthlyProgress), 1500, '', '%');
    animateValue('efficiencyScore', 0, Math.round(efficiencyScore), 1800, '', '%');
    
    document.getElementById('savingsGoal').textContent = '₹' + monthlySavings.toLocaleString('en-IN');
    document.getElementById('goalProgress').textContent = `${completedGoals}/${Math.max(totalGoals, 3)}`;
}

function showEditForm() {
    document.getElementById('editProfileCard').style.display = 'block';
    
    // Populate form with current data
    document.getElementById('editUsername').value = currentUser.fullName || currentUser.username || '';
    document.getElementById('editEmail').value = currentUser.email || '';
    document.getElementById('editBudget').value = currentUser.monthlyBudget || 20000;
    document.getElementById('editCampus').value = currentUser.campus || 'CHRIST_BLR';
    document.getElementById('editPhone').value = currentUser.phone || '';
    document.getElementById('editCourse').value = currentUser.course || 'BCA';
    
    // Smooth scroll to form
    document.getElementById('editProfileCard').scrollIntoView({ behavior: 'smooth' });
}

function hideEditForm() {
    document.getElementById('editProfileCard').style.display = 'none';
}

function updateProfile(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('editUsername').value;
    const email = document.getElementById('editEmail').value;
    const budget = parseFloat(document.getElementById('editBudget').value);
    const campus = document.getElementById('editCampus').value;
    const phone = document.getElementById('editPhone').value;
    const course = document.getElementById('editCourse').value;
    
    // Update current user
    currentUser.fullName = fullName;
    currentUser.username = fullName.toLowerCase().replace(' ', '_');
    currentUser.email = email;
    currentUser.monthlyBudget = budget;
    currentUser.campus = campus;
    currentUser.phone = phone;
    currentUser.course = course;
    
    // Update in users array if exists
    let users = JSON.parse(localStorage.getItem('backpack_users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = { ...currentUser };
        localStorage.setItem('backpack_users', JSON.stringify(users));
    }
    
    // Update current user storage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Refresh UI
    updateUserProfile();
    hideEditForm();
    showFlashMessage('✨ Profile updated successfully! Your information looks great! 🎉');
}

function exportData() {
    const userExpenses = expenses.filter(e => e.userId === currentUser.id);
    const userWishlist = wishlist.filter(w => w.userId === currentUser.id);
    
    if (userExpenses.length === 0 && userWishlist.length === 0) {
        showFlashMessage('📊 No data to export yet! Start tracking expenses or add goals first.', 'warning');
        return;
    }
    
    // Create comprehensive CSV export
    let csv = 'Type,Date,Description,Amount,Category,Mood,Notes\n';
    
    // Add expenses
    userExpenses.forEach(exp => {
        csv += `Expense,${new Date(exp.date).toLocaleDateString()},${exp.description},${exp.amount},${exp.category},${exp.mood || 'N/A'},${exp.notes || 'N/A'}\n`;
    });
    
    // Add wishlist goals
    userWishlist.forEach(wish => {
        csv += `Goal,${new Date(wish.createdAt).toLocaleDateString()},${wish.name},${wish.targetAmount},${wish.category},${wish.priority},Saved: ₹${wish.savedAmount}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backpack_optimizer_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showFlashMessage('📥 Complete data exported successfully! Check your downloads folder! 📊');
}

function backupData() {
    const backupData = {
        user: currentUser,
        expenses: expenses.filter(e => e.userId === currentUser.id),
        wishlist: wishlist.filter(w => w.userId === currentUser.id),
        exportDate: new Date().toISOString(),
        version: '2.0'
    };
    
    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backpack_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showFlashMessage('☁️ Backup created successfully! Your data is safe! 🔒');
}

function showThemeOptions() {
    showFlashMessage('🌈 Theme customization coming soon! Get ready for personalized colors and layouts! 🎨', 'info');
}

function manageNotifications() {
    showFlashMessage('🔔 Notification settings coming soon! Stay tuned for smart alerts and reminders! 📱', 'info');
}

function confirmDataReset() {
    if (confirm('⚠️ Are you absolutely sure you want to reset ALL your data?\n\nThis will permanently delete:\n• All expenses\n• All goals\n• All achievements\n• Profile settings\n\nThis action cannot be undone!')) {
        if (confirm('🔴 Final confirmation: This will erase everything and cannot be recovered. Are you sure?')) {
            resetAllData();
        }
    }
}

function resetAllData() {
    // Remove all user-specific data
    localStorage.removeItem('backpack_expenses');
    localStorage.removeItem('backpack_wishlist');
    localStorage.removeItem('backpack_marketplace');
    localStorage.removeItem('backpack_housing');
    
    // Reset current user but keep basic info
    const basicInfo = {
        id: currentUser.id,
        username: currentUser.username,
        fullName: currentUser.fullName,
        campus: currentUser.campus,
        course: currentUser.course,
        regNumber: currentUser.regNumber,
        email: currentUser.email,
        monthlyBudget: 20000,
        profileImage: null,
        joinDate: new Date().toISOString()
    };
    currentUser = basicInfo;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Reset arrays
    expenses = [];
    wishlist = [];
    
    showFlashMessage('🗑️ All data has been reset successfully! Welcome to your fresh start! 🌱');
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 2000);
}

function determinePersonality() {
    const userExpenses = expenses.filter(e => e.userId === currentUser.id);
    const totalSpent = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budgetRatio = totalSpent / (currentUser.monthlyBudget || 20000);
    
    if (userExpenses.length === 0) return '🌱 Financial Newbie';
    if (budgetRatio < 0.2) return '💎 Ultimate Super Saver';
    if (budgetRatio < 0.4) return '🎯 Smart Money Manager';
    if (budgetRatio < 0.6) return '💰 Balanced Budgeter';
    if (budgetRatio < 0.8) return '🔥 Active Spender';
    if (budgetRatio < 1.0) return '⚡ Budget Maximizer';
    return '🎢 Financial Adventurer';
}

function getCategoryIcon(category) {
    const icons = {
        food: '🍕',
        transport: '🚗',
        entertainment: '🎬',
        education: '📚',
        shopping: '🛍️',
        health: '🏥',
        other: '🔄'
    };
    return icons[category] || '🔄';
}

function getCategoryLabel(category) {
    const labels = {
        food: 'Food',
        transport: 'Transport',
        entertainment: 'Entertainment',
        education: 'Education',
        shopping: 'Shopping',
        health: 'Healthcare',
        other: 'Other'
    };
    return labels[category] || 'Other';
}

// Enhanced value animation
function animateValue(elementId, start, end, duration, prefix = '', suffix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const range = end - start;
    const startTime = Date.now();
    
    const updateValue = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + (range * progress * progress); // Quadratic easing
        
        element.textContent = prefix + Math.round(current).toLocaleString('en-IN') + suffix;
        
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
    } else if (type === 'warning') {
        flash.style.borderLeftColor = 'var(--warning-orange)';
    } else if (type === 'info') {
        flash.style.borderLeftColor = 'var(--info-cyan)';
    }
    
    flash.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <span style="font-size: 28px;">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
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
    if (confirm(`Are you sure you want to logout, ${currentUser.fullName || 'Student'}?\n\nAll your data will be preserved for when you return! 👋`)) {
        localStorage.removeItem('currentUser');
        showFlashMessage('👋 Logged out successfully! Your financial journey continues when you return! See you soon! 🎯');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        hideImageOptions();
    }
}

// ✅ CLEAN INITIALIZATION - NO PREDEFINED USER DATA
document.addEventListener('DOMContentLoaded', function() {
    console.log('👤 Profile Dashboard Loading with REAL user data only...');
    
    updateUserProfile();
    
    console.log('✅ Profile Dashboard loaded successfully!');
    console.log('✅ NO predefined user data - uses actual user info only');
    console.log('✅ Real registration number:', currentUser.regNumber);
    console.log('✅ Professional Image Upload: ACTIVE');
    console.log('✅ Achievement System: ENABLED');
    console.log('✅ Progress Tracking: UPDATED');
});

// Export functions for global access
window.showImageOptions = showImageOptions;
window.hideImageOptions = hideImageOptions;
window.chooseFromFiles = chooseFromFiles;
window.captureFromCamera = captureFromCamera;
window.handleImageUpload = handleImageUpload;
window.showEditForm = showEditForm;
window.hideEditForm = hideEditForm;
window.updateProfile = updateProfile;
window.exportData = exportData;
window.backupData = backupData;
window.showThemeOptions = showThemeOptions;
window.manageNotifications = manageNotifications;
window.confirmDataReset = confirmDataReset;
window.logout = logout;

console.log('🎯 Profile JavaScript Module Loaded Successfully!');
