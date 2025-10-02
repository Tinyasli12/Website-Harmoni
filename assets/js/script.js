document.addEventListener('DOMContentLoaded', function() {
    
    // ====================================
    // LOGIC TOMBOL HERO SECTION (View Maps)
    // ====================================
    const viewMapsBtn = document.getElementById('viewMapsBtn');

    if (viewMapsBtn) {
        viewMapsBtn.addEventListener('click', function() {
            console.log("Tombol View Maps diklik!");
        });
    }

    // ====================================
    // LOGIC TABBED CONTENT FASILITAS (TAB UTAMA)
    // ====================================
    const tabLinks = document.querySelectorAll('.category-nav .nav-link');
    const contentTabs = document.querySelectorAll('.content-tab');

    function showContent(targetId) {
        contentTabs.forEach(tab => {
            tab.classList.remove('active-tab');
        });
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.classList.add('active-tab');
        }
    }

    function setActiveLink(clickedLink) {
        tabLinks.forEach(link => {
            link.classList.remove('active');
        });
        clickedLink.classList.add('active');
    }

    tabLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); 
            const targetId = this.getAttribute('data-target');
            
            setActiveLink(this);
            showContent(targetId);
        });
    });

    const defaultActiveTab = document.querySelector('.category-nav .nav-link.active');
    if (defaultActiveTab) {
        const defaultTargetId = defaultActiveTab.getAttribute('data-target');
        showContent(defaultTargetId);
    }
    
    // ====================================
    // LOGIC SUB-SLIDER (CAROUSEL) COMMUNAL
    // ====================================
    const communalDots = document.querySelectorAll('.communal-dot');
    const communalSlides = document.querySelectorAll('#communal-carousel .sub-carousel-item');

    communalDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const targetSlideIndex = this.getAttribute('data-slide-to');
            
            // 1. Atur dot mana yang aktif
            communalDots.forEach(d => d.classList.remove('active'));
            this.classList.add('active');

            // 2. Tampilkan slide yang sesuai
            communalSlides.forEach(slide => {
                slide.classList.remove('active-slide');
                
                if (slide.getAttribute('data-slide') === targetSlideIndex) {
                    slide.classList.add('active-slide');
                }
            });
        });
    });

});