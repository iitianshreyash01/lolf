let isLoading = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('MedAI Pro loaded');
    checkBackendConnection();
    loadSpecialists();
    loadHealthTips();
});

async function checkBackendConnection() {
    try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.HEALTH_CHECK));
        const data = await response.json();
        console.log('✅ Backend connection:', data);
    } catch (error) {
        console.error('❌ Cannot connect to backend:', error);
        addSystemMessage('⚠️ Cannot connect to backend on port 5000');
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    const section = document.getElementById(sectionId);
    if (section) section.classList.add('active');
}

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();

    if (!message) {
        alert('Please enter your symptoms');
        return;
    }

    if (isLoading) {
        alert('Please wait for response...');
        return;
    }

    addMessage(message, 'user');
    userInput.value = '';
    addMessage('⏳ Analyzing your symptoms...', 'loading');
    isLoading = true;

    try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AI_DOCTOR), {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        removeLastMessage();

        if (response.ok && data.success) {
            addMessage(data.response, 'ai');
        } else {
            const errorMsg = data.error || 'Failed to get response';
            addMessage(`❌ Error: ${errorMsg}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        removeLastMessage();
        addMessage(`❌ Connection Error: ${error.message}`, 'error');
    } finally {
        isLoading = false;
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !isLoading) {
        sendMessage();
    }
}

function addMessage(text, sender = 'ai') {
    const messagesDiv = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.innerHTML = text; // Changed from textContent to innerHTML for better formatting
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function removeLastMessage() {
    const messagesDiv = document.getElementById('chat-messages');
    if (messagesDiv.lastChild) {
        messagesDiv.removeChild(messagesDiv.lastChild);
    }
}

function addSystemMessage(text) {
    const messagesDiv = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message error';
    messageElement.textContent = text;
    messagesDiv.appendChild(messageElement);
}

async function loadSpecialists() {
    try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SPECIALISTS));
        const data = await response.json();

        if (data.success && data.specialists) {
            const specialistsList = document.getElementById('specialists-list');
            specialistsList.innerHTML = '';

            data.specialists.forEach(specialist => {
                const card = document.createElement('div');
                card.className = 'specialist-card';
                card.innerHTML = `
                    <h3>${specialist.name}</h3>
                    <p><strong>Specialty:</strong> ${specialist.specialty}</p>
                    <p class="rating">⭐ ${specialist.rating}/5.0</p>
                `;
                specialistsList.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error loading specialists:', error);
    }
}

async function loadHealthTips() {
    try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.HEALTH_TIPS));
        const data = await response.json();

        if (data.success && data.tips) {
            const tipsList = document.getElementById('tips-list');
            tipsList.innerHTML = '';

            data.tips.forEach(tip => {
                const card = document.createElement('div');
                card.className = 'tip-card';
                card.textContent = tip;
                tipsList.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error loading health tips:', error);
    }
}

function logout() {
    if (confirm('Logout?')) {
        localStorage.clear();
        location.reload();
    }
}
