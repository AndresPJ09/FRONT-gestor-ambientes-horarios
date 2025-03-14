import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Instructor from './pages/p/Instructor';
import Ambiente from './pages/p/Ambiente';
import Periodo from './pages/p/Periodo';
import TipoVinculo from './pages/p/Tipovinculo';
import NivelFormacion from './pages/p/Nivelformacion';
import Programa from './pages/o/Programa';
import Competencia from './pages/o/Competencia';
import Fase from './pages/p/Fase';
import Proyecto from './pages/p/Proyecto';
import Ficha from './pages/o/Ficha';
import Horario from './pages/o/Horario';
import InstructorHorario from './pages/o/InstructorHorario';
import Actividad from './pages/o/Actividad';
import ProyectoFase from './pages/o/ProyectoFase';
import ActividadFase from './pages/o/ActividadFase';
import ConsolidadoFicha from './pages/o/ConsolidadoFicha';
import ConsolidadoAmbiente from './pages/o/ConsolidadoAmbiente';
import ResultadoAprendizaje from './pages/o/ResultadoAprendizaje';


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
        <Route path="/resultadoaprendizaje" element={< ResultadoAprendizaje/>} />
        <Route path="/fase" element={<Fase />} />
        <Route path="/proyecto" element={<Proyecto />} />
        <Route path="/ficha" element={<Ficha />} />
        <Route path="/horario" element={<Horario />} />
        <Route path="/instructorhorario" element={< InstructorHorario/>} />
        <Route path="/proyectofase" element={< ProyectoFase/>} />
        <Route path="/actividad" element={< Actividad/>} />
        <Route path="/actividadfase" element={< ActividadFase/>} />
        <Route path="/consolidadoambiente" element={< ConsolidadoAmbiente/>} />
        <Route path="/consolidadohorario" element={< ConsolidadoFicha/>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;