/**
 * Simple test endpoint to verify Vercel functions are working
 * Access at: /api/test
 */
export default async function handler(req, res) {
  res.status(200).json({ 
    message: 'Vercel function is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}

