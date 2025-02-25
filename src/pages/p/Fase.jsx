import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    crearFase,
    actualizarFase,
    eliminarFase,
    obtenerFases,
} from '../../services/FaseService';

const Fase = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        estado: true,
    });

    const [editando, setEditando] = useState(false);
    const [idEditar, setIdEditar] = useState(null);
    const [fases, setFases] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);

    useEffect(() => {
        cargarFases();
    }, []);

    const cargarFases = async () => {
        try {
            const data = await obtenerFases();
            setFases(data);
        } catch (error) {
            console.error('Error al cargar fases:', error);
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

        try {
            if (editando) {
                await actualizarFase(idEditar, formData);
                Swal.fire('Actualizado', 'Fase actualizada exitosamente', 'success');
            } else {
                await crearFase(formData);
                Swal.fire('Creado', 'Fase creada exitosamente', 'success');
            }
            resetFormulario();
            cargarFases();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un problema', 'error');
        }
    };

    const resetFormulario = () => {
        setFormData({ nombre: '', descripcion: '', estado: true });
        setEditando(false);
        setIdEditar(null);
        setModalAbierto(false);
    };

    const handleEditar = (fase) => {
        setFormData({ ...fase });
        setEditando(true);
        setIdEditar(fase.id);
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
                await eliminarFase(id);
                Swal.fire('Eliminado', 'Fase eliminada exitosamente', 'success');
                cargarFases();
            } catch (error) {
                console.error('Error al eliminar la fase:', error);
                Swal.fire('Error', 'No se pudo eliminar la fase', 'error');
            }
        }
    };

    return (
        <div className="container">
            <h1 className="titulo">Gestión de Fases</h1>
            <button onClick={() => setModalAbierto(true)} className="boton-crear">Crear Fase</button>
            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2 className="modal-titulo">{editando ? 'Editar Fase' : 'Crear Fase'}</h2>
                        <form onSubmit={handleSubmit} className="formulario">
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
                                <label htmlFor="descripcion">Descripción:</label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={formData.descripcion}
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
                            <div className="botones">
                                <button className="boton-cancelar" type="button" onClick={resetFormulario}>Cancelar</button>
                                <button className="boton-guardar" type="submit">
                                    {editando ? 'Actualizar Fase' : 'Crear Fase'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <h2 className="subtitulo">Lista de Fases</h2>
            <table className="tabla">
                <thead>
                    <tr>
                        <th className="th">Nombre</th>
                        <th className="th">Descripción</th>
                        <th className="th">Estado</th>
                        <th className="th">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {fases.map((fase) => (
                        <tr key={fase.id} className="tr">
                            <td className="td">{fase.nombre}</td>
                            <td className="td">{fase.descripcion}</td>
                            <td className="td">{fase.estado ? 'Activo' : 'Inactivo'}</td>
                            <td className="td">
                                <button onClick={() => handleEditar(fase)} className="boton-editar">Editar</button>
                                <button onClick={() => handleEliminar(fase.id)} className="boton-eliminar">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Fase;
