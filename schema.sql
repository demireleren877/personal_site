-- Personal Site Database Schema for Cloudflare D1

-- Hero section data
CREATE TABLE hero_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  birth_year INTEGER NOT NULL,
  location TEXT NOT NULL,
  current_job TEXT NOT NULL,
  github_url TEXT,
  linkedin_url TEXT,
  cv_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- About section data
CREATE TABLE about_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- About highlights
CREATE TABLE about_highlights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  about_id INTEGER NOT NULL,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (about_id) REFERENCES about_data(id) ON DELETE CASCADE
);

-- Experience data
CREATE TABLE experiences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Experience achievements
CREATE TABLE experience_achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  experience_id INTEGER NOT NULL,
  achievement TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE
);

-- Education data
CREATE TABLE education (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  degree TEXT NOT NULL,
  school TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  field_of_study TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Education achievements
CREATE TABLE education_achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  education_id INTEGER NOT NULL,
  achievement TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (education_id) REFERENCES education(id) ON DELETE CASCADE
);

-- Competencies
CREATE TABLE competencies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  icon_url TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tools and software
CREATE TABLE tools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon_url TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Languages
CREATE TABLE languages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  level TEXT NOT NULL,
  flag_emoji TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages (for storing form submissions)
CREATE TABLE contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial data
INSERT INTO hero_data (name, title, description, birth_year, location, current_job, github_url, linkedin_url, cv_url) VALUES 
('Eren Demirel', 'Actuarial Analyst', 'I''m passionate about transforming data into actionable insights and driving innovation in the insurance sector.', 2001, 'Istanbul', 'Actuarial Analyst at Eureko Sigorta', 'https://github.com/demireleren877', 'https://linkedin.com/in/demireleren877', '/cv.pdf');

INSERT INTO about_data (title, description) VALUES 
('About Me', 'I am a dedicated Business Development and Data Analysis professional with a strong passion for transforming complex data into actionable insights. With expertise in process automation, financial reporting, and strategic business development, I help organizations make data-driven decisions that drive growth and efficiency.');

INSERT INTO about_highlights (about_id, icon, title, description, order_index) VALUES 
(1, '🎯', 'Strategic Thinking', 'Developing comprehensive business strategies that align with organizational goals and market opportunities.', 1),
(1, '📊', 'Data Analysis', 'Transforming raw data into meaningful insights using advanced analytical tools and methodologies.', 2),
(1, '⚡', 'Process Automation', 'Streamlining business processes through innovative automation solutions and technology integration.', 3);

INSERT INTO experiences (title, company, start_date, end_date, is_current, description, order_index) VALUES 
('Actuarial Analyst', 'Eureko Sigorta', 'June 2022', NULL, TRUE, 'Working as an Actuarial Analyst at Eureko Sigorta, focusing on IFRS data extraction, transformation, and automation of manual processes using SAS Enterprise Guide and SQL.', 1),
('.NET Web Developer', 'Uyumsoft AŞ', 'June 2022', 'July 2022', FALSE, 'Short-term web development project using .NET framework for creating web applications and solutions.', 2);

INSERT INTO experience_achievements (experience_id, achievement, order_index) VALUES 
(1, 'Extract and transform data sets required by International Financial Reporting System (IFRS) from raw data into desired formats using SAS Enterprise Guide and SQL', 1),
(1, 'Automate manual Excel tasks, saving an average of 2 workdays per month per project while reducing human error and increasing efficiency', 2),
(1, 'Prepare interpretable data for actuarial processes and financial reporting, creating comprehensive documentation for all processes', 3),
(1, 'Developed a tool that extracts discounted cash flows according to IFRS 17 standards and demonstrates the impact of discount curves, initially in Python then optimized with Oracle SQL and Power BI for better performance with large datasets', 4),
(1, 'Automated monthly closing preparation process by developing a Python-based bot for sending individual emails to various departments, streamlining communication and saving valuable time', 5),
(2, 'Developed web applications using .NET framework', 1),
(2, 'Gained hands-on experience in web development technologies', 2),
(2, 'Contributed to software development projects', 3),
(2, 'Applied programming skills in a professional environment', 4);

INSERT INTO education (degree, school, start_date, end_date, is_current, field_of_study, order_index) VALUES 
('Mathematical Engineering', 'Yıldız Technical University', 'September 2019', 'May 2024', FALSE, 'Mathematical Engineering', 1),
('Data Academy Certification', 'Eureko Sigorta', '2022', '2022', FALSE, 'Data Analytics', 2);

INSERT INTO education_achievements (education_id, achievement, order_index) VALUES 
(1, 'Comprehensive training in mathematical modeling and analysis', 1),
(1, 'Strong foundation in engineering mathematics and statistics', 2),
(1, 'Applied mathematical concepts to real-world engineering problems', 3),
(1, 'Developed analytical thinking and problem-solving skills', 4),
(2, 'Completed comprehensive data analysis training program', 1),
(2, 'Developed and presented a final project', 2),
(2, 'Gained advanced skills in data analysis methodologies', 3),
(2, 'Applied business intelligence and reporting techniques', 4),
(2, 'Enhanced data visualization and dashboard development capabilities', 5);

INSERT INTO competencies (name, icon_url, order_index) VALUES 
('Business Development', '/icons/business-development.png', 1),
('Analytical Thinking', '/icons/analytical-thinking.png', 2),
('Problem Solving', '/icons/problem-solving.png', 3),
('Data Analysis', '/icons/data-analysis.png', 4),
('Project Management', '/icons/project-management.png', 5),
('Strategic Planning', '/icons/strategic-planning.png', 6);

INSERT INTO tools (name, category, icon_url, order_index) VALUES 
('Python', 'Process Automation & Data Analysis', '/icons/python-svgrepo-com.svg', 1),
('Excel', 'Data Analysis & Reporting', '/icons/excel-svgrepo-com.svg', 2),
('SAS EG', 'Data Processing', '/icons/sas-logo-horiz.svg', 3),
('Oracle SQL', 'Database Management', '/icons/sql-svgrepo-com.svg', 4),
('Power BI', 'Data Visualization', '/icons/New_Power_BI_Logo.svg', 5),
('Flutter', 'Mobile Development', '/icons/flutter-svgrepo-com.svg', 6);

INSERT INTO languages (name, level, flag_emoji, order_index) VALUES 
('Turkish', 'Native', '🇹🇷', 1),
('English', 'Advanced', '🇬🇧', 2);
