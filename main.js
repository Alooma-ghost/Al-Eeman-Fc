// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');

mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    mobileMenuBtn.innerHTML = mainNav.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a:not(.admin-link)').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
});

// Load data from localStorage
function loadData() {
    // Load gallery images
    const userUploadedImages = JSON.parse(localStorage.getItem('alEemanGallery')) || [];
    
    // Load team data
    const seniorPlayers = JSON.parse(localStorage.getItem('seniorPlayers')) || [
        { name: "Adebayo Ahmed", position: "Goalkeeper", img: "images/goalkeeper.jpeg" },
        { name: "Taiwo Lukmon", position: "Defender", img: "images/skipo.jpeg" },
        { name: "Omolewa Afeez", position: "Defender", img: "images/jabala2.jpeg" },
        { name: "Femi Ojo", position: "Midfielder", img: "images/al eeman 3.jpeg" },
        { name: "Ibrahim Sule", position: "Midfielder", img: "images/al eeman 3.jpeg" },
        { name: "James Akpan", position: "Forward", img: "images/al eeman 3.jpeg" },
        { name: "Adedeji Adeolu", position: "Forward", img: "images/adex.jpeg" },
        { name: "Musa Abdullahi", position: "Midfielder", img: "images/al eeman 3.jpeg" }
    ];
    
    const u16Players = JSON.parse(localStorage.getItem('u16Players')) || [
        { name: "Tunde Adekunle", position: "Forward", img: "images/al eeman 3.jpeg" },
        { name: "Segun Balogun", position: "Midfielder", img: "images/al eeman 3.jpeg" },
        { name: "Oluwaseun Kola", position: "Defender", img: "images/al eeman 3.jpeg" },
        { name: "Abdul Rasheed", position: "Goalkeeper", img: "images/al eeman 3.jpeg" },
        { name: "Chukwuemeka Obi", position: "Midfielder", img: "images/al eeman 3.jpeg" },
        { name: "Sadiq Mohammed", position: "Defender", img: "images/al eeman 3.jpeg" }
    ];
    
    const u13Players = JSON.parse(localStorage.getItem('u13Players')) || [
        { name: "Aminu Sani", position: "Forward", img: "images/al eeman 3.jpeg" },
        { name: "Peter Okeke", position: "Midfielder", img: "images/al eeman 3.jpeg" },
        { name: "Yusuf Bello", position: "Defender", img: "images/al eeman 3.jpeg" },
        { name: "John Okafor", position: "Goalkeeper", img: "images/al eeman 3.jpeg" },
        { name: "Samuel Adeyemi", position: "Midfielder", img: "images/al eeman 3.jpeg" }
    ];
    
    const u10Players = JSON.parse(localStorage.getItem('u10Players')) || [
        { name: "Kolawole Ade", position: "Forward", img: "images/al eeman 3.jpeg" },
        { name: "Tochukwu Nwa", position: "Midfielder", img: "images/al eeman 3.jpeg" },
        { name: "David Okon", position: "Defender", img: "images/al eeman 3.jpeg" },
        { name: "Emmanuel Udoh", position: "Goalkeeper", img: "images/al eeman 3.jpeg" }
    ];
    
    const coaches = JSON.parse(localStorage.getItem('coaches')) || [
        { name: "Coach Adeshina Saheed Salenco", position: "Head Coach", img: "images/salenco.jpeg" },
        { name: "Coach Taiwo Lukmon", position: "Assistant Coach", img: "images/al eeman 2.jpeg" },
        { name: "Coach Taiwo Lukmon", position: "U-16 Coach", img: "images/al eeman 2.jpeg" },
        { name: "Coach Taiwo Lukmon", position: "U-13 Coach", img: "images/al eeman 2.jpeg" },
        { name: "Coach Taiwo Lukmon", position: "U-10 Coach", img: "images/al eeman 2.jpeg" },
    ];
    
    const boardMembers = JSON.parse(localStorage.getItem('boardMembers')) || [
        { name: "Alhaji Alabi Badmus", position: "Club Chairman & Founder", img: "images/allfound.jpeg" },
        { name: "Mr. Fatai Akeem Alabi", position: "Club Secretary", img: "images/secretaryeman.jpeg" },
        { name: "Mr. Rasheed Nasir Adeshina", position: "Board Member", img: "images/al eeman 2.jpeg" },
        { name: "Otunba Alabi Mayowa", position: "Board Member", img: "images/otun.jpeg"}
    ];
    
    return {
        userUploadedImages,
        seniorPlayers,
        u16Players,
        u13Players,
        u10Players,
        coaches,
        boardMembers
    };
}

// Gallery data - initial images
const defaultGalleryItems = [
    { img: "images/al eeman 3.jpeg", category: "matches", caption: "Senior Team in Action" },
    { img: "images/princess.jpeg", category: "teams", caption: "Team Photo 2023" },
    { img: "images/allfound.jpeg", category: "teams", caption: "Founders and Board Members" },
    { img: "images/al eeman 2.jpeg", category: "facilities", caption: "Club Logo and Identity" },
    { img: "images/coachEman.jpeg", category: "coaches", caption: "Head Coach Adeshina" },
    { img: "images/ishana.jpeg", category: "coaches", caption: "Shooting Stars Player Ishana" },
];

// Image Modal elements
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalCategory = document.getElementById('modalCategory');
const modalDate = document.getElementById('modalDate');
const closeModal = document.getElementById('closeModal');

// Swiper instances
let teamSwipers = [];
let gallerySwiper;

// Function to show notification
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-exclamation-triangle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Function to create team card
function createTeamCard(person) {
    return `
        <div class="swiper-slide">
            <div class="team-card">
                <div class="team-img-container">
                    <img src="${person.img}" alt="${person.name}" class="team-img">
                </div>
                <div class="team-info">
                    <h3>${person.name}</h3>
                    <p class="position">${person.position}</p>
                </div>
            </div>
        </div>
    `;
}

// Function to create gallery slide
function createGallerySlide(item) {
    return `
        <div class="swiper-slide">
            <div class="gallery-slide" data-category="${item.category}">
                <img src="${item.img}" alt="${item.caption}" 
                     data-caption="${item.caption}"
                     data-description="${item.description || ''}"
                     data-category="${item.category}"
                     ${item.date ? `data-date="${item.date}"` : ''}>
                <div class="gallery-caption">
                    <h4>${item.caption}</h4>
                    <span class="gallery-category">${item.category}</span>
                </div>
            </div>
        </div>
    `;
}

// Function to open image modal
function openImageModal(imageData) {
    modalImage.src = imageData.img;
    modalImage.alt = imageData.caption;
    modalTitle.textContent = imageData.caption;
    modalDescription.textContent = imageData.description || 'No description provided.';
    modalCategory.textContent = imageData.category;
    
    if (imageData.date) {
        const date = new Date(imageData.date);
        modalDate.textContent = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
    } else {
        modalDate.textContent = 'No date available';
    }
    
    imageModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Function to close image modal
function closeImageModal() {
    imageModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Initialize team swipers
function initializeTeamSwipers() {
    // Initialize all team swipers
    document.querySelectorAll('.team-swiper').forEach((swiperEl, index) => {
        const swiper = new Swiper(swiperEl, {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: swiperEl.querySelector('.swiper-pagination'),
                clickable: true,
            },
            navigation: {
                nextEl: swiperEl.querySelector('.swiper-button-next'),
                prevEl: swiperEl.querySelector('.swiper-button-prev'),
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 3,
                },
                1024: {
                    slidesPerView: 4,
                },
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
        });
        teamSwipers.push(swiper);
    });
}

// Initialize gallery swiper
function initializeGallerySwiper() {
    const gallerySwiperEl = document.querySelector('.gallery-swiper');
    gallerySwiper = new Swiper(gallerySwiperEl, {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
            el: gallerySwiperEl.querySelector('.swiper-pagination'),
            clickable: true,
        },
        navigation: {
            nextEl: gallerySwiperEl.querySelector('.swiper-button-next'),
            prevEl: gallerySwiperEl.querySelector('.swiper-button-prev'),
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        loop: true,
    });
}

// Populate all sections with data
function populateAllSections(data) {
    // Populate senior players section
    const seniorPlayersContainer = document.getElementById('senior-players');
    seniorPlayersContainer.innerHTML = '';
    data.seniorPlayers.forEach(player => {
        seniorPlayersContainer.innerHTML += createTeamCard(player);
    });

    // Populate U-16 players section
    const u16Container = document.getElementById('u16-players');
    u16Container.innerHTML = '';
    data.u16Players.forEach(player => {
        u16Container.innerHTML += createTeamCard(player);
    });

    // Populate U-13 players section
    const u13Container = document.getElementById('u13-players');
    u13Container.innerHTML = '';
    data.u13Players.forEach(player => {
        u13Container.innerHTML += createTeamCard(player);
    });

    // Populate U-10 players section
    const u10Container = document.getElementById('u10-players');
    u10Container.innerHTML = '';
    data.u10Players.forEach(player => {
        u10Container.innerHTML += createTeamCard(player);
    });

    // Populate coaches section
    const coachesContainer = document.getElementById('coaches-staff');
    coachesContainer.innerHTML = '';
    data.coaches.forEach(coach => {
        coachesContainer.innerHTML += createTeamCard(coach);
    });

    // Populate board members section
    const boardContainer = document.getElementById('board-members');
    boardContainer.innerHTML = '';
    data.boardMembers.forEach(member => {
        boardContainer.innerHTML += createTeamCard(member);
    });

    // Populate gallery section with combined images
    populateGallery(data.userUploadedImages);
}

// Populate gallery section with combined images
function populateGallery(userUploadedImages) {
    const galleryContainer = document.getElementById('gallery-images');
    galleryContainer.innerHTML = '';
    
    // Combine default and user uploaded images
    const allImages = [...defaultGalleryItems, ...userUploadedImages.map(item => ({
        img: item.imageUrl,
        category: item.category,
        caption: item.title,
        description: item.description,
        date: item.date
    }))];
    
    allImages.forEach(item => {
        galleryContainer.innerHTML += createGallerySlide(item);
    });
    
    // Reinitialize gallery swiper
    if (gallerySwiper) {
        gallerySwiper.update();
    }
    
    // Add click event to gallery slides
    document.querySelectorAll('.gallery-slide img').forEach(img => {
        img.addEventListener('click', function() {
            const imageData = {
                img: this.src,
                caption: this.getAttribute('data-caption') || this.alt,
                category: this.getAttribute('data-category'),
                description: this.getAttribute('data-description'),
                date: this.getAttribute('data-date')
            };
            
            openImageModal(imageData);
        });
    });
}

// Gallery filter functionality
function updateGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Filter gallery slides
            document.querySelectorAll('.gallery-slide').forEach(slide => {
                if (filter === 'all' || slide.getAttribute('data-category') === filter) {
                    slide.closest('.swiper-slide').style.display = 'block';
                } else {
                    slide.closest('.swiper-slide').style.display = 'none';
                }
            });
            
            // Update swiper
            if (gallerySwiper) {
                gallerySwiper.update();
            }
        });
    });
}

// Modal event listeners
closeModal.addEventListener('click', closeImageModal);

// Close modal when clicking outside the modal content
imageModal.addEventListener('click', function(e) {
    if (e.target === imageModal) {
        closeImageModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && imageModal.classList.contains('active')) {
        closeImageModal();
    }
});

// Form submission handling for player registration
const registrationForm = document.getElementById('registrationForm');

if (registrationForm) {
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const ageCategory = document.getElementById('ageCategory').value;
        
        // Save registration to localStorage
        const registration = {
            id: Date.now(),
            firstName,
            lastName,
            email,
            phone,
            ageCategory,
            date: new Date().toISOString()
        };
        
        let registrations = JSON.parse(localStorage.getItem('playerRegistrations')) || [];
        registrations.push(registration);
        localStorage.setItem('playerRegistrations', JSON.stringify(registrations));
        
        // Show success message
        showNotification(`Thank you ${firstName} ${lastName}! Your registration has been submitted successfully. We will contact you soon.`);
        
        // Reset the form
        registrationForm.reset();
    });
}

// Highlight active navigation link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a:not(.admin-link)');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load data
    const data = loadData();
    
    // Populate all sections
    populateAllSections(data);
    
    // Initialize swipers
    initializeTeamSwipers();
    initializeGallerySwiper();
    
    // Initialize gallery filter
    updateGalleryFilter();
});