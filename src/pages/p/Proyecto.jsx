import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    crearProyecto,
    actualizarProyecto,
    eliminarProyecto,
    obtenerProyectos,
} from '../../services/ProyectoService';

const Proyecto = () => {
    // Estado para manejar los datos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        jornada_tecnica: '',
        estado: true,
    });

    // Estado para manejar el modo de edición
    const [editando, setEditando] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    // Estado para almacenar la lista de proyectos
    const [proyectos, setProyectos] = useState([]);

    // Estado para controlar la visibilidad del modal
    const [modalAbierto, setModalAbierto] = useState(false);

    // Obtener los proyectos al cargar el componente
    useEffect(() => {
        cargarProyectos();
    }, []);

    // Función para cargar los proyectos
    const cargarProyectos = async () => {
        try {
            const data = await obtenerProyectos();
            setProyectos(data);
        } catch (error) {
            console.error('Error al cargar proyectos:', error);
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

    // Manejar el envío del formulario (crear o actualizar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...formData };

        try {
            if (editando) {
                await actualizarProyecto(idEditar, data);
                Swal.fire('Actualizado', 'Proyecto actualizado exitosamente', 'success');
            } else {
                await crearProyecto(data);
                Swal.fire('Creado', 'Proyecto creado exitosamente', 'success');
            }

            resetFormulario();
            cargarProyectos();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un problema', 'error');
        }
    };

    // Función para restablecer el formulario
    const resetFormulario = () => {
        setFormData({ nombre: '', jornada_tecnica: '', estado: true });
        setEditando(false);
        setIdEditar(null);
        setModalAbierto(false);
    };

    // Función para editar un proyecto
    const handleEditar = (proyecto) => {
        setFormData({ ...proyecto });
        setEditando(true);
        setIdEditar(proyecto.id);
        setModalAbierto(true);
    };

    // Función para eliminar un proyecto con confirmación
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
                await eliminarProyecto(id);
                Swal.fire('Eliminado', 'Proyecto eliminado exitosamente', 'success');
                cargarProyectos();
            } catch (error) {
                console.error('Error al eliminar el proyecto:', error);
                Swal.fire('Error', 'No se pudo eliminar el proyecto', 'error');
            }
        }
    };

    return (
        <div className="container">
            <h1 className="titulo">Gestión de Proyectos</h1>

            {/* Botón para abrir el modal de creación */}
            <button onClick={() => setModalAbierto(true)} className="boton-crear">
                Crear Proyecto
            </button>

            {/* Modal para el formulario */}
            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2 className="modal-titulo">
                            {editando ? 'Editar Proyecto' : 'Crear Proyecto'}
                        </h2>
                        <form onSubmit={handleSubmit} className="formulario">
                            {/* Campos del formulario */}
                            <div className="campo">
                                <label htmlFor="nombre">Nombre:</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                />
                            </div>

                            <div className="campo">
                                <label htmlFor="jornada_tecncia">Jornada Técnica:</label>
                                <select
                                    id="jornada_tecncia"
                                    name="jornada_tecncia"
                                    value={formData.jornada_tecncia}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                >
                                    <option value="">Seleccione una opción</option>
                                    <option value="Mañana">Mañana</option>
                                    <option value="Tarde">Tarde</option>
                                    <option value="Noche">Noche</option>
                                    <option value="Fin de Semana">Fin de Semana</option>
                                    <option value="Virtual">Virtual</option>
                                </select>
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

                            {/* Botones de guardar y cancelar */}
                            <div className="botones">
                                <button className="boton-cancelar" type="button" onClick={resetFormulario}>
                                    Cancelar
                                </button>
                                <button className="boton-guardar" type="submit">
                                    {editando ? 'Actualizar Proyecto' : 'Crear Proyecto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tabla para mostrar los proyectos */}
            <h2 className="subtitulo">Lista de Proyectos</h2>
            <table className="tabla">
                <thead>
                    <tr>
                        <th className="th">Nombre</th>
                        <th className="th">Jornada Técnica</th>
                        <th className="th">Estado</th>
                        <th className="th">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {proyectos.map((proyecto) => (
                        <tr key={proyecto.id} className="tr">
                            <td className="td">{proyecto.nombre}</td>
                            <td className="td">{proyecto.jornada_tecncia}</td>
                            <td className="td">{proyecto.estado ? 'Activo' : 'Inactivo'}</td>
                            <td className="td">
                                <button
                                    onClick={() => handleEditar(proyecto)}
                                    className="boton-editar"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleEliminar(proyecto.id)}
                                    className="boton-eliminar"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Proyecto;
