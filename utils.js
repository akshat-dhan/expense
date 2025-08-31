/* =================================
   BACKPACK OPTIMIZER - UTILITIES
   ================================= */

// Flash Message System
function showFlashMessage(message, type = 'success') {
    // Remove existing flash message
    const existingFlash = document.querySelector('.flash-message');
    if (existingFlash) {
        existingFlash.remove();
    }

    const flash = document.createElement('div');
    flash.className = 'flash-message';
    if (type === 'error') flash.classList.add('flash-error');
    
    flash.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span>${message}</span>
            <span onclick="this.parentElement.parentElement.remove()" 
                  style="cursor:pointer;font-size:18px;font-weight:bold;margin-left:auto;">&times;</span>
        </div>
    `;
    
    document.body.appendChild(flash);
    
    setTimeout(() => {
        if (flash.parentNode) {
            flash.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => flash.remove(), 300);
        }
    }, type === 'error' ? 8000 : 6000);
}

// Initialize User Data Structure
function initializeUserData(userId) {
    // Initialize empty arrays for user data
    const expenses = JSON.parse(localStorage.getItem('backpack_expenses') || '[]');
    const wishlist = JSON.parse(localStorage.getItem('backpack_wishlist') || '[]');
    const marketplace = JSON.parse(localStorage.getItem('backpack_marketplace') || '[]');
    const housing = JSON.parse(localStorage.getItem('backpack_housing') || '[]');
    
    // Only initialize if arrays don't exist yet - NO sample data added
    if (!localStorage.getItem('backpack_expenses')) {
        localStorage.setItem('backpack_expenses', JSON.stringify([]));
    }
    if (!localStorage.getItem('backpack_wishlist')) {
        localStorage.setItem('backpack_wishlist', JSON.stringify([]));
    }
    if (!localStorage.getItem('backpack_marketplace')) {
        localStorage.setItem('backpack_marketplace', JSON.stringify([]));
    }
    if (!localStorage.getItem('backpack_housing')) {
        localStorage.setItem('backpack_housing', JSON.stringify([]));
    }
    
    console.log('✅ Clean data structures initialized for user:', userId);
}

// Console Initialization Messages
console.log('🎒 Backpack Optimizer - Utils Loaded');
console.log('✅ Fixed: No hardcoded roll numbers');
console.log('✅ Fixed: No predefined user data');
console.log('✅ Fixed: Clean start for all modules');
console.log('✅ Ready for real user registration and authentication');
