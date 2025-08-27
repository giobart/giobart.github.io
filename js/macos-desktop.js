// macOS Desktop Window Manager
class MacOSWindowManager {
    constructor() {
        this.windows = new Map();
        this.zIndex = 100;
        this.activeWindow = null;
        this.init();
    }

    initializeMode() {
        if (window.innerWidth <= 768) {
            this.createIOSHomescreen();
        } else {
            this.createDesktopStructure();
            this.initializeWindows();
        }
        this.setupEventListeners();
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    init() {
        this.initializeMode();
    }

    createIOSHomescreen() {
        const body = document.body;
        
        // Add iOS mode class to body (this will hide all other content via CSS)
        body.classList.add('ios-mode');
        
        // Create iOS homescreen container
        const homescreen = document.createElement('div');
        homescreen.className = 'ios-homescreen mobile-view';
        
        // Create status bar
        const statusBar = document.createElement('div');
        statusBar.className = 'ios-status-bar';
        statusBar.innerHTML = `
            <div>9:41</div>
            <div>Giovanni Bartolomeo</div>
            <div>100%</div>
        `;
        
        // Create app container
        const appContainer = document.createElement('div');
        appContainer.className = 'ios-app-container';
        appContainer.id = 'ios-apps';
        
        // Create About app (default)
        const aboutApp = this.createIOSApp('about', 'About', '👤', true);
        appContainer.appendChild(aboutApp);
        
        // Create other apps
        const apps = [
            { id: 'news', title: 'News', icon: '📰' },
            { id: 'publications', title: 'Publications', icon: '📚' },
            { id: 'students', title: 'Students', icon: '👥' },
            { id: 'projects', title: 'Projects', icon: '🚀' },
            { id: 'contacts', title: 'Contacts', icon: '📧' }
        ];
        
        apps.forEach(app => {
            const appElement = this.createIOSApp(app.id, app.title, app.icon, false);
            appContainer.appendChild(appElement);
        });
        
        // Create dock
        const dock = document.createElement('div');
        dock.className = 'ios-dock';
        dock.innerHTML = `
            <div class="ios-dock-item-container">
                <div class="ios-dock-item active" data-app="about">👤</div>
                <div class="ios-dock-label">About</div>
            </div>
            <div class="ios-dock-item-container">
                <div class="ios-dock-item" data-app="news">📰</div>
                <div class="ios-dock-label">News</div>
            </div>
            <div class="ios-dock-item-container">
                <div class="ios-dock-item" data-app="publications">📚</div>
                <div class="ios-dock-label">Publications</div>
            </div>
            <div class="ios-dock-item-container">
                <div class="ios-dock-item" data-app="students">👥</div>
                <div class="ios-dock-label">Students</div>
            </div>
            <div class="ios-dock-item-container">
                <div class="ios-dock-item" data-app="projects">🚀</div>
                <div class="ios-dock-label">Projects</div>
            </div>
            <div class="ios-dock-item-container">
                <div class="ios-dock-item" data-app="contacts">📧</div>
                <div class="ios-dock-label">Contacts</div>
            </div>
        `;
        
        homescreen.appendChild(statusBar);
        homescreen.appendChild(appContainer);
        homescreen.appendChild(dock);
        
        body.insertBefore(homescreen, body.firstChild);
        
        // Load content for apps immediately
        this.loadIOSContent();
    }

    createIOSApp(id, title, icon, isDefault) {
        const app = document.createElement('div');
        app.className = `ios-app ${id}${isDefault ? ' active' : ''}`;
        app.id = `ios-app-${id}`;
        
        app.innerHTML = `
            <div class="ios-app-header">
                <div class="ios-app-title">${icon} ${title}</div>
            </div>
            <div class="ios-app-content" id="ios-${id}-content"></div>
        `;
        
        return app;
    }

    loadIOSContent() {
        console.log('Loading iOS content...');
        
        // Load About content
        const aboutSection = document.querySelector('#About');
        console.log('About section found:', aboutSection);
        if (aboutSection) {
            const aboutPageDiv = aboutSection.closest('.page-div');
            console.log('About page div found:', aboutPageDiv);
            if (aboutPageDiv) {
                const aboutContent = aboutPageDiv.cloneNode(true);
                aboutContent.classList.add('about-content', 'ios');
                aboutContent.style.display = 'block';
                const aboutContainer = document.getElementById('ios-about-content');
                console.log('About container found:', aboutContainer);
                if (aboutContainer) {
                    aboutContainer.innerHTML = ''; // Clear first
                    aboutContainer.appendChild(aboutContent);
                    
                    // Initialize typewriter effect with multiple attempts for mobile
                    this.tryInitializeTypewriter();
                }
            }
        } else {
            // Fallback content if About section not found
            const aboutContainer = document.getElementById('ios-about-content');
            if (aboutContainer) {
                aboutContainer.innerHTML = `
                    <div class="about-content ios">
                        <h2>Giovanni Bartolomeo</h2>
                        <p>Researcher and Ph.D. Candidate</p>
                        <p>Content loaded successfully!</p>
                    </div>
                `;
            }
        }
        
        // Load other content
        this.loadNewsForIOS();
        this.loadPublicationsForIOS();
        this.loadStudentsForIOS();
        this.loadProjectsForIOS();
        this.loadContactsForIOS();
    }

    loadNewsForIOS() {
        console.log('Loading news for iOS...');
        const newsListElement = document.querySelector('#news-list');
        console.log('News list element found:', newsListElement);
        if (newsListElement) {
            const newsContent = newsListElement.cloneNode(true);
            newsContent.style.display = 'block';
            const newsContainer = document.getElementById('ios-news-content');
            console.log('News container found:', newsContainer);
            if (newsContainer) {
                newsContainer.innerHTML = ''; // Clear first
                newsContainer.appendChild(newsContent);
                console.log('News content loaded');
            }
        } else {
            // Add fallback content
            const newsContainer = document.getElementById('ios-news-content');
            if (newsContainer) {
                newsContainer.innerHTML = '<p>News content not found</p>';
            }
        }
    }

    loadPublicationsForIOS() {
        console.log('Loading publications for iOS...');
        const pubSection = document.querySelector('#Publications');
        console.log('Publications section found:', pubSection);
        if (pubSection) {
            const pubRow = pubSection.closest('.section');
            if (pubRow && pubRow.nextElementSibling) {
                const pubContent = pubRow.nextElementSibling;
                console.log('Publications content found:', pubContent);
                const content = pubContent.cloneNode(true);
                content.style.display = 'block';
                const pubContainer = document.getElementById('ios-publications-content');
                console.log('Publications container found:', pubContainer);
                if (pubContainer) {
                    pubContainer.innerHTML = ''; // Clear first
                    pubContainer.appendChild(content);
                    console.log('Publications content loaded');
                }
            }
        } else {
            // Add fallback content
            const pubContainer = document.getElementById('ios-publications-content');
            if (pubContainer) {
                pubContainer.innerHTML = '<p>Publications content not found</p>';
            }
        }
    }

    loadStudentsForIOS() {
        const studentSection = document.querySelector('#Students');
        if (studentSection) {
            const studentContent = studentSection.closest('.section').nextElementSibling;
            if (studentContent) {
                const content = studentContent.cloneNode(true);
                content.style.display = 'block';
                const studentContainer = document.getElementById('ios-students-content');
                if (studentContainer) {
                    studentContainer.appendChild(content);
                }
            }
        }
    }

    loadProjectsForIOS() {
        const projectSection = document.querySelector('#Projects');
        if (projectSection) {
            const projectContent = projectSection.closest('.section');
            if (projectContent) {
                const content = projectContent.cloneNode(true);
                content.style.display = 'block';
                const projectContainer = document.getElementById('ios-projects-content');
                if (projectContainer) {
                    projectContainer.appendChild(content);
                }
            }
        }
    }

    loadContactsForIOS() {
        const contactSection = document.querySelector('#Contacts');
        if (contactSection) {
            const contactContent = contactSection.closest('.page-div');
            if (contactContent) {
                const content = contactContent.cloneNode(true);
                content.style.display = 'block';
                const contactContainer = document.getElementById('ios-contacts-content');
                if (contactContainer) {
                    contactContainer.appendChild(content);
                }
            }
        }
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
            <div class="dock-item-container">
                <div class="dock-item" data-window="news" title="News">📰</div>
                <div class="dock-label">News</div>
            </div>
            <div class="dock-item-container">
                <div class="dock-item" data-window="publications" title="Publications">📚</div>
                <div class="dock-label">Publications</div>
            </div>
            <div class="dock-item-container">
                <div class="dock-item" data-window="students" title="Students">👥</div>
                <div class="dock-label">Students</div>
            </div>
            <div class="dock-item-container">
                <div class="dock-item" data-window="projects" title="Projects">🚀</div>
                <div class="dock-label">Projects</div>
            </div>
            <div class="dock-item-container">
                <div class="dock-item" data-window="contacts" title="Contacts">📧</div>
                <div class="dock-label">Contacts</div>
            </div>
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
            aboutContent.classList.add('cloned-sidebar-content'); // Add specific marker for cloned content
            sidebar.appendChild(aboutContent);
            
            // Hide original only on desktop
            //aboutSection.style.display = 'none';
            aboutSection.classList.add('desktop-hidden');
            
            // Initialize typewriter effect on the cloned element
            setTimeout(() => {
                this.initializeTypewriter();
            }, 100);
        }
    }

    tryInitializeTypewriter(attempt = 1, maxAttempts = 10) {
        // Prevent multiple simultaneous initialization attempts
        if (this.typewriterInitializing) {
            console.log('Typewriter initialization already in progress');
            return;
        }
        this.typewriterInitializing = true;
        
        console.log(`Attempting to initialize typewriter, attempt ${attempt}/${maxAttempts}`);
        
        // Find the typewriter element in multiple possible locations
        let typewriterElement = document.querySelector('.about-content #typewriter');
        if (!typewriterElement) {
            typewriterElement = document.querySelector('#ios-about-content #typewriter');
        }
        if (!typewriterElement) {
            typewriterElement = document.querySelector('#ios-about-content .about-content #typewriter');
        }
        if (!typewriterElement) {
            typewriterElement = document.querySelector('#typewriter');
        }
        
        console.log('Typewriter element found:', typewriterElement);
        console.log('setupTypewriter function available:', typeof setupTypewriter === 'function');
        
        if (typewriterElement && typeof setupTypewriter === 'function') {
            console.log('Setting up typewriter...');
            try {
                const typewriter = setupTypewriter(typewriterElement);
                typewriter.type();
                console.log('Typewriter initialized successfully!');
                this.typewriterInitializing = false;
                return; // Success, exit early
            } catch (error) {
                console.error('Error setting up typewriter:', error);
            }
        }
        
        // If we haven't succeeded and haven't reached max attempts, try again
        if (attempt < maxAttempts) {
            setTimeout(() => {
                this.typewriterInitializing = false;
                this.tryInitializeTypewriter(attempt + 1, maxAttempts);
            }, 500); // Wait 500ms between attempts
        } else {
            console.log('Failed to initialize typewriter after', maxAttempts, 'attempts');
            this.typewriterInitializing = false;
        }
    }

    initializeTypewriter() {
        // Find the typewriter element in both desktop sidebar and iOS mobile app
        let typewriterElement = document.querySelector('.about-content #typewriter');
        
        // If not found in desktop sidebar, look in iOS mobile app
        if (!typewriterElement) {
            typewriterElement = document.querySelector('#ios-about-content #typewriter');
        }
        
        console.log('Typewriter element found:', typewriterElement);
        
        if (typewriterElement) {
            // Make sure the setupTypewriter function is available
            if (typeof setupTypewriter === 'function') {
                console.log('Setting up typewriter...');
                const typewriter = setupTypewriter(typewriterElement);
                typewriter.type();
            } else {
                console.log('setupTypewriter not available, retrying...');
                // If setupTypewriter isn't available yet, wait a bit and try again
                setTimeout(() => {
                    if (typeof setupTypewriter === 'function') {
                        console.log('Setting up typewriter (retry)...');
                        const typewriter = setupTypewriter(typewriterElement);
                        typewriter.type();
                    } else {
                        console.log('setupTypewriter still not available');
                    }
                }, 500);
            }
        } else {
            console.log('No typewriter element found');
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
        // Desktop dock clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('dock-item')) {
                const windowId = e.target.dataset.window;
                this.toggleWindow(windowId);
            }
            
            // iOS dock clicks
            if (e.target.classList.contains('ios-dock-item')) {
                const appId = e.target.dataset.app;
                this.switchIOSApp(appId);
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
                // Switching to mobile - show iOS homescreen
                document.querySelector('.macos-desktop')?.remove();
                if (!document.querySelector('.ios-homescreen')) {
                    // First restore the original layout to clean up desktop mode
                    this.restoreOriginalLayout();
                    // Then create iOS homescreen
                    this.createIOSHomescreen();
                }
            } else if (window.innerWidth > 768 && !document.querySelector('.macos-desktop')) {
                // Switching back to desktop - reinitialize
                document.querySelector('.ios-homescreen')?.remove();
                this.restoreOriginalLayout();
                setTimeout(() => {
                    new MacOSWindowManager();
                }, 100);
            }
        });
    }

    restoreOriginalLayout() {
        console.log('Restoring original layout...');
        
        // Simply remove iOS mode class from body - CSS will handle the rest
        document.body.classList.remove('ios-mode');
        
        // Remove iOS homescreen if it exists
        const iosHomescreen = document.querySelector('.ios-homescreen');
        if (iosHomescreen) {
            iosHomescreen.remove();
        }
        
        // Remove ALL cloned content - be very aggressive about this
        document.querySelectorAll('.cloned-sidebar-content').forEach(element => {
            console.log('Removing cloned sidebar content:', element);
            element.remove();
        });
        
        document.querySelectorAll('.about-content').forEach(element => {
            console.log('Removing about-content:', element);
            element.remove();
        });
        
        // Clear the entire sidebar content completely
        const existingSidebar = document.getElementById('about-sidebar');
        if (existingSidebar) {
            console.log('Clearing sidebar innerHTML');
            existingSidebar.innerHTML = ''; // Clear sidebar content
        }
        
        // Now restore the original About section
        document.querySelectorAll('.desktop-hidden').forEach(element => {
            console.log('Restoring desktop-hidden element:', element);
            element.style.display = '';
            element.classList.remove('desktop-hidden');
        });
        
        console.log('Original layout restored');
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
        
        // Update iOS status bar time
        const statusTime = document.querySelector('.ios-status-bar > div:first-child');
        if (statusTime) {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });
            statusTime.textContent = timeString;
        }
    }

    switchIOSApp(appId) {
        // Hide all apps
        document.querySelectorAll('.ios-app').forEach(app => {
            app.classList.remove('active');
        });
        
        // Show selected app
        const selectedApp = document.getElementById(`ios-app-${appId}`);
        if (selectedApp) {
            selectedApp.classList.add('active');
        }
        
        // Update dock indicators
        document.querySelectorAll('.ios-dock-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-app="${appId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize for both desktop and mobile
    new MacOSWindowManager();
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && !document.querySelector('.macos-desktop')) {
        document.querySelector('.ios-homescreen')?.remove();
        new MacOSWindowManager();
    } else if (window.innerWidth <= 768 && !document.querySelector('.ios-homescreen')) {
        document.querySelector('.macos-desktop')?.remove();
        new MacOSWindowManager();
    }
});
