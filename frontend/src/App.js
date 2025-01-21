import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import authStore from './stores/AuthStore';
import Login from './pages/Login';
import Home from './pages/Home';
import Conferinte from './pages/Conferinte';
import Articole from './pages/Articole';
import Register from './pages/Register';

const App = observer(() => {
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#007bff',
  };

  const linkContainerStyle = {
    display: 'flex',
    gap: '20px',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
  };

  const activeLinkStyle = {
    fontWeight: 'bold',
    textDecoration: 'underline',
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    authStore.logout();
    navigate('/');
  };

  return (
    <div className="App">
      <nav style={navStyle}>
        <div style={linkContainerStyle}>
          <NavLink to="/" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}>
            Acasă
          </NavLink>
          <NavLink to="/conferinte" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}>
            Conferințe
          </NavLink>
          <NavLink to="/articole" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}>
            Articole
          </NavLink>
        </div>
        {authStore.isLoggedIn() ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'white', fontSize: '16px' }}>Bun venit, {authStore.user.username}!</span>
            <button onClick={handleLogout} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}>
              Deconectare
            </button>
          </div>
        ) : (
          <NavLink to="/login" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}>
            Autentificare
          </NavLink>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/conferinte" element={<Conferinte />} />
        <Route path="/articole" element={<Articole />} />
      </Routes>
    </div>
  );
});

export default App;
