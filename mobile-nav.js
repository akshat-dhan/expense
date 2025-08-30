// 📱 MOBILE NAVIGATION - EXTERNAL JS

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('mobileMenuToggle');
    const overlay = document.getElementById('mobileOverlay');
    
    if (!sidebar || !menuToggle || !overlay) {
        console.log('Elements not found');
        return;
    }
    
    const isOpen = sidebar.classList.contains('mobile-open');
    
    if (isOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function openSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('mobileMenuToggle');
    const overlay = document.getElementById('mobileOverlay');
    
    if (!sidebar || !menuToggle || !overlay) return;
    
    sidebar.classList.add('mobile-open');
    menuToggle.classList.add('active');
    overlay.classList.add('show');
    
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('mobileMenuToggle');
    const overlay = document.getElementById('mobileOverlay');
    
    if (!sidebar || !menuToggle || !overlay) return;
    
    sidebar.classList.remove('mobile-open');
    menuToggle.classList.remove('active');
    overlay.classList.remove('show');
    
    document.body.style.overflow = 'auto';
}

// Auto-setup when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add mobile menu HTML
    const mobileHTML = `
        <div class="mobile-menu-toggle" id="mobileMenuToggle" onclick="toggleSidebar()">
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
        <div class="mobile-overlay" id="mobileOverlay" onclick="closeSidebar()"></div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', mobileHTML);
    
    // Close sidebar when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });
    
    // Close on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && window.innerWidth <= 768) {
            closeSidebar();
        }
    });
});
