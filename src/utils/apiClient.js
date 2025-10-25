// API Client with timeout and retry mechanism
class ApiClient {
    constructor(baseURL, options = {}) {
        this.baseURL = baseURL;
        this.timeout = options.timeout || 30000; // 30 seconds
        this.retries = options.retries || 3;
        this.retryDelay = options.retryDelay || 1000; // 1 second
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const requestOptions = {
            ...options,
            timeout: this.timeout
        };

        for (let attempt = 1; attempt <= this.retries; attempt++) {
            try {
                console.log(`API Request (attempt ${attempt}/${this.retries}):`, url);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);

                const response = await fetch(url, {
                    ...requestOptions,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    console.log(`API Request successful (attempt ${attempt}):`, url);
                    return response;
                } else if (response.status >= 500 && attempt < this.retries) {
                    // Server error, retry
                    console.warn(`Server error (attempt ${attempt}), retrying...`, response.status);
                    await this.delay(this.retryDelay * attempt);
                    continue;
                } else {
                    // Client error or final attempt
                    console.error(`API Request failed (attempt ${attempt}):`, response.status, response.statusText);
                    return response;
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.error(`API Request timeout (attempt ${attempt}):`, url);
                    if (attempt < this.retries) {
                        await this.delay(this.retryDelay * attempt);
                        continue;
                    }
                    throw new Error(`Request timeout after ${this.retries} attempts`);
                } else if (error.name === 'TypeError' && attempt < this.retries) {
                    // Network error, retry
                    console.warn(`Network error (attempt ${attempt}), retrying...`, error.message);
                    await this.delay(this.retryDelay * attempt);
                    continue;
                } else {
                    console.error(`API Request error (attempt ${attempt}):`, error);
                    throw error;
                }
            }
        }
    }

    async get(endpoint, options = {}) {
        return this.request(endpoint, {
            method: 'GET',
            ...options
        });
    }

    async post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: JSON.stringify(data),
            ...options
        });
    }

    async put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: JSON.stringify(data),
            ...options
        });
    }

    async delete(endpoint, options = {}) {
        return this.request(endpoint, {
            method: 'DELETE',
            ...options
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Create API client instance
export const apiClient = new ApiClient('https://personal-site-saas-api.l5819033.workers.dev', {
    timeout: 30000,
    retries: 3,
    retryDelay: 1000
});

// Helper function for authenticated requests
export const authenticatedRequest = async (endpoint, options = {}) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.uid) {
        throw new Error('User not authenticated');
    }

    return apiClient.request(endpoint, {
        ...options,
        headers: {
            'Authorization': `Bearer ${user.uid}`,
            ...options.headers
        }
    });
};
