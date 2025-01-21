import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifică dacă header-ul lipsește
  if (!authHeader) {
    return res.status(401).json({ message: 'Lipsă token de autentificare.' });
  }

  // Verifică formatul header-ului
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(400).json({ message: 'Formatul token-ului este invalid.' });
  }

  const token = parts[1]; // Extrage token-ul

  try {
    // Verifică token-ul JWT
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // Adaugă utilizatorul decodat în req pentru utilizare ulterioară
    req.user = user;
    next(); // Trecere la următoarea funcție/rută
  } catch (error) {
    console.error('Token invalid:', error);
    res.status(403).json({ message: 'Token invalid.' });
  }
};

export default authenticateToken;
