/**
 * Vercel Serverless Function to Proxy API Requests
 * 
 * This function handles all requests to /api/* and forwards them to your backend API.
 * 
 * How it works:
 * 1. Frontend makes request to: /api/customers/paged
 * 2. Vercel routes it to this function (because of api/[...path].js)
 * 3. This function extracts the path: customers/paged
 * 4. It forwards the request to: http://relsofttims-001-site1.gtempurl.com/api/customers/paged
 * 5. It returns the response back to the frontend
 */

export default async function handler(req, res) {
  // Set CORS headers to allow requests from your Vercel domain
  // This allows your frontend to make API calls without CORS errors
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests (browser checks if request is allowed)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Log that the function was called (for debugging)
  console.log('=== Vercel Function Called ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Query:', JSON.stringify(req.query));
  console.log('Headers:', JSON.stringify(req.headers));

  // Your backend API URL
  // You can override this with an environment variable in Vercel dashboard
  const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://relsofttims-001-site1.gtempurl.com';
  
  // Extract the path from the request
  // For Vercel [...path].js files, the path segments are in req.query.path as an array
  // Example: /api/customers/paged becomes ['customers', 'paged']
  let pathArray = req.query.path;
  
  // Debug: Log the request details
  console.log('Request received:', {
    url: req.url,
    method: req.method,
    query: req.query,
    pathArray: pathArray
  });
  
  // If path is not an array, convert it to an array
  if (!Array.isArray(pathArray)) {
    pathArray = pathArray ? [pathArray] : [];
  }
  
  // If pathArray is empty, try to extract from URL
  if (pathArray.length === 0 && req.url) {
    try {
      const urlPath = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
      // Remove /api prefix if present
      const cleanPath = urlPath.replace(/^\/api\/?/, '');
      if (cleanPath) {
        pathArray = cleanPath.split('/').filter(Boolean);
      }
    } catch (e) {
      console.error('Error parsing URL:', e);
      // Try simple string manipulation as fallback
      const urlMatch = req.url.match(/\/api\/(.+?)(\?|$)/);
      if (urlMatch && urlMatch[1]) {
        pathArray = urlMatch[1].split('/').filter(Boolean);
      }
    }
  }
  
  // Join the path segments with '/' to create the full path
  // Example: ['customers', 'paged'] becomes '/customers/paged'
  const apiPath = pathArray.length > 0 ? '/' + pathArray.join('/') : '';
  
  // If we still don't have a path, return an error
  if (!apiPath) {
    console.error('No path extracted from request');
    return res.status(400).json({ 
      error: 'Invalid API path',
      url: req.url,
      query: req.query
    });
  }
  
  // Build query string from all query parameters except 'path'
  // The 'path' parameter is used by Vercel for routing, so we exclude it
  const queryParams = new URLSearchParams();
  Object.keys(req.query).forEach(key => {
    if (key !== 'path') {
      const value = req.query[key];
      if (Array.isArray(value)) {
        // If multiple values for same parameter, add all of them
        value.forEach(v => queryParams.append(key, v));
      } else {
        queryParams.append(key, value);
      }
    }
  });
  const queryString = queryParams.toString() ? '?' + queryParams.toString() : '';
  
  // Build the full URL to your backend API
  // Example: http://relsofttims-001-site1.gtempurl.com/api/customers/paged?pageNumber=1&pageSize=10
  const targetUrl = `${API_BASE_URL}/api${apiPath}${queryString}`;

  try {
    // Parse request body if present (for POST, PUT, PATCH requests)
    let body = null;
    if (req.method !== 'GET' && req.method !== 'DELETE' && req.body) {
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    // Prepare headers to send to backend
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Forward authorization header if present
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }

    // Forward the request to your backend API
    const fetchOptions = {
      method: req.method,
      headers,
    };

    if (body) {
      fetchOptions.body = body;
    }

    // Make the request to your backend
    console.log('Fetching from backend:', targetUrl);
    const response = await fetch(targetUrl, fetchOptions);
    
    // Log for debugging
    console.log('Backend response:', {
      method: req.method,
      originalUrl: req.url,
      targetUrl: targetUrl,
      status: response.status,
      statusText: response.statusText,
      pathArray: pathArray,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    // Get the response data (handle both JSON and non-JSON responses)
    let data;
    const contentType = response.headers.get('content-type') || '';
    
    try {
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // If not JSON, get as text
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { 
            message: text || `Backend returned ${response.status} ${response.statusText}`,
            status: response.status,
            statusText: response.statusText
          };
        }
      }
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      data = { 
        message: `Error parsing response: ${parseError.message}`,
        status: response.status,
        statusText: response.statusText
      };
    }
    
    // Forward the status code and data back to the frontend
    res.status(response.status).json(data);
  } catch (error) {
    // If something goes wrong, log it and return an error
    console.error('Proxy error:', error);
    console.error('Target URL was:', targetUrl);
    res.status(500).json({ 
      message: 'Proxy error', 
      error: error.message 
    });
  }
}

