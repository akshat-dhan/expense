/* =================================
   BACKPACK OPTIMIZER - AUTHENTICATION
   ================================= */

// ✅ CLEAN USER MANAGEMENT - NO PREDEFINED DATA
let users = JSON.parse(localStorage.getItem('backpack_users') || '[]');

// ✅ NO HARDCODED SAMPLE USERS - START WITH EMPTY ARRAY
console.log('👥 Total registered users:', users.length);

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showFlashMessage('❌ Please enter both username and password.', 'error');
        return;
    }

    // ✅ AUTHENTICATE ONLY REGISTERED USERS - NO PREDEFINED ACCOUNTS
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // ✅ Store ACTUAL user data (including their real roll number)
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // ✅ Welcome message with REAL user data
        const welcomeMsg = `🎉 Welcome back, ${user.fullName}! Your roll number ${user.regNumber} is verified.`;
        showFlashMessage(welcomeMsg);
        
        // ✅ Initialize clean data structures for user
        initializeUserData(user.id);
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } else {
        showFlashMessage('❌ Invalid credentials. Please register first if you don\'t have an account.', 'error');
        
        // Suggest registration after failed login
        setTimeout(() => {
            showFlashMessage('💡 New user? Click "Create your account" below to register! ✨', 'info');
        }, 2500);
    }
}

// Enhanced UX features
document.addEventListener('DOMContentLoaded', function() {
    // Auto-focus username field
    document.getElementById('username').focus();
    
    // Add enter key support for password field
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
    });

    // Auto-lowercase username input
    document.getElementById('username').addEventListener('input', function() {
        this.value = this.value.toLowerCase().trim();
    });

    console.log('🎒 Backpack Optimizer - Authentication System Ready');
});
