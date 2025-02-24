import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    crearTipoVinculo,
    actualizarTipoVinculo,
    eliminarTipoVinculo,
    obtenerTipoVinculos,
} from '../../services/TipoVinculoService';

const TipoVinculo = () => {
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        descripcion: '',
        estado: true,
    });

    const [tiposVinculo, setTiposVinculo] = useState([]);
    const [editando, setEditando] = useState(false);
    const [idEditar, setIdEditar] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);

    useEffect(() => {
        cargarTiposVinculo();
    }, []);

    const cargarTiposVinculo = async () => {
        try {
            const data = await obtenerTipoVinculos();
            setTiposVinculo(data);
        } catch (error) {
            console.error('Error al cargar tipos de vínculo:', error);
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
                await actualizarTipoVinculo(idEditar, formData);
                Swal.fire('Actualizado', 'Tipo de vínculo actualizado', 'success');
            } else {
                await crearTipoVinculo(formData);
                Swal.fire('Creado', 'Tipo de vínculo creado', 'success');
            }
            resetFormulario();
            cargarTiposVinculo();
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

    const handleEditar = (tipo) => {
        setFormData({ ...tipo });
        setEditando(true);
        setIdEditar(tipo.id);
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
                await eliminarTipoVinculo(id);
                Swal.fire('Eliminado', 'Tipo de vínculo eliminado', 'success');
                cargarTiposVinculo();
            } catch (error) {
                console.error('Error al eliminar:', error);
                Swal.fire('Error', 'No se pudo eliminar', 'error');
            }
        }
    };

    return (
        <div className="container">
            <h1 className="titulo">Gestión de Tipos de Vínculo</h1>
            <button onClick={() => setModalAbierto(true)} className="boton-crear">
                Crear Tipo de Vínculo
            </button>

            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2 className="modal-titulo">
                            {editando ? 'Editar Tipo de Vínculo' : 'Crear Tipo de Vínculo'}
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

            <h2 className="subtitulo">Lista de Tipos de Vínculo</h2>
            <table className="tabla">
                <thead>
                    <tr>
                        <th className="th">Código</th>
                        <th className="th">Nombre</th>
                        <th className="th">Descripción</th>
                        <th className="th">Estado</th>
                        <th className="th">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {tiposVinculo.map((tipo) => (
                        <tr key={tipo.id} className="tr">
                            <td className="td">{tipo.codigo}</td>
                            <td className="td">{tipo.nombre}</td>
                            <td className="td">{tipo.descripcion}</td>
                            <td className="td">{tipo.estado ? 'Activo' : 'Inactivo'}</td>
                            <td className="td">
                                <button onClick={() => handleEditar(tipo)} className="boton-editar">
                                    Editar
                                </button>
                                <button onClick={() => handleEliminar(tipo.id)} className="boton-eliminar">
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

export default TipoVinculo;
