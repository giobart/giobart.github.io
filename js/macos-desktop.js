// macOS Desktop Window Manager
class MacOSWindowManager {
    constructor() {
        this.windows = new Map();
        this.zIndex = 100;
        this.activeWindow = null;
        this.init();
    }

    init() {
        this.createDesktopStructure();
        this.initializeWindows();
        this.setupEventListeners();
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    createDesktopStructure() {
        // Check if we're on mobile
        if (window.innerWidth <= 768) {
            return; // Don't create desktop on mobile
        }

        const body = document.body;
        
        // Create desktop container
        const desktop = document.createElement('div');
        desktop.className = 'macos-desktop desktop-view';
        
        // Create menu bar
        const menubar = document.createElement('div');
        menubar.className = 'macos-menubar';
        menubar.innerHTML = `
            <div class="menubar-left">
                <span class="apple-logo"></span>
                <span>Giovanni Bartolomeo</span>
            </div>
            <div class="menubar-right">
                <span id="current-time"></span>
            </div>
        `;
        
        // Create desktop content
        const desktopContent = document.createElement('div');
        desktopContent.className = 'desktop-content';
        
        // Create sidebar for About section
        const sidebar = document.createElement('div');
        sidebar.className = 'desktop-sidebar';
        sidebar.id = 'about-sidebar';
        
        // Create windows container
        const windowsContainer = document.createElement('div');
        windowsContainer.className = 'desktop-windows';
        windowsContainer.id = 'windows-container';
        
        // Create dock
        const dock = document.createElement('div');
        dock.className = 'macos-dock';
        dock.innerHTML = `
            <div class="dock-item" data-window="news" title="News">📰</div>
            <div class="dock-item" data-window="publications" title="Publications">📚</div>
            <div class="dock-item" data-window="students" title="Students">👥</div>
            <div class="dock-item" data-window="projects" title="Projects">🚀</div>
            <div class="dock-item" data-window="contacts" title="Contacts">📧</div>
        `;
        
        desktopContent.appendChild(sidebar);
        desktopContent.appendChild(windowsContainer);
        
        desktop.appendChild(menubar);
        desktop.appendChild(desktopContent);
        desktop.appendChild(dock);
        
        body.insertBefore(desktop, body.firstChild);
    }

    initializeWindows() {
        if (window.innerWidth <= 768) {
            return; // Don't initialize windows on mobile
        }

        const sections = [
            { id: 'news', title: 'News', icon: '📰' },
            { id: 'publications', title: 'Publications', icon: '📚' },
            { id: 'students', title: 'Students', icon: '👥' },
            { id: 'projects', title: 'Projects', icon: '🚀' },
            { id: 'contacts', title: 'Contacts', icon: '📧' }
        ];

        // Move About section to sidebar
        this.moveAboutToSidebar();

        // Wait a bit for JS scripts to load content
        setTimeout(() => {
            // Ensure content scripts have loaded
            this.ensureContentLoaded();
            
            sections.forEach((section, index) => {
                this.createWindow(section, index);
            });

            // Start with only the News window open and maximized
            this.maximizeWindow('news');
            
            // Minimize all other windows initially
            ['publications', 'students', 'projects', 'contacts'].forEach(sectionId => {
                this.minimizeWindow(sectionId);
            });
            
            // Update dock indicators
            this.updateDockIndicators();
        }, 1000);
    }
    
    ensureContentLoaded() {
        // Make sure the news, publications, and students content is loaded
        // These scripts should have already executed, but we can check if content exists
        
        // Check if news content exists, if not, try to reload
        if (!document.querySelector('#news-list').children.length) {
            // Try to re-execute news loading
            if (typeof fetch !== 'undefined') {
                this.loadNewsContent();
            }
        }
        
        // Similar checks for other content...
    }
    
    loadNewsContent() {
        fetch('news.yaml')
          .then(response => response.text())
          .then(yamlText => {
            const newsList = jsyaml.load(yamlText);
            const newsContainer = document.getElementById('news-list');
            if (newsContainer && newsList) {
                newsContainer.innerHTML = ''; // Clear existing content
                var divider = "";
                newsList.forEach(news => {
                    const newsElement = document.createElement('div');
                    var picture = news.picture ? `<img style="height: 10em;" src="${news.picture}" class="rounded float-right" alt="news cover image">` : ``;
                    var link = news.link ? ` <a class="badge badge-primary badge-pill" href="${news.link}">${news.linkname}</a>` : ``;

                    newsElement.innerHTML = `
                        ${divider}
                        <div class="card mb-3 bg-dark" style="max-width: 700px;">
                            <div class="d-flex w-100 justify-content-between">
                              <h4 class="mb-1">${news.title}${link}</h4>
                              <small class="text-muted">${news.date}</small>
                            </div>
                            <div class="d-flex w-100 justify-content-start">
                              <p><br>${news.content}</p>
                              ${picture}
                            </div>
                        </div>
                    `;

                    if (divider == "") {
                        divider = `<p class="text-center">---</p>`
                    }

                    newsContainer.appendChild(newsElement);
                });
            }
          }).catch(err => console.log('Error loading news:', err));
    }

    moveAboutToSidebar() {
        const aboutSection = document.querySelector('#About').closest('.page-div');
        const sidebar = document.getElementById('about-sidebar');
        
        if (aboutSection && sidebar) {
            const aboutContent = aboutSection.cloneNode(true);
            aboutContent.classList.add('about-content');
            sidebar.appendChild(aboutContent);
            
            // Hide original only on desktop
            aboutSection.style.display = 'none';
            aboutSection.classList.add('desktop-hidden');
            
            // Initialize typewriter effect on the cloned element
            setTimeout(() => {
                this.initializeTypewriter();
            }, 100);
        }
    }

    initializeTypewriter() {
        // Find the typewriter element in the sidebar
        const typewriterElement = document.querySelector('.about-content #typewriter');
        if (typewriterElement) {
            // Make sure the setupTypewriter function is available
            if (typeof setupTypewriter === 'function') {
                const typewriter = setupTypewriter(typewriterElement);
                typewriter.type();
            } else {
                // If setupTypewriter isn't available yet, wait a bit and try again
                setTimeout(() => {
                    if (typeof setupTypewriter === 'function') {
                        const typewriter = setupTypewriter(typewriterElement);
                        typewriter.type();
                    }
                }, 500);
            }
        }
    }

    createWindow(section, index) {
        const windowsContainer = document.getElementById('windows-container');
        
        // Find the section content based on section type
        let contentToClone;
        let elementsToHide = [];
        
        if (section.id === 'news') {
            // For news, get the content from the news list
            const newsListElement = document.querySelector('#news-list');
            if (newsListElement) {
                contentToClone = newsListElement; // Just the news list content
                // Hide the entire news section
                const newsSection = document.querySelector('#News').closest('.section');
                const newsRow = newsSection.nextElementSibling;
                elementsToHide = [newsSection, newsRow];
            }
        } else if (section.id === 'publications') {
            // Get the publications content
            const pubSection = document.querySelector('#Publications').closest('.section');
            const pubContent = pubSection.nextElementSibling;
            contentToClone = pubContent.querySelector('.col-md-auto');
            elementsToHide = [pubSection, pubContent];
        } else if (section.id === 'students') {
            // Get the students content
            const studentSection = document.querySelector('#Students').closest('.section');
            const studentContent = studentSection.nextElementSibling;
            contentToClone = studentContent.querySelector('.col-md-auto');
            elementsToHide = [studentSection, studentContent];
        } else if (section.id === 'projects') {
            // Get the projects content
            const projectSection = document.querySelector('#Projects').closest('.section');
            contentToClone = projectSection;
            elementsToHide = [projectSection];
        } else if (section.id === 'contacts') {
            // Get the contacts content
            const contactSection = document.querySelector('#Contacts').closest('.page-div');
            contentToClone = contactSection;
            elementsToHide = [contactSection];
        }
        
        if (!contentToClone) return;

        // Create window container - position on the right side where they belong
        const windowContainer = document.createElement('div');
        windowContainer.className = 'window-container';
        windowContainer.style.top = '20px';
        windowContainer.style.left = '20px';
        windowContainer.style.width = '800px';
        windowContainer.style.height = '600px';
        
        // Create window
        const window = document.createElement('div');
        window.className = 'macos-window';
        window.innerHTML = `
            <div class="macos-titlebar" data-window="${section.id}">
                <div class="macos-traffic-lights">
                    <div class="macos-traffic-light close" data-action="close" data-window="${section.id}"></div>
                    <div class="macos-traffic-light minimize" data-action="minimize" data-window="${section.id}"></div>
                    <div class="macos-traffic-light maximize" data-action="maximize" data-window="${section.id}"></div>
                </div>
                <div class="macos-window-title">${section.icon} ${section.title}</div>
            </div>
            <div class="macos-content" id="${section.id}-content"></div>
        `;
        
        const windowContent = window.querySelector('.macos-content');
        
        // Clone and add the content
        const clonedContent = contentToClone.cloneNode(true);
        
        // Remove or hide section titles
        const titleElements = clonedContent.querySelectorAll('h2');
        titleElements.forEach(title => {
            if (title.textContent.includes('News') || 
                title.textContent.includes('Publications') || 
                title.textContent.includes('Students') || 
                title.textContent.includes('Projects') || 
                title.textContent.includes('Contacts')) {
                title.style.display = 'none';
            }
        });
        
        windowContent.appendChild(clonedContent);
        
        // Hide original elements
        elementsToHide.forEach(element => {
            if (element) {
                element.style.display = 'none';
                element.classList.add('desktop-hidden');
            }
        });
        
        windowContainer.appendChild(window);
        windowsContainer.appendChild(windowContainer);
        
        this.windows.set(section.id, {
            element: windowContainer,
            isMinimized: false,
            isMaximized: true,  // Start all windows maximized
            originalPosition: { x: 20, y: 20 },
            originalSize: { width: 800, height: 600 }
        });
        
        // Apply maximized state immediately
        windowContainer.classList.add('maximized');
    }

    setupEventListeners() {
        // Dock clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('dock-item')) {
                const windowId = e.target.dataset.window;
                this.toggleWindow(windowId);
            }
            
            // Window controls
            if (e.target.classList.contains('macos-traffic-light')) {
                const action = e.target.dataset.action;
                const windowId = e.target.dataset.window;
                
                switch (action) {
                    case 'close':
                        this.minimizeWindow(windowId);
                        break;
                    case 'minimize':
                        this.minimizeWindow(windowId);
                        break;
                    case 'maximize':
                        this.toggleMaximize(windowId);
                        break;
                }
            }
        });

        // Window focus
        document.addEventListener('mousedown', (e) => {
            const windowContainer = e.target.closest('.window-container');
            if (windowContainer) {
                this.focusWindow(windowContainer);
            }
        });

        // Responsive handling
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                // Switching to mobile - show original sections
                this.restoreOriginalLayout();
                document.querySelector('.macos-desktop')?.remove();
                document.querySelector('.mobile-view').style.display = 'block';
            } else if (window.innerWidth > 768 && !document.querySelector('.macos-desktop')) {
                // Switching back to desktop - reinitialize
                setTimeout(() => {
                    new MacOSWindowManager();
                }, 100);
            }
        });
    }

    restoreOriginalLayout() {
        // Show all hidden sections for mobile
        document.querySelectorAll('.desktop-hidden').forEach(element => {
            element.style.display = '';
            element.classList.remove('desktop-hidden');
        });
    }

    toggleWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        if (windowData.isMinimized) {
            this.restoreWindow(windowId);
        } else {
            // Just bring to foreground if already visible
            this.focusWindow(windowData.element);
        }
        
        this.updateDockIndicators();
    }

    minimizeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        windowData.element.classList.add('minimized');
        windowData.isMinimized = true;
        this.updateDockIndicators();
    }

    restoreWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        windowData.element.classList.remove('minimized');
        windowData.isMinimized = false;
        this.focusWindow(windowData.element);
        this.updateDockIndicators();
    }

    maximizeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        windowData.element.classList.add('maximized');
        windowData.isMaximized = true;
        this.focusWindow(windowData.element);
    }

    toggleMaximize(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        if (windowData.isMaximized) {
            windowData.element.classList.remove('maximized');
            windowData.isMaximized = false;
        } else {
            this.maximizeWindow(windowId);
        }
    }

    focusWindow(windowElement) {
        // Remove focus from all windows
        document.querySelectorAll('.window-container').forEach(w => {
            w.classList.remove('focused');
            w.style.zIndex = 100;
        });
        
        // Focus current window
        windowElement.classList.add('focused');
        windowElement.style.zIndex = ++this.zIndex;
        this.activeWindow = windowElement;
    }

    updateDockIndicators() {
        document.querySelectorAll('.dock-item').forEach(item => {
            const windowId = item.dataset.window;
            const windowData = this.windows.get(windowId);
            
            if (windowData && !windowData.isMinimized) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    updateTime() {
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });
            timeElement.textContent = timeString;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on desktop
    if (window.innerWidth > 768) {
        new MacOSWindowManager();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && !document.querySelector('.macos-desktop')) {
        new MacOSWindowManager();
    }
});
