const BACKEND_URL = "https://tapchat-backend.onrender.com";

let currentLang = localStorage.getItem('tapchat_lang') || 'en';

const translations = {
    en: {
        announcementTag: "Official Announcement",
        welcomePost: "Welcome to TapChat! Enjoy trending reels and AI chat support in one place.",
        reelsLoading: "🎥 Loading Reels...",
        statusHeader: "Recent Updates",
        myStatus: "My Status",
        addStatus: "Share a new status update",
        aiWelcome: "Hello! I am TapChat AI. How can I assist you today?",
        chatPlaceholder: "Type a message...",
        sendBtn: "Send",
        navFeed: "Feed",
        navReels: "Reels",
        navStatus: "Status",
        navAI: "AI Chat",
        langToggle: "हिंदी"
    },
    hi: {
        announcementTag: "आधिकारिक घोषणा",
        welcomePost: "TapChat में आपका स्वागत है! रील्स और AI चैट का एक साथ आनंद लें।",
        reelsLoading: "🎥 रील्स लोड हो रही हैं...",
        statusHeader: "हाल के अपडेट्स",
        myStatus: "मेरा स्टेटस",
        addStatus: "नया स्टेटस शेयर करें",
        aiWelcome: "नमस्ते! मैं TapChat AI हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?",
        chatPlaceholder: "मैसेज टाइप करें...",
        sendBtn: "भेजें",
        navFeed: "फ़ीड",
        navReels: "रील्स",
        navStatus: "स्टेटस",
        navAI: "AI चैट",
        langToggle: "English"
    }
};

function applyTranslations() {
    const t = translations[currentLang];
    if(document.getElementById('announcementTag')) document.getElementById('announcementTag').innerText = t.announcementTag;
    if(document.getElementById('welcomePost')) document.getElementById('welcomePost').innerText = t.welcomePost;
    if(document.getElementById('reelsLoading')) document.getElementById('reelsLoading').innerText = t.reelsLoading;
    if(document.getElementById('statusHeader')) document.getElementById('statusHeader').innerText = t.statusHeader;
    if(document.getElementById('myStatus')) document.getElementById('myStatus').innerText = t.myStatus;
    if(document.getElementById('addStatus')) document.getElementById('addStatus').innerText = t.addStatus;
    if(document.getElementById('aiWelcome')) document.getElementById('aiWelcome').innerText = t.aiWelcome;
    if(document.getElementById('chatInput')) document.getElementById('chatInput').placeholder = t.chatPlaceholder;
    if(document.getElementById('sendBtn')) document.getElementById('sendBtn').innerText = t.sendBtn;
    if(document.getElementById('navFeed')) document.getElementById('navFeed').innerText = t.navFeed;
    if(document.getElementById('navReels')) document.getElementById('navReels').innerText = t.navReels;
    if(document.getElementById('navStatus')) document.getElementById('navStatus').innerText = t.navStatus;
    if(document.getElementById('navAI')) document.getElementById('navAI').innerText = t.navAI;
    if(document.getElementById('langToggle')) document.getElementById('langToggle').innerText = t.langToggle;
}

function toggleLang() {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    localStorage.setItem('tapchat_lang', currentLang);
    applyTranslations();
}

document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
});

function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active-tab'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active-tab');
    btn.classList.add('active');

    if (tabId === 'reelsTab') {
        loadReels();
    }
}

async function loadReels() {
    const container = document.getElementById('reelsContainer');
    try {
        const res = await fetch(`${BACKEND_URL}/api/reels`);
        const data = await res.json();
        
        if (data.success && data.reels.length > 0) {
            container.innerHTML = '';
            data.reels.forEach(reel => {
                container.innerHTML += `
                    <div class="reel-box">
                        <video class="reel-video" src="${reel.video_url}" autoplay loop muted playsinline></video>
                        <div class="reel-overlay">
                            <div>
                                <b>@${reel.user}</b>
                                <p style="font-size: 12px; margin-top: 4px;">TapChat Reels 🎵</p>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 24px;">❤️</div>
                                <small>${reel.likes}</small>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
    } catch (e) {
        container.innerHTML = `<div style="padding:20px; text-align:center; color:#888;">${currentLang === 'hi' ? 'रील्स लोड करने में समस्या आई।' : 'Failed to load reels.'}</div>`;
    }
}

async function sendAI() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML += `<div class="msg user-msg">${text}</div>`;
    input.value = '';

    try {
        const response = await fetch(`${BACKEND_URL}/api/ai-chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: text })
        });
        const data = await response.json();
        chatBox.innerHTML += `<div class="msg bot-msg">${data.reply || (currentLang === 'hi' ? 'कोई उत्तर नहीं मिला।' : 'No response received.')}</div>`;
    } catch (e) {
        chatBox.innerHTML += `<div class="msg bot-msg">${currentLang === 'hi' ? 'सर्वर से कनेक्ट नहीं हो सका।' : 'Unable to connect to server.'}</div>`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}
