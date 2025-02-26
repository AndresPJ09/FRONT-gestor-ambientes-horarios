import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <nav style={{ display: "flex", gap: "10px", padding: "10px", background: "#f0f0f0" }}>
        <Link to="/competencia">Competencia</Link>
        <Link to="/consolidado-ambiente">Consolidado Ambiente</Link>
        <Link to="/ficha">Ficha</Link>
        <Link to="/programa">Programa</Link>
        <Link to="/resultado-aprendizaje">Resultado Aprendizaje</Link>
        <Link to="/ambiente">Ambiente</Link>
        <Link to="/fase">Fase</Link>
        <Link to="/instructor">Instructor</Link>
        <Link to="/nivelformacion">Nivel Formación</Link>
        <Link to="/periodo">Periodo</Link>
        <Link to="/proyecto">Proyecto</Link>
        <Link to="/tipovinculo">Tipo Vínculo</Link>
        <Link to="/ficha">Ficha</Link>
        <Link to="/horario">Horario</Link>
      </nav>

      <p>Hola, bienvenido</p>
    </div>
  );
};

export default Home;
