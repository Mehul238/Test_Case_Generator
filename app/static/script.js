document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatHistory = document.getElementById('chat-history');
    const welcomeParams = document.querySelector('.welcome-message');

    // Load History from LocalStorage
    // Load History from LocalStorage handled by init()

    // Auto-resize textarea
    userInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value.trim() === '') {
            this.style.height = 'auto';
        }
    });

    // Send on Enter (without shift)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    sendBtn.addEventListener('click', handleSend);

    async function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        // Hide welcome message if it's the first message
        if (welcomeParams) welcomeParams.style.display = 'none';

        // Disable input while processing
        userInput.value = '';
        userInput.style.height = 'auto';
        userInput.disabled = true;
        sendBtn.disabled = true;

        // Capture session ID
        const activeSessionId = currentSessionId;
        const session = appData.sessions[activeSessionId];
        session.isGenerating = true; // Mark as generating
        saveAppData();

        // Add User Message
        if (activeSessionId === currentSessionId) {
            addMessage(text, 'user');
        }
        saveMessage(text, 'user', activeSessionId);

        // Add Loading Indicator
        const loadingHtml = `
            <div class="loading-wrapper">
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <span class="loading-text">Analyzing & Generating...</span>
            </div>
        `;
        let loadingId = null;
        if (activeSessionId === currentSessionId) {
            loadingId = addMessage(loadingHtml, 'ai', true);
        }

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text })
            });

            const data = await response.json();

            // Clear generating flag
            session.isGenerating = false;
            saveAppData();

            // Remove loading if visible
            if (activeSessionId === currentSessionId && loadingId) {
                removeMessage(loadingId);
            }

            if (data.status === 'success') {
                if (activeSessionId === currentSessionId) {
                    addMessage(data.data.test_cases, 'ai');
                }
                saveMessage(data.data.test_cases, 'ai', activeSessionId);
            } else {
                const errorMsg = `**Error:** ${data.message}`;
                if (activeSessionId === currentSessionId) {
                    addMessage(errorMsg, 'ai');
                }
                saveMessage(errorMsg, 'ai', activeSessionId);
            }

        } catch (error) {
            session.isGenerating = false;
            saveAppData();

            if (activeSessionId === currentSessionId && loadingId) {
                removeMessage(loadingId);
            }
            const sysError = `**System Error:** ${error.message}`;
            if (activeSessionId === currentSessionId) {
                addMessage(sysError, 'ai');
            }
            saveMessage(sysError, 'ai', activeSessionId);
        } finally {
            // Restore UI state
            if (activeSessionId === currentSessionId) {
                userInput.disabled = false;
                sendBtn.disabled = false;
                userInput.focus();
            }
        }
    }

    function addMessage(content, type, isLoading = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'content markdown-body';

        if (isLoading) {
            contentDiv.innerHTML = content; // Inject raw HTML for loader
            msgDiv.id = 'loading-' + Date.now();
        } else if (type === 'ai') {
            // Parse Markdown
            contentDiv.innerHTML = marked.parse(content);
        } else {
            contentDiv.textContent = content; // Plain text for user
        }

        msgDiv.appendChild(contentDiv);
        chatHistory.appendChild(msgDiv);

        // Scroll to bottom
        chatHistory.scrollTop = chatHistory.scrollHeight;

        return msgDiv.id;
    }

    // --- Session Management ---
    const sessionListEl = document.getElementById('session-list');
    const newChatBtn = document.getElementById('new-chat-btn');
    const resetDataBtn = document.getElementById('reset-data-btn'); // New Button
    let currentSessionId = null;

    // Retrieve storage or init
    // Structure: { sessions: { [id]: { id, title, timestamp, messages: [] } }, currentId: null }
    let appData = JSON.parse(localStorage.getItem('magicApp')) || { sessions: {}, currentId: null };

    // Initialize
    init();

    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', () => {
            if (confirm("Are you sure? This will delete all chat history.")) {
                localStorage.removeItem('magicApp');
                location.reload();
            }
        });
    }

    function init() {
        renderSessionList();

        // Load current session or create new if none
        if (appData.currentId && appData.sessions[appData.currentId]) {
            loadSession(appData.currentId);
        } else {
            createNewSession();
        }
    }

    newChatBtn.addEventListener('click', createNewSession);

    function createNewSession() {
        const id = 'session-' + Date.now();
        const newSession = {
            id: id,
            title: 'New Session',
            timestamp: Date.now(),
            messages: [],
            isGenerating: false
        };

        appData.sessions[id] = newSession;
        appData.currentId = id;
        saveAppData();

        renderSessionList();
        loadSession(id);
    }

    function loadSession(id) {
        currentSessionId = id;
        appData.currentId = id;
        saveAppData();

        // Highlight active sidebar item
        document.querySelectorAll('.session-item').forEach(el => el.classList.remove('active'));
        const activeItem = document.querySelector(`.session-item[data-id="${id}"]`);
        if (activeItem) activeItem.classList.add('active');

        // FORCE ENABLE INPUTS (Fixes stuck state if switched during generation)
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();

        // Clear UI
        chatHistory.innerHTML = '';

        const session = appData.sessions[id];

        // Render Messages
        if (session.messages.length === 0 && !session.isGenerating) {
            chatHistory.appendChild(createWelcomeMessage());
        } else {
            session.messages.forEach(msg => {
                addMessage(msg.content, msg.type);
            });
        }

        // Handle Loading State recovery
        if (session.isGenerating) {
            const loadingHtml = `
            <div class="loading-wrapper">
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <span class="loading-text">Analyzing & Generating...</span>
            </div>
            `;
            addMessage(loadingHtml, 'ai', true);

            // Disable inputs since this session is still busy
            userInput.disabled = true;
            sendBtn.disabled = true;
        } else {
            // Enable inputs if not generating
            userInput.disabled = false;
            sendBtn.disabled = false;
            userInput.focus();
        }
    }

    function saveMessage(content, type, targetSessionId) {
        // Use targetSessionId if provided (for background saves), else current
        const sessionId = targetSessionId || currentSessionId;

        if (!sessionId || !appData.sessions[sessionId]) return;

        const session = appData.sessions[sessionId];
        session.messages.push({ content, type, timestamp: Date.now() });

        // Update Title based on first user message
        if (type === 'user' && session.title === 'New Session') {
            session.title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
            renderSessionList(); // Re-render to show new title
        }

        saveAppData();
    }

    function saveAppData() {
        localStorage.setItem('magicApp', JSON.stringify(appData));
    }

    function renderSessionList() {
        sessionListEl.innerHTML = '';

        // Sort sessions by timestamp desc
        const sessions = Object.values(appData.sessions).sort((a, b) => b.timestamp - a.timestamp);

        sessions.forEach(session => {
            const el = document.createElement('div');
            el.className = 'session-item';
            el.dataset.id = session.id;
            if (session.id === currentSessionId) el.classList.add('active');

            el.innerHTML = `
                <span class="material-icons-round session-icon">chat_bubble_outline</span>
                <span class="session-title">${session.title}</span>
            `;

            el.addEventListener('click', () => {
                loadSession(session.id);
            });

            sessionListEl.appendChild(el);
        });
    }

    // Reuse existing UI helper
    function createWelcomeMessage() {
        // Return existing welcome message element or clone it
        // Ideally we keep the welcome message structure in HTML and toggle visibility.
        // For now, let's reconstruct since we cleared innerHTML
        const wrapper = document.createElement('div');
        wrapper.className = 'welcome-message';
        wrapper.style.display = 'block';
        wrapper.style.animation = 'fadeInUp 0.8s forwards';
        wrapper.innerHTML = `
            <h2>Hi, I'm Robo-Test!</h2>
            <p>Describe your feature or paste code to start a new generation.</p>
        `;
        return wrapper;
    }

    // Refactored handleSend to not rely on global LoadHistory
    // ... (rest of logic uses global saveMessage which is now updated)
});
