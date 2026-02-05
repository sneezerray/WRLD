// AI Tools Manager
document.addEventListener('DOMContentLoaded', function() {
    console.log('⚡ AI Tools module loaded');
    
    // AI Tools Database
    const aiTools = [
        {
            id: 'text-summarizer',
            name: 'Text Summarizer',
            description: 'Summarize long articles, documents, and web pages using local NLP models. No data sent to external servers.',
            category: 'writing',
            badge: 'local',
            icon: '📝',
            api: 'local://summarizer',
            requiresKey: false,
            model: 'bart-large-cnn',
            size: '1.6GB'
        },
        {
            id: 'image-upscaler',
            name: 'Image Upscaler',
            description: 'Enhance image resolution up to 4x using ESRGAN models running offline on your device.',
            category: 'design',
            badge: 'local',
            icon: '🖼️',
            api: 'local://upscaler',
            requiresKey: false,
            model: 'Real-ESRGAN',
            size: '670MB'
        },
        {
            id: 'code-explainer',
            name: 'Code Explainer',
            description: 'Explain complex code snippets in simple terms using CodeLlama running locally.',
            category: 'code',
            badge: 'local',
            icon: '💻',
            api: 'local://code-explainer',
            requiresKey: false,
            model: 'CodeLlama-7B',
            size: '4.2GB'
        },
        {
            id: 'text-to-speech',
            name: 'Text to Speech',
            description: 'Convert text to natural-sounding speech using free TTS APIs with multiple voices.',
            category: 'audio',
            badge: 'api',
            icon: '🔊',
            api: 'https://api.wrl.ai/tts',
            requiresKey: false,
            model: 'Coqui TTS',
            size: '0MB'
        },
        {
            id: 'transcript-generator',
            name: 'Transcript Generator',
            description: 'Generate accurate transcripts from audio files using Whisper.cpp running locally.',
            category: 'audio',
            badge: 'local',
            icon: '🎙️',
            api: 'local://transcriber',
            requiresKey: false,
            model: 'Whisper Medium',
            size: '1.5GB'
        },
        {
            id: 'flashcard-maker',
            name: 'Flashcard Maker',
            description: 'Automatically create study flashcards from your notes and textbooks.',
            category: 'study',
            badge: 'api',
            icon: '📚',
            api: 'https://api.wrl.ai/flashcards',
            requiresKey: false,
            model: 'GPT-3.5 (Free)',
            size: '0MB'
        },
        {
            id: 'color-palette',
            name: 'Color Palette Generator',
            description: 'Generate harmonious color palettes from images or themes using AI.',
            category: 'design',
            badge: 'local',
            icon: '🎨',
            api: 'local://color-palette',
            requiresKey: false,
            model: 'ColorAI',
            size: '320MB'
        },
        {
            id: 'markdown-editor',
            name: 'Smart Markdown Editor',
            description: 'AI-powered markdown editor with auto-formatting and content suggestions.',
            category: 'writing',
            badge: 'local',
            icon: '✏️',
            api: 'local://markdown-ai',
            requiresKey: false,
            model: 'Custom',
            size: '280MB'
        },
        {
            id: 'audio-cleaner',
            name: 'Audio Cleaner',
            description: 'Remove background noise and enhance audio quality using AI models.',
            category: 'audio',
            badge: 'local',
            icon: '🎵',
            api: 'local://audio-cleaner',
            requiresKey: false,
            model: 'Demucs',
            size: '890MB'
        },
        {
            id: 'git-helper',
            name: 'Git Assistant',
            description: 'Generate Git commands and explanations based on your workflow.',
            category: 'code',
            badge: 'api',
            icon: '🔄',
            api: 'https://api.wrl.ai/git-helper',
            requiresKey: false,
            model: 'GPT-3.5',
            size: '0MB'
        }
    ];
    
    // Categories
    const categories = [
        { id: 'all', name: 'All Tools' },
        { id: 'writing', name: 'Writing & Text' },
        { id: 'design', name: 'Design & Images' },
        { id: 'code', name: 'Coding & Tech' },
        { id: 'audio', name: 'Music & Audio' },
        { id: 'study', name: 'Study & Learning' }
    ];
    
    // State
    let currentCategory = 'all';
    let searchQuery = '';
    let pinnedTools = JSON.parse(localStorage.getItem('wrl-pinned-tools') || '[]');
    
    // Elements
    const categoryTabs = document.getElementById('category-tabs');
    const toolsGrid = document.getElementById('tools-grid');
    const pinnedSection = document.getElementById('pinned-section');
    const pinnedToolsGrid = document.getElementById('pinned-tools');
    const aiSearch = document.getElementById('ai-search');
    const toolsCount = document.getElementById('tools-count');
    const currentCategoryTitle = document.getElementById('current-category');
    const toolModal = document.getElementById('tool-modal');
    const closeModal = document.getElementById('close-modal');
    
    // Initialize
    init();
    
    function init() {
        renderCategories();
        renderTools();
        setupEventListeners();
        updateToolsCount();
    }
    
    function renderCategories() {
        categoryTabs.innerHTML = '';
        
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = `cat-btn ${category.id === currentCategory ? 'active' : ''}`;
            button.textContent = category.name;
            button.dataset.category = category.id;
            button.addEventListener('click', () => filterByCategory(category.id));
            categoryTabs.appendChild(button);
        });
    }
    
    function renderTools() {
        const filteredTools = filterTools();
        
        // Clear grids
        toolsGrid.innerHTML = '';
        pinnedToolsGrid.innerHTML = '';
        
        // Separate pinned tools
        const filteredPinnedTools = filteredTools.filter(tool => pinnedTools.includes(tool.id));
        const otherTools = filteredTools.filter(tool => !pinnedTools.includes(tool.id));
        
        // Show/hide pinned section
        if (filteredPinnedTools.length > 0 && currentCategory === 'all') {
            pinnedSection.style.display = 'block';
            filteredPinnedTools.forEach(tool => {
                pinnedToolsGrid.appendChild(createToolCard(tool));
            });
        } else {
            pinnedSection.style.display = 'none';
        }
        
        // Show other tools
        if (otherTools.length === 0 && filteredPinnedTools.length === 0) {
            toolsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No tools found</h3>
                    <p>Try a different search term or category</p>
                </div>
            `;
        } else {
            otherTools.forEach(tool => {
                toolsGrid.appendChild(createToolCard(tool));
            });
        }
        
        // Update category title
        const currentCat = categories.find(c => c.id === currentCategory);
        currentCategoryTitle.textContent = currentCat ? currentCat.name : 'All AI Tools';
        currentCategoryTitle.innerHTML = `<i class="fas fa-${getCategoryIcon(currentCategory)}"></i> ${currentCategoryTitle.textContent}`;
    }
    
    function createToolCard(tool) {
        const card = document.createElement('div');
        card.className = `tool-card ${pinnedTools.includes(tool.id) ? 'pinned' : ''}`;
        card.dataset.toolId = tool.id;
        
        const isPinned = pinnedTools.includes(tool.id);
        
        card.innerHTML = `
            <div class="tool-header">
                <div>
                    <div class="tool-title">
                        <span>${tool.icon}</span>
                        <h3>${tool.name}</h3>
                    </div>
                    <span class="tool-badge ${tool.badge}">${tool.badge}</span>
                </div>
                <button class="pin-btn ${isPinned ? 'pinned' : ''}" title="${isPinned ? 'Unpin' : 'Pin'}">
                    <i class="fas fa-thumbtack"></i>
                </button>
            </div>
            <p class="tool-desc">${tool.description}</p>
            <div class="tool-footer">
                <div class="tool-meta">
                    <span>${getCategoryName(tool.category)}</span>
                    <span>•</span>
                    <span>${tool.requiresKey ? 'API Key' : 'No Auth'}</span>
                </div>
                <div class="tool-actions">
                    <button class="btn btn-info info-btn">
                        <i class="fas fa-info-circle"></i>
                        Info
                    </button>
                    <button class="btn btn-open open-btn">
                        <i class="fas fa-external-link-alt"></i>
                        Open
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const pinBtn = card.querySelector('.pin-btn');
        const infoBtn = card.querySelector('.info-btn');
        const openBtn = card.querySelector('.open-btn');
        
        pinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePin(tool.id);
        });
        
        infoBtn.addEventListener('click', () => showToolInfo(tool.id));
        openBtn.addEventListener('click', () => openTool(tool.id));
        
        return card;
    }
    
    function filterTools() {
        let filtered = [...aiTools];
        
        // Filter by category
        if (currentCategory !== 'all') {
            filtered = filtered.filter(tool => tool.category === currentCategory);
        }
        
        // Filter by search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(tool => 
                tool.name.toLowerCase().includes(query) ||
                tool.description.toLowerCase().includes(query) ||
                getCategoryName(tool.category).toLowerCase().includes(query)
            );
        }
        
        return filtered;
    }
    
    function getCategoryName(categoryId) {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : categoryId;
    }
    
    function getCategoryIcon(categoryId) {
        const icons = {
            'all': 'robot',
            'writing': 'pen',
            'design': 'palette',
            'code': 'code',
            'audio': 'music',
            'study': 'book'
        };
        return icons[categoryId] || 'robot';
    }
    
    function filterByCategory(categoryId) {
        currentCategory = categoryId;
        
        // Update active tab
        document.querySelectorAll('.cat-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === categoryId);
        });
        
        renderTools();
        updateToolsCount();
    }
    
    function togglePin(toolId) {
        const index = pinnedTools.indexOf(toolId);
        
        if (index === -1) {
            pinnedTools.push(toolId);
        } else {
            pinnedTools.splice(index, 1);
        }
        
        localStorage.setItem('wrl-pinned-tools', JSON.stringify(pinnedTools));
        renderTools();
    }
    
    function showToolInfo(toolId) {
        const tool = aiTools.find(t => t.id === toolId);
        if (!tool) return;
        
        document.getElementById('modal-title').textContent = tool.name;
        
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <div class="tool-info">
                <div class="info-header">
                    <div class="info-icon">${tool.icon}</div>
                    <div>
                        <h3 style="margin: 0 0 5px 0;">${tool.name}</h3>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <span class="tool-badge ${tool.badge}">${tool.badge}</span>
                            <span style="color: #8b949e;">${getCategoryName(tool.category)}</span>
                        </div>
                    </div>
                </div>
                
                <p style="margin: 20px 0; line-height: 1.6;">${tool.description}</p>
                
                <div class="info-details">
                    <h4 style="margin: 0 0 10px 0; color: #c9d1d9;">Details</h4>
                    <ul style="list-style: none; padding: 0; color: #8b949e;">
                        <li style="padding: 5px 0;">
                            <i class="fas fa-microchip"></i>
                            <strong> Model:</strong> ${tool.model}
                        </li>
                        <li style="padding: 5px 0;">
                            <i class="fas fa-hdd"></i>
                            <strong> Size:</strong> ${tool.size}
                        </li>
                        <li style="padding: 5px 0;">
                            <i class="fas fa-key"></i>
                            <strong> Auth:</strong> ${tool.requiresKey ? 'API Key Required' : 'No Authentication'}
                        </li>
                        <li style="padding: 5px 0;">
                            <i class="fas fa-bolt"></i>
                            <strong> Status:</strong> 
                            <span style="color: #28ca42;">Ready</span>
                        </li>
                    </ul>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: #0d1117; border-radius: 8px;">
                    <h4 style="margin: 0 0 10px 0; color: #c9d1d9;">Privacy</h4>
                    <p style="margin: 0; color: #8b949e; font-size: 0.9rem;">
                        ${tool.badge === 'local' 
                            ? '✅ This tool runs 100% locally on your device. No data is sent to external servers.' 
                            : '⚠️ This tool uses free public APIs. Some data may be processed externally.'}
                    </p>
                </div>
            </div>
        `;
        
        // Update pin button
        const pinBtn = document.getElementById('modal-pin-btn');
        const isPinned = pinnedTools.includes(toolId);
        pinBtn.innerHTML = `<i class="fas fa-thumbtack"></i> ${isPinned ? 'Unpin' : 'Pin'}`;
        pinBtn.onclick = () => {
            togglePin(toolId);
            pinBtn.innerHTML = `<i class="fas fa-thumbtack"></i> ${pinnedTools.includes(toolId) ? 'Unpin' : 'Pin'}`;
        };
        
        // Update open button
        const openBtn = document.getElementById('modal-open-btn');
        openBtn.onclick = () => {
            openTool(toolId);
            closeToolModal();
        };
        
        // Show modal
        toolModal.style.display = 'flex';
    }
    
    function openTool(toolId) {
        const tool = aiTools.find(t => t.id === toolId);
        if (!tool) return;
        
        console.log(`Opening AI tool: ${tool.name}`);
        
        // In Tauri, you would use window.open or create new webview
        if (window.__TAURI__) {
            // Tauri implementation
            const { invoke } = window.__TAURI__.core;
            invoke('open_ai_tool', { toolId: tool.id, toolName: tool.name })
                .then(() => console.log('Tool opened'))
                .catch(err => console.error('Failed to open tool:', err));
        } else {
            // Browser fallback
            alert(`Opening: ${tool.name}\n\nAPI: ${tool.api}\n\n(In Tauri, this would open in a new window)`);
        }
    }
    
    function closeToolModal() {
        toolModal.style.display = 'none';
    }
    
    function updateToolsCount() {
        const totalTools = aiTools.length;
        const visibleTools = filterTools().length;
        
        if (searchQuery) {
            toolsCount.textContent = `${visibleTools} of ${totalTools} tools`;
        } else if (currentCategory !== 'all') {
            toolsCount.textContent = `${visibleTools} tools in this category`;
        } else {
            toolsCount.textContent = `${totalTools} AI tools available`;
        }
    }
    
    function setupEventListeners() {
        // Search
        aiSearch.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderTools();
            updateToolsCount();
        });
        
        // Modal
        closeModal.addEventListener('click', closeToolModal);
        toolModal.addEventListener('click', (e) => {
            if (e.target === toolModal) {
                closeToolModal();
            }
        });
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && toolModal.style.display === 'flex') {
                closeToolModal();
            }
        });
    }
});
