export default function handler(req, res) {
  // Health check endpoint para Docker
  if (req.method === 'GET') {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'VX Autopeças Frontend',
      version: '1.0.0'
    })
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}