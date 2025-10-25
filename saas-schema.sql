-- SAAS Multi-Tenant Database Schema

-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  subscription_plan TEXT DEFAULT 'free', -- free, pro, enterprise
  subscription_status TEXT DEFAULT 'active', -- active, cancelled, expired
  subscription_expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User sites (each user can have multiple sites)
CREATE TABLE user_sites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  subdomain TEXT UNIQUE NOT NULL, -- e.g., "john-doe"
  domain TEXT, -- custom domain (optional)
  site_name TEXT NOT NULL,
  site_description TEXT,
  theme_id INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  is_published BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Themes table
CREATE TABLE themes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  preview_image_url TEXT,
  css_variables TEXT, -- JSON string with theme variables
  is_premium BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Site sections (modular content)
CREATE TABLE site_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL,
  section_type TEXT NOT NULL, -- hero, about, experience, education, skills, contact
  section_order INTEGER NOT NULL,
  is_enabled BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES user_sites(id) ON DELETE CASCADE
);

-- Hero section data
CREATE TABLE site_hero_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  birth_year INTEGER,
  location TEXT,
  current_job TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  cv_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES user_sites(id) ON DELETE CASCADE
);

-- About section data
CREATE TABLE site_about_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES user_sites(id) ON DELETE CASCADE
);

-- About highlights
CREATE TABLE site_about_highlights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  about_id INTEGER NOT NULL,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (about_id) REFERENCES site_about_data(id) ON DELETE CASCADE
);

-- Experiences
CREATE TABLE site_experiences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES user_sites(id) ON DELETE CASCADE
);

-- Experience achievements
CREATE TABLE site_experience_achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  experience_id INTEGER NOT NULL,
  achievement TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (experience_id) REFERENCES site_experiences(id) ON DELETE CASCADE
);

-- Education
CREATE TABLE site_education (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL,
  degree TEXT NOT NULL,
  school TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  field_of_study TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES user_sites(id) ON DELETE CASCADE
);

-- Education achievements
CREATE TABLE site_education_achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  education_id INTEGER NOT NULL,
  achievement TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (education_id) REFERENCES site_education(id) ON DELETE CASCADE
);

-- Competencies
CREATE TABLE site_competencies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  icon_url TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES user_sites(id) ON DELETE CASCADE
);

-- Tools
CREATE TABLE site_tools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  usage_purpose TEXT,
  icon_url TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES user_sites(id) ON DELETE CASCADE
);

-- Languages
CREATE TABLE site_languages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  level TEXT NOT NULL,
  flag_emoji TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES user_sites(id) ON DELETE CASCADE
);

-- Contact messages
CREATE TABLE site_contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES user_sites(id) ON DELETE CASCADE
);

-- Insert default themes
INSERT INTO themes (name, description, css_variables, is_premium) VALUES 
('Modern Purple', 'Modern purple gradient theme', '{"primary": "#667eea", "secondary": "#764ba2", "accent": "#4facfe"}', false),
('Professional Blue', 'Clean professional blue theme', '{"primary": "#2563eb", "secondary": "#1d4ed8", "accent": "#3b82f6"}', false),
('Dark Mode', 'Dark theme for modern look', '{"primary": "#1f2937", "secondary": "#111827", "accent": "#10b981"}', true),
('Creative Orange', 'Vibrant orange creative theme', '{"primary": "#f97316", "secondary": "#ea580c", "accent": "#fb923c"}', true);

-- Insert sample user for testing
INSERT INTO users (email, password_hash, name, subscription_plan) VALUES 
('demo@example.com', '$2b$10$demo_hash', 'Demo User', 'pro');

-- Insert sample site for demo user
INSERT INTO user_sites (user_id, subdomain, site_name, site_description, theme_id, is_published) VALUES 
(1, 'demo-user', 'Demo Personal Site', 'A demo personal site', 1, true);

-- Insert sample hero data
INSERT INTO site_hero_data (site_id, name, title, description, birth_year, location, current_job, github_url, linkedin_url, cv_url) VALUES 
(1, 'Demo User', 'Full Stack Developer', 'Passionate about creating amazing web experiences', 1995, 'San Francisco', 'Senior Developer at Tech Corp', 'https://github.com/demo', 'https://linkedin.com/in/demo', '/cv.pdf');
