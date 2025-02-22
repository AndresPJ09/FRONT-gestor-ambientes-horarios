import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Instructor from './pages/p/Instructor';
import Ambiente from './pages/p/Ambiente';
import Periodo from './pages/p/Periodo';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/instructor" element={<Instructor />} /> 
        <Route path="/ambiente" element={<Ambiente />} /> 
        <Route path="/periodo" element={<Periodo />} /> 
      </Routes>
    </Router>
  );
};

export default AppRoutes;