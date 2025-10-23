// API service for fetching data from Cloudflare D1
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://personal-site-saas-api.l5819033.workers.dev';

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
        try {
            return await this.fetchData('/api/hero');
        } catch (error) {
            console.error('API Error, using fallback hero data:', error);
            return {
                id: 1,
                name: "Eren Demirel",
                title: "Actuarial Analyst",
                description: "I'm passionate about transforming data into actionable insights and driving innovation in the insurance sector.",
                birth_year: 2001,
                location: "Istanbul",
                current_job: "Actuarial Analyst at Eureko Sigorta",
                github_url: "https://github.com/demireleren877",
                linkedin_url: "https://linkedin.com/in/demireleren877",
                cv_url: "/cv.pdf"
            };
        }
    }

    // About data
    async getAboutData() {
        console.log('Using fallback about data');
        return {
            id: 1,
            title: "About Me",
            description: "I am a dedicated Business Development and Data Analysis professional with a strong passion for transforming complex data into actionable insights.",
            highlights: [
                {
                    icon: "🎯",
                    title: "Strategic Thinking",
                    description: "Developing comprehensive business strategies that align with organizational goals and market opportunities."
                },
                {
                    icon: "📊",
                    title: "Data Analysis",
                    description: "Transforming raw data into meaningful insights using advanced analytical tools and methodologies."
                },
                {
                    icon: "⚡",
                    title: "Process Automation",
                    description: "Streamlining business processes through innovative automation solutions and technology integration."
                }
            ]
        };
    }

    // Experiences
    async getExperiences() {
        try {
            return await this.fetchData('/api/experiences');
        } catch (error) {
            console.error('API Error, using fallback data:', error);
            return [];
        }
    }

    // Education
    async getEducation() {
        try {
            return await this.fetchData('/api/education');
        } catch (error) {
            console.error('API Error, using fallback data:', error);
            return [];
        }
    }

    // Competencies
    async getCompetencies() {
        try {
            return await this.fetchData('/api/competencies');
        } catch (error) {
            console.error('API Error, using fallback data:', error);
            return [];
        }
    }

    // Tools
    async getTools() {
        try {
            return await this.fetchData('/api/tools');
        } catch (error) {
            console.error('API Error, using fallback data:', error);
            return [];
        }
    }

    // Languages
    async getLanguages() {
        try {
            return await this.fetchData('/api/languages');
        } catch (error) {
            console.error('API Error, using fallback data:', error);
            return [];
        }
    }

    // Contact form submission
    async submitContactForm(formData) {
        return this.postData('/api/contact', formData);
    }
}

const apiService = new ApiService();
export default apiService;
