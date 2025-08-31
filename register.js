// Enhanced Registration System with Improved Validations
let profileImageBase64 = '';

// State and City Mapping for Logical Selection
const locationData = {
    'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum'],
    'Delhi': ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Vellore'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Pilani'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nashik', 'Aurangabad', 'Nagpur'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
    'Andhra Pradesh': ['Hyderabad', 'Vijayawada', 'Visakhapatnam', 'Guntur', 'Tirupati'],
    'Other': ['Other City']
};

// University/Campus mapping based on cities
const universityData = {
    'Bangalore': [
        {value: 'CHRIST_BLR', text: '🌟 Christ University Bangalore'},
        {value: 'BU_BLR', text: '🎓 Bangalore University'},
        {value: 'IISC_BLR', text: '🔬 IISc Bangalore'}
    ],
    'New Delhi': [
        {value: 'DU_DELHI', text: '🎯 Delhi University'},
        {value: 'IIT_DEL', text: '🔬 IIT Delhi'},
        {value: 'JNU_DEL', text: '📚 JNU Delhi'}
    ],
    'Chennai': [
        {value: 'ANNA_CHE', text: '⚙️ Anna University'},
        {value: 'IIT_CHE', text: '🚀 IIT Madras'}
    ],
    'Vellore': [
        {value: 'VIT_VEL', text: '⚡ VIT Vellore'}
    ],
    'Pilani': [
        {value: 'BITS_PIL', text: '💎 BITS Pilani'}
    ],
    'Mumbai': [
        {value: 'IIT_BOM', text: '🚀 IIT Bombay'},
        {value: 'MU_MUM', text: '🏛️ Mumbai University'}
    ],
    'Pune': [
        {value: 'PUNE_UNI', text: '🎓 University of Pune'},
        {value: 'VIT_PUN', text: '⚡ VIT Pune'}
    ],
    'Mysore': [
        {value: 'UOM_MYS', text: '🏛️ University of Mysore'}
    ],
    'Other City': [
        {value: 'OTHER_UNI', text: '🔄 Other University'}
    ]
};

// Image handling functions
// Fixed Image handling functions
function chooseFromFiles() {
    document.getElementById('fileInput').click();
}

function captureFromCamera() {
    // Clear any previous file selection
    document.getElementById('cameraInput').value = '';
    document.getElementById('cameraInput').click();
}

function previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Enhanced file validation
    if (file.size > 5 * 1024 * 1024) {
        showFlashMessage('📸 Image size must be less than 5MB! Please choose a smaller image.', 'error');
        event.target.value = '';
        return;
    }

    if (!file.type.startsWith('image/')) {
        showFlashMessage('📸 Please select a valid image file (JPG, PNG, etc.)', 'error');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        profileImageBase64 = e.target.result;
        
        const preview = document.getElementById('imagePreview');
        preview.src = profileImageBase64;
        preview.style.display = 'block';
        
        // Show different message based on source
        if (event.target.id === 'cameraInput') {
            showFlashMessage('📷 Photo captured successfully! Looking great!', 'success');
        } else {
            showFlashMessage('📸 Profile picture uploaded successfully! Looking great!', 'success');
        }
    };
    
    reader.onerror = function() {
        showFlashMessage('❌ Error reading the image file. Please try again.', 'error');
    };
    
    reader.readAsDataURL(file);
}


// Enhanced password validation
function validatePassword(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const score = Object.values(requirements).filter(Boolean).length;
    
    return {
        score: score,
        requirements: requirements,
        isValid: score >= 4
    };
}

function updatePasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthDiv = document.getElementById('passwordStrength');
    
    if (!password) {
        strengthDiv.className = 'password-strength';
        return;
    }
    
    const validation = validatePassword(password);
    
    if (validation.score < 3) {
        strengthDiv.className = 'password-strength weak';
    } else if (validation.score < 4) {
        strengthDiv.className = 'password-strength medium';
    } else {
        strengthDiv.className = 'password-strength strong';
    }
}

function updatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const matchDiv = document.getElementById('passwordMatch');
    const confirmField = document.getElementById('confirmPassword');
    
    if (!confirmPassword) {
        matchDiv.textContent = '';
        matchDiv.className = 'field-hint';
        confirmField.className = 'form-control';
        return;
    }
    
    if (password === confirmPassword) {
        matchDiv.textContent = '✅ Passwords match!';
        matchDiv.className = 'field-hint success';
        confirmField.className = 'form-control valid';
    } else {
        matchDiv.textContent = '❌ Passwords do not match';
        matchDiv.className = 'field-hint error';
        confirmField.className = 'form-control invalid';
    }
}

// State and City selection logic
function populateCities() {
    const stateSelect = document.getElementById('state');
    const citySelect = document.getElementById('city');
    const campusSelect = document.getElementById('campus');
    
    const selectedState = stateSelect.value;
    
    // Clear and disable city and campus
    citySelect.innerHTML = '<option value="">Select City</option>';
    campusSelect.innerHTML = '<option value="">Select City First</option>';
    campusSelect.disabled = true;
    
    if (!selectedState) {
        citySelect.disabled = true;
        citySelect.innerHTML = '<option value="">Select State First</option>';
        return;
    }
    
    citySelect.disabled = false;
    const cities = locationData[selectedState] || [];
    
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

function populateUniversities() {
    const citySelect = document.getElementById('city');
    const campusSelect = document.getElementById('campus');
    
    const selectedCity = citySelect.value;
    
    campusSelect.innerHTML = '<option value="">Select Campus</option>';
    
    if (!selectedCity) {
        campusSelect.disabled = true;
        campusSelect.innerHTML = '<option value="">Select City First</option>';
        return;
    }
    
    campusSelect.disabled = false;
    const universities = universityData[selectedCity] || [{value: 'OTHER_UNI', text: '🔄 Other University'}];
    
    universities.forEach(uni => {
        const option = document.createElement('option');
        option.value = uni.value;
        option.textContent = uni.text;
        campusSelect.appendChild(option);
    });
}

// Enhanced campus-specific information
function updateCampusInfo() {
    const campus = document.getElementById('campus').value;
    const campusInfo = document.getElementById('campusSpecificInfo');
    const benefitsList = document.getElementById('campusBenefitsList');
    
    if (!campus) {
        campusInfo.style.display = 'none';
        return;
    }

    const campusBenefits = {
        'CHRIST_BLR': [
            '🌟 Access to Christ University marketplace',
            '🏢 Bangalore PG and housing listings',
            '🍕 Campus cafeteria meal plans',
            '🚌 City transport optimization'
        ],
        'DU_DELHI': [
            '🎯 Delhi University student network',
            '🏛️ Central Delhi accommodation',
            '🚇 Metro-based transport planning',
            '📚 DU-specific study materials'
        ],
        'VIT_VEL': [
            '⚡ VIT campus marketplace',
            '🏫 Vellore hostel management',
            '🔧 Engineering-specific budgeting',
            '🌮 Campus food court optimization'
        ],
        'BITS_PIL': [
            '💎 BITS Pilani premium network',
            '🏜️ Rajasthan accommodation',
            '📊 Engineering expense tracking',
            '🎓 Campus placement preparation'
        ],
        'IIT_BOM': [
            '🚀 IIT Bombay elite network',
            '🏙️ Mumbai premium housing',
            '🔬 Research funding assistance',
            '💼 Corporate internship programs'
        ],
        'IIT_DEL': [
            '🔬 IIT Delhi research community',
            '🏛️ Delhi NCR networking',
            '📊 Technical project funding',
            '🎯 Startup incubation support'
        ]
    };

    const benefits = campusBenefits[campus] || ['🔄 General campus features', '📊 Standard analytics', '💰 Basic budgeting', '🎯 Goal tracking'];
    
    benefitsList.innerHTML = benefits.map(benefit => 
        `<div class="campus-benefit">${benefit}</div>`
    ).join('');
    
    campusInfo.style.display = 'block';
}

// Enhanced form validation
function validateForm() {
    const requiredFields = [
        'fullName', 'username', 'email', 'phone', 'password', 'confirmPassword',
        'state', 'city', 'campus', 'course', 'year', 'semester', 'rollNumber',
        'accommodation', 'budget'
    ];
    
    let isValid = true;
    const errors = [];
    
    // Check required fields
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        
        if (!value) {
            field.classList.add('invalid');
            isValid = false;
            errors.push(`${field.previousElementSibling.textContent} is required`);
        } else {
            field.classList.remove('invalid');
            field.classList.add('valid');
        }
    });
    
    // Enhanced email validation
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        document.getElementById('email').classList.add('invalid');
        isValid = false;
        errors.push('Please enter a valid email address');
    }
    
    // Enhanced phone validation (Indian format)
    const phone = document.getElementById('phone').value.trim();
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    if (phone && !phoneRegex.test(phone.replace(/\s|-/g, ''))) {
        document.getElementById('phone').classList.add('invalid');
        isValid = false;
        errors.push('Please enter a valid Indian phone number');
    }
    
    // Password validation
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        document.getElementById('password').classList.add('invalid');
        isValid = false;
        errors.push('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
    }
    
    if (password !== confirmPassword) {
        document.getElementById('confirmPassword').classList.add('invalid');
        isValid = false;
        errors.push('Passwords do not match');
    }
    
    // Username validation
    const username = document.getElementById('username').value.trim();
    const usernameRegex = /^[a-z0-9_]+$/;
    if (username && !usernameRegex.test(username)) {
        document.getElementById('username').classList.add('invalid');
        isValid = false;
        errors.push('Username can only contain lowercase letters, numbers, and underscore');
    }
    
    if (errors.length > 0) {
        showFlashMessage('❌ ' + errors[0], 'error');
    }
    
    return isValid;
}

// Registration handling
function handleRegister(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Collect all form data
    const formData = {
        // Basic Information
        fullName: document.getElementById('fullName').value.trim(),
        username: document.getElementById('username').value.toLowerCase().trim(),
        email: document.getElementById('email').value.toLowerCase().trim(),
        phone: document.getElementById('phone').value.trim(),
        password: document.getElementById('password').value,
        
        // Academic Information  
        state: document.getElementById('state').value,
        city: document.getElementById('city').value,
        campus: document.getElementById('campus').value,
        course: document.getElementById('course').value,
        year: document.getElementById('year').value,
        semester: document.getElementById('semester').value,
        regNumber: document.getElementById('rollNumber').value.trim(),
        
        // Personal Details
        accommodation: document.getElementById('accommodation').value,
        familyIncome: document.getElementById('familyIncome').value,
        
        // Financial Planning
        monthlyBudget: parseFloat(document.getElementById('budget').value),
        savingsGoal: parseFloat(document.getElementById('savingsGoal').value) || 0,
        careerGoals: document.getElementById('careerGoals').value.trim(),
        
        // System Data
        profileImage: profileImageBase64,
        id: 'user_' + Date.now(),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };
    
    // Check for existing users
    let users = JSON.parse(localStorage.getItem('backpack_users') || '[]');
    if (users.find(u => u.username === formData.username || u.email === formData.email)) {
        showFlashMessage('❌ Account already exists! Please use different credentials or sign in.', 'error');
        return;
    }
    
    // Save new user with real data
    users.push(formData);
    localStorage.setItem('backpack_users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(formData));
    
    // Initialize clean data structures
    initializeCleanUserData(formData.id);
    
    // Success message with personalization
    const campusNames = {
        'CHRIST_BLR': 'Christ University',
        'DU_DELHI': 'Delhi University',
        'VIT_VEL': 'VIT Vellore',
        'BITS_PIL': 'BITS Pilani',
        'IIT_BOM': 'IIT Bombay',
        'IIT_DEL': 'IIT Delhi'
    };
    
    const campusName = campusNames[formData.campus] || 'your university';
    showFlashMessage(`🎉 Welcome to Backpack Optimizer, ${formData.fullName}! Your ${campusName} account with roll number ${formData.regNumber} is ready!`, 'success');
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 2000);
}

// Initialize clean data structures
function initializeCleanUserData(userId) {
    // Initialize EMPTY arrays for user data
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

// Enhanced flash message system
function showFlashMessage(message, type = 'success') {
    // Remove existing flash messages
    const existingFlashes = document.querySelectorAll('.flash-message');
    existingFlashes.forEach(flash => flash.remove());
    
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

// Enhanced UX features and event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Auto-focus first field
    document.getElementById('fullName').focus();
    
    // Form submission
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // Image preview handlers
    document.getElementById('fileInput').addEventListener('change', previewImage);
    document.getElementById('cameraInput').addEventListener('change', previewImage);
    
    // Password validation
    document.getElementById('password').addEventListener('input', updatePasswordStrength);
    document.getElementById('confirmPassword').addEventListener('input', updatePasswordMatch);
    
    // Username validation - only allow letters, numbers, underscore
    document.getElementById('username').addEventListener('input', function() {
        this.value = this.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    });
    
    // State and city selection
    document.getElementById('state').addEventListener('change', populateCities);
    document.getElementById('city').addEventListener('change', populateUniversities);
    document.getElementById('campus').addEventListener('change', updateCampusInfo);
    
    // Phone number formatting
    document.getElementById('phone').addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.startsWith('91')) {
            value = '+91 ' + value.slice(2);
        } else if (value.length === 10) {
            value = '+91 ' + value;
        }
        this.value = value;
    });
    
    // Real-time validation feedback
    const formFields = document.querySelectorAll('.form-control');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value.trim()) {
                this.classList.remove('invalid');
                this.classList.add('valid');
            }
        });
    });
    
    console.log('🎒 Enhanced Registration System Ready');
    console.log('✅ State-City mapping implemented');
    console.log('✅ Password strength validation added');
    console.log('✅ Real-time form validation enabled');
});

// Mobile sidebar functionality
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('mobileMenuToggle');
    const overlay = document.getElementById('mobileOverlay');
    
    if (!sidebar || !menuToggle || !overlay) return;
    
    const isOpen = sidebar.classList.contains('mobile-open');
    
    if (isOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('mobileMenuToggle');
    const overlay = document.getElementById('mobileOverlay');
    
    if (!sidebar || !menuToggle || !overlay) return;
    
    sidebar.classList.add('mobile-open');
    menuToggle.classList.add('active');
    overlay.classList.add('show');
    
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('mobileMenuToggle');
    const overlay = document.getElementById('mobileOverlay');
    
    if (!sidebar || !menuToggle || !overlay) return;
    
    sidebar.classList.remove('mobile-open');
    menuToggle.classList.remove('active');
    overlay.classList.remove('show');
    
    document.body.style.overflow = 'auto';
}
