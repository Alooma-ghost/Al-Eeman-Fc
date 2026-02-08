// Admin Configuration
const ADMIN_CONFIG = {
    credentials: {
        username: 'admin',
        password: 'admin123'
    },
    storageKeys: {
        gallery: 'alEemanGallery',
        seniorPlayers: 'seniorPlayers',
        u16Players: 'u16Players',
        u13Players: 'u13Players',
        u10Players: 'u10Players',
        coaches: 'coaches',
        boardMembers: 'boardMembers',
        registrations: 'playerRegistrations',
        adminLogin: 'adminLoggedIn'
    }
};

// State Management
let currentState = {
    isLoggedIn: localStorage.getItem(ADMIN_CONFIG.storageKeys.adminLogin) === 'true',
    currentSection: 'dashboard',
    editingItem: null,
    editingType: null
};

// DOM Elements
const adminLogin = document.getElementById('adminLogin');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const adminNavLinks = document.querySelectorAll('.admin-nav-link');
const adminSections = document.querySelectorAll('.admin-section');

// Form Elements
const uploadForm = document.getElementById('uploadForm');
const showUploadFormBtns = document.querySelectorAll('#showUploadForm, #showUploadForm2');
const cancelUploadBtn = document.getElementById('cancelUpload');
const adminUploadForm = document.getElementById('adminUploadForm');
const fileUploadArea = document.getElementById('fileUploadArea');
const filePreview = document.getElementById('filePreview');
const imageFileInput = document.getElementById('imageFile');

const playerForm = document.getElementById('playerForm');
const showPlayerFormBtn = document.getElementById('showPlayerForm');
const cancelPlayerFormBtn = document.getElementById('cancelPlayerForm');
const addPlayerForm = document.getElementById('addPlayerForm');

const staffForm = document.getElementById('staffForm');
const showStaffFormBtn = document.getElementById('showStaffForm');
const cancelStaffFormBtn = document.getElementById('cancelStaffForm');
const addStaffForm = document.getElementById('addStaffForm');

// Search and Filter Elements
const searchGallery = document.getElementById('searchGallery');
const categoryFilter = document.getElementById('categoryFilter');
const searchRegistrations = document.getElementById('searchRegistrations');
const filterByCategory = document.getElementById('filterByCategory');

// Tab Elements
const teamTabs = document.querySelectorAll('.team-tab');
const staffTabs = document.querySelectorAll('.staff-tab');

// Modal Elements
const confirmationModal = document.getElementById('confirmationModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const closeModal = document.getElementById('closeModal');
const cancelAction = document.getElementById('cancelAction');
const confirmAction = document.getElementById('confirmAction');

// Stats Elements
const totalImagesEl = document.getElementById('totalImages');
const totalPlayersEl = document.getElementById('totalPlayers');
const totalStaffEl = document.getElementById('totalStaff');
const totalRegistrationsEl = document.getElementById('totalRegistrations');
const lastUpdatedEl = document.getElementById('lastUpdated');

// Load data from localStorage
function loadData() {
    return {
        gallery: JSON.parse(localStorage.getItem(ADMIN_CONFIG.storageKeys.gallery)) || [],
        seniorPlayers: JSON.parse(localStorage.getItem(ADMIN_CONFIG.storageKeys.seniorPlayers)) || [],
        u16Players: JSON.parse(localStorage.getItem(ADMIN_CONFIG.storageKeys.u16Players)) || [],
        u13Players: JSON.parse(localStorage.getItem(ADMIN_CONFIG.storageKeys.u13Players)) || [],
        u10Players: JSON.parse(localStorage.getItem(ADMIN_CONFIG.storageKeys.u10Players)) || [],
        coaches: JSON.parse(localStorage.getItem(ADMIN_CONFIG.storageKeys.coaches)) || [],
        boardMembers: JSON.parse(localStorage.getItem(ADMIN_CONFIG.storageKeys.boardMembers)) || [],
        registrations: JSON.parse(localStorage.getItem(ADMIN_CONFIG.storageKeys.registrations)) || []
    };
}

// Save data to localStorage
function saveData(data) {
    localStorage.setItem(ADMIN_CONFIG.storageKeys.gallery, JSON.stringify(data.gallery));
    localStorage.setItem(ADMIN_CONFIG.storageKeys.seniorPlayers, JSON.stringify(data.seniorPlayers));
    localStorage.setItem(ADMIN_CONFIG.storageKeys.u16Players, JSON.stringify(data.u16Players));
    localStorage.setItem(ADMIN_CONFIG.storageKeys.u13Players, JSON.stringify(data.u13Players));
    localStorage.setItem(ADMIN_CONFIG.storageKeys.u10Players, JSON.stringify(data.u10Players));
    localStorage.setItem(ADMIN_CONFIG.storageKeys.coaches, JSON.stringify(data.coaches));
    localStorage.setItem(ADMIN_CONFIG.storageKeys.boardMembers, JSON.stringify(data.boardMembers));
    localStorage.setItem(ADMIN_CONFIG.storageKeys.registrations, JSON.stringify(data.registrations));
    
    // Update last updated timestamp
    const now = new Date();
    lastUpdatedEl.textContent = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Dispatch storage event to update main page
    window.dispatchEvent(new Event('storage'));
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                        type === 'error' ? 'fa-exclamation-circle' : 
                        'fa-exclamation-triangle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Initialize admin panel
function initAdmin() {
    if (currentState.isLoggedIn) {
        adminLogin.style.display = 'none';
        adminDashboard.style.display = 'block';
        loadDashboard();
        updateLastUpdated();
    } else {
        adminLogin.style.display = 'flex';
        adminDashboard.style.display = 'none';
    }
}

// Update last updated timestamp
function updateLastUpdated() {
    const now = new Date();
    lastUpdatedEl.textContent = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Load dashboard statistics
function loadDashboard() {
    const data = loadData();
    
    const totalImages = data.gallery.length;
    const totalPlayers = data.seniorPlayers.length + data.u16Players.length + 
                         data.u13Players.length + data.u10Players.length;
    const totalStaff = data.coaches.length + data.boardMembers.length;
    const totalRegistrations = data.registrations.length;
    
    totalImagesEl.textContent = totalImages;
    totalPlayersEl.textContent = totalPlayers;
    totalStaffEl.textContent = totalStaff;
    totalRegistrationsEl.textContent = totalRegistrations;
}

// Login form handler
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_CONFIG.credentials.username && 
        password === ADMIN_CONFIG.credentials.password) {
        currentState.isLoggedIn = true;
        localStorage.setItem(ADMIN_CONFIG.storageKeys.adminLogin, 'true');
        showNotification('Login successful! Welcome to the admin panel.', 'success');
        initAdmin();
    } else {
        showNotification('Invalid username or password. Try admin / admin123', 'error');
    }
});

// Logout handler
logoutBtn.addEventListener('click', function() {
    currentState.isLoggedIn = false;
    localStorage.removeItem(ADMIN_CONFIG.storageKeys.adminLogin);
    showNotification('Logged out successfully', 'success');
    initAdmin();
});

// Navigation handler
adminNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update active navigation link
        adminNavLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Update current section
        currentState.currentSection = this.dataset.section;
        
        // Hide all sections
        adminSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(currentState.currentSection);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Load section data
            switch(currentState.currentSection) {
                case 'dashboard':
                    loadDashboard();
                    break;
                case 'gallery':
                    loadGalleryManager();
                    break;
                case 'players':
                    loadPlayersManager();
                    break;
                case 'staff':
                    loadStaffManager();
                    break;
                case 'registrations':
                    loadRegistrations();
                    break;
            }
        }
    });
});

// Quick actions navigation
document.querySelectorAll('.action-card[data-section]').forEach(card => {
    card.addEventListener('click', function(e) {
        e.preventDefault();
        const section = this.dataset.section;
        const targetLink = document.querySelector(`.admin-nav-link[data-section="${section}"]`);
        if (targetLink) {
            targetLink.click();
        }
    });
});

// File upload preview
 imageFileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('File size must be less than 5MB', 'error');
            this.value = '';
            return;
        }
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            showNotification('Please upload a valid image (JPG, PNG, GIF)', 'error');
            this.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            filePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            filePreview.classList.add('has-image');
        };
        reader.readAsDataURL(file);
    }
});

// Show upload form
showUploadFormBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        uploadForm.style.display = 'block';
        this.style.display = 'none';
        window.scrollTo({ top: uploadForm.offsetTop - 100, behavior: 'smooth' });
    });
});

// Cancel upload
cancelUploadBtn.addEventListener('click', function() {
    uploadForm.style.display = 'none';
    showUploadFormBtns.forEach(btn => btn.style.display = 'flex');
    adminUploadForm.reset();
    filePreview.classList.remove('has-image');
    filePreview.innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Click to upload or drag and drop</p>
        <span>PNG, JPG, GIF up to 5MB</span>
    `;
});

// Gallery upload form handler - FIXED VERSION
adminUploadForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('imageTitle').value.trim();
    const category = document.getElementById('imageCategory').value;
    const description = document.getElementById('imageDescription').value.trim();
    const file = imageFileInput.files[0];
    
    // Validation
    if (!title) {
        showNotification('Please enter an image title', 'error');
        return;
    }
    
    if (!category) {
        showNotification('Please select a category', 'error');
        return;
    }
    
    if (!file) {
        showNotification('Please select an image to upload', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = loadData();
        
        const newImage = {
            id: Date.now(),
            title: title,
            category: category,
            description: description || '',
            imageUrl: e.target.result, // This stores the base64 image data
            date: new Date().toISOString()
        };
        
        console.log('Uploading image:', newImage); // Debug log
        
        data.gallery.push(newImage);
        saveData(data);
        
        // Reset form
        adminUploadForm.reset();
        filePreview.classList.remove('has-image');
        filePreview.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Click to upload or drag and drop</p>
            <span>PNG, JPG, GIF up to 5MB</span>
        `;
        
        showNotification('Image uploaded successfully! It will appear on the website gallery.', 'success');
        
        // Hide form and show upload button
        uploadForm.style.display = 'none';
        showUploadFormBtns.forEach(btn => btn.style.display = 'flex');
        
        // Reload gallery manager
        loadGalleryManager();
        loadDashboard();
    };
    
    reader.onerror = function() {
        showNotification('Error reading image file', 'error');
    };
    
    reader.readAsDataURL(file);
});

// Load gallery manager
function loadGalleryManager() {
    const data = loadData();
    const galleryGrid = document.getElementById('galleryGrid');
    const noGalleryResults = document.getElementById('noGalleryResults');
    
    console.log('Gallery data loaded:', data.gallery); // Debug log
    
    if (data.gallery.length === 0) {
        galleryGrid.innerHTML = '';
        noGalleryResults.style.display = 'block';
        return;
    }
    
    noGalleryResults.style.display = 'none';
    
    // Sort by date (newest first)
    const sortedGallery = [...data.gallery].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    galleryGrid.innerHTML = sortedGallery.map(image => `
        <div class="gallery-item" data-id="${image.id}">
            <img src="${image.imageUrl}" alt="${image.title}" class="gallery-image">
            <div class="gallery-info">
                <h4>${image.title}</h4>
                <span class="gallery-category">${image.category}</span>
                ${image.description ? `<p class="gallery-description">${image.description}</p>` : ''}
                <div class="gallery-meta">
                    <div class="gallery-date">${new Date(image.date).toLocaleDateString()}</div>
                    <div class="gallery-actions">
                        <button class="delete-btn delete-gallery-item" data-id="${image.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add delete event listeners
    document.querySelectorAll('.delete-gallery-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const imageId = parseInt(this.dataset.id);
            showConfirmationModal(
                'Delete Image',
                'Are you sure you want to delete this image? This action cannot be undone.',
                () => deleteGalleryItem(imageId)
            );
        });
    });
    
    // Initialize search
    searchGallery.addEventListener('input', function() {
        filterGallery();
    });
    
    // Initialize category filter
    categoryFilter.addEventListener('change', function() {
        filterGallery();
    });
}

// Filter gallery
function filterGallery() {
    const searchTerm = searchGallery.value.toLowerCase();
    const category = categoryFilter.value;
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const title = item.querySelector('h4').textContent.toLowerCase();
        const itemCategory = item.querySelector('.gallery-category').textContent;
        
        const matchesSearch = title.includes(searchTerm);
        const matchesCategory = category === 'all' || itemCategory === category;
        
        item.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
    });
}

// Delete gallery item
function deleteGalleryItem(imageId) {
    const data = loadData();
    data.gallery = data.gallery.filter(image => image.id !== imageId);
    saveData(data);
    showNotification('Image deleted successfully', 'success');
    loadGalleryManager();
    loadDashboard();
}

// Player management
showPlayerFormBtn.addEventListener('click', function() {
    playerForm.style.display = 'block';
    this.style.display = 'none';
    window.scrollTo({ top: playerForm.offsetTop - 100, behavior: 'smooth' });
});

cancelPlayerFormBtn.addEventListener('click', function() {
    playerForm.style.display = 'none';
    showPlayerFormBtn.style.display = 'flex';
    addPlayerForm.reset();
    currentState.editingItem = null;
});

addPlayerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('playerName').value;
    const position = document.getElementById('playerPosition').value;
    const team = document.getElementById('playerTeam').value;
    const imageUrl = document.getElementById('playerImage').value;
    
    const data = loadData();
    
    const player = {
        name: name,
        position: position,
        img: imageUrl
    };
    
    if (currentState.editingItem && currentState.editingType === 'player') {
        // Update existing player
        const teamKey = `${currentState.editingItem.team}Players`;
        const players = data[teamKey];
        const index = players.findIndex(p => p.name === currentState.editingItem.oldName);
        if (index !== -1) {
            players[index] = player;
        }
        showNotification('Player updated successfully!', 'success');
    } else {
        // Add new player
        const teamKey = `${team}Players`;
        data[teamKey].push(player);
        showNotification('Player added successfully!', 'success');
    }
    
    saveData(data);
    
    // Reset form
    addPlayerForm.reset();
    playerForm.style.display = 'none';
    showPlayerFormBtn.style.display = 'flex';
    currentState.editingItem = null;
    
    // Reload players manager
    loadPlayersManager();
    loadDashboard();
});

// Load players manager
function loadPlayersManager() {
    const data = loadData();
    const playersGrid = document.getElementById('playersGrid');
    
    // Get active team
    const activeTeam = document.querySelector('.team-tab.active')?.dataset.team || 'all';
    
    // Combine all players
    let allPlayers = [];
    
    if (activeTeam === 'all' || activeTeam === 'senior') {
        data.seniorPlayers.forEach(player => {
            allPlayers.push({ ...player, team: 'senior', teamName: 'Senior Team' });
        });
    }
    
    if (activeTeam === 'all' || activeTeam === 'u16') {
        data.u16Players.forEach(player => {
            allPlayers.push({ ...player, team: 'u16', teamName: 'Under-16 Team' });
        });
    }
    
    if (activeTeam === 'all' || activeTeam === 'u13') {
        data.u13Players.forEach(player => {
            allPlayers.push({ ...player, team: 'u13', teamName: 'Under-13 Team' });
        });
    }
    
    if (activeTeam === 'all' || activeTeam === 'u10') {
        data.u10Players.forEach(player => {
            allPlayers.push({ ...player, team: 'u10', teamName: 'Under-10 Team' });
        });
    }
    
    if (allPlayers.length === 0) {
        playersGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-users"></i>
                <h3>No Players Found</h3>
                <p>Add players to get started</p>
            </div>
        `;
        return;
    }
    
    playersGrid.innerHTML = allPlayers.map(player => `
        <div class="player-card">
            <img src="${player.img}" alt="${player.name}" class="player-image">
            <div class="player-info">
                <h4>${player.name}</h4>
                <p class="player-position">${player.position}</p>
                <span class="player-team">${player.teamName}</span>
                <div class="card-actions">
                    <button class="edit-btn edit-player" 
                            data-name="${player.name}"
                            data-position="${player.position}"
                            data-team="${player.team}"
                            data-image="${player.img}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn delete-player" 
                            data-name="${player.name}"
                            data-team="${player.team}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-player').forEach(btn => {
        btn.addEventListener('click', function() {
            editPlayer(this.dataset);
        });
    });
    
    document.querySelectorAll('.delete-player').forEach(btn => {
        btn.addEventListener('click', function() {
            showConfirmationModal(
                'Delete Player',
                'Are you sure you want to delete this player? This action cannot be undone.',
                () => deletePlayer(this.dataset.name, this.dataset.team)
            );
        });
    });
}

// Edit player
function editPlayer(playerData) {
    currentState.editingItem = {
        oldName: playerData.name,
        team: playerData.team
    };
    currentState.editingType = 'player';
    
    document.getElementById('playerName').value = playerData.name;
    document.getElementById('playerPosition').value = playerData.position;
    document.getElementById('playerTeam').value = playerData.team;
    document.getElementById('playerImage').value = playerData.image;
    
    playerForm.style.display = 'block';
    showPlayerFormBtn.style.display = 'none';
    window.scrollTo({ top: playerForm.offsetTop - 100, behavior: 'smooth' });
}

// Delete player
function deletePlayer(playerName, team) {
    const data = loadData();
    const teamKey = `${team}Players`;
    data[teamKey] = data[teamKey].filter(player => player.name !== playerName);
    saveData(data);
    showNotification('Player deleted successfully', 'success');
    loadPlayersManager();
    loadDashboard();
}

// Staff management
showStaffFormBtn.addEventListener('click', function() {
    staffForm.style.display = 'block';
    this.style.display = 'none';
    window.scrollTo({ top: staffForm.offsetTop - 100, behavior: 'smooth' });
});

cancelStaffFormBtn.addEventListener('click', function() {
    staffForm.style.display = 'none';
    showStaffFormBtn.style.display = 'flex';
    addStaffForm.reset();
    currentState.editingItem = null;
});

addStaffForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('staffName').value;
    const role = document.getElementById('staffRole').value;
    const type = document.getElementById('staffType').value;
    const imageUrl = document.getElementById('staffImage').value;
    
    const data = loadData();
    
    const staffMember = {
        name: name,
        position: role,
        img: imageUrl
    };
    
    if (currentState.editingItem && currentState.editingType === 'staff') {
        // Update existing staff
        const staffKey = currentState.editingItem.type === 'coach' ? 'coaches' : 'boardMembers';
        const staff = data[staffKey];
        const index = staff.findIndex(s => s.name === currentState.editingItem.oldName);
        if (index !== -1) {
            staff[index] = staffMember;
        }
        showNotification('Staff member updated successfully!', 'success');
    } else {
        // Add new staff
        if (type === 'coach') {
            data.coaches.push(staffMember);
        } else {
            data.boardMembers.push(staffMember);
        }
        showNotification('Staff member added successfully!', 'success');
    }
    
    saveData(data);
    
    // Reset form
    addStaffForm.reset();
    staffForm.style.display = 'none';
    showStaffFormBtn.style.display = 'flex';
    currentState.editingItem = null;
    
    // Reload staff manager
    loadStaffManager();
    loadDashboard();
});

// Load staff manager
function loadStaffManager() {
    const data = loadData();
    const staffGrid = document.getElementById('staffGrid');
    
    // Get active type
    const activeType = document.querySelector('.staff-tab.active')?.dataset.type || 'all';
    
    // Combine staff
    let allStaff = [];
    
    if (activeType === 'all' || activeType === 'coach') {
        data.coaches.forEach(coach => {
            allStaff.push({ ...coach, type: 'coach', typeName: 'Coaching Staff' });
        });
    }
    
    if (activeType === 'all' || activeType === 'board') {
        data.boardMembers.forEach(member => {
            allStaff.push({ ...member, type: 'board', typeName: 'Board Member' });
        });
    }
    
    if (allStaff.length === 0) {
        staffGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-chalkboard-teacher"></i>
                <h3>No Staff Members Found</h3>
                <p>Add staff members to get started</p>
            </div>
        `;
        return;
    }
    
    staffGrid.innerHTML = allStaff.map(staff => `
        <div class="staff-card">
            <img src="${staff.img}" alt="${staff.name}" class="staff-image">
            <div class="staff-info">
                <h4>${staff.name}</h4>
                <p class="staff-role">${staff.position}</p>
                <span class="staff-type">${staff.typeName}</span>
                <div class="card-actions">
                    <button class="edit-btn edit-staff" 
                            data-name="${staff.name}"
                            data-role="${staff.position}"
                            data-type="${staff.type}"
                            data-image="${staff.img}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn delete-staff" 
                            data-name="${staff.name}"
                            data-type="${staff.type}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.edit-staff').forEach(btn => {
        btn.addEventListener('click', function() {
            editStaff(this.dataset);
        });
    });
    
    document.querySelectorAll('.delete-staff').forEach(btn => {
        btn.addEventListener('click', function() {
            showConfirmationModal(
                'Delete Staff Member',
                'Are you sure you want to delete this staff member? This action cannot be undone.',
                () => deleteStaff(this.dataset.name, this.dataset.type)
            );
        });
    });
}

// Edit staff
function editStaff(staffData) {
    currentState.editingItem = {
        oldName: staffData.name,
        type: staffData.type
    };
    currentState.editingType = 'staff';
    
    document.getElementById('staffName').value = staffData.name;
    document.getElementById('staffRole').value = staffData.role;
    document.getElementById('staffType').value = staffData.type;
    document.getElementById('staffImage').value = staffData.image;
    
    staffForm.style.display = 'block';
    showStaffFormBtn.style.display = 'none';
    window.scrollTo({ top: staffForm.offsetTop - 100, behavior: 'smooth' });
}

// Delete staff
function deleteStaff(staffName, type) {
    const data = loadData();
    const staffKey = type === 'coach' ? 'coaches' : 'boardMembers';
    data[staffKey] = data[staffKey].filter(staff => staff.name !== staffName);
    saveData(data);
    showNotification('Staff member deleted successfully', 'success');
    loadStaffManager();
    loadDashboard();
}

// Load registrations
function loadRegistrations() {
    const data = loadData();
    const tableBody = document.getElementById('registrationsTableBody');
    const noRegistrations = document.getElementById('noRegistrations');
    
    if (data.registrations.length === 0) {
        tableBody.innerHTML = '';
        noRegistrations.style.display = 'block';
        return;
    }
    
    noRegistrations.style.display = 'none';
    
    // Sort by date (newest first)
    const sortedRegistrations = [...data.registrations].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    tableBody.innerHTML = sortedRegistrations.map(registration => `
        <tr>
            <td>${registration.id}</td>
            <td>${registration.firstName} ${registration.lastName}</td>
            <td>${registration.email}</td>
            <td>${registration.phone}</td>
            <td>
                <span class="player-team">${registration.ageCategory}</span>
            </td>
            <td>${new Date(registration.date).toLocaleDateString()}</td>
            <td>
                <div class="registration-actions">
                    <button class="view-btn view-registration" data-id="${registration.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="delete-btn delete-registration" data-id="${registration.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.view-registration').forEach(btn => {
        btn.addEventListener('click', function() {
            viewRegistration(parseInt(this.dataset.id));
        });
    });
    
    document.querySelectorAll('.delete-registration').forEach(btn => {
        btn.addEventListener('click', function() {
            showConfirmationModal(
                'Delete Registration',
                'Are you sure you want to delete this registration? This action cannot be undone.',
                () => deleteRegistration(parseInt(this.dataset.id))
            );
        });
    });
    
    // Initialize search and filter
    searchRegistrations.addEventListener('input', filterRegistrations);
    filterByCategory.addEventListener('change', filterRegistrations);
}

// Filter registrations
function filterRegistrations() {
    const searchTerm = searchRegistrations.value.toLowerCase();
    const category = filterByCategory.value;
    const rows = document.querySelectorAll('#registrationsTableBody tr');
    
    rows.forEach(row => {
        const name = row.children[1].textContent.toLowerCase();
        const email = row.children[2].textContent.toLowerCase();
        const ageCategory = row.children[4].querySelector('.player-team').textContent;
        
        const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm);
        const matchesCategory = category === 'all' || ageCategory.includes(category);
        
        row.style.display = matchesSearch && matchesCategory ? '' : 'none';
    });
}

// View registration details
function viewRegistration(id) {
    const data = loadData();
    const registration = data.registrations.find(r => r.id === id);
    
    if (registration) {
        const details = `
            Name: ${registration.firstName} ${registration.lastName}
            Email: ${registration.email}
            Phone: ${registration.phone}
            Age Category: ${registration.ageCategory}
            Date: ${new Date(registration.date).toLocaleDateString()}
            ${registration.experience ? `Experience: ${registration.experience} years` : ''}
            ${registration.previousClub ? `Previous Club: ${registration.previousClub}` : ''}
            ${registration.message ? `Message: ${registration.message}` : ''}
        `;
        
        alert(details);
    }
}

// Delete registration
function deleteRegistration(id) {
    const data = loadData();
    data.registrations = data.registrations.filter(r => r.id !== id);
    saveData(data);
    showNotification('Registration deleted successfully', 'success');
    loadRegistrations();
    loadDashboard();
}

// Export registrations to CSV
document.getElementById('exportRegistrations').addEventListener('click', function() {
    const data = loadData();
    
    if (data.registrations.length === 0) {
        showNotification('No registrations to export', 'warning');
        return;
    }
    
    const csvHeaders = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Age Category', 'Date'];
    const csvRows = data.registrations.map(reg => [
        reg.id,
        reg.firstName,
        reg.lastName,
        reg.email,
        reg.phone,
        reg.ageCategory,
        new Date(reg.date).toLocaleDateString()
    ]);
    
    const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    showNotification('Registrations exported successfully', 'success');
});

// Team tabs
teamTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        teamTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        loadPlayersManager();
    });
});

// Staff tabs
staffTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        staffTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        loadStaffManager();
    });
});

// Confirmation modal
function showConfirmationModal(title, message, confirmCallback) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    confirmationModal.classList.add('active');
    
    // Store callback
    confirmAction.onclick = function() {
        confirmCallback();
        confirmationModal.classList.remove('active');
    };
}

// Close modal handlers
closeModal.addEventListener('click', function() {
    confirmationModal.classList.remove('active');
});

cancelAction.addEventListener('click', function() {
    confirmationModal.classList.remove('active');
});

// Close modal on outside click
confirmationModal.addEventListener('click', function(e) {
    if (e.target === confirmationModal) {
        confirmationModal.classList.remove('active');
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && confirmationModal.classList.contains('active')) {
        confirmationModal.classList.remove('active');
    }
});

// Initialize admin panel on load
document.addEventListener('DOMContentLoaded', function() {
    initAdmin();
    
    // Set current year
    const yearSpan = document.querySelector('.admin-footer p');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.innerHTML = yearSpan.innerHTML.replace('2023', currentYear);
    }
});