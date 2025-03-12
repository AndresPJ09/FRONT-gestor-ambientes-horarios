import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { obtenerProyectoFases } from '../../services/ProyectoFaseService';
import {
  crearActividad,
  actualizarActividad,
  eliminarActividad,
  obtenerActividades,
} from '../../services/ActividadService';

const Actividad = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    proyectodase_id: 0,
    estado: true,
  });

  const abrirModalCrear = () => {
    setEditando(false);
    setFormData({
      nombre: '',
      proyectodase_id: 0,
      estado: true,
    });
    setEditando(false);
    setIdEditar(null);
    setModalAbierto(true); // Abrir el modal
  };

  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [proyectofases, setProyectoFases] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    cargarProyectosFases();
    cargarActividades();
  }, []);


  const cargarActividades = async () => {
    try {
      const data = await obtenerActividades();
      console.log("Actividades cargados:", data);
      setActividades(data);
    } catch (error) {
      console.error('Error al cargar actividades:', error);
    }
  };

  const cargarProyectosFases = async () => {
    try {
      const data = await obtenerProyectoFases();
      console.log("Proyectos cargados:", data);
      setProyectoFases(data);
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
        await actualizarActividad(idEditar, data);
        Swal.fire('Actualizado', 'Actividad actualizada exitosamente', 'success');
      } else {
        await crearActividad(data);
        Swal.fire('Creado', 'Actividad creada exitosamente', 'success');
      }
      resetFormulario();
      cargarActividad();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Ocurrió un problema', 'error');
    }
  };

  const resetFormulario = () => {
    setFormData({
      codigo: '',
      programa_id: 0,
      proyecto_id: 0,
      fecha_inicio: '',
      fecha_fin: '',
      fin_lectiva: '',
      numero_semanas: 0,
      cupo: 0,
      estado: true,
    });
    setEditando(false);
    setIdEditar(null);
    setModalAbierto(false);
  };

  const handleEditar = (ficha) => {
    setFormData({ ...ficha });
    setEditando(true);
    setIdEditar(ficha.id);
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
        await eliminarActividad(id);
        Swal.fire('Eliminado', 'Actividad eliminada exitosamente', 'success');
        cargarActividads();
      } catch (error) {
        console.error('Error al eliminar la actividad:', error);
        Swal.fire('Error', 'No se pudo eliminar la actividad', 'error');
      }
    }
  };

  return (
    <div className="container">
      <h1 className="titulo">Gestión de actividades</h1>

      <button onClick={abrirModalCrear} className="boton-crear">
        Crear Actividad
      </button>

      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal2">
            <h2 className="modal-titulo">
              {editando ? 'Editar ficha' : 'Crear ficha'}
            </h2>
            <form onSubmit={handleSubmit} className="formulario">

              <div className="fila">
                <div className="campo">
                  <label htmlFor="nombre">Nombre:</label>
                  <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required className="input" />
                </div>

                <div className="campo">
                  <label htmlFor="proyecto_id">Proyecto fase:</label>
                  <select id="proyecto_id" name="proyecto_id" value={formData.proyecto_id} onChange={handleChange} required className="input">
                    <option value="">Seleccione...</option>
                    {proyectofases.map((proyecto) => (
                      <option key={proyecto.id} value={proyecto.id}>
                        {proyecto.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {editando && (

                  <div className="campo">
                    <label htmlFor="estado">Estado:</label>
                    <select id="estado" name="estado" value={formData.estado} onChange={handleChange} required className="input">
                      <option value={true}>Activo</option>
                      <option value={false}>Inactivo</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="botones">
                <button className="boton-cancelar" type="button" onClick={() => setModalAbierto(false)}>Cancelar</button>
                <button className="boton-guardar" type="submit">{editando ? 'Actualizar Actividad' : 'Crear Actividad'}</button>
              </div>
            </form>
          </div>
        </div >
      )}

      <h2 className="subtitulo">Lista de Actividades</h2>
      <table className="tabla">
        <thead>
          <tr>
            <th className="th">Nombre</th>
            <th className="th">Proyecto de fase</th>
            <th className="th">Estado</th>
            <th className="th">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {actividades.map((actividad) => (
            <tr key={actividad.id} className="tr">
              <td className="td">{actividad.nombre}</td>
              <td className="td">{proyectofases.find(proy => proy.id === actividad.proyecto_id)?.nombre || "No asignado"}</td>
              <td className="td">{actividad.estado ? 'Activo' : 'Inactivo'}</td>
              <td className="td">
                <button
                  onClick={() => handleEditar(actividad)}
                  className="boton-editar"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(actividad.id)}
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

export default Actividad;