// Vercel serverless function to proxy all API requests and handle CORS
export default async function handler(req, res) {
  // Set CORS headers to allow requests from your Vercel domain
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the API base URL
  const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://relsofttims-001-site1.gtempurl.com';
  
  // Extract the path from the request
  // For Vercel [...path].js, req.query.path will be an array like ['customers', 'paged'] or ['customers', '1']
  // If path is not in query, try to extract from URL
  let pathArray = req.query.path;
  
  if (!pathArray) {
    // Fallback: extract from URL if path is not in query
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    // Remove /api prefix if present
    const cleanPath = pathname.startsWith('/api/') ? pathname.slice(5) : pathname.startsWith('/api') ? pathname.slice(4) : pathname;
    pathArray = cleanPath ? cleanPath.split('/').filter(Boolean) : [];
  }
  
  const path = Array.isArray(pathArray) 
    ? '/' + pathArray.join('/') 
    : '/' + (pathArray || '');
  
  // Build query string from all query parameters except 'path'
  const queryParams = new URLSearchParams();
  Object.keys(req.query).forEach(key => {
    if (key !== 'path') {
      const value = req.query[key];
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, v));
      } else {
        queryParams.append(key, value);
      }
    }
  });
  const queryString = queryParams.toString() ? '?' + queryParams.toString() : '';
  
  const targetUrl = `${API_BASE_URL}/api${path}${queryString}`;

  try {
    // Parse request body if present
    let body = null;
    if (req.method !== 'GET' && req.method !== 'DELETE' && req.body) {
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }

    // Forward the request to the actual API
    const fetchOptions = {
      method: req.method,
      headers,
    };

    if (body) {
      fetchOptions.body = body;
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();
    
    // Forward the status and data
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      message: 'Proxy error', 
      error: error.message 
    });
  }
}

