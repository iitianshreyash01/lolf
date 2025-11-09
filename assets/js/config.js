const API_CONFIG = {
    BASE_URL: 'https://backend-1-cvbp.onrender.com',
    ENDPOINTS: {
        HEALTH_CHECK: '/api/health',
        AI_DOCTOR: '/api/ai-doctor',
        SPECIALISTS: '/api/specialists',
        HEALTH_TIPS: '/api/health-tips',
    }
};

function getApiUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}
