import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { obtenerActividades } from '../../services/ActividadService';
import { obtenerFases } from '../../services/FaseService';
import {
  crearActividadfase,
  actualizarActividadfase,
  eliminarActividadfase,
  obtenerActividadfases,
} from '../../services/ActividadFaseService';

const ActividadFase = () => {
  const [formData, setFormData] = useState({
    actividad_id: 0,
    fase_id: 0,
    fecha_inicio_actividad: '',
    fecha_fin_actividad: '',
    numero_semanas: '',
  });

  const abrirModalCrear = () => {
    setEditando(false);
    setFormData({
      actividad_id: 0,
      fase_id: 0,
      fecha_inicio_actividad: '',
      fecha_fin_actividad: '',
      numero_semanas: '',
    });
    setEditando(false);
    setIdEditar(null);
    setModalAbierto(true); // Abrir el modal
  };

  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const [actividadfases, setActividadFases] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [fases, setFases] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    cargarActividadFases();
    cargarFases();
    cargarActividades();
  }, []);

  const cargarActividadFases = async () => {
    try {
      const data = await obtenerActividadfases();
      console.log("Actividad fases cargados:", data);
      setActividadFases(data);
    } catch (error) {
      console.error('Error al cargar actividad fase:', error);
    }
  };


  const cargarActividades = async () => {
    try {
      const data = await obtenerActividades();
      console.log("Actividad cargados:", data);
      setActividades(data);
    } catch (error) {
      console.error('Error al cargar actividades:', error);
    }
  };

  const cargarFases = async () => {
    try {
      const data = await obtenerFases();
      console.log("Fases cargados:", data);
      setFases(data);
    } catch (error) {
      console.error('Error al cargar fases:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      let newData = { ...prevData, [name]: value };

      // Calcular número de semanas si se cambia la fecha
      if (name === "fecha_inicio_actividad" || name === "fecha_fin_actividad") {
          const { fecha_inicio_actividad, fecha_fin_actividad } = newData;
          if (fecha_inicio_actividad && fecha_fin_actividad) {
              const startDate = new Date(fecha_inicio_actividad);
              const endDate = new Date(fecha_fin_actividad);
              const diffWeeks = Math.floor((endDate - startDate) / (7 * 24 * 60 * 60 * 1000));
              newData.numero_semanas = diffWeeks > 0 ? diffWeeks : 0;
          }
      }

      return newData;
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData };
    try {
      if (editando) {
        await actualizarActividadfase(idEditar, data);
        Swal.fire('Actualizado', 'Actividad fase actualizada exitosamente', 'success');
      } else {
        await crearActividadfase(data);
        Swal.fire('Creado', 'Actividad fase creada exitosamente', 'success');
      }
      resetFormulario();
      cargarActividadFases();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Ocurrió un problema', 'error');
    }
  };

  const resetFormulario = () => {
    setFormData({
      actividad_id: 0,
      fase_id: 0,
      fecha_inicio_actividad: '',
      fecha_fin_actividad: '',
      numero_semanas: '',
    });
    setEditando(false);
    setIdEditar(null);
    setModalAbierto(false);
  };

  const handleEditar = (actividadfase) => {
    setFormData({ ...actividadfase });
    setEditando(true);
    setIdEditar(actividadfase.id);
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
        await eliminarActividadfase(id);
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
      <h1 className="titulo">Gestión de Actividad fase</h1>

      <button onClick={abrirModalCrear} className="boton-crear">
        Crear Actividad fase
      </button>

      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal2">
            <h2 className="modal-titulo">
              {editando ? 'Editar actividad fase' : 'Crear actividad fase'}
            </h2>
            <form onSubmit={handleSubmit} className="formulario">

              <div className="fila">
                <div className="campo">
                  <label htmlFor="actividad_id">Actividad:</label>
                  <select id="actividad_id" name="actividad_id" value={formData.actividad_id} onChange={handleChange} required className="input">
                    <option value="">Seleccione...</option>
                    {actividades.map((actividad) => (
                      <option key={actividad.id} value={actividad.id}>
                        {actividad.nombre}
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

                {/* Campo: Fecha de Inicio */}
                <div className="fila">
                <div className="campo">
                  <label htmlFor="fecha_inicio_actividad">Fecha de Inicio de actividad:</label>
                  <input
                    type="date"
                    id="fecha_inicio_actividad"
                    name="fecha_inicio_actividad"
                    value={formData.fecha_inicio_actividad}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>

              {/* Campo: Fecha de Finalización */}
                <div className="campo">
                  <label htmlFor="fecha_fin_actividad">Fecha de Finalización de actividad:</label>
                  <input
                    type="date"
                    id="fecha_fin_actividad"
                    name="fecha_fin_actividad"
                    value={formData.fecha_fin_actividad}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
                </div>
             

                <div className="fila">
                  <div className="campo">
                    <label htmlFor="numero_semanas">Número de semanas:</label>
                    <input
                      type="number"
                      id="numero_semanas"
                      name="numero_semanas"
                      value={formData.numero_semanas}
                      required
                      className="input"
                      readOnly
                    />
                  </div>
                </div>

                <div className="botones">
                  <button className="boton-cancelar" type="button" onClick={() => setModalAbierto(false)}>Cancelar</button>
                  <button className="boton-guardar" type="submit">{editando ? 'Actualizar actividad fase' : 'Crear actividad fase'}</button>
                </div>
            </form>
          </div>
        </div >
      )}

      <h2 className="subtitulo">Lista de actividad fase</h2>
      <table className="tabla">
        <thead>
          <tr>
            <th className="th">Actividad</th>
            <th className="th">Fase</th>
            <th className="th">Fecha de inicio de actividad</th>
            <th className="th">Fecha de finalizacion de actividad</th>
            <th className="th">numero de semanas</th>
            <th className="th">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {actividadfases.map((actvidadfase) => (
            <tr key={actvidadfase.id} className="tr">
              <td className="td">{actividades.find(acti => acti.id === actvidadfase.actividad_id)?.nombre || "No asignado"}</td>
              <td className="td">{fases.find(fase => fase.id === actvidadfase.fase_id)?.descripcion || "No asignado"}</td>
              <td className="td">{actvidadfase.fecha_inicio_actividad}</td>
              <td className="td">{actvidadfase.fecha_fin_actividad}</td>
              <td className="td">{actvidadfase.numero_semanas}</td>
              <td className="td">
                <button
                  onClick={() => handleEditar(actvidadfase)}
                  className="boton-editar"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(actvidadfase.id)}
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

export default ActividadFase;