import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <nav style={{ display: "flex", gap: "20px", padding: "20px", background: "#f0f0f0", width: '1590px' }}>
        <Link to="/tipovinculo">Tipo Vínculo</Link>
        <Link to="/instructor">Instructor</Link>
        <Link to="/competencia">Competencia</Link>
        <Link to="/periodo">Periodo</Link>
        <Link to="/ambiente">Ambiente</Link>
        <Link to="/fase">Fase</Link>
        <Link to="/nivelformacion">Nivel Formación</Link>
        <Link to="/programa">Programa</Link>
        <Link to="/proyecto">Proyecto</Link>
        <Link to="/actividad">Actividad</Link>
        <Link to="/proyectofase">Proyecto fase</Link>
        <Link to="/actividadfase">Actividad fase</Link>
        <Link to="/resultadoaprendizaje">Resultado Aprendizaje</Link>
        <Link to="/ficha">Ficha</Link>
        <Link to="/horario">Horario</Link>
        <Link to="/instructorhorario">Horario de instructores</Link>
        <Link to="/consolidadoambiente">Consolidado Ambiente</Link>
        <Link to="/consolidadoficha">Consolidado Fichas</Link>
      </nav>

      <p>Hola, bienvenido</p>
    </div>
  );
};

export default Home;
