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

// ✅ CLEAN APPLICATION STATE WITH AUTHENTICATION CHECK
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
let marketplaceItems = JSON.parse(localStorage.getItem('backpack_marketplace') || '[]');
let uploadedImages = [];

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
    
    // Update campus badge
    const campusBadgeNames = {
        'CHRIST_BLR': 'Christ University Exclusive',
        'DU_DELHI': 'Delhi University Exclusive',
        'VIT_VEL': 'VIT Vellore Exclusive',
        'BITS_PIL': 'BITS Pilani Exclusive',
        'IIT_BOM': 'IIT Bombay Exclusive',
        'IIT_DEL': 'IIT Delhi Exclusive'
    };
    document.getElementById('campusBadge').textContent = `🏛️ ${campusBadgeNames[currentUser.campus] || 'Campus Exclusive'}`;
    
    console.log('✅ User Profile Updated with REAL data:', {
        name: currentUser.fullName,
        regNumber: currentUser.regNumber, // This shows actual user input
        campus: currentUser.campus
    });
}

// Initialize enhanced sample data with campus restriction - KEEP PREDEFINED ITEMS
if (marketplaceItems.filter(item => item.campus === currentUser.campus).length === 0) {
    marketplaceItems = [
        {
            id: Date.now() + 1001,
            sellerId: 'student_999',
            sellerName: "Priya Sharma",
            campus: "CHRIST_BLR",
            course: "MBA",
            title: "MacBook Pro M2 (16GB, 512GB) - Perfect for Coding",
            price: 189900,
            category: "electronics",
            condition: "excellent",
            description: "Barely used MacBook Pro with M2 chip, 16GB RAM, and 512GB SSD. Perfect for programming, design work, and heavy multitasking. Includes original box, charger, and AppleCare+ warranty till Dec 2024. Selling due to company laptop provision.",
            contact: "WhatsApp: +91-9876543210 | Email: priya.sharma@christuniversity.in",
            negotiable: "yes",
            images: [], // In real implementation, these would be base64 or URLs
            views: 127,
            verified: true,
            createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: Date.now() + 1002,
            sellerId: 'student_998',
            sellerName: "Rahul Kumar",
            campus: "CHRIST_BLR",
            course: "BCA",
            title: "Gaming Setup - Chair + Desk + LED Strips",
            price: 8500,
            category: "furniture",
            condition: "good",
            description: "Complete gaming setup including ergonomic gaming chair, spacious desk, and RGB LED strips. Perfect for hostel rooms or apartments. Chair has minor wear but very comfortable. Desk is sturdy with cable management. Moving out of city, need to sell urgently!",
            contact: "WhatsApp: +91-8765432109",
            negotiable: "yes",
            images: [],
            views: 89,
            verified: true,
            createdAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
            id: Date.now() + 1003,
            sellerId: 'student_997',
            sellerName: "Sneha Patel",
            campus: "CHRIST_BLR",
            course: "B.Com",
            title: "Complete BCA Textbooks Bundle - All 3 Years",
            price: 4500,
            category: "books",
            condition: "good",
            description: "Complete collection of BCA textbooks covering all 6 semesters. Includes Programming in C++, Data Structures, Database Management, Software Engineering, Computer Networks, and more. All books have my notes and highlights. Great for new BCA students!",
            contact: "Email: sneha.patel@christuniversity.in",
            negotiable: "no",
            images: [],
            views: 156,
            verified: true,
            createdAt: new Date(Date.now() - 259200000).toISOString()
        },
        {
            id: Date.now() + 1004,
            sellerId: 'student_996',
            sellerName: "Arjun Singh",
            campus: "CHRIST_BLR",
            course: "MCA",
            title: "iPhone 13 Pro Max 256GB - Excellent Condition",
            price: 89999,
            category: "electronics",
            condition: "excellent",
            description: "iPhone 13 Pro Max in pristine condition. Always used with screen protector and case. Battery health at 94%. Includes original box, unused EarPods, charger, and premium leather case worth ₹5000. No scratches or dents. Upgrading to iPhone 15 Pro.",
            contact: "WhatsApp: +91-7654321098 | Email: arjun.singh@mca.christuniversity.in",
            negotiable: "yes",
            images: [],
            views: 203,
            verified: true,
            createdAt: new Date(Date.now() - 345600000).toISOString()
        },
        {
            id: Date.now() + 1005,
            sellerId: 'student_995',
            sellerName: "Ananya Reddy",
            campus: "CHRIST_BLR",
            course: "MBA",
            title: "Royal Enfield Classic 350 - Well Maintained",
            price: 145000,
            category: "vehicles",
            condition: "good",
            description: "2019 Royal Enfield Classic 350 in excellent running condition. Regular servicing done at authorized service center. New tires fitted last month. Insurance valid till March 2024. Perfect for campus commuting and weekend rides. Selling due to relocation abroad for job.",
            contact: "WhatsApp: +91-6543210987",
            negotiable: "yes",
            images: [],
            views: 67,
            verified: true,
            createdAt: new Date(Date.now() - 432000000).toISOString()
        }
    ];
    localStorage.setItem('backpack_marketplace', JSON.stringify(marketplaceItems));
}

// Enhanced statistics calculation
function updateStatistics() {
    const campusItems = marketplaceItems.filter(item => item.campus === currentUser.campus);
    const totalViews = campusItems.reduce((sum, item) => sum + item.views, 0);
    const avgPrice = campusItems.length > 0 ? campusItems.reduce((sum, item) => sum + item.price, 0) / campusItems.length : 0;
    const uniqueSellers = new Set(campusItems.map(item => item.sellerId)).size;

    // Animate values
    animateValue('totalItems', 0, campusItems.length, 1000);
    animateValue('avgPrice', 0, avgPrice, 1500, '₹');
    animateValue('totalSellers', 0, uniqueSellers, 1000);
    animateValue('totalViews', 0, totalViews, 1500);

    document.getElementById('itemCount').textContent = campusItems.length;
}

// Professional Image Upload Handler
function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    const maxFiles = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (files.length > maxFiles) {
        showFlashMessage(`❌ Maximum ${maxFiles} images allowed. Please select fewer images.`, 'error');
        return;
    }

    files.forEach(file => {
        if (file.size > maxSize) {
            showFlashMessage(`❌ Image "${file.name}" is too large. Please use images under 5MB.`, 'error');
            return;
        }

        if (!file.type.startsWith('image/')) {
            showFlashMessage(`❌ "${file.name}" is not a valid image file.`, 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImages.push({
                name: file.name,
                data: e.target.result,
                size: file.size
            });
            updateImagePreview();
        };
        reader.readAsDataURL(file);
    });
}

function updateImagePreview() {
    const container = document.getElementById('imagePreviewContainer');
    const uploadSection = document.getElementById('imageUploadSection');
    
    if (uploadedImages.length > 0) {
        uploadSection.classList.add('has-images');
        uploadSection.querySelector('.upload-text').textContent = `${uploadedImages.length} image(s) selected`;
        uploadSection.querySelector('.upload-subtext').textContent = 'Click to add more images or drag to reorder';
    } else {
        uploadSection.classList.remove('has-images');
        uploadSection.querySelector('.upload-text').textContent = 'Click to Add Product Images';
        uploadSection.querySelector('.upload-subtext').textContent = 'Add up to 5 high-quality photos (JPG, PNG, WebP - Max 5MB each)';
    }

    container.innerHTML = uploadedImages.map((image, index) => `
        <div class="image-preview">
            <img src="${image.data}" alt="Product image ${index + 1}">
            <button class="image-remove" onclick="removeImage(${index})" title="Remove image">×</button>
        </div>
    `).join('');
}

function removeImage(index) {
    uploadedImages.splice(index, 1);
    updateImagePreview();
    showFlashMessage('🗑️ Image removed successfully!');
}

function sellItem(event) {
    event.preventDefault();
    
    const title = document.getElementById('itemTitle').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    const category = document.getElementById('itemCategory').value;
    const condition = document.getElementById('itemCondition').value;
    const description = document.getElementById('itemDescription').value;
    const contact = document.getElementById('itemContact').value;
    const negotiable = document.getElementById('itemNegotiable').value;

    if (uploadedImages.length === 0) {
        showFlashMessage('📸 Please add at least one product image to make your listing more attractive!', 'warning');
        return;
    }

    const item = {
        id: Date.now(),
        sellerId: currentUser.id,
        sellerName: currentUser.fullName || currentUser.username,
        campus: currentUser.campus,
        course: currentUser.course || 'BCA',
        title,
        price,
        category,
        condition,
        description,
        contact,
        negotiable,
        images: [...uploadedImages], // Store images with item
        views: 0,
        verified: true,
        createdAt: new Date().toISOString()
    };

    marketplaceItems.push(item);
    localStorage.setItem('backpack_marketplace', JSON.stringify(marketplaceItems));
    
    updateMarketplace();
    updateStatistics();
    showFlashMessage(`🏷️ "${title}" listed successfully on ${currentUser.campus} marketplace! 🎉 Get ready for interested buyers! 📦`);
    
    // Clear form and reset images
    document.getElementById('sellItemForm').reset();
    uploadedImages = [];
    updateImagePreview();
}

function filterItems() {
    const searchTerm = document.getElementById('searchItems').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const sort = document.getElementById('priceSort').value;

    // Only show items from same campus
    let filteredItems = marketplaceItems.filter(item => 
        item.campus === currentUser.campus &&
        (category === 'all' || item.category === category) &&
        (searchTerm === '' || 
         item.title.toLowerCase().includes(searchTerm) || 
         item.description.toLowerCase().includes(searchTerm) ||
         item.sellerName.toLowerCase().includes(searchTerm))
    );

    // Apply sorting
    const sortFunctions = {
        'newest': (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        'price-low': (a, b) => a.price - b.price,
        'price-high': (a, b) => b.price - a.price,
        'popular': (a, b) => b.views - a.views
    };

    filteredItems.sort(sortFunctions[sort]);
    displayItems(filteredItems);
}

function displayItems(items) {
    const container = document.getElementById('marketplaceGrid');

    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-icon">🛍️</div>
                <div style="font-size: 28px; font-weight: 900; margin-bottom: 15px; color: var(--text-primary);">No Items Found</div>
                <div style="font-size: 18px; margin-bottom: 25px;">Try adjusting your search or filter criteria</div>
                <div style="font-size: 16px; color: var(--system-gray);">Be the first to list an item in this category! 🚀</div>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(item => {
        const mainImage = item.images && item.images.length > 0 ? item.images[0].data : null;
        const imageCount = item.images ? item.images.length : 0;

        return `
            <div class="marketplace-item">
                <div class="item-image-container">
                    ${mainImage ? 
                        `<img src="${mainImage}" alt="${item.title}" class="item-image">` :
                        `<div class="item-image-placeholder">${getCategoryIcon(item.category, false)}</div>`
                    }
                    ${imageCount > 1 ? `<div class="image-gallery-indicator">📸 ${imageCount} photos</div>` : ''}
                    <div class="seller-badge">${item.course || 'Student'}</div>
                </div>
                <div class="item-info">
                    <div class="item-header">
                        <div class="item-title">${item.title}</div>
                        ${item.verified ? '<div class="verified-seller">✅ Verified</div>' : ''}
                    </div>
                    <div class="item-price">₹${item.price.toLocaleString('en-IN')}</div>
                    <div class="item-description">${item.description || 'No description provided'}</div>
                    
                    <div class="item-meta">
                        <div class="meta-item">
                            <span class="condition-badge condition-${item.condition}">
                                ${getConditionIcon(item.condition)} ${item.condition.toUpperCase()}
                            </span>
                        </div>
                        <div class="meta-item">
                            👁️ ${item.views} views
                        </div>
                        <div class="meta-item">
                            📅 ${formatDate(item.createdAt)}
                        </div>
                        <div class="meta-item">
                            👤 ${item.sellerName}
                        </div>
                    </div>
                    
                    <div class="item-actions">
                        <button class="btn btn-success btn-small" onclick="contactSeller(${item.id})" style="flex: 1;">
                            💬 Contact Seller
                        </button>
                        <div class="negotiable-badge ${item.negotiable === 'yes' ? 'negotiable-yes' : 'negotiable-no'}">
                            ${item.negotiable === 'yes' ? '💬 Negotiable' : '💎 Fixed Price'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateMarketplace() {
    filterItems(); // This will display all items with current filters
    updateStatistics();
}

function contactSeller(itemId) {
    const item = marketplaceItems.find(i => i.id === itemId);
    if (!item) return;

    // Increment view count
    item.views += 1;
    localStorage.setItem('backpack_marketplace', JSON.stringify(marketplaceItems));

    const message = `Hi ${item.sellerName}! 👋\n\nI'm interested in your "${item.title}" listed for ₹${item.price.toLocaleString('en-IN')} on the Christ University marketplace.\n\nIs it still available? ${item.negotiable === 'yes' ? 'Also, is the price negotiable?' : ''}\n\nLooking forward to hearing from you!\n\nBest regards,\n${currentUser.fullName || currentUser.username}\n${currentUser.course || 'BCA'} Student`;

    if (item.contact.includes('@')) {
        const email = item.contact.match(/[\w\.-]+@[\w\.-]+\.\w+/)[0];
        window.open(`mailto:${email}?subject=Interested in ${item.title} - Marketplace&body=${encodeURIComponent(message)}`);
        showFlashMessage('📧 Opening email client... Happy negotiating! 💬');
    } else if (item.contact.includes('WhatsApp') || item.contact.includes('+91')) {
        const phone = item.contact.match(/\+91[-\s]?[6-9]\d{9}|\b[6-9]\d{9}\b/)[0].replace(/\D/g, '');
        window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`);
        showFlashMessage('📱 Opening WhatsApp... Happy chatting! 💚');
    } else {
        showFlashMessage('📞 Contact information copied to clipboard!');
        navigator.clipboard.writeText(item.contact);
    }

    updateMarketplace(); // Refresh to show updated view count
}

function getCategoryIcon(category, large = true) {
    const icons = {
        electronics: '📱',
        books: '📚',
        furniture: '🪑',
        clothing: '👕',
        sports: '⚽',
        vehicles: '🚗',
        musical: '🎵',
        other: '🌟'
    };
    const icon = icons[category] || '🌟';
    return large ? `<div style="font-size: 64px;">${icon}</div>` : icon;
}

function getConditionIcon(condition) {
    const icons = {
        new: '✨',
        excellent: '🌟',
        good: '👍',
        fair: '👌'
    };
    return icons[condition] || '👌';
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

// Enhanced value animation
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
    }
    
    flash.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <span style="font-size: 28px;">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'}
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
    if (confirm(`Are you sure you want to logout, ${currentUser.fullName || 'Student'}?\n\nYour marketplace listings will remain active! 🛍️`)) {
        localStorage.removeItem('currentUser');
        showFlashMessage('Logged out successfully! Your items are still listed for campus buyers! See you soon! 👋');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

// ✅ CLEAN INITIALIZATION - KEEP PREDEFINED MARKETPLACE ITEMS
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 Marketplace Loading with REAL user profile but keeping predefined items...');
    
    updateUserProfile();
    updateMarketplace();
    
    console.log('✅ Marketplace loaded successfully!');
    console.log('✅ Real user profile with registration number:', currentUser.regNumber);
    console.log('✅ Predefined marketplace items: KEPT as requested');
    console.log('✅ Professional image upload: ACTIVE');
});

// Export functions for global access
window.filterItems = filterItems;
window.contactSeller = contactSeller;
window.handleImageUpload = handleImageUpload;
window.removeImage = removeImage;
window.sellItem = sellItem;
window.logout = logout;

console.log('🎯 Marketplace JavaScript Module Loaded Successfully!');
