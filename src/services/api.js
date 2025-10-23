// API service for fetching data from Cloudflare D1
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-worker.your-subdomain.workers.dev';

class ApiService {
    async fetchData(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    }

    async postData(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error posting to ${endpoint}:`, error);
            throw error;
        }
    }

    // Hero data
    async getHeroData() {
        return this.fetchData('/api/hero');
    }

    // About data
    async getAboutData() {
        return this.fetchData('/api/about');
    }

    // Experiences
    async getExperiences() {
        return this.fetchData('/api/experiences');
    }

    // Education
    async getEducation() {
        return this.fetchData('/api/education');
    }

    // Competencies
    async getCompetencies() {
        return this.fetchData('/api/competencies');
    }

    // Tools
    async getTools() {
        return this.fetchData('/api/tools');
    }

    // Languages
    async getLanguages() {
        return this.fetchData('/api/languages');
    }

    // Contact form submission
    async submitContactForm(formData) {
        return this.postData('/api/contact', formData);
    }
}

export default new ApiService();
