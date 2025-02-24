import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { obtenerTipoVinculos } from '../../services/TipoVinculoService';
import {
  crearInstructor,
  actualizarInstructor,
  eliminarInstructor,
  obtenerInstructores,
} from '../../services/InstructorService';

const Instructor = () => {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    foto: null, // Para manejar archivos (imagen)
    fotoPreview: '',
    identificacion: '',
    tipo_vinculacion_id: 0,
    especialidad: '',
    correo: '',
    fecha_inicio: '',
    fecha_finalizacion: '',
    hora_ingreso: '',
    hora_egreso: '',
    horas_asignadas: 0,
    estado: true,
  });

  // Función para abrir el modal en modo creación
  const abrirModalCrear = () => {
    setFormData({
      nombres: '',
      apellidos: '',
      foto: null,
      identificacion: '',
      tipo_vinculacion_id: 0,
      especialidad: '',
      correo: '',
      fecha_inicio: '',
      fecha_finalizacion: '',
      hora_ingreso: '',
      hora_egreso: '',
      horas_asignadas: 0,
      estado: true,
    });
    setEditando(false);
    setIdEditar(null);
    setModalAbierto(true); // Abrir el modal
  };

  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const [instructores, setInstructores] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [imagenModal, setImagenModal] = useState(null);
  const [tiposVinculacion, setTiposVinculacion] = useState([]);

  // Obtener los instructores al cargar el componente
  useEffect(() => {
    cargarInstructores();
    cargarTiposVinculacion();
  }, []);

  // Función para cargar los instructores
  const cargarInstructores = async () => {
    try {
      const data = await obtenerInstructores();
      setInstructores(data);
    } catch (error) {
      console.error('Error al cargar instructores:', error);
    }
  };

  const cargarTiposVinculacion = async () => {
    try {
      const data = await obtenerTipoVinculos();
      setTiposVinculacion(data); // Almacena los tipos en el estado
    } catch (error) {
      console.error('Error al obtener los tipos de vinculación:', error);
    }
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Obtener el archivo seleccionado

    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1]; // Quitar el prefijo "data:image/png;base64,"
        setFormData({
          ...formData,
          foto: base64String, // Guardamos la imagen en Base64
          fotoPreview: URL.createObjectURL(file) // Vista previa
        });
      };

      reader.readAsDataURL(file); // Convertir a Base64
    } else {
      alert("Solo se permiten archivos PNG y JPG");
      e.target.value = ""; // Limpiar el input de archivo
    }
  };

  // Manejar el envío del formulario (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { ...formData };
    try {
      if (editando) {
        await actualizarInstructor(idEditar, data);
        Swal.fire('Actualizado', 'Instructor actualizado exitosamente', 'success');
      } else {
        await crearInstructor(data);
        Swal.fire('Creado', 'Instructor creado exitosamente', 'success');
      }

      // Limpiar el formulario después del envío
      resetFormulario();
      cargarInstructores();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Ocurrió un problema', 'error');
    }
  };

  // Función para restablecer el formulario
  const resetFormulario = () => {
    setFormData({
      nombres: '', apellidos: '', foto: null, identificacion: '',
      tipo_vinculacion_id: 0, especialidad: '', correo: '',
      fecha_inicio: '', fecha_finalizacion: '',
      hora_ingreso: '', hora_egreso: '', horas_asignadas: 0,
      estado: true,
    });
    setEditando(false);
    setIdEditar(null);
    setModalAbierto(false);
  };

  // Función para editar un instructor
  const handleEditar = (instructor) => {
    setFormData({
      ...instructor,
      fotoPreview: instructor.foto ? `data:image/jpeg;base64,${instructor.foto}` : '',
    });
    setEditando(true);
    setIdEditar(instructor.id);
    setModalAbierto(true);
  };

  // Función para eliminar un instructor con confirmación
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
        await eliminarInstructor(id);
        Swal.fire('Eliminado', 'Instructor eliminado exitosamente', 'success');
        cargarInstructores();
      } catch (error) {
        console.error('Error al eliminar el instructor:', error);
        Swal.fire('Error', 'No se pudo eliminar el instructor', 'error');
      }
    }
  };

  const handleEliminarImagen = () => {
    setFormData({
      ...formData,
      foto: null,
      fotoPreview: null,
    });
  };

  return (
    <div className="container">
      <h1 className="titulo">Gestión de Instructores</h1>

      {/* Botón para abrir el modal de creación */}
      <button onClick={abrirModalCrear} className="boton-crear">
        Crear Instructor
      </button>

      {/* Modal para el formulario */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-titulo">
              {editando ? 'Editar Instructor' : 'Crear Instructor'}
            </h2>
            <form onSubmit={handleSubmit} className="formulario">
              {/* Campos del formulario */}
              <div className="fila">
                <div className="campo">
                  <label htmlFor="nombres">Nombres:</label>
                  <input
                    type="text"
                    id="nombres"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>

                {/* Campo: Apellidos */}
                <div className="campo">
                  <label htmlFor="apellidos">Apellidos:</label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
              </div>

              {/* Campo: Foto */}
              <div className="fila">
                <div className="campo">
                  <label htmlFor="foto">Foto:</label>
                  <input
                    type="file"
                    id="foto"
                    name="foto"
                    accept=".png, .jpg, .jpeg"
                    className="input"
                    onChange={handleFileChange}
                  />

                  {/* Vista previa de la imagen con botón de eliminar */}
                  {formData.fotoPreview && (
                    <div className="preview-container">
                      <img
                        src={formData.fotoPreview}
                        alt="Vista previa"
                        className="preview-image"
                      />
                      <button
                        type="button"
                        className="deleteE-btn"
                        onClick={handleEliminarImagen}
                      >
                        ✖
                      </button>
                    </div>
                  )}
                </div>

                {/* Campo: Identificación */}
                <div className="campo">
                  <label htmlFor="identificacion">Identificación:</label>
                  <input
                    type="text"
                    id="identificacion"
                    name="identificacion"
                    value={formData.identificacion}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
              </div>

              {/* Campo: Tipo de Contrato/Vinculo */}
              <div className="fila">
                <div className="campo">
                  <label htmlFor="tipo_vinculacion_id">Tipo de tipo_vinculacion:</label>
                  <select
                    id="tipo_vinculacion_id"
                    name="tipo_vinculacion_id"
                    value={formData.tipo_vinculacion_id}
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    <option value="">Seleccione...</option>
                    {tiposVinculacion.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Campo: Especialidad */}
                <div className="campo">
                  <label htmlFor="especialidad">Especialidad:</label>
                  <input
                    type="text"
                    id="especialidad"
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
              </div>

              {/* Campo: Correo */}
              <div className="fila">
                <div className="campo">
                  <label htmlFor="correo">Correo:</label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>

                {/* Campo: Fecha de Inicio */}
                <div className="campo">
                  <label htmlFor="fecha_inicio">Fecha de Inicio:</label>
                  <input
                    type="date"
                    id="fecha_inicio"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
              </div>

              {/* Campo: Fecha de Finalización */}
              <div className="fila">
                <div className="campo">
                  <label htmlFor="fecha_finalizacion">Fecha de Finalización:</label>
                  <input
                    type="date"
                    id="fecha_finalizacion"
                    name="fecha_finalizacion"
                    value={formData.fecha_finalizacion}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>

                {/* Campo: Hora de Ingreso */}
                <div className="campo">
                  <label htmlFor="hora_ingreso">Hora de Ingreso:</label>
                  <input
                    type="time"
                    id="hora_ingreso"
                    name="hora_ingreso"
                    value={formData.hora_ingreso}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
              </div>

              {/* Campo: Hora de Egreso */}
              <div className="fila">
                <div className="campo">
                  <label htmlFor="hora_egreso">Hora de Egreso:</label>
                  <input
                    type="time"
                    id="hora_egreso"
                    name="hora_egreso"
                    value={formData.hora_egreso}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>

                {/* Campo: Horas Asignadas */}
                <div className="campo">
                  <label htmlFor="horas_asignadas">Horas Asignadas:</label>
                  <input
                    type="number"
                    id="horas_asignadas"
                    name="horas_asignadas"
                    value={formData.horas_asignadas}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
              </div>

              {editando && (
                <div className="campo">
                  <label htmlFor="estado">Estado:</label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    <option value={true}>Activo</option>
                    <option value={false}>Inactivo</option>
                  </select>
                </div>
              )}


              {/* Botón de envío */}
              <div className="botones">
                <button className="boton-cancelar" type="button" onClick={() => setModalAbierto(false)}>
                  Cancelar
                </button>
                <button className="boton-guardar" type="submit">
                  {editando ? 'Actualizar Instructor' : 'Crear Instructor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Tabla para mostrar los instructores */}
      <h2 className="subtitulo">Lista de Instructores</h2>
      <table className="tabla">
        <thead>
          <tr>
            <th className="th">Nombres</th>
            <th className="th">Apellidos</th>
            <th className="th">Identificación</th>
            <th className="th">Correo</th>
            <th className="th">Foto</th>
            <th className="th">Tipo de vinculación</th>
            <th className="th">Especialidad</th>
            <th className="th">Fecha de inicio</th>
            <th className="th">Fecha de finalización</th>
            <th className="th">Hora de ingreso</th>
            <th className="th">Hora de egreso</th>
            <th className="th">Horas aignadas</th>
            <th className="th">Estado</th>
            <th className="th">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {instructores.map((instructor) => (
            <tr key={instructor.id} className="tr">
              <td className="td">{instructor.nombres}</td>
              <td className="td">{instructor.apellidos}</td>
              <td className="td">{instructor.identificacion}</td>
              <td className="td">{instructor.correo}</td>
              <td>
                {instructor.foto && (
                  <>
                    <img
                      src={`data:image/jpeg;base64,${instructor.foto}`}
                      alt="Foto"
                      className="tabla-img"
                      style={{ width: "50px", height: "50px", objectFit: "cover", cursor: "pointer" }}
                      onClick={() => setImagenModal(`data:image/jpeg;base64,${instructor.foto}`)}
                    />
                  </>
                )}
              </td>
              <td>
                {tiposVinculacion.find(tipo => tipo.id === instructor.tipo_vinculacion_id)?.nombre || "No asignado"}
              </td>
              <td className="td">{instructor.especialidad}</td>
              <td className="td">{instructor.fecha_inicio}</td>
              <td className="td">{instructor.fecha_finalizacion}</td>
              <td className="td">{instructor.hora_ingreso}</td>
              <td className="td">{instructor.hora_egreso}</td>
              <td className="td">{instructor.horas_asignadas}</td>
              <td className="td">{instructor.estado ? 'Activo' : 'Inactivo'}</td>
              <td className="td">
                <button
                  onClick={() => handleEditar(instructor)}
                  className="boton-editar"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(instructor.id)}
                  className="boton-eliminar"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {/* MODAL PARA VER IMAGEN AMPLIADA */}
          {imagenModal && (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", position: "relative" }}>
                <div
                  style={{
                    position: "fixed",
                    top: 0, left: 0, width: "100%", height: "100%",
                    backgroundColor: "rgba(0,0,0,0.8)",
                    display: "flex", justifyContent: "center", alignItems: "center"
                  }}
                  onClick={() => setImagenModal(null)} // Cerrar modal al hacer clic fuera
                >
                  <img
                    src={imagenModal}
                    alt="Imagen ampliada"
                    style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "10px" }}
                  />
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};


export default Instructor;