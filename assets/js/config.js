const API_CONFIG = {
    BASE_URL: 'https://b7e85afb-7dbb-4352-9501-1426349fef5d.railway.app',
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
