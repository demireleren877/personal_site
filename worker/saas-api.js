// SAAS API for Multi-Tenant Personal Sites
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        // Handle preflight requests
        if (method === 'OPTIONS') {
            return new Response(null, { status: 200, headers: corsHeaders });
        }

        try {
            // Authentication middleware
            const authResult = await authenticateUser(request, env);
            if (!authResult.success && path.startsWith('/api/user/')) {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // Route handling
            if (path === '/api/auth/register' && method === 'POST') {
                return await registerUser(request, env, corsHeaders);
            } else if (path === '/api/auth/login' && method === 'POST') {
                return await loginUser(request, env, corsHeaders);
            } else if (path === '/api/user/profile' && method === 'GET') {
                return await getUserProfile(authResult.userId, env, corsHeaders);
            } else if (path === '/api/user/sites' && method === 'GET') {
                return await getUserSites(authResult.userId, env, corsHeaders);
            } else if (path === '/api/user/sites' && method === 'POST') {
                return await createUserSite(request, authResult.userId, env, corsHeaders);
            } else if (path.startsWith('/api/site/') && method === 'GET') {
                return await getSiteData(path, env, corsHeaders);
            } else if (path.startsWith('/api/site/') && method === 'PUT') {
                return await updateSiteData(path, request, authResult.userId, env, corsHeaders);
            } else if (path === '/api/themes' && method === 'GET') {
                return await getThemes(env, corsHeaders);
            } else if (path.startsWith('/api/site/') && path.includes('/contact') && method === 'POST') {
                return await submitContactForm(path, request, env, corsHeaders);
            } else if (path === '/api/hero' && method === 'GET') {
                return await getMainSiteHero(env, corsHeaders);
            } else if (path === '/api/experiences' && method === 'GET') {
                return await getMainSiteExperiences(env, corsHeaders);
            } else if (path === '/api/education' && method === 'GET') {
                return await getMainSiteEducation(env, corsHeaders);
            } else if (path === '/api/competencies' && method === 'GET') {
                return await getMainSiteCompetencies(env, corsHeaders);
            } else if (path === '/api/tools' && method === 'GET') {
                return await getMainSiteTools(env, corsHeaders);
            } else if (path === '/api/languages' && method === 'GET') {
                return await getMainSiteLanguages(env, corsHeaders);
            } else if (path === '/api/contact' && method === 'POST') {
                return await submitMainSiteContact(request, env, corsHeaders);
            } else if (path === '/api/user/domain' && method === 'POST') {
                return await addCustomDomain(request, authResult.userId, env, corsHeaders);
            } else {
                return new Response('Not Found', {
                    status: 404,
                    headers: corsHeaders
                });
            }
        } catch (error) {
            console.error('SAAS API Error:', error);
            return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
    },
};

// Authentication helper
async function authenticateUser(request, env) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { success: false };
    }

    const token = authHeader.substring(7);
    const userId = parseInt(token);

    if (!userId || isNaN(userId)) {
        return { success: false };
    }

    // Verify user exists
    const user = await env.DB.prepare(
        'SELECT id FROM users WHERE id = ?'
    ).bind(userId).first();

    if (!user) {
        return { success: false };
    }

    return { success: true, userId };
}

// User registration
async function registerUser(request, env, corsHeaders) {
    const { email, password, name } = await request.json();

    // Check if user exists
    const existingUser = await env.DB.prepare(
        'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existingUser) {
        return new Response(JSON.stringify({ error: 'User already exists' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    // Hash password (in production, use proper hashing)
    const passwordHash = `$2b$10$${Math.random().toString(36).substring(2)}`;

    // Create user
    const result = await env.DB.prepare(
        'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)'
    ).bind(email, passwordHash, name).run();

    return new Response(JSON.stringify({
        success: true,
        userId: result.meta.last_row_id
    }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

// User login
async function loginUser(request, env, corsHeaders) {
    const { email, password } = await request.json();

    const user = await env.DB.prepare(
        'SELECT id, name, email FROM users WHERE email = ?'
    ).bind(email).first();

    if (!user) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    // In production, verify password hash
    // For demo, return success
    return new Response(JSON.stringify({
        success: true,
        user: { id: user.id, name: user.name, email: user.email },
        token: user.id.toString() // Demo token
    }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

// Get user profile
async function getUserProfile(userId, env, corsHeaders) {
    const user = await env.DB.prepare(
        'SELECT id, name, email, subscription_plan, created_at FROM users WHERE id = ?'
    ).bind(userId).first();

    return new Response(JSON.stringify(user), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

// Get user sites
async function getUserSites(userId, env, corsHeaders) {
    const sites = await env.DB.prepare(
        'SELECT us.*, t.name as theme_name FROM user_sites us LEFT JOIN themes t ON us.theme_id = t.id WHERE us.user_id = ? ORDER BY us.created_at DESC'
    ).bind(userId).all();

    return new Response(JSON.stringify(sites.results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

// Create new site
async function createUserSite(request, userId, env, corsHeaders) {
    const { subdomain, site_name, site_description, theme_id, custom_domain } = await request.json();

    // Check if subdomain is available
    const existingSite = await env.DB.prepare(
        'SELECT id FROM user_sites WHERE subdomain = ?'
    ).bind(subdomain).first();

    if (existingSite) {
        return new Response(JSON.stringify({ error: 'Subdomain already taken' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    const result = await env.DB.prepare(
        'INSERT INTO user_sites (user_id, subdomain, site_name, site_description, theme_id, domain) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(userId, subdomain, site_name, site_description, theme_id || 1, custom_domain || null).run();

    // If custom domain provided, create Cloudflare DNS record
    if (custom_domain) {
        try {
            await createCloudflareDNSRecord(custom_domain, env);
        } catch (error) {
            console.error('Failed to create DNS record:', error);
            // Continue with site creation even if DNS fails
        }
    }

    return new Response(JSON.stringify({
        success: true,
        siteId: result.meta.last_row_id
    }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

// Get site data (public endpoint)
async function getSiteData(path, env, corsHeaders) {
    const pathParts = path.split('/');
    const subdomain = pathParts[3]; // /api/site/{subdomain}/...
    const dataType = pathParts[4]; // hero, about, experiences, etc.

    // Get site info (allow unpublished sites for editing)
    const site = await env.DB.prepare(
        'SELECT us.*, t.css_variables FROM user_sites us LEFT JOIN themes t ON us.theme_id = t.id WHERE us.subdomain = ?'
    ).bind(subdomain).first();

    if (!site) {
        return new Response(JSON.stringify({ error: 'Site not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    let data = null;

    switch (dataType) {
        case 'hero':
            data = await env.DB.prepare(
                'SELECT * FROM site_hero_data WHERE site_id = ?'
            ).bind(site.id).first();
            break;
        case 'about':
            const about = await env.DB.prepare(
                'SELECT * FROM site_about_data WHERE site_id = ?'
            ).bind(site.id).first();
            if (about) {
                const highlights = await env.DB.prepare(
                    'SELECT * FROM site_about_highlights WHERE about_id = ? ORDER BY order_index'
                ).bind(about.id).all();
                data = { ...about, highlights: highlights.results };
            }
            break;
        case 'experiences':
            const experiences = await env.DB.prepare(
                'SELECT * FROM site_experiences WHERE site_id = ? ORDER BY start_date DESC, order_index'
            ).bind(site.id).all();

            data = await Promise.all(
                experiences.results.map(async (exp) => {
                    const achievements = await env.DB.prepare(
                        'SELECT * FROM site_experience_achievements WHERE experience_id = ? ORDER BY order_index'
                    ).bind(exp.id).all();
                    return { ...exp, achievements: achievements.results };
                })
            );
            break;
        case 'education':
            const education = await env.DB.prepare(
                'SELECT * FROM site_education WHERE site_id = ? ORDER BY start_date DESC, order_index'
            ).bind(site.id).all();

            data = await Promise.all(
                education.results.map(async (edu) => {
                    const achievements = await env.DB.prepare(
                        'SELECT * FROM site_education_achievements WHERE education_id = ? ORDER BY order_index'
                    ).bind(edu.id).all();
                    return { ...edu, achievements: achievements.results };
                })
            );
            break;
        case 'competencies':
            data = await env.DB.prepare(
                'SELECT * FROM site_competencies WHERE site_id = ? ORDER BY order_index'
            ).bind(site.id).all();
            data = data.results;
            break;
        case 'tools':
            data = await env.DB.prepare(
                'SELECT * FROM site_tools WHERE site_id = ? ORDER BY order_index'
            ).bind(site.id).all();
            data = data.results;
            break;
        case 'languages':
            data = await env.DB.prepare(
                'SELECT * FROM site_languages WHERE site_id = ? ORDER BY order_index'
            ).bind(site.id).all();
            data = data.results;
            break;
        case 'theme':
            data = { css_variables: site.css_variables };
            break;
    }

    return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

// Update site data
async function updateSiteData(path, request, userId, env, corsHeaders) {
    const pathParts = path.split('/');
    const subdomain = pathParts[3];

    // Get or create site for user
    let site = await env.DB.prepare(
        'SELECT id FROM user_sites WHERE subdomain = ? AND user_id = ?'
    ).bind(subdomain, userId).first();

    if (!site) {
        // Create new site for user
        const result = await env.DB.prepare(
            'INSERT INTO user_sites (user_id, site_name, subdomain, is_published) VALUES (?, ?, ?, ?)'
        ).bind(userId, `${subdomain}'s Portfolio`, subdomain, true).run();

        site = { id: result.meta.last_row_id };
    }

    const data = await request.json();

    try {
        // Update hero data
        if (data.hero) {
            // First, delete existing hero data for this site
            await env.DB.prepare(
                'DELETE FROM site_hero_data WHERE site_id = ?'
            ).bind(site.id).run();

            // Then insert new hero data
            await env.DB.prepare(
                'INSERT INTO site_hero_data (site_id, name, title, description, birth_year, location, current_job, github_url, linkedin_url, cv_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            ).bind(
                site.id,
                data.hero.name || '',
                data.hero.title || '',
                data.hero.description || '',
                data.hero.birth_year || null,
                data.hero.location || '',
                data.hero.current_job || '',
                data.hero.github_url || '',
                data.hero.linkedin_url || '',
                data.hero.cv_url || ''
            ).run();
        }

        // Update about data
        if (data.about) {
            // First, delete existing about data for this site
            await env.DB.prepare(
                'DELETE FROM site_about_data WHERE site_id = ?'
            ).bind(site.id).run();

            // Then insert new about data
            await env.DB.prepare(
                'INSERT INTO site_about_data (site_id, title, description) VALUES (?, ?, ?)'
            ).bind(
                site.id,
                data.about.title || '',
                data.about.description || ''
            ).run();
        }

        // Update experiences
        if (data.experiences) {
            // Clear existing experiences and their achievements
            await env.DB.prepare('DELETE FROM site_experience_achievements WHERE experience_id IN (SELECT id FROM site_experiences WHERE site_id = ?)').bind(site.id).run();
            await env.DB.prepare('DELETE FROM site_experiences WHERE site_id = ?').bind(site.id).run();

            // Insert new experiences
            for (let i = 0; i < data.experiences.length; i++) {
                const exp = data.experiences[i];
                console.log('Processing experience:', exp);
                const endDate = exp.end_date || '';
                console.log('end_date:', endDate);

                const result = await env.DB.prepare(
                    'INSERT INTO site_experiences (site_id, title, company, start_date, end_date, description, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)'
                ).bind(
                    site.id,
                    exp.title || exp.position || '',
                    exp.company || '',
                    exp.start_date || '',
                    endDate,
                    exp.description || '',
                    i
                ).run();

                // Insert achievements for this experience
                if (exp.achievements && exp.achievements.length > 0) {
                    for (let j = 0; j < exp.achievements.length; j++) {
                        const achievement = exp.achievements[j];
                        await env.DB.prepare(
                            'INSERT INTO site_experience_achievements (experience_id, achievement, order_index) VALUES (?, ?, ?)'
                        ).bind(
                            result.meta.last_row_id,
                            achievement.achievement || '',
                            j
                        ).run();
                    }
                }
            }
        }

        // Update education
        if (data.education) {
            // Clear existing education
            await env.DB.prepare('DELETE FROM site_education WHERE site_id = ?').bind(site.id).run();

            // Insert new education
            for (let i = 0; i < data.education.length; i++) {
                const edu = data.education[i];
                await env.DB.prepare(
                    'INSERT INTO site_education (site_id, degree, school, start_date, end_date, description, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)'
                ).bind(
                    site.id,
                    edu.degree || '',
                    edu.institution || '',
                    edu.start_date || '',
                    edu.end_date || '',
                    edu.field || '',
                    i
                ).run();
            }
        }

        // Update competencies
        if (data.competencies) {
            // Clear existing competencies
            await env.DB.prepare('DELETE FROM site_competencies WHERE site_id = ?').bind(site.id).run();

            // Insert new competencies
            for (let i = 0; i < data.competencies.length; i++) {
                const comp = data.competencies[i];
                await env.DB.prepare(
                    'INSERT INTO site_competencies (site_id, name, level, order_index) VALUES (?, ?, ?, ?)'
                ).bind(
                    site.id,
                    comp.name || '',
                    comp.level || 5,
                    i
                ).run();
            }
        }

        // Update tools
        if (data.tools) {
            // Clear existing tools
            await env.DB.prepare('DELETE FROM site_tools WHERE site_id = ?').bind(site.id).run();

            // Insert new tools
            for (let i = 0; i < data.tools.length; i++) {
                const tool = data.tools[i];
                await env.DB.prepare(
                    'INSERT INTO site_tools (site_id, name, level, order_index) VALUES (?, ?, ?, ?)'
                ).bind(
                    site.id,
                    tool.name || '',
                    tool.level || 5,
                    i
                ).run();
            }
        }

        // Update languages
        if (data.languages) {
            // Clear existing languages
            await env.DB.prepare('DELETE FROM site_languages WHERE site_id = ?').bind(site.id).run();

            // Insert new languages
            for (let i = 0; i < data.languages.length; i++) {
                const lang = data.languages[i];
                await env.DB.prepare(
                    'INSERT INTO site_languages (site_id, name, level, order_index) VALUES (?, ?, ?, ?)'
                ).bind(
                    site.id,
                    lang.name || '',
                    lang.level || 5,
                    i
                ).run();
            }
        }

        return new Response(JSON.stringify({ success: true, message: 'Site data updated successfully' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error updating site data:', error);
        return new Response(JSON.stringify({ error: 'Failed to update site data' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}

// Get themes
async function getThemes(env, corsHeaders) {
    const themes = await env.DB.prepare(
        'SELECT * FROM themes ORDER BY is_premium, name'
    ).all();

    return new Response(JSON.stringify(themes.results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

// Submit contact form
async function submitContactForm(path, request, env, corsHeaders) {
    const pathParts = path.split('/');
    const subdomain = pathParts[3];

    const site = await env.DB.prepare(
        'SELECT id FROM user_sites WHERE subdomain = ? AND is_published = true'
    ).bind(subdomain).first();

    if (!site) {
        return new Response(JSON.stringify({ error: 'Site not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    const { name, email, subject, message } = await request.json();

    await env.DB.prepare(
        'INSERT INTO site_contact_messages (site_id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)'
    ).bind(site.id, name, email, subject, message).run();

    return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

// Main site functions (for the default personal site)
async function getMainSiteHero(env, corsHeaders) {
    const hero = await env.DB.prepare(
        'SELECT * FROM site_hero_data WHERE site_id = 1'
    ).first();

    return new Response(JSON.stringify(hero), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

async function getMainSiteExperiences(env, corsHeaders) {
    const experiences = await env.DB.prepare(
        'SELECT * FROM site_experiences WHERE site_id = 1 ORDER BY start_date DESC, order_index'
    ).all();

    const experiencesWithAchievements = await Promise.all(
        experiences.results.map(async (exp) => {
            const achievements = await env.DB.prepare(
                'SELECT * FROM site_experience_achievements WHERE experience_id = ? ORDER BY order_index'
            ).bind(exp.id).all();

            return {
                ...exp,
                achievements: achievements.results
            };
        })
    );

    return new Response(JSON.stringify(experiencesWithAchievements), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

async function getMainSiteEducation(env, corsHeaders) {
    const education = await env.DB.prepare(
        'SELECT * FROM site_education WHERE site_id = 1 ORDER BY start_date DESC, order_index'
    ).all();

    return new Response(JSON.stringify(education.results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

async function getMainSiteCompetencies(env, corsHeaders) {
    const competencies = await env.DB.prepare(
        'SELECT * FROM site_competencies WHERE site_id = 1 ORDER BY order_index'
    ).all();

    return new Response(JSON.stringify(competencies.results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

async function getMainSiteTools(env, corsHeaders) {
    const tools = await env.DB.prepare(
        'SELECT * FROM site_tools WHERE site_id = 1 ORDER BY order_index'
    ).all();

    return new Response(JSON.stringify(tools.results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

async function getMainSiteLanguages(env, corsHeaders) {
    const languages = await env.DB.prepare(
        'SELECT * FROM site_languages WHERE site_id = 1 ORDER BY order_index'
    ).all();

    return new Response(JSON.stringify(languages.results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

async function submitMainSiteContact(request, env, corsHeaders) {
    const { name, email, subject, message } = await request.json();

    await env.DB.prepare(
        'INSERT INTO site_contact_messages (site_id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)'
    ).bind(1, name, email, subject, message).run();

    return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

// Cloudflare DNS record creation
async function createCloudflareDNSRecord(domain, env) {
    const zoneId = env.CLOUDFLARE_ZONE_ID;
    const apiToken = env.CLOUDFLARE_API_TOKEN;

    console.log('Creating DNS record for domain:', domain);
    console.log('Zone ID:', zoneId);
    console.log('API Token exists:', !!apiToken);
    console.log('API Token length:', apiToken ? apiToken.length : 0);

    if (!zoneId || !apiToken) {
        throw new Error('Cloudflare credentials not configured');
    }

    // Extract subdomain from domain
    const domainParts = domain.split('.');
    const subdomain = domainParts[0];
    const rootDomain = domainParts.slice(1).join('.');

    console.log('Subdomain:', subdomain);
    console.log('Root domain:', rootDomain);

    const dnsRecord = {
        type: 'CNAME',
        name: subdomain,
        content: env.CLOUDFLARE_WORKER_DOMAIN || 'personal-site-saas-api.l5819033.workers.dev',
        ttl: 1, // Auto TTL
        proxied: true // Enable Cloudflare proxy
    };

    console.log('DNS Record to create:', JSON.stringify(dnsRecord));

    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dnsRecord)
    });

    console.log('Cloudflare API response status:', response.status);

    if (!response.ok) {
        const error = await response.json();
        console.error('Cloudflare API error:', error);
        throw new Error(`Cloudflare API error: ${error.errors?.[0]?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('DNS record created successfully:', result);

    // Also add domain to Cloudflare Pages
    try {
        await addDomainToPages(domain, env);
    } catch (error) {
        console.error('Failed to add domain to Pages:', error);
        // Continue even if Pages API fails
    }

    return result;
}

// Add domain to Cloudflare Pages
async function addDomainToPages(domain, env) {
    const accountId = env.CLOUDFLARE_ACCOUNT_ID;
    const projectName = env.CLOUDFLARE_PROJECT_NAME;
    const apiToken = env.CLOUDFLARE_API_TOKEN;

    console.log('Adding domain to Pages:', domain);
    console.log('Account ID:', accountId);
    console.log('Project Name:', projectName);

    if (!accountId || !projectName || !apiToken) {
        throw new Error('Cloudflare Pages credentials not configured');
    }

    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/domains`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: domain
        })
    });

    console.log('Pages API response status:', response.status);

    if (!response.ok) {
        const error = await response.json();
        console.error('Pages API error:', error);
        throw new Error(`Pages API error: ${error.errors?.[0]?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('Domain added to Pages successfully:', result);
    return result;
}

// Add custom domain to existing site
async function addCustomDomain(request, userId, env, corsHeaders) {
    const { site_id, custom_domain } = await request.json();

    // Verify user owns the site
    const site = await env.DB.prepare(
        'SELECT id FROM user_sites WHERE id = ? AND user_id = ?'
    ).bind(site_id, userId).first();

    if (!site) {
        return new Response(JSON.stringify({ error: 'Site not found or access denied' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    // Update site with custom domain
    await env.DB.prepare(
        'UPDATE user_sites SET domain = ? WHERE id = ?'
    ).bind(custom_domain, site_id).run();

    // Create Cloudflare DNS record
    try {
        await createCloudflareDNSRecord(custom_domain, env);

        return new Response(JSON.stringify({
            success: true,
            message: 'Custom domain added successfully'
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Failed to create DNS record',
            details: error.message
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}
