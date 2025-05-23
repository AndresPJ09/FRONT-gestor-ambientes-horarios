import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    crearNivelFormacion,
    actualizarNivelFormacion,
    eliminarNivelFormacion,
    obtenerNivelesFormacion,
} from '../../services/NivelFormacionService';

const NivelFormacion = () => {
    // Estado para manejar los datos del formulario
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        duracion: '',
        estado: true,
        fecha_creo: new Date().toISOString(),
        fecha_modifico: null,
        fecha_elimino: null,
    });

    // Estado para manejar la lista de niveles de formación
    const [niveles, setNiveles] = useState([]);
    const [editando, setEditando] = useState(false);
    const [idEditar, setIdEditar] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);

    // Cargar los niveles de formación al montar el componente
    useEffect(() => {
        cargarNiveles();
    }, []);

    const cargarNiveles = async () => {
        try {
            const data = await obtenerNivelesFormacion();
            setNiveles(data);
        } catch (error) {
            console.error('Error al cargar niveles de formación:', error);
        }
    };

    // Manejar cambios en los inputs del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Manejar envío del formulario (crear o actualizar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...formData };

        try {
            if (editando) {
                await actualizarNivelFormacion(idEditar, data);
                Swal.fire('Actualizado', 'Nivel de formación actualizado', 'success');
            } else {
                await crearNivelFormacion(data);
                Swal.fire('Creado', 'Nivel de formación creado', 'success');
            }

            resetFormulario();
            cargarNiveles();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un problema', 'error');
        }
    };

    // Restablecer el formulario
    const resetFormulario = () => {
        setFormData({
            codigo: '',
            nombre: '',
            duracion: '',
            estado: true,
            fecha_creo: new Date().toISOString(),
            fecha_modifico: null,
            fecha_elimino: null,
        });
        setEditando(false);
        setIdEditar(null);
        setModalAbierto(false);
    };

    // Editar un nivel de formación
    const handleEditar = (nivel) => {
        setFormData({ ...nivel });
        setEditando(true);
        setIdEditar(nivel.id);
        setModalAbierto(true);
    };

    // Eliminar un nivel de formación
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
                await eliminarNivelFormacion(id);
                Swal.fire('Eliminado', 'Nivel de formación eliminado', 'success');
                cargarNiveles();
            } catch (error) {
                console.error('Error al eliminar:', error);
                Swal.fire('Error', 'No se pudo eliminar', 'error');
            }
        }
    };

    return (
        <div className="container">
            <h1 className="titulo">Gestión de Niveles de Formación</h1>

            <button onClick={() => setModalAbierto(true)} className="boton-crear">
                Crear Nivel de Formación
            </button>

            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2 className="modal-titulo">
                            {editando ? 'Editar Nivel de Formación' : 'Crear Nivel de Formación'}
                        </h2>
                        <form onSubmit={handleSubmit} className="formulario">
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
                                    <label htmlFor="duracion">Duración:</label>
                                    <input
                                        type="text"
                                        id="duracion"
                                        name="duracion"
                                        value={formData.duracion}
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

                            <div className="botones">
                                <button className="boton-cancelar" type="button" onClick={resetFormulario}>
                                    Cancelar
                                </button>
                                <button className="boton-guardar" type="submit">
                                    {editando ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <h2 className="subtitulo">Lista de Niveles de Formación</h2>
            <table className="tabla">
                <thead>
                    <tr>
                        <th className="th">Código</th>
                        <th className="th">Nombre</th>
                        <th className="th">Duración</th>
                        <th className="th">Estado</th>
                        <th className="th">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {niveles.map((nivel) => (
                        <tr key={nivel.id} className="tr">
                            <td className="td">{nivel.codigo}</td>
                            <td className="td">{nivel.nombre}</td>
                            <td className="td">{nivel.duracion}</td>
                            <td className="td">{nivel.estado ? 'Activo' : 'Inactivo'}</td>
                            <td className="td">
                                <button onClick={() => handleEditar(nivel)} className="boton-editar">
                                    Editar
                                </button>
                                <button onClick={() => handleEliminar(nivel.id)} className="boton-eliminar">
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

export default NivelFormacion;
