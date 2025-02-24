import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    crearCompetencia,
    actualizarCompetencias,
    eliminarCompetencia,
    obtenerCompetencias,
} from '../../services/CompetenciaService';

const Competencia = () => {
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        descripcion: '',
        estado: true,
    });

    // Función para abrir el modal en modo creación
    const abrirModalCrear = () => {
        setFormData({
            codigo: '',
            nombre: '',
            descripcion: '',
            estado: true,
        });
        setEditando(false);
        setIdEditar(null);
        setModalAbierto(true); // Abrir el modal
    };

    const [editando, setEditando] = useState(false);
    const [idEditar, setIdEditar] = useState(null);
    const [competencias, setCompetencias] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);

    useEffect(() => {
        cargarCompetencias();
    }, []);

    const cargarCompetencias = async () => {
        try {
            const data = await obtenerCompetencias();
            setCompetencias(data);
        } catch (error) {
            console.error('Error al cargar competencias:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editando) {
                await actualizarCompetencias(idEditar, formData);
                Swal.fire('Actualizado', 'Competencia actualizada con éxito', 'success');
            } else {
                await crearCompetencia(formData);
                Swal.fire('Creado', 'Competencia creada con éxito', 'success');
            }
            resetFormulario();
            cargarCompetencias();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un problema', 'error');
        }
    };

    const resetFormulario = () => {
        setFormData({ codigo: '', nombre: '', descripcion: '', estado: true });
        setEditando(false);
        setIdEditar(null);
        setModalAbierto(false);
    };

    const handleEditar = (competencia) => {
        setFormData({
            ...competencia
        });
        setEditando(true);
        setIdEditar(competencia.id);
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
                await eliminarCompetencia(id);
                Swal.fire('Eliminado', 'Competencia eliminada con éxito', 'success');
                cargarCompetencias();
            } catch (error) {
                console.error('Error al eliminar:', error);
                Swal.fire('Error', 'No se pudo eliminar la competencia', 'error');
            }
        }
    };

    return (
        <div className="container">
            <h1 className="titulo">Gestión de Competencias</h1>

            {/* Botón para abrir el modal de creación */}
            <button onClick={abrirModalCrear} className="boton-crear">
                Crear Competencia
            </button>

            {/* Modal para el formulario */}
            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2 className="modal-titulo">
                            {editando ? 'Editar Competencia' : 'Crear Competencia'}
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
                                    <label htmlFor="descripcion">Descripcion:</label>
                                    <textarea
                                        type="text"
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
                            </div>

                            {/* Botones de guardar y cancelar */}
                            <div className="botones">
                                <button className="boton-cancelar" type="button" onClick={() => setModalAbierto(false)}>
                                    Cancelar
                                </button>
                                <button className="boton-guardar" type="submit">
                                    {editando ? 'Actualizar programa' : 'Crear programa'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <h2 className="subtitulo">Lista de Competencias</h2>
            <table className="tabla">
                <thead>
                    <tr>
                        <th className="th">Código</th>
                        <th className="th">Nombre</th>
                        <th className="th">Descripcion</th>
                        <th className="th">Estado</th>
                        <th className="th">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {competencias.map((competencia) => (
                        <tr key={competencia.id} className="tr">
                            <td className="td">{competencia.codigo}</td>
                            <td className="td">{competencia.nombre}</td>
                            <td className="td">{competencia.descripcion}</td>
                            <td className="td">{competencia.estado ? 'Activo' : 'Inactivo'}</td>
                            <td className="td">
                            <button
                                onClick={() => handleEditar(competencia)}
                                className="boton-editar"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleEliminar(competencia.id)}
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

export default Competencia;
