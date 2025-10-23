// Cloudflare Worker API for Personal Site
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
      // Route handling
      if (path === '/api/hero' && method === 'GET') {
        return await getHeroData(env, corsHeaders);
      } else if (path === '/api/about' && method === 'GET') {
        return await getAboutData(env, corsHeaders);
      } else if (path === '/api/experiences' && method === 'GET') {
        return await getExperiences(env, corsHeaders);
      } else if (path === '/api/education' && method === 'GET') {
        return await getEducation(env, corsHeaders);
      } else if (path === '/api/competencies' && method === 'GET') {
        return await getCompetencies(env, corsHeaders);
      } else if (path === '/api/tools' && method === 'GET') {
        return await getTools(env, corsHeaders);
      } else if (path === '/api/languages' && method === 'GET') {
        return await getLanguages(env, corsHeaders);
      } else if (path === '/api/contact' && method === 'POST') {
        return await createContactMessage(request, env, corsHeaders);
      } else {
        return new Response('Not Found', {
          status: 404,
          headers: corsHeaders
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};

// Get hero data
async function getHeroData(env, corsHeaders) {
  const result = await env.DB.prepare(
    'SELECT * FROM hero_data ORDER BY id DESC LIMIT 1'
  ).first();

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Get about data with highlights
async function getAboutData(env, corsHeaders) {
  const about = await env.DB.prepare(
    'SELECT * FROM about_data ORDER BY id DESC LIMIT 1'
  ).first();

  const highlights = await env.DB.prepare(
    'SELECT * FROM about_highlights WHERE about_id = ? ORDER BY order_index'
  ).bind(about.id).all();

  const result = {
    ...about,
    highlights: highlights.results
  };

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Get experiences with achievements
async function getExperiences(env, corsHeaders) {
  const experiences = await env.DB.prepare(
    'SELECT * FROM experiences ORDER BY order_index'
  ).all();

  const result = await Promise.all(
    experiences.results.map(async (exp) => {
      const achievements = await env.DB.prepare(
        'SELECT * FROM experience_achievements WHERE experience_id = ? ORDER BY order_index'
      ).bind(exp.id).all();

      return {
        ...exp,
        achievements: achievements.results
      };
    })
  );

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Get education with achievements
async function getEducation(env, corsHeaders) {
  const education = await env.DB.prepare(
    'SELECT * FROM education ORDER BY order_index'
  ).all();

  const result = await Promise.all(
    education.results.map(async (edu) => {
      const achievements = await env.DB.prepare(
        'SELECT * FROM education_achievements WHERE education_id = ? ORDER BY order_index'
      ).bind(edu.id).all();

      return {
        ...edu,
        achievements: achievements.results
      };
    })
  );

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Get competencies
async function getCompetencies(env, corsHeaders) {
  const result = await env.DB.prepare(
    'SELECT * FROM competencies ORDER BY order_index'
  ).all();

  return new Response(JSON.stringify(result.results), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Get tools
async function getTools(env, corsHeaders) {
  const result = await env.DB.prepare(
    'SELECT * FROM tools ORDER BY order_index'
  ).all();

  return new Response(JSON.stringify(result.results), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Get languages
async function getLanguages(env, corsHeaders) {
  const result = await env.DB.prepare(
    'SELECT * FROM languages ORDER BY order_index'
  ).all();

  return new Response(JSON.stringify(result.results), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Create contact message
async function createContactMessage(request, env, corsHeaders) {
  const data = await request.json();

  const { name, email, subject, message } = data;

  if (!name || !email || !subject || !message) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const result = await env.DB.prepare(
    'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)'
  ).bind(name, email, subject, message).run();

  return new Response(JSON.stringify({
    success: true,
    id: result.meta.last_row_id
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}