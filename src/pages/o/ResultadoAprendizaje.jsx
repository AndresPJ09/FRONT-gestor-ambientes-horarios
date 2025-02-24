import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { obtenerCompetencias } from '../../services/CompetenciaService';
import {
    crearResulAprendi,
    actualizarResulAprendis,
    eliminarResulAprendi,
    obtenerResulAprendis,
} from '../../services/ResultadoAprendizajeService';

const ResultadoAprendizaje = () => {
    const [formData, setFormData] = useState({
        descripcion: '',
        competencia_id: 0,
        est_ideal_evaluacion: '',
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
    const [resultados, setResultados] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [competencias, setCompetencias] = useState([]);

    useEffect(() => {
        cargarResultados();
        cargarCompetencias();
    }, []);

    const cargarResultados = async () => {
        try {
            const data = await obtenerResulAprendis();
            setResultados(data);
        } catch (error) {
            console.error('Error al cargar resultados de aprendizaje:', error);
        }
    };

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
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editando) {
                await actualizarResulAprendis(idEditar, formData);
                Swal.fire('Actualizado', 'Resultado de aprendizaje actualizado exitosamente', 'success');
            } else {
                await crearResulAprendi(formData);
                Swal.fire('Creado', 'Resultado de aprendizaje creado exitosamente', 'success');
            }
            resetFormulario();
            cargarResultados();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un problema', 'error');
        }
    };

    const resetFormulario = () => {
        setFormData({
            descripcion: '',
            competencia_id: 0,
            est_ideal_evaluacion: '',
            estado: true,
        });
        setEditando(false);
        setIdEditar(null);
        setModalAbierto(false);
    };

    const handleEditar = (resultado) => {
        setFormData({ ...resultado });
        setEditando(true);
        setIdEditar(resultado.id);
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
                await eliminarResulAprendi(id);
                Swal.fire('Eliminado', 'Resultado de aprendizaje eliminado exitosamente', 'success');
                cargarResultados();
            } catch (error) {
                console.error('Error al eliminar el resultado:', error);
                Swal.fire('Error', 'No se pudo eliminar el resultado', 'error');
            }
        }
    };

    return (
        <div className="container">
            <h1 className="titulo">Gestión de Resultados de Aprendizaje</h1>

            <button onClick={abrirModalCrear} className="boton-crear">
                Crear Resultado
            </button>

            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2 className="modal-titulo">{editando ? 'Editar Resultado' : 'Crear Resultado'}</h2>
                        <form onSubmit={handleSubmit} className="formulario">
                            <div className="fila">
                                <div className="campo">
                                    <label htmlFor="descripcion">Descripción:</label>
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
                            </div>

                            <div className="fila">
                                <div className="campo">
                                    <label htmlFor="competencia_id">Competencia:</label>
                                    <select
                                        id="competencia_id"
                                        name="competencia_id"
                                        value={formData.competencia_id}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    >
                                        <option value="">Seleccione...</option>
                                        {competencias.map((comp) => (
                                            <option key={comp.id} value={comp.id}>
                                                {comp.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="campo">
                                    <label htmlFor="est_ideal_evaluacion">Evaluación ideal:</label>
                                    <select
                                        id="est_ideal_evaluacion"
                                        name="est_ideal_evaluacion"
                                        value={formData.est_ideal_evaluacion}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    >
                                        <option value="">Seleccione una opción</option>
                                        <option value="Evaluado">Evaluado</option>
                                        <option value="En ejecución">En ejecución</option>
                                    </select>
                                </div>
                            </div>

                            {editando && (
                                <div className="fila">
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
                                </div>
                            )}

                            <div className="botones">
                                <button className="boton-cancelar" type="button" onClick={() => setModalAbierto(false)}>
                                    Cancelar
                                </button>
                                <button className="boton-guardar" type="submit">
                                    {editando ? 'Actualizar Resultado' : 'Crear Resultado'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <h2 className="subtitulo">Lista de Resultados de Aprendizaje</h2>
            <table className="tabla">
                <thead>
                    <tr>
                        <th className="th">Descripción</th>
                        <th className="th">Competencia</th>
                        <th className="th">Evaluación Ideal</th>
                        <th className="th">Estado</th>
                        <th className="th">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {resultados.map((resultado) => (
                        <tr key={resultado.id} className="tr">
                            <td className="td">{resultado.descripcion}</td>
                            <td className="td">
                                {competencias.find((c) => c.id === resultado.competencia_id)?.nombre || 'No asignado'}
                            </td>
                            <td className="td">{resultado.est_ideal_evaluacion}</td>
                            <td className="td">{resultado.estado ? 'Activo' : 'Inactivo'}</td>
                            <td className="td">
                                <button onClick={() => handleEditar(resultado)} className="boton-editar">
                                    Editar
                                </button>
                                <button onClick={() => handleEliminar(resultado.id)} className="boton-eliminar">
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

export default ResultadoAprendizaje;
