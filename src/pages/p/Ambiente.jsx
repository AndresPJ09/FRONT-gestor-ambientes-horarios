import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    crearAmbiente,
    actualizarAmbiente,
    eliminarAmbiente,
    obtenerAmbientes,
} from '../../services/AmbienteService';

const Ambiente = () => {
    // Estado para manejar los datos del formulario
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        capacidad: 0,
        estado: true,
        fecha_creo: '',
        fecha_modifico: null,
        fecha_elimino: null,
    });

    // Función para abrir el modal en modo creación
    const abrirModalCrear = () => {
        setFormData({
            codigo: '',
            nombre: '',
            capacidad: 0,
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

    // Estado para almacenar la lista de ambientes
    const [ambientes, setAmbientes] = useState([]);

    // Estado para controlar la visibilidad del modal
    const [modalAbierto, setModalAbierto] = useState(false);

    // Obtener los ambientes al cargar el componente
    useEffect(() => {
        cargarAmbientes();
    }, []);

    // Función para cargar los ambientes
    const cargarAmbientes = async () => {
        try {
            const data = await obtenerAmbientes();
            setAmbientes(data);
        } catch (error) {
            console.error('Error al cargar ambientes:', error);
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
                await actualizarAmbiente(idEditar, data);
                Swal.fire('Actualizado', 'Ambiente actualizado exitosamente', 'success');
            } else {
                await crearAmbiente(data);
                Swal.fire('Creado', 'Ambiente creado exitosamente', 'success');
            }

            // Limpiar el formulario después del envío
            resetFormulario();
            cargarAmbientes();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un problema', 'error');
        }
    };

    // Función para restablecer el formulario
    const resetFormulario = () => {
        setFormData({
            codigo: '', nombre: '', capacidad: 0, estado: true,
            fecha_creo: '', fecha_modifico: null, fecha_elimino: null,
        });
        setEditando(false);
        setIdEditar(null);
        setModalAbierto(false);
    };

    // Función para editar un ambiente
    const handleEditar = (ambiente) => {
        setFormData({
            ...ambiente,
        });
        setEditando(true);
        setIdEditar(ambiente.id);
        setModalAbierto(true);
    };

    // Función para eliminar un ambiente con confirmación
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
                await eliminarAmbiente(id);
                Swal.fire('Eliminado', 'Ambiente eliminado exitosamente', 'success');
                cargarAmbientes();
            } catch (error) {
                console.error('Error al eliminar el ambiente:', error);
                Swal.fire('Error', 'No se pudo eliminar el ambiente', 'error');
            }
        }
    };

    return (
        <div className="container">
            <h1 className="titulo">Gestión de Ambientes</h1>

            {/* Botón para abrir el modal de creación */}
            <button onClick={abrirModalCrear} className="boton-crear">
                Crear Ambiente
            </button>

            {/* Modal para el formulario */}
            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2 className="modal-titulo">
                            {editando ? 'Editar Ambiente' : 'Crear Ambiente'}
                        </h2>
                        <form onSubmit={handleSubmit} className="formulario">
                            {/* Campos del formulario */}
                            <div className="fila">
                                <div className="campo">
                                    <label htmlFor="codigo">Código:</label>
                                    <input
                                        type="text"
                                        id="codigo"
                                        name="codigo"
                                        value={formData.codigo}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    />
                                </div>

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
                                    <label htmlFor="capacidad">Capacidad:</label>
                                    <input
                                        type="number"
                                        id="capacidad"
                                        name="capacidad"
                                        value={formData.capacidad}
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
                                    {editando ? 'Actualizar Ambiente' : 'Crear Ambiente'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tabla para mostrar los ambientes */}
            <h2 className="subtitulo">Lista de Ambientes</h2>
            <table className="tabla">
                <thead>
                    <tr>
                        <th className="th">Código</th>
                        <th className="th">Nombre</th>
                        <th className="th">Capacidad</th>
                        <th className="th">Estado</th>
                        <th className="th">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ambientes.map((ambiente) => (
                        <tr key={ambiente.id} className="tr">
                            <td className="td">{ambiente.codigo}</td>
                            <td className="td">{ambiente.nombre}</td>
                            <td className="td">{ambiente.capacidad}</td>
                            <td className="td">{ambiente.estado ? 'Activo' : 'Inactivo'}</td>
                            <td className="td">
                                <button
                                    onClick={() => handleEditar(ambiente)}
                                    className="boton-editar"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleEliminar(ambiente.id)}
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

export default Ambiente;
