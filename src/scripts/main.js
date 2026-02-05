// Main Browser Controller
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 WRLD Browser starting...');
    
    // Elements
    const contentArea = document.getElementById('content-area');
    const urlInput = document.getElementById('url-input');
    const navItems = document.querySelectorAll('.nav-item');
    const quickCards = document.querySelectorAll('.quick-card');
    const backBtn = document.getElementById('back-btn');
    const forwardBtn = document.getElementById('forward-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const goBtn = document.getElementById('go-btn');
    const aiBtn = document.getElementById('ai-btn');
    const bookmarksBtn = document.getElementById('bookmarks-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const newTabBtn = document.getElementById('new-tab-btn');
    
    // Current page state
    let currentPage = 'home';
    let currentWebview = null;
    
    // Initialize
    updateActiveNav();
    
    // Navigation functions
    function navigateTo(page, url = null) {
        console.log('Navigating to:', page, url);
        currentPage = page;
        
        // Update active navigation
        updateActiveNav();
        
        // Load content based on page
        switch(page) {
            case 'home':
                loadHomePage();
                break;
                
            case 'browse':
                if (url) {
                    loadWebPage(url);
                } else {
                    loadWebPage('https://duckduckgo.com');
                }
                break;
                
            case 'ai-tools':
                loadAITools();
                break;
                
            case 'bookmarks':
                loadBookmarks();
                break;
                
            case 'settings':
                loadSettings();
                break;
                
            default:
                loadHomePage();
        }
    }
    
    function updateActiveNav() {
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === currentPage) {
                item.classList.add('active');
            }
        });
    }
    
    function loadHomePage() {
        contentArea.innerHTML = `
            <div class="welcome-screen">
                <div class="welcome-logo">
                    <h1>🌐 WRLD</h1>
                    <p class="tagline">Lightweight • Private • Free</p>
                </div>
                
                <div class="quick-actions">
                    <div class="quick-card" data-page="browse">
                        <i class="fas fa-search"></i>
                        <h3>Browse Web</h3>
                        <p>Start browsing privately</p>
                    </div>
                    
                    <div class="quick-card" data-page="ai-tools">
                        <i class="fas fa-robot"></i>
                        <h3>AI Tools</h3>
                        <p>Free AI-powered tools</p>
                    </div>
                    
                    <div class="quick-card" data-page="bookmarks">
                        <i class="fas fa-bookmark"></i>
                        <h3>Bookmarks</h3>
                        <p>Your saved pages</p>
                    </div>
                    
                    <div class="quick-card" data-page="settings">
                        <i class="fas fa-cog"></i>
                        <h3>Settings</h3>
                        <p>Customize your browser</p>
                    </div>
                </div>
            </div>
        `;
        
        // Re-attach quick card listeners
        document.querySelectorAll('.quick-card').forEach(card => {
            card.addEventListener('click', function() {
                navigateTo(this.dataset.page);
            });
        });
    }
    
    function loadWebPage(url) {
        // Clean URL
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            if (url.includes('.')) {
                url = 'https://' + url;
            } else {
                url = 'https://duckduckgo.com/?q=' + encodeURIComponent(url);
            }
        }
        
        // Update URL input
        urlInput.value = url;
        
        // Create webview
        contentArea.innerHTML = `
            <div class="webview-container">
                <webview id="webview" src="${url}" style="width:100%; height:100%;"></webview>
            </div>
        `;
        
        currentWebview = document.getElementById('webview');
        
        // Listen for webview events
        if (currentWebview) {
            currentWebview.addEventListener('did-navigate', function(e) {
                urlInput.value = e.url;
            });
        }
    }
    
    function loadAITools() {
        contentArea.innerHTML = `
            <div class="loading">
                <h2>Loading AI Tools...</h2>
                <p>Please wait</p>
            </div>
        `;
        
        // Load AI Tools page
        fetch('pages/ai-tools.html')
            .then(response => response.text())
            .then(html => {
                contentArea.innerHTML = html;
                
                // Load AI Tools CSS
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'styles/ai-tools.css';
                document.head.appendChild(link);
                
                // Load AI Tools JS
                const script = document.createElement('script');
                script.src = 'scripts/ai-tools.js';
                document.body.appendChild(script);
            })
            .catch(error => {
                console.error('Error loading AI Tools:', error);
                contentArea.innerHTML = `
                    <div class="error">
                        <h2>Failed to load AI Tools</h2>
                        <p>${error.message}</p>
                    </div>
                `;
            });
    }
    
    function loadBookmarks() {
        contentArea.innerHTML = `
            <div class="page-container">
                <h2>📚 Bookmarks</h2>
                <p>Your saved websites will appear here.</p>
                <div id="bookmarks-list"></div>
            </div>
        `;
    }
    
    function loadSettings() {
        contentArea.innerHTML = `
            <div class="page-container">
                <h2>⚙️ Settings</h2>
                <p>Configure your browser preferences.</p>
                
                <div class="settings-section">
                    <h3>Privacy</h3>
                    <label>
                        <input type="checkbox" checked>
                        Block trackers
                    </label>
                    <label>
                        <input type="checkbox" checked>
                        Clear history on exit
                    </label>
                </div>
                
                <div class="settings-section">
                    <h3>Appearance</h3>
                    <label>
                        Dark mode <input type="checkbox" checked>
                    </label>
                </div>
            </div>
        `;
    }
    
    // Event Listeners
    
    // Navigation items
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo(this.dataset.page);
        });
    });
    
    // Quick cards
    quickCards.forEach(card => {
        card.addEventListener('click', function() {
            navigateTo(this.dataset.page);
        });
    });
    
    // URL input
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            navigateTo('browse', this.value);
        }
    });
    
    // Go button
    goBtn.addEventListener('click', function() {
        if (urlInput.value.trim()) {
            navigateTo('browse', urlInput.value);
        }
    });
    
    // Navigation buttons
    backBtn.addEventListener('click', function() {
        if (currentWebview && currentWebview.canGoBack()) {
            currentWebview.goBack();
        }
    });
    
    forwardBtn.addEventListener('click', function() {
        if (currentWebview && currentWebview.canGoForward()) {
            currentWebview.goForward();
        }
    });
    
    refreshBtn.addEventListener('click', function() {
        if (currentWebview) {
            currentWebview.reload();
        }
    });
    
    // AI button
    aiBtn.addEventListener('click', function() {
        navigateTo('ai-tools');
    });
    
    // Menu buttons
    bookmarksBtn.addEventListener('click', function() {
        navigateTo('bookmarks');
    });
    
    settingsBtn.addEventListener('click', function() {
        navigateTo('settings');
    });
    
    // New tab button
    newTabBtn.addEventListener('click', function() {
        navigateTo('home');
    });
    
    // Window controls (Tauri)
    document.querySelectorAll('.win-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!window.__TAURI__) {
                console.log('Window control clicked (Tauri not detected)');
                return;
            }
            
            const { getCurrentWindow } = window.__TAURI__.window;
            const currentWindow = getCurrentWindow();
            
            if (this.classList.contains('close')) {
                currentWindow.close();
            } else if (this.classList.contains('minimize')) {
                currentWindow.minimize();
            } else if (this.classList.contains('maximize')) {
                currentWindow.toggleMaximize();
            }
        });
    });
    
    // Tauri detection
    if (window.__TAURI__) {
        console.log('✅ Tauri detected - running in desktop mode');
        document.body.classList.add('tauri');
    } else {
        console.log('🌐 Tauri not detected - running in browser mode');
        document.body.classList.add('web');
    }
});
