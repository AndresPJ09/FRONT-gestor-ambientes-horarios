import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { obtenerProyectos } from '../../services/ProyectoService';
import { obtenerFases } from '../../services/FaseService';
import {
  crearProyectoFase,
  actualizarProyectoFase,
  eliminarProyectoFase,
  obtenerProyectoFases,
} from '../../services/ProyectoFaseService';

const ProyectoFase = () => {
  const [formData, setFormData] = useState({
    proyecto_id: 0,
    fase_id: 0,
  });

  const abrirModalCrear = () => {
    setEditando(false);
    setFormData({
      proyecto_id: 0,
      fase_id: 0,
    });
    setEditando(false);
    setIdEditar(null);
    setModalAbierto(true); // Abrir el modal
  };

  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const [proyectofases, setProyectosFases] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [fases, setFases] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    cargarProyectos();
    cargarFases();
    cargarProyectoFases();
  }, []);

  const cargarProyectoFases = async () => {
    try {
      const data = await obtenerProyectoFases();
      console.log("Proyecto fases cargados:", data);
      setProyectosFases(data);
    } catch (error) {
      console.error('Error al cargar proyecto fase:', error);
    }
  };


  const cargarProyectos = async () => {
    try {
      const data = await obtenerProyectos();
      console.log("Proyecto cargados:", data);
      setProyectos(data);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    }
  };

  const cargarFases = async () => {
    try {
      const data = await obtenerFases();
      console.log("Proyectos cargados:", data);
      setFases(data);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData };
    try {
      if (editando) {
        await actualizarProyectoFase(idEditar, data);
        Swal.fire('Actualizado', 'Proyecto fase actualizada exitosamente', 'success');
      } else {
        await crearProyectoFase(data);
        Swal.fire('Creado', 'Proyecto fase creada exitosamente', 'success');
      }
      resetFormulario();
      cargarProyectoFases();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Ocurrió un problema', 'error');
    }
  };

  const resetFormulario = () => {
    setFormData({
    proyecto_id: 0,
    fase_id: 0,
    });
    setEditando(false);
    setIdEditar(null);
    setModalAbierto(false);
  };

  const handleEditar = (proyectofase) => {
    setFormData({ ...proyectofase });
    setEditando(true);
    setIdEditar(proyectofase.id);
    setModalAbierto(true);
  };

  const handleEliminar = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (resultado.isConfirmed) {
      try {
        await eliminarProyectoFase(id);
        Swal.fire('Eliminado', 'Proyecto eliminada exitosamente', 'success');
        cargarProyectoFases();
      } catch (error) {
        console.error('Error al eliminar la proyecto fase:', error);
        Swal.fire('Error', 'No se pudo eliminar la proyecto fase', 'error');
      }
    }
  };

  return (
    <div className="container">
      <h1 className="titulo">Gestión de Proyecto fase</h1>

      <button onClick={abrirModalCrear} className="boton-crear">
        Crear Proyecto fase
      </button>

      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal2">
            <h2 className="modal-titulo">
              {editando ? 'Editar proyecto fase' : 'Crear proyecto fase'}
            </h2>
            <form onSubmit={handleSubmit} className="formulario">

              <div className="fila">
              <div className="campo">
                  <label htmlFor="proyecto_id">Proyecto:</label>
                  <select id="proyecto_id" name="proyecto_id" value={formData.proyecto_id} onChange={handleChange} required className="input">
                    <option value="">Seleccione...</option>
                    {proyectos.map((proyecto) => (
                      <option key={proyecto.id} value={proyecto.id}>
                        {proyecto.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="campo">
                  <label htmlFor="fase_id">Fase:</label>
                  <select id="fase_id" name="fase_id" value={formData.fase_id} onChange={handleChange} required className="input">
                    <option value="">Seleccione...</option>
                    {fases.map((fase) => (
                      <option key={fase.id} value={fase.id}>
                        {fase.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="botones">
                <button className="boton-cancelar" type="button" onClick={() => setModalAbierto(false)}>Cancelar</button>
                <button className="boton-guardar" type="submit">{editando ? 'Actualizar proyecto fase' : 'Crear proyecto fase'}</button>
              </div>
            </form>
          </div>
        </div >
      )}

      <h2 className="subtitulo">Lista de proyecto fase</h2>
      <table className="tabla">
        <thead>
          <tr>
            <th className="th">Proyecto</th>
            <th className="th">Fase</th>
            <th className="th">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proyectofases.map((proyectofase) => (
            <tr key={proyectofase.id} className="tr">
              <td className="td">{proyectos.find(proy => proy.id === proyectofase.proyecto_id)?.nombre || "No asignado"}</td>
              <td className="td">{fases.find(proy => proy.id === proyectofase.fase_id)?.descripcion || "No asignado"}</td>
              <td className="td">
                <button
                  onClick={() => handleEditar(proyectofase)}
                  className="boton-editar"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(proyectofase.id)}
                  className="boton-eliminar"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div >
  );




};

export default ProyectoFase;