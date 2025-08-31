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
let housingListings = JSON.parse(localStorage.getItem('backpack_housing') || '[]');
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

// ✅ KEEP PREDEFINED HOUSING LISTINGS FOR RICH BROWSING EXPERIENCE
if (housingListings.filter(listing => listing.campus === currentUser.campus).length === 0) {
    housingListings = [
        {
            id: Date.now() + 2001,
            listerId: 'host_990',
            listerName: "Amit Verma",
            campus: "CHRIST_BLR",
            title: "Luxury 2BHK Fully Furnished Apartment - Premium Location",
            rent: 24000,
            location: "Hosur Road, Electronic City Phase 1, 1.2km from Christ University",
            type: "apartment",
            bedrooms: "2",
            bathrooms: "2",
            furnished: "fully",
            amenities: ["High-Speed WiFi", "Air Conditioning", "Dedicated Parking", "24/7 Security", "Modular Kitchen", "Power Backup"],
            contact: "WhatsApp: +91-9876543210 | Email: amit.verma@housing.com",
            deposit: 48000,
            description: "Beautiful 2BHK apartment in a premium gated community. Perfect for 2-3 students with all modern amenities. Walking distance to college with excellent connectivity. Includes 24/7 power backup, high-speed internet, and dedicated parking space.",
            images: [],
            views: 0,
            verified: true,
            popular: true,
            createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: Date.now() + 2002,
            listerId: 'host_989',
            listerName: "Kavya Nair",
            campus: "CHRIST_BLR",
            title: "Girls Only Premium PG - AC Rooms with All Meals",
            rent: 15000,
            location: "Electronic City Phase 2, 800m from Christ University Main Gate",
            type: "pg",
            bedrooms: "1",
            bathrooms: "1",
            furnished: "fully",
            amenities: ["High-Speed WiFi", "Air Conditioning", "Laundry Service", "24/7 Security", "Modular Kitchen", "Balcony/Terrace"],
            contact: "WhatsApp: +91-8765432109 | Email: kavya.nair@pgservices.com",
            deposit: 30000,
            description: "Safe and secure PG exclusively for girls. Includes breakfast, lunch, dinner, and evening snacks. Homely environment with experienced management. 24/7 security with CCTV surveillance. Walking distance to college.",
            images: [],
            views: 0,
            verified: true,
            popular: false,
            createdAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
            id: Date.now() + 2003,
            listerId: 'host_988',
            listerName: "Rajesh Gupta",
            campus: "CHRIST_BLR",
            title: "Budget-Friendly Shared Room for Boys - Near College",
            rent: 9500,
            location: "Bannerghatta Road, Talaghattapura, 1.8km from Christ University",
            type: "shared",
            bedrooms: "1",
            bathrooms: "1",
            furnished: "semi",
            amenities: ["High-Speed WiFi", "Dedicated Parking", "Power Backup"],
            contact: "WhatsApp: +91-7654321098",
            deposit: 19000,
            description: "Affordable shared accommodation for boys. Clean and well-maintained room with basic furnishing. Good connectivity to college via bus. Suitable for budget-conscious students. Includes bed, study table, and storage space.",
            images: [],
            views: 0,
            verified: true,
            popular: false,
            createdAt: new Date(Date.now() - 259200000).toISOString()
        },
        {
            id: Date.now() + 2004,
            listerId: 'host_987',
            listerName: "Priya Sharma",
            campus: "CHRIST_BLR",
            title: "Modern Studio Apartment - Perfect for Single Student",
            rent: 18000,
            location: "Hosur Road, Bommanahalli, 2.1km from Christ University",
            type: "studio",
            bedrooms: "1",
            bathrooms: "1",
            furnished: "fully",
            amenities: ["High-Speed WiFi", "Air Conditioning", "Modular Kitchen", "Balcony/Terrace", "Elevator Access"],
            contact: "Email: priya.sharma@premium.in | WhatsApp: +91-6543210987",
            deposit: 36000,
            description: "Modern studio apartment perfect for single student. Fully furnished with kitchenette, study area, and comfortable living space. Located in a well-maintained building with elevator access and 24/7 water supply.",
            images: [],
            views: 0,
            verified: true,
            popular: true,
            createdAt: new Date(Date.now() - 345600000).toISOString()
        },
        {
            id: Date.now() + 2005,
            listerId: 'host_986',
            listerName: "Sanjay Reddy",
            campus: "CHRIST_BLR",
            title: "3BHK Villa for Group of Students - Premium Amenities",
            rent: 45000,
            location: "Electronic City Phase 1, Neeladri Nagar, 1.5km from Christ University",
            type: "villa",
            bedrooms: "3",
            bathrooms: "3",
            furnished: "fully",
            amenities: ["High-Speed WiFi", "Air Conditioning", "Dedicated Parking", "24/7 Security", "Modular Kitchen", "Balcony/Terrace", "Fitness Center", "Power Backup"],
            contact: "WhatsApp: +91-5432109876 | Email: sanjay.reddy@villarentals.com",
            deposit: 90000,
            description: "Spacious 3BHK villa perfect for a group of 4-6 students. Independent house with private parking, garden area, and all modern amenities. Ideal for students who prefer privacy and space. Located in a safe residential area.",
            images: [],
            views: 0,
            verified: true,
            popular: true,
            createdAt: new Date(Date.now() - 432000000).toISOString()
        }
    ];
    localStorage.setItem('backpack_housing', JSON.stringify(housingListings));
}

// Enhanced statistics calculation
function updateStatistics() {
    const campusListings = housingListings.filter(listing => listing.campus === currentUser.campus);
    const avgRent = campusListings.length > 0 ? campusListings.reduce((sum, listing) => sum + listing.rent, 0) / campusListings.length : 0;
    const uniqueAreas = new Set(campusListings.map(listing => listing.location.split(',')[0])).size;
    const uniqueHosts = new Set(campusListings.map(listing => listing.listerId)).size;

    // Animate values
    animateValue('totalListings', 0, campusListings.length, 1000);
    animateValue('avgRent', 0, avgRent, 1500, '₹');
    animateValue('totalAreas', 0, uniqueAreas, 1000);
    animateValue('totalHosts', 0, uniqueHosts, 1000);

    document.getElementById('listingCount').textContent = campusListings.length;
}

// Professional Image Upload Handler
function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    const maxFiles = 8;
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
        uploadSection.querySelector('.upload-subtext').textContent = 'Your property photos look great! Add more or proceed to list.';
    } else {
        uploadSection.classList.remove('has-images');
        uploadSection.querySelector('.upload-text').textContent = 'Click to Add Property Images';
        uploadSection.querySelector('.upload-subtext').textContent = 'Add up to 8 high-quality photos showcasing your property';
    }

    container.innerHTML = uploadedImages.map((image, index) => `
        <div class="image-preview">
            <img src="${image.data}" alt="Property image ${index + 1}">
            <button class="image-remove" onclick="removeImage(${index})" title="Remove image">×</button>
        </div>
    `).join('');
}

function removeImage(index) {
    uploadedImages.splice(index, 1);
    updateImagePreview();
    showFlashMessage('🗑️ Image removed successfully!');
}

function listHousing(event) {
    event.preventDefault();
    
    const title = document.getElementById('housingTitle').value;
    const rent = parseFloat(document.getElementById('housingRent').value);
    const location = document.getElementById('housingLocation').value;
    const type = document.getElementById('housingType').value;
    const bedrooms = document.getElementById('housingBedrooms').value;
    const bathrooms = document.getElementById('housingBathrooms').value;
    const furnished = document.getElementById('housingFurnished').value;
    const contact = document.getElementById('housingContact').value;
    const deposit = parseFloat(document.getElementById('housingDeposit').value) || 0;
    const description = document.getElementById('housingDescription').value;
    
    // Get selected amenities
    const amenityChecks = ['wifi', 'ac', 'parking', 'laundry', 'gym', 'security', 'kitchen', 'balcony', 'elevator', 'powerbackup'];
    const amenities = amenityChecks.filter(amenity => 
        document.getElementById(amenity).checked
    ).map(amenity => document.getElementById(amenity).value);

    if (uploadedImages.length === 0) {
        showFlashMessage('📸 Please add at least one property image to make your listing more attractive!', 'warning');
        return;
    }

    const housing = {
        id: Date.now(),
        listerId: currentUser.id,
        listerName: currentUser.fullName || currentUser.username,
        campus: currentUser.campus,
        course: currentUser.course || 'BCA',
        title,
        rent,
        location,
        type,
        bedrooms,
        bathrooms,
        furnished,
        amenities,
        contact,
        deposit,
        description,
        images: [...uploadedImages],
        views: 0,
        verified: true,
        popular: false,
        createdAt: new Date().toISOString()
    };

    housingListings.push(housing);
    localStorage.setItem('backpack_housing', JSON.stringify(housingListings));
    
    updateHousing();
    updateStatistics();
    showFlashMessage(`🏡 "${title}" listed successfully on ${currentUser.campus} housing platform! 🎉 Students will love this place! 🏠`);
    
    // Clear form and reset images
    document.getElementById('housingForm').reset();
    uploadedImages = [];
    updateImagePreview();
}

function filterHousing() {
    const searchTerm = document.getElementById('housingSearch').value.toLowerCase();
    const type = document.getElementById('housingTypeFilter').value;
    const sort = document.getElementById('rentSort').value;

    // Only show listings from same campus
    let filteredListings = housingListings.filter(listing => 
        listing.campus === currentUser.campus &&
        (type === 'all' || listing.type === type) &&
        (searchTerm === '' || 
         listing.title.toLowerCase().includes(searchTerm) || 
         listing.location.toLowerCase().includes(searchTerm) ||
         listing.description.toLowerCase().includes(searchTerm) ||
         listing.listerName.toLowerCase().includes(searchTerm) ||
         listing.amenities.some(amenity => amenity.toLowerCase().includes(searchTerm)))
    );

    // Apply sorting
    const sortFunctions = {
        'newest': (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        'rent-low': (a, b) => a.rent - b.rent,
        'rent-high': (a, b) => b.rent - a.rent,
        'popular': (a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0)
    };

    filteredListings.sort(sortFunctions[sort]);
    displayHousingListings(filteredListings);
}

function displayHousingListings(listings) {
    const container = document.getElementById('housingGrid');

    if (listings.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-icon">🏠</div>
                <div style="font-size: 28px; font-weight: 900; margin-bottom: 15px; color: var(--text-primary);">No Properties Found</div>
                <div style="font-size: 18px; margin-bottom: 25px;">Try adjusting your search criteria or be the first to list a property!</div>
                <div style="font-size: 16px; color: var(--system-gray);">Help fellow students find their perfect home! 🚀</div>
            </div>
        `;
        return;
    }

    container.innerHTML = listings.map(listing => {
        const mainImage = listing.images && listing.images.length > 0 ? listing.images[0].data : null;
        const imageCount = listing.images ? listing.images.length : 0;

        return `
            <div class="housing-item">
                <div class="housing-image-container">
                    ${mainImage ? 
                        `<img src="${mainImage}" alt="${listing.title}" class="housing-image">` :
                        `<div class="housing-image-placeholder">${getTypeIcon(listing.type, false)}</div>`
                    }
                    ${imageCount > 1 ? `<div class="image-gallery-indicator">📸 ${imageCount} photos</div>` : ''}
                    <div class="housing-type-badge">${getTypeIcon(listing.type)} ${listing.type.toUpperCase()}</div>
                    ${listing.verified ? '<div class="verified-badge">✅ Verified</div>' : ''}
                </div>
                
                <div class="housing-content">
                    <div class="housing-header">
                        <div class="housing-title">${listing.title}</div>
                        <div class="housing-rent">₹${listing.rent.toLocaleString('en-IN')}/month</div>
                        <div class="housing-location">📍 ${listing.location}</div>
                    </div>
                    
                    <div class="housing-details">
                        <div class="detail-item">
                            <span class="detail-icon">🛏️</span>
                            <div>${listing.bedrooms} Bed</div>
                        </div>
                        <div class="detail-item">
                            <span class="detail-icon">🚿</span>
                            <div>${listing.bathrooms} Bath</div>
                        </div>
                        <div class="detail-item">
                            <span class="detail-icon">🛋️</span>
                            <div>${getFurnishedIcon(listing.furnished)} ${listing.furnished}</div>
                        </div>
                        <div class="detail-item">
                            <span class="detail-icon">👤</span>
                            <div>${listing.course || 'Host'}</div>
                        </div>
                    </div>
                    
                    ${listing.amenities && listing.amenities.length > 0 ? `
                        <div class="housing-amenities">
                            ${listing.amenities.slice(0, 6).map(amenity => `
                                <span class="amenity-tag">
                                    ${getAmenityIcon(amenity)} ${amenity}
                                </span>
                            `).join('')}
                            ${listing.amenities.length > 6 ? `<span class="amenity-tag">+${listing.amenities.length - 6} more</span>` : ''}
                        </div>
                    ` : ''}
                    
                    <div class="housing-description">
                        ${listing.description || 'No description provided'}
                    </div>
                    
                    ${listing.deposit > 0 ? `
                        <div class="deposit-info">
                            <div class="deposit-amount">💎 Security Deposit: ₹${listing.deposit.toLocaleString('en-IN')}</div>
                        </div>
                    ` : ''}
                    
                    <div class="housing-actions">
                        <div class="lister-info">
                            👤 <strong>${listing.listerName}</strong><br>
                            📅 Listed ${formatDate(listing.createdAt)}<br>
                            👁️ ${listing.views} views
                        </div>
                        <button class="btn btn-success btn-small" onclick="contactLister(${listing.id})" style="flex: 1; max-width: 150px;">
                            📞 Contact Host
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateHousing() {
    filterHousing(); // This will display all items with current filters
    updateStatistics();
}

function contactLister(listingId) {
    const listing = housingListings.find(l => l.id === listingId);
    if (!listing) return;

    // Increment view count
    listing.views += 1;
    localStorage.setItem('backpack_housing', JSON.stringify(housingListings));

    const message = `Hi ${listing.listerName}! 👋\n\nI'm interested in your property "${listing.title}" listed for ₹${listing.rent.toLocaleString('en-IN')}/month on the Christ University housing platform.\n\nProperty Details:\n📍 Location: ${listing.location}\n🏠 Type: ${listing.type}\n🛏️ ${listing.bedrooms} Bedroom(s), ${listing.bathrooms} Bathroom(s)\n💎 Deposit: ₹${listing.deposit.toLocaleString('en-IN')}\n\nIs this property still available? I'd love to schedule a visit.\n\nBest regards,\n${currentUser.fullName || currentUser.username}\n${currentUser.course || 'BCA'} Student\n${currentUser.regNumber || ''} | ${currentUser.phone || ''}`;

    if (listing.contact.includes('@')) {
        const email = listing.contact.match(/[\w\.-]+@[\w\.-]+\.\w+/)[0];
        window.open(`mailto:${email}?subject=Interested in ${listing.title} - Housing Platform&body=${encodeURIComponent(message)}`);
        showFlashMessage('📧 Opening email client... Hope you find your perfect home! 🏡');
    } else if (listing.contact.includes('WhatsApp') || listing.contact.includes('+91')) {
        const phone = listing.contact.match(/\+91[-\s]?[6-9]\d{9}|\b[6-9]\d{9}\b/)[0].replace(/\D/g, '');
        window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`);
        showFlashMessage('📱 Opening WhatsApp... Happy house hunting! 💚');
    } else {
        showFlashMessage('📞 Contact information copied to clipboard!');
        navigator.clipboard.writeText(listing.contact);
    }

    updateHousing(); // Refresh to show updated view count
}

function getTypeIcon(type, large = true) {
    const icons = {
        apartment: '🏢',
        pg: '🏠',
        room: '🚪',
        villa: '🏡',
        shared: '👥',
        studio: '🎨'
    };
    const icon = icons[type] || '🏠';
    return large ? `<div style="font-size: 64px;">${icon}</div>` : icon;
}

function getFurnishedIcon(furnished) {
    const icons = {
        fully: '✅',
        semi: '🔧',
        unfurnished: '❌'
    };
    return icons[furnished] || '🔧';
}

function getAmenityIcon(amenity) {
    const icons = {
        'High-Speed WiFi': '📶',
        'Air Conditioning': '❄️',
        'Dedicated Parking': '🚗',
        'Laundry Service': '👕',
        'Fitness Center': '💪',
        '24/7 Security': '🛡️',
        'Modular Kitchen': '🍳',
        'Balcony/Terrace': '🌅',
        'Elevator Access': '🛗',
        'Power Backup': '⚡'
    };
    return icons[amenity] || '⭐';
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
    if (confirm(`Are you sure you want to logout, ${currentUser.fullName || 'Student'}?\n\nYour housing listings will remain active for students! 🏠`)) {
        localStorage.removeItem('currentUser');
        showFlashMessage('Logged out successfully! Your properties are still helping students find homes! See you soon! 👋');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

// ✅ CLEAN INITIALIZATION - KEEP PREDEFINED HOUSING LISTINGS
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 Elite Campus Housing Platform Loading with REAL user profile...');
    
    updateUserProfile();
    updateHousing();
    
    console.log('✅ Elite Campus Housing Platform loaded successfully!');
    console.log('✅ Real user profile with registration number:', currentUser.regNumber);
    console.log('✅ KEPT predefined housing listings: 5 amazing properties');
    console.log('📸 Professional Image Upload: ACTIVE');
    console.log('🏛️ Campus-Restricted Listings: ENABLED');
    console.log('📊 Real-time Statistics: UPDATED');
    console.log('🏠 Student Housing Network: ONLINE');
});

// Export functions for global access
window.filterHousing = filterHousing;
window.contactLister = contactLister;
window.handleImageUpload = handleImageUpload;
window.removeImage = removeImage;
window.listHousing = listHousing;
window.logout = logout;

console.log('🎯 Housing JavaScript Module Loaded Successfully!');
