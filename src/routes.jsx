import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Instructor from './pages/p/o/Instructor';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Ruta para la página de inicio */}
        <Route path="/instructor" element={<Instructor />} /> {/* Ruta para el formulario de instructor */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;