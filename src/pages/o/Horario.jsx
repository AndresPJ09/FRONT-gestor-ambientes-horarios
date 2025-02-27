import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { obtenerPeriodos } from '../../services/PeriodoService';
import { obtenerUsuarios } from '../../services/S/UsuarioService';
import { obtenerFichas } from '../../services/FichaService';
import { obtenerAmbientes } from '../../services/AmbienteService';
import { obtenerInstructores } from '../../services/InstructorService';
import {
    crearHorario,
    actualizarHorario,
    eliminarHorario,
    obtenerHorarios,
} from '../../services/HorarioService';

const Horario = () => {
    const [formData, setFormData] = useState({
        usuario_id: 0,
        ficha_id: 0,
        ambiente_id: 0,
        periodo_id: 0,
        instructor_id: 0,
        jornada_programada: '',
        fecha_inicio_hora_ingreso: '',
        fecha_fin_hora_egreso: '',
        horas: 0,
        validacion: '',
        observaciones: '',
        estado: true,
    });

    const [editando, setEditando] = useState(false);
    const [idEditar, setIdEditar] = useState(null);
    const [horarios, setHorarios] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [fichas, setFichas] = useState([]);
    const [instructores, setInstructores] = useState([]);
    const [ambientes, setAmbientes] = useState([]);
    const [mostrarHorario, setMostrarHorario] = useState(false);
    const [diasSemana, setDiasSemana] = useState([]);
    const diasDisponibles = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const agregarDiaSemana = () => {
        setDiasSemana([...diasSemana, { dia: '', jornada: '' }]);
    };

    const handleDiaChange = (index, field, value) => {
        const nuevosDias = [...diasSemana];
        nuevosDias[index][field] = value;
        setDiasSemana(nuevosDias);
    };

    useEffect(() => {
        cargarPeriodos();
        cargarHorarios();
        cargarFichas();
        cargarUsuarios();
        cargarAmbientes();
        cargarInstructores();
    }, [formData.fecha_inicio_hora_ingreso, formData.fecha_fin_hora_egreso]);

    const cargarHorarios = async () => {
        try {
            const data = await obtenerHorarios();
            setHorarios(data);
        } catch (error) {
            console.error('Error al cargar horarios:', error);
        }
    };

    const cargarUsuarios = async () => {
        try {
            const data = await obtenerUsuarios();
            setUsuarios(data);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    };

    const cargarInstructores = async () => {
        try {
            const data = await obtenerInstructores();
            console.log("Inst cargados:", data);
            setInstructores(data);
        } catch (error) {
            console.error('Error al obtener los instructores:', error);
        }
    };

    const cargarAmbientes = async () => {
        try {
            const data = await obtenerAmbientes();
            console.log("Ambientes cargados:", data);
            setAmbientes(data);
        } catch (error) {
            console.error('Error al obtener los ambientes:', error);
        }
    };

    const cargarPeriodos = async () => {
        try {
            const data = await obtenerPeriodos();
            setPeriodos(data);
        } catch (error) {
            console.error('Error al obtener los periodos:', error);
        }
    };

    const cargarFichas = async () => {
        try {
            const data = await obtenerFichas();
            setFichas(data);
        } catch (error) {
            console.error('Error al obtener los fichas:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const newData = { ...prevData, [name]: value };

        // Si el campo es instructor_id, mostrar los campos adicionales
        if (name === 'instructor_id' && value) {
            setMostrarHorario(true);
        }


        // Si los campos de fecha están completos, calcula las horas
        if (name === 'fecha_inicio_hora_ingreso' || name === 'fecha_fin_hora_egreso') {
            const inicio = new Date(newData.fecha_inicio_hora_ingreso);
            const fin = new Date(newData.fecha_fin_hora_egreso);
            if (!isNaN(inicio) && !isNaN(fin)) {
                const diferenciaHoras = (fin - inicio) / (1000 * 60 * 60);
                newData.horas = diferenciaHoras > 0 ? diferenciaHoras : 0;
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
                await actualizarHorario(idEditar, data);
                Swal.fire('Actualizado', 'Horario actualizado exitosamente', 'success');
            } else {
                await crearHorario(data);
                Swal.fire('Creado', 'Horario creado exitosamente', 'success');
            }
            resetFormulario();
            cargarHorarios();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un problema', 'error');
        }
    };

    const resetFormulario = () => {
        setFormData({
            usuario_id: 0,
            ficha_id: 0,
            ambiente_id: 0,
            periodo_id: 0,
            instructor_id: 0,
            jornada_programada: '',
            fecha_inicio_hora_ingreso: '',
            fecha_fin_hora_egreso: '',
            horas: 0,
            validacion: '',
            observaciones: '',
            estado: true,
        });
        setEditando(false);
        setIdEditar(null);
        setModalAbierto(false);
    };

    const handleEditar = (horario) => {
        setFormData({ ...horario });
        setEditando(true);
        setIdEditar(horario.id);
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
                await eliminarHorario(id);
                Swal.fire('Eliminado', 'Horario eliminado exitosamente', 'success');
                cargarHorarios();
            } catch (error) {
                console.error('Error al eliminar el horario:', error);
                Swal.fire('Error', 'No se pudo eliminar el horario', 'error');
            }
        }
    };

    return (
        <div className="container">
            <h1 className="titulo">Gestión de Horarios</h1>
            <button onClick={() => setModalAbierto(true)} className="boton-crear">Crear Horario</button>

            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal1">
                        <h2 className="modal-titulo">{editando ? 'Editar Horario' : 'Crear Horario'}</h2>
                        <form onSubmit={handleSubmit} className="formulario">

                            <div className="fila">
                                <div className="campo">
                                    <label>Nombre y apellido de gestor:</label>
                                    <select name="usuario_id" value={formData.usuario_id} onChange={handleChange} required className="input">
                                        <option value="">Seleccione...</option>
                                        {usuarios.map((usuario) => (
                                            <option key={usuario.id} value={usuario.id}>
                                                {usuario.nombres} {usuario.apellidos}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="campo">
                                    <label>Ambientes:</label>
                                    <select name="ambiente_id" value={formData.ambiente_id} onChange={handleChange} required className="input">
                                        <option value="">Seleccione...</option>
                                        {ambientes.map((p) => (
                                            <option key={p.id} value={p.id}>{p.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="fila">
                                <div className="campo">
                                    <label>Periodo:</label>
                                    <select name="periodo_id" value={formData.periodo_id} onChange={handleChange} required className="input">
                                        <option value="">Seleccione...</option>
                                        {periodos.map((p) => (
                                            <option key={p.id} value={p.id}>{p.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="campo">
                                    <label>Ficha:</label>
                                    <select name="ficha_id" value={formData.ficha_id} onChange={handleChange} required className="input">
                                        <option value="">Seleccione...</option>
                                        {fichas.map((p) => (
                                            <option key={p.id} value={p.id}>{p.codigo}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="campo">
                                    <label>Instructor:</label>
                                    <select name="instructor_id" value={formData.instructor_id} onChange={handleChange} required className="input">
                                        <option value="">Seleccione...</option>
                                        {instructores.map((p) => (
                                            <option key={p.id} value={p.id}>{p.nombres}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            

                            {formData.instructor_id && (
                                <>
                                    <div className="fila">
                                        <div className="campo">
                                            <label>Jornada Programada:</label>
                                            <select name="jornada_programada" value={formData.jornada_programada} onChange={handleChange} required className="input">
                                            <option value="">Seleccione...</option>
                                            <option value="Mañana">Mañana</option>
                                            <option value="Tarde">Tarde</option>
                                            <option value="Noche">Noche</option>
                                        </select>
                                        </div>

                                        <div className="campo">
                                            <label>Fecha Inicio y hora Ingreso:</label>
                                            <input type="datetime-local" name="fecha_inicio_hora_ingreso" value={formData.fecha_inicio_hora_ingreso} onChange={handleChange} required className="input" />
                                        </div>
                                    </div>
                                    <div className="fila">
                                        <div className="campo">
                                            <label>Fecha Fin y hora Egreso:</label>
                                            <input type="datetime-local" name="fecha_fin_hora_egreso" value={formData.fecha_fin_hora_egreso} onChange={handleChange} required className="input" />
                                        </div>
                                        <div className="campo">
                                            <label>Horas:</label>
                                            <input type="number" name="horas" value={formData.horas} onChange={handleChange} required className="input" />
                                        </div>
                                    </div>

                                    <div className="fila">
                                        <div className="campo">
                                            <label>Validación:</label>
                                            <input type="text" name="validacion" value={formData.validacion} onChange={handleChange} required className="input" />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="fila">
                                <div className="campo">
                                    <label>Observaciones:</label>
                                    <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} className="input" />
                                </div>
                            </div>

                            <div className="botones">
                                <button type="button" onClick={() => setModalAbierto(false)} className="boton-cancelar">Cancelar</button>
                                <button type="submit" className="boton-guardar">{editando ? 'Actualizar Horario' : 'Crear Horario'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <h2 className="subtitulo">Lista de Horarios</h2>
            <table className="tabla">
                <thead>
                    <tr>
                        <th className="th">Usuario</th>
                        <th className="th">Ficha</th>
                        <th className="th">Periodo</th>
                        <th className="th">Fecha de inicio y hora de ingreso </th>
                        <th className="th">Fecha de fin y hora de egreso</th>
                        <th className="th">Horas</th>
                        <th className="th">Observaciones</th>
                        <th className="th">Estado</th>
                        <th className="th">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {horarios.map((horario) => (
                        <tr key={horario.id}>
                            <td className="td">
                                {usuarios.find((u) => u.id === horario.usuario_id)?.nombres || "No asignado"}{" "}
                                {usuarios.find((u) => u.id === horario.usuario_id)?.apellidos || ""}
                            </td>

                            <td className="td">{fichas.find(p => p.id === horario.ficha_id)?.codigo || 'No asignado'}</td>
                            <td className="td">{periodos.find(p => p.id === horario.periodo_id)?.nombre || 'No asignado'}</td>
                            <td className="td">{horario.fecha_inicio_hora_ingreso}</td>
                            <td className="td">{horario.fecha_fin_hora_egreso}</td>
                            <td className="td">{horario.horas}</td>
                            <td className="td">{horario.observaciones}</td>
                            <td className="td">{horario.estado ? 'Activo' : 'Inactivo'}</td>
                            <td className="td">
                                <button onClick={() => handleEditar(horario)} className="boton-editar">Editar</button>
                                <button onClick={() => handleEliminar(horario.id)} className="boton-eliminar">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Horario;
