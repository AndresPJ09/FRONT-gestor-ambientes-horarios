import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    crearPeriodo,
    actualizarPeriodo,
    eliminarPeriodo,
    obtenerPeriodos,
} from '../../services/PeriodoService';

const Periodo = () => {
    // Estado para manejar los datos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        fecha_inicio: '',
        fecha_fin: '',
        ano: new Date().getFullYear(),
        estado: true,
        fecha_creo: '',
        fecha_modifico: null,
        fecha_elimino: null,
    });

    // Función para abrir el modal en modo creación
    const abrirModalCrear = () => {
        setFormData({
            nombre: '',
            fecha_inicio: '',
            fecha_fin: '',
            ano: new Date().getFullYear(),
            estado: true,
            fecha_creo: '',
            fecha_modifico: null,
            fecha_elimino: null,
        });
        setEditando(false);
        setIdEditar(null);
        setModalAbierto(true); // Abrir el modal
    };

    // Estado para manejar el modo de edición
    const [editando, setEditando] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    // Estado para almacenar la lista de periodos
    const [periodos, setPeriodos] = useState([]);

    // Estado para controlar la visibilidad del modal
    const [modalAbierto, setModalAbierto] = useState(false);

    // Obtener los periodos al cargar el componente
    useEffect(() => {
        cargarPeriodos();
    }, []);

    // Función para cargar los periodos
    const cargarPeriodos = async () => {
        try {
            const data = await obtenerPeriodos();
            setPeriodos(data);
        } catch (error) {
            console.error('Error al cargar periodos:', error);
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
                await actualizarPeriodo(idEditar, data);
                Swal.fire('Actualizado', 'Periodo actualizado exitosamente', 'success');
            } else {
                await crearPeriodo(data);
                Swal.fire('Creado', 'Periodo creado exitosamente', 'success');
            }

            // Limpiar el formulario después del envío
            resetFormulario();
            cargarPeriodos();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un problema', 'error');
        }
    };

    // Función para restablecer el formulario
    const resetFormulario = () => {
        setFormData({
            nombre: '', fecha_inicio: '', fecha_fin: '', ano: new Date().getFullYear(),
            estado: true, fecha_creo: '', fecha_modifico: null, fecha_elimino: null,
        });
        setEditando(false);
        setIdEditar(null);
        setModalAbierto(false);
    };

    // Función para editar un periodo
    const handleEditar = (periodo) => {
        setFormData({
            ...periodo,
        });
        setEditando(true);
        setIdEditar(periodo.id);
        setModalAbierto(true);
    };

    // Función para eliminar un periodo con confirmación
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
                await eliminarPeriodo(id);
                Swal.fire('Eliminado', 'Periodo eliminado exitosamente', 'success');
                cargarPeriodos();
            } catch (error) {
                console.error('Error al eliminar el periodo:', error);
                Swal.fire('Error', 'No se pudo eliminar el periodo', 'error');
            }
        }
    };

    return (
        <div className="container">
            <h1 className="titulo">Gestión de Periodos</h1>

            {/* Botón para abrir el modal de creación */}
            <button onClick={abrirModalCrear} className="boton-crear">
                Crear Periodo
            </button>

            {/* Modal para el formulario */}
            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2 className="modal-titulo">
                            {editando ? 'Editar Periodo' : 'Crear Periodo'}
                        </h2>
                        <form onSubmit={handleSubmit} className="formulario">
                            {/* Campos del formulario */}
                            <div className="fila">
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
                            </div>

                            <div className="fila">
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

                                <div className="campo">
                                    <label htmlFor="fecha_fin">Fecha de Fin:</label>
                                    <input
                                        type="date"
                                        id="fecha_fin"
                                        name="fecha_fin"
                                        value={formData.fecha_fin}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div className="fila">
                                <div className="campo">
                                    <label htmlFor="ano">Año:</label>
                                    <input
                                        type="number"
                                        id="ano"
                                        name="ano"
                                        value={formData.ano}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    />
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
                            </div>

                            {/* Botones de guardar y cancelar */}
                            <div className="botones">
                                <button className="boton-cancelar" type="button" onClick={() => setModalAbierto(false)}>
                                    Cancelar
                                </button>
                                <button className="boton-guardar" type="submit">
                                    {editando ? 'Actualizar Periodo' : 'Crear Periodo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tabla para mostrar los periodos */}
            <h2 className="subtitulo">Lista de Periodos</h2>
            <table className="tabla">
                <thead>
                    <tr>
                        <th className="th">Nombre</th>
                        <th className="th">Fecha de Inicio</th>
                        <th className="th">Fecha de Fin</th>
                        <th className="th">Año</th>
                        <th className="th">Estado</th>
                        <th className="th">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {periodos.map((periodo) => (
                        <tr key={periodo.id} className="tr">
                            <td className="td">{periodo.nombre}</td>
                            <td className="td">{periodo.fecha_inicio}</td>
                            <td className="td">{periodo.fecha_fin}</td>
                            <td className="td">{periodo.ano}</td>
                            <td className="td">{periodo.estado ? 'Activo' : 'Inactivo'}</td>
                            <td className="td">
                                <button
                                    onClick={() => handleEditar(periodo)}
                                    className="boton-editar"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleEliminar(periodo.id)}
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

export default Periodo;
