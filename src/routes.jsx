import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Instructor from './pages/p/Instructor';
import Ambiente from './pages/p/Ambiente';
import Periodo from './pages/p/Periodo';
import TipoVinculo from './pages/p/Tipovinculo';
import NivelFormacion from './pages/p/Nivelformacion';
import Programa from './pages/o/Programa';
import Competencia from './pages/o/Competencia';
import ResultadoAprendizaje from './pages/o/ResultadoAprendizaje';
import Fase from './pages/p/Fase';
import Proyecto from './pages/p/Proyecto';
import Ficha from './pages/o/Ficha';
import Horario from './pages/o/Horario';


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/instructor" element={<Instructor />} /> 
        <Route path="/ambiente" element={<Ambiente />} /> 
        <Route path="/periodo" element={<Periodo />} /> 
        <Route path="/nivelformacion" element={<NivelFormacion />} /> 
        <Route path="/tipovinculo" element={<TipoVinculo />} /> 
        <Route path="/programa" element={<Programa />} /> 
        <Route path="/competencia" element={<Competencia />} /> 
        <Route path="/resultadoaprendizaje" element={<ResultadoAprendizaje />} />
        <Route path="/fase" element={<Fase />} />
        <Route path="/proyecto" element={<Proyecto />} />
        <Route path="/ficha" element={<Ficha />} />
        <Route path="/horario" element={<Horario />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;