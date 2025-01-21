import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Lipsă token de autentificare.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(400).json({ message: 'Formatul token-ului este invalid.' });
  }

  const token = parts[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: user.id,
      username: user.username, // Adăugat username-ul în req.user
      role: user.role,
    };
    next();
  } catch (error) {
    console.error('Token invalid:', error);
    res.status(403).json({ message: 'Token invalid.' });
  }
};

export default authenticateToken;

