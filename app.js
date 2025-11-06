// ============================================
// Page Navigation System
// ============================================

/**
 * Navigate to a specific page
 * @param {string} pageName - The name of the page to navigate to
 */
function navigateToPage(pageName) {
    // Get all pages
    const pages = document.querySelectorAll('.page');
    
    // Remove active class from all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Add active class to target page
    const targetPage = document.querySelector(`[data-page="${pageName}"]`);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Update countdown progress when navigating to rooms page
        if (pageName === 'rooms') {
            setTimeout(() => {
                updateCountdownProgress();
            }, 100);
        }
        
        // Adjust iframe heights when navigating to memories page
        if (pageName === 'memories') {
            setTimeout(() => {
                adjustMemoriesIframeHeights();
            }, 300);
        }
    }
}

// ============================================
// Enter/Welcome Page Navigation
// ============================================

// Handle click on enter page button (Login with Email)
const enterPageButton = document.querySelector('.enter-page__button');
if (enterPageButton) {
    enterPageButton.addEventListener('click', () => {
        navigateToPage('home');
    });
}

// Handle click on enter page sign up link
const enterPageSignUpLink = document.querySelector('.enter-page__signup-link');
if (enterPageSignUpLink) {
    enterPageSignUpLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToPage('home');
    });
}

// ============================================
// Home Page Navigation
// ============================================

// Handle click on home page button
const homePageButton = document.querySelector('.home-page__button');
if (homePageButton) {
    homePageButton.addEventListener('click', () => {
        navigateToPage('rooms');
    });
}

// Handle click on home page icon (door image)
const doorImage = document.getElementById('doorImage');
if (doorImage) {
    doorImage.addEventListener('click', () => {
        navigateToPage('rooms');
    });
}

// ============================================
// Rooms Page Navigation
// ============================================

// Handle click on back button in rooms page
const roomsBackButton = document.querySelector('.rooms-page__back-button');
if (roomsBackButton) {
    roomsBackButton.addEventListener('click', () => {
        navigateToPage('home');
    });
}

// Handle click on Home memories button in rooms page
const roomsMemoriesButton = document.querySelector('.rooms-page__memories-button');
if (roomsMemoriesButton) {
    roomsMemoriesButton.addEventListener('click', () => {
        navigateToPage('memories');
    });
}

// Room type to detail page mapping
const roomToDetailPageMap = {
    'living-room': 'detail-living-room',
    'bedroom': 'detail-bedroom',
    'balcony': 'detail-balcony',
    'study': 'detail-study',
    'room': 'detail-room'
};

// Handle click on room cards
const roomCards = document.querySelectorAll('.room-card');
roomCards.forEach(card => {
    card.addEventListener('click', () => {
        const roomName = card.getAttribute('data-room-name');
        const roomNameEn = card.getAttribute('data-room-name-en');
        const roomType = card.getAttribute('data-room');
        
        // Get the corresponding detail page name
        const detailPageName = roomToDetailPageMap[roomType];
        
        if (detailPageName) {
            // Get the detail page element
            const detailPage = document.querySelector(`[data-page="${detailPageName}"]`);
            
            // Update detail page title in the target page
            if (detailPage) {
                const detailPageTitle = detailPage.querySelector('.detail-page__title');
                if (detailPageTitle) {
                    detailPageTitle.textContent = roomName;
                }
            }
            
            // Update album modal title
            const albumRoomName = document.querySelector('.album-room-name');
            if (albumRoomName) {
                albumRoomName.textContent = roomName;
            }
            
            // Navigate to the specific detail page
            navigateToPage(detailPageName);
        }
    });
});

// ============================================
// Detail Page Navigation
// ============================================

// Handle click on back button in detail pages (using event delegation)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('detail-page__back-button')) {
        navigateToPage('rooms');
    }
    
    // Handle click on album button in detail pages
    if (e.target.classList.contains('detail-page__album-button')) {
        openAlbumModal();
    }
});

// ============================================
// Memories Page Navigation
// ============================================

// Handle click on back button in memories page
const memoriesBackButton = document.querySelector('.memories-page__back-button');
if (memoriesBackButton) {
    memoriesBackButton.addEventListener('click', () => {
        navigateToPage('rooms');
    });
}

// ============================================
// Album Modal Functions
// ============================================

function openAlbumModal() {
    const albumModal = document.getElementById('albumModal');
    if (albumModal) {
        // Find the currently active detail page
        const activeDetailPage = document.querySelector('.page.active[data-page^="detail-"]');
        if (activeDetailPage) {
            // Update album modal title
            const detailPageTitle = activeDetailPage.querySelector('.detail-page__title');
            const albumRoomName = document.querySelector('.album-room-name');
            if (detailPageTitle && albumRoomName) {
                albumRoomName.textContent = detailPageTitle.textContent.trim();
            }
        }
        
        albumModal.classList.add('active');
        
        // Always load photos dynamically based on current room
        loadPhotos();
    }
}

function closeAlbumModal() {
    const albumModal = document.getElementById('albumModal');
    if (albumModal) {
        albumModal.classList.remove('active');
    }
}

// Handle click on album close button
const albumCloseButton = document.querySelector('.album-close');
if (albumCloseButton) {
    albumCloseButton.addEventListener('click', () => {
        closeAlbumModal();
    });
}

// Handle click on album backdrop
const albumBackdrop = document.querySelector('.album-backdrop');
if (albumBackdrop) {
    albumBackdrop.addEventListener('click', () => {
        closeAlbumModal();
    });
}

// Room name to photo directory mapping
const roomToPhotoDirMap = {
    '客厅': 'living-room',
    '卧室': 'bedroom',
    '阳台': 'balcony',
    '书房': 'study',
    '房间': 'room'
};

// Load photos into the album grid
function loadPhotos() {
    const photoGrid = document.getElementById('photoGrid');
    if (!photoGrid) return;
    
    // Clear existing photos
    photoGrid.innerHTML = '';
    
    // Find the currently active detail page
    const activeDetailPage = document.querySelector('.page.active[data-page^="detail-"]');
    if (!activeDetailPage) return;
    
    // Get the room name from the active detail page
    const detailPageTitle = activeDetailPage.querySelector('.detail-page__title');
    const currentRoomName = detailPageTitle ? detailPageTitle.textContent.trim() : '客厅';
    
    // Get the photo directory name for this room
    const photoDir = roomToPhotoDirMap[currentRoomName] || 'living-room';
    
    // Generate photo paths (14 photos: picture1.jpg through picture14.jpg)
    const photoPaths = [];
    for (let i = 1; i <= 14; i++) {
        photoPaths.push(`imgs/album/${photoDir}/picture${i}.jpg`);
    }
    
    // Debug: Log the photo paths being used
    console.log(`Loading photos for room: ${currentRoomName} (${photoDir})`);
    console.log('Photo paths:', photoPaths);
    
    // Create and append photo elements
    photoPaths.forEach((photoPath, index) => {
        const img = document.createElement('img');
        img.src = photoPath;
        img.alt = `${currentRoomName} - Photo ${index + 1}`;
        img.className = 'album-photo';
        img.addEventListener('click', () => {
            openLightbox(photoPaths, index);
        });
        
        // Handle image load error (if image doesn't exist)
        img.addEventListener('error', () => {
            console.warn(`Image not found: ${photoPath}`);
            // Hide the broken image
            img.style.display = 'none';
        });
        
        photoGrid.appendChild(img);
    });
    
    // Update lightbox total photos count
    const totalPhotosSpan = document.querySelector('.lightbox-total-photos');
    if (totalPhotosSpan) {
        totalPhotosSpan.textContent = photoPaths.length;
    }
}

// ============================================
// Lightbox Functions
// ============================================

let currentPhotoIndex = 0;
let currentPhotos = [];

function openLightbox(photos, index) {
    currentPhotos = photos;
    currentPhotoIndex = index;
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    if (lightbox && lightboxImage) {
        lightbox.classList.add('active');
        updateLightboxImage();
        updateLightboxCounter();
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
    }
}

function updateLightboxImage() {
    const lightboxImage = document.getElementById('lightboxImage');
    if (lightboxImage && currentPhotos[currentPhotoIndex]) {
        lightboxImage.src = currentPhotos[currentPhotoIndex];
    }
}

function updateLightboxCounter() {
    const currentIndexSpan = document.querySelector('.lightbox-current-index');
    const totalPhotosSpan = document.querySelector('.lightbox-total-photos');
    
    if (currentIndexSpan) {
        currentIndexSpan.textContent = currentPhotoIndex + 1;
    }
    if (totalPhotosSpan) {
        totalPhotosSpan.textContent = currentPhotos.length;
    }
}

function showNextPhoto() {
    if (currentPhotoIndex < currentPhotos.length - 1) {
        currentPhotoIndex++;
        updateLightboxImage();
        updateLightboxCounter();
    }
}

function showPrevPhoto() {
    if (currentPhotoIndex > 0) {
        currentPhotoIndex--;
        updateLightboxImage();
        updateLightboxCounter();
    }
}

// Handle lightbox controls
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxNext = document.querySelector('.lightbox-next');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxBackdrop = document.querySelector('.lightbox-backdrop');

if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightboxNext) {
    lightboxNext.addEventListener('click', showNextPhoto);
}

if (lightboxPrev) {
    lightboxPrev.addEventListener('click', showPrevPhoto);
}

if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', closeLightbox);
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNextPhoto();
        } else if (e.key === 'ArrowLeft') {
            showPrevPhoto();
        }
    }
});

// ============================================
// Timeline Slider Functionality
// ============================================

// Initialize timeline sliders for all detail pages
function initializeTimelineSliders() {
    const detailPages = document.querySelectorAll('[data-page^="detail-"]');
    
    detailPages.forEach(detailPage => {
        const timelineSlider = detailPage.querySelector('.timeline__slider');
        const timelineHandle = detailPage.querySelector('.timeline__slider-handle');
        const timelineTrack = detailPage.querySelector('.timeline__track');
        
        if (timelineSlider && timelineHandle && timelineTrack) {
            setupTimelineSlider(timelineSlider, timelineHandle, timelineTrack, detailPage);
        }
    });
}

function setupTimelineSlider(timelineSlider, timelineHandle, timelineTrack, detailPage) {
    let isDragging = false;
    let currentPosition = 50; // Start at 50% (middle)
    
    // Find background images within this specific detail page
    const layer1 = detailPage.querySelector('.detail-page__background--layer-1');
    const layer2 = detailPage.querySelector('.detail-page__background--layer-2');
    const image1 = layer1 ? layer1.querySelector('.detail-page__background-image') : null;
    const image2 = layer2 ? layer2.querySelector('.detail-page__background-image') : null;
    
    // Get the image sources
    const image1Src = image1 ? image1.src : null;
    const image2Src = image2 ? image2.src : null;
    
    // Update background based on slider position
    function updateBackground(percentage) {
        if (!layer1 || !layer2) return;
        
        // Calculate opacity based on slider position
        // At 0%: show image 1 (layer1 opacity = 1, layer2 opacity = 0)
        // At 100%: show image 2 (layer1 opacity = 0, layer2 opacity = 1)
        // Smooth transition between 0% and 100%
        const layer1Opacity = 1 - (percentage / 100);
        const layer2Opacity = percentage / 100;
        
        layer1.style.opacity = layer1Opacity;
        layer2.style.opacity = layer2Opacity;
    }
    
    // Update handle position
    function updateHandlePosition(percentage) {
        currentPosition = Math.max(0, Math.min(100, percentage));
        timelineHandle.style.left = `${currentPosition}%`;
        updateBackground(currentPosition);
    }
    
    // Get position from mouse/touch event
    function getPositionFromEvent(e) {
        const rect = timelineTrack.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const percentage = ((clientX - rect.left) / rect.width) * 100;
        return percentage;
    }
    
    // Mouse events
    timelineHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    
    timelineSlider.addEventListener('mousedown', (e) => {
        if (e.target === timelineSlider || e.target === timelineTrack) {
            const percentage = getPositionFromEvent(e);
            updateHandlePosition(percentage);
            isDragging = true;
        }
    });
    
    const handleMouseMove = (e) => {
        if (isDragging) {
            const percentage = getPositionFromEvent(e);
            updateHandlePosition(percentage);
        }
    };
    
    const handleMouseUp = () => {
        isDragging = false;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Touch events for mobile
    timelineHandle.addEventListener('touchstart', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    
    timelineSlider.addEventListener('touchstart', (e) => {
        if (e.target === timelineSlider || e.target === timelineTrack) {
            const percentage = getPositionFromEvent(e);
            updateHandlePosition(percentage);
            isDragging = true;
        }
    });
    
    const handleTouchMove = (e) => {
        if (isDragging) {
            const percentage = getPositionFromEvent(e);
            updateHandlePosition(percentage);
        }
    };
    
    const handleTouchEnd = () => {
        isDragging = false;
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    
    // Initialize handle position and background
    updateHandlePosition(50);
}

// ============================================
// Background Image Cross-Fade Animation
// ============================================

// Function to change background images with cross-fade effect
function changeBackgroundImage(imageSrc) {
    const layer1 = document.querySelector('.detail-page__background--layer-1');
    const layer2 = document.querySelector('.detail-page__background--layer-2');
    
    if (!layer1 || !layer2) return;
    
    // Determine which layer is currently visible
    const currentLayer = layer1.style.opacity === '1' || !layer1.style.opacity ? layer1 : layer2;
    const nextLayer = currentLayer === layer1 ? layer2 : layer1;
    
    // Set the new image
    const nextImage = nextLayer.querySelector('.detail-page__background-image');
    if (nextImage) {
        nextImage.src = imageSrc;
    }
    
    // Cross-fade animation
    currentLayer.style.opacity = '0';
    nextLayer.style.opacity = '1';
}

// You can call changeBackgroundImage() when the timeline slider moves
// to update the background based on the timeline position

// ============================================
// 3D Tilt Effect for Room Cards
// ============================================

function initializeCardTiltEffect() {
    const roomCards = document.querySelectorAll('.room-card');
    
    roomCards.forEach(card => {
        card.classList.add('tilt-effect');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15; // 调整倾斜强度（更轻微）
            const rotateY = (centerX - x) / 15;
            
            // 应用3D倾斜效果，同时保持悬停的位移和缩放
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // 恢复默认状态
            card.style.transform = '';
        });
    });
}

// ============================================
// Floating Button Functionality
// ============================================

function initializeFloatingButton() {
    const floatingButton = document.querySelector('.rooms-page__floating-button');
    
    if (floatingButton) {
        floatingButton.addEventListener('click', () => {
            // 可以添加快速操作功能，比如滚动到顶部、显示菜单等
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function initializeDetailFloatingButton() {
    const floatingButtons = document.querySelectorAll('.detail-page__floating-button');
    
    floatingButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 可以添加快速操作功能，比如滚动到顶部、显示菜单等
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
}

// ============================================
// Countdown Progress Ring Update
// ============================================

function updateCountdownProgress() {
    const progressFill = document.querySelector('.countdown-progress-fill');
    const countdownDays = document.querySelector('.countdown-days');
    
    if (!progressFill || !countdownDays) return;
    
    // Get the current countdown days (default: 71)
    const daysRemaining = parseInt(countdownDays.textContent) || 71;
    const totalDays = 90; // Assuming 90 days total
    const daysPassed = totalDays - daysRemaining;
    const progressPercentage = (daysPassed / totalDays) * 100;
    
    // Calculate the stroke-dashoffset
    // Circumference = 2 * π * r = 2 * π * 90 ≈ 565.48
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (circumference * progressPercentage / 100);
    
    // Set initial position
    progressFill.style.strokeDashoffset = circumference;
    
    // Animate to final position
    setTimeout(() => {
        progressFill.style.transition = 'stroke-dashoffset 2s ease-out';
        progressFill.style.strokeDashoffset = offset;
    }, 100);
}

// ============================================
// Memories Page Iframe Height Adjustment
// ============================================

function adjustMemoriesIframeHeights() {
    const iframes = document.querySelectorAll('.memories-page__iframe');
    
    iframes.forEach(iframe => {
        try {
            // Try to get the content height from iframe
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            const body = iframeDocument.body;
            const html = iframeDocument.documentElement;
            
            // Get the actual content height
            const height = Math.max(
                body.scrollHeight,
                body.offsetHeight,
                html.clientHeight,
                html.scrollHeight,
                html.offsetHeight
            );
            
            // Set iframe height to content height + some padding
            if (height > 0) {
                iframe.style.height = (height + 40) + 'px';
                iframe.parentElement.style.height = (height + 40) + 'px';
            }
        } catch (e) {
            // Cross-origin restriction - use default height
            console.log('Cannot access iframe content (cross-origin):', e);
            // Keep the default height set in CSS
        }
    });
}

// ============================================
// Initialize Application
// ============================================

// Ensure home page is active on load
document.addEventListener('DOMContentLoaded', () => {
    navigateToPage('home');
    
    // Initialize timeline sliders for all detail pages
    initializeTimelineSliders();
    
    // Update countdown progress ring
    updateCountdownProgress();
    
    // Initialize card tilt effect when rooms page is active
    const roomsPage = document.querySelector('[data-page="rooms"]');
    if (roomsPage) {
        // Use MutationObserver to detect when rooms page becomes active
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('active')) {
                        // Initialize tilt effect when page becomes active
                        setTimeout(() => {
                            initializeCardTiltEffect();
                            initializeFloatingButton();
                        }, 100);
                    }
                }
            });
        });
        
        observer.observe(roomsPage, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        // Also initialize if page is already active
        if (roomsPage.classList.contains('active')) {
            setTimeout(() => {
                initializeCardTiltEffect();
                initializeFloatingButton();
            }, 100);
        }
    }
    
    // Initialize detail page floating buttons
    const detailPages = document.querySelectorAll('[data-page^="detail-"]');
    if (detailPages.length > 0) {
        // Use MutationObserver to detect when detail pages become active
        detailPages.forEach(detailPage => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const target = mutation.target;
                        if (target.classList.contains('active')) {
                            // Initialize floating button when page becomes active
                            setTimeout(() => {
                                initializeDetailFloatingButton();
                            }, 100);
                        }
                    }
                });
            });
            
            observer.observe(detailPage, {
                attributes: true,
                attributeFilter: ['class']
            });
            
            // Also initialize if page is already active
            if (detailPage.classList.contains('active')) {
                setTimeout(() => {
                    initializeDetailFloatingButton();
                }, 100);
            }
        });
    }
    
    // Add any initialization code here
    console.log('Home Memories app initialized');
});

