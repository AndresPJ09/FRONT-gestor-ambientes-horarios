import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { obtenerPeriodos } from '../../services/PeriodoService';
import { obtenerUsuarios } from '../../services/S/UsuarioService';
import { obtenerFichas } from '../../services/FichaService';
import { obtenerAmbientes } from '../../services/AmbienteService';
import { obtenerInstructores } from '../../services/InstructorService';
import { obtenerProgramas } from '../../services/ProgramaService';
import { obtenerNivelesFormacion } from '../../services/NivelFormacionService';
import { obtenerProyectos } from '../../services/ProyectoService';
import { obtenerFases } from '../../services/FaseService';
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
        dia: '',
        observaciones: '',
        estado: true,
    });

    const abrirModalCrear = () => {
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
            dia: '',
            observaciones: '',
            estado: true,
        });
        setProgramaSeleccionado('');
        setNivelSeleccionado('');
        setProyectoSeleccionado('');
        setJornadaTecnicaSeleccionado('');
        setFechaInicioSeleccionado('');
        setFechaFinSeleccionado('');
        setFinLectivaSeleccionado('');
        setFaseSeleccionada('');
        setEditando(false);
        setIdEditar(null);
        setModalAbierto(true);
    };

    const [editando, setEditando] = useState(false);
    const [idEditar, setIdEditar] = useState(null);
    const [horarios, setHorarios] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [fichas, setFichas] = useState([]);
    const [instructores, setInstructores] = useState([]);
    const [ambientes, setAmbientes] = useState([]);
    const [programas, setProgramas] = useState([]);
    const [proyectos, setProyectos] = useState([]);
    const [niveles, setNiveles] = useState([]);
    const [programaSeleccionado, setProgramaSeleccionado] = useState('');
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState('');
    const [nivelSeleccionado, setNivelSeleccionado] = useState('');
    const [fechaInicioSeleccionado, setFechaInicioSeleccionado] = useState('');
    const [fechaFinSeleccionado, setFechaFinSeleccionado] = useState('');
    const [finlectivaSeleccionado, setFinLectivaSeleccionado] = useState('');
    const [jornadaTecnicaSeleccionado, setJornadaTecnicaSeleccionado] = useState('');
    const [fases, setFases] = useState([]);
    const [faseSeleccionada, setFaseSeleccionada] = useState('');

    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    const cargarDatosIniciales = async () => {
        try {
            const [
                periodosData,
                horariosData,
                fichasData,
                usuariosData,
                ambientesData,
                instructoresData,
                programasData,
                nivelesData,
                proyectosData,
                fasesData
            ] = await Promise.all([
                obtenerPeriodos(),
                obtenerHorarios(),
                obtenerFichas(),
                obtenerUsuarios(),
                obtenerAmbientes(),
                obtenerInstructores(),
                obtenerProgramas(),
                obtenerNivelesFormacion(),
                obtenerProyectos(),
                obtenerFases()

            ]);

            setPeriodos(periodosData);
            setHorarios(horariosData);
            setFichas(fichasData);
            setUsuarios(usuariosData);
            setAmbientes(ambientesData);
            setInstructores(instructoresData);
            setProgramas(programasData);
            setNiveles(nivelesData);
            setProyectos(proyectosData);
            setFases(fasesData);
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
        }
    };

    const handleFichaChange = (e) => {
        const fichaId = e.target.value;
        setFormData({ ...formData, ficha_id: fichaId });

        const ficha = fichas.find(f => f.id === parseInt(fichaId));
        if (ficha) {
            setFechaInicioSeleccionado(ficha.fecha_inicio || '');
            setFechaFinSeleccionado(ficha.fecha_fin || '');
            setFinLectivaSeleccionado(ficha.fin_lectiva || '');

            const proyecto = proyectos.find(p => p.id === ficha.proyecto_id);
            if (proyecto) {
                setProyectoSeleccionado(proyecto.nombre);
                setJornadaTecnicaSeleccionado(proyecto.jornada_tecnica || '');

                const programa = programas.find(p => p.id === ficha.programa_id);
                if (programa) {
                    setProgramaSeleccionado(programa.nombre);
                    const nivel = niveles.find(n => n.id === programa.nivel_formacion_id);
                    setNivelSeleccionado(nivel ? nivel.nombre : '');
                } else {
                    setProgramaSeleccionado('');
                    setNivelSeleccionado('');
                }
            } else {
                setProyectoSeleccionado('');
                setJornadaTecnicaSeleccionado('');
                setProgramaSeleccionado('');
                setNivelSeleccionado('');
            }
        } else {
            setFechaInicioSeleccionado('');
            setFechaFinSeleccionado('');
            setFinLectivaSeleccionado('');
            setProyectoSeleccionado('');
            setJornadaTecnicaSeleccionado('');
            setProgramaSeleccionado('');
            setNivelSeleccionado('');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Actualizar el estado de formData
        setFormData((prev) => {
            const newFormData = {
                ...prev,
                [name]: value,
            };
    
            // Calcular la diferencia de horas si los campos de fecha están cambiados
            if (name === 'fecha_inicio_hora_ingreso' || name === 'fecha_fin_hora_egreso') {
                const inicio = new Date(newFormData.fecha_inicio_hora_ingreso);
                const fin = new Date(newFormData.fecha_fin_hora_egreso);
    
                if (!isNaN(inicio.getTime()) && !isNaN(fin.getTime())) {
                    const diferenciaMilisegundos = fin - inicio;
                    const diferenciaHoras = diferenciaMilisegundos / (1000 * 60 * 60); // Convertir a horas
                    newFormData.horas = Math.max(0, Math.floor(diferenciaHoras)); // Asegurar que sea un número entero positivo
                } else {
                    newFormData.horas = 0; // Si las fechas no son válidas, establecer las horas en 0
                }
            }
    
            return newFormData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editando) {
                await actualizarHorario(idEditar, formData);
                Swal.fire('Actualizado', 'Horario actualizado exitosamente', 'success');
            } else {
                await crearHorario(formData);
                Swal.fire('Creado', 'Horario creado exitosamente', 'success');
            }
            resetFormulario();
            cargarDatosIniciales();
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
            observaciones: '',
            dia: '',
            estado: true,
        });

        setProgramaSeleccionado('');
        setNivelSeleccionado('');
        setProyectoSeleccionado('');
        setJornadaTecnicaSeleccionado('');
        setFechaInicioSeleccionado('');
        setFechaFinSeleccionado('');
        setFinLectivaSeleccionado('');
        setFaseSeleccionada('');
        setEditando(false);
        setIdEditar(null);
        setModalAbierto(false);
    };

    const handleEditar = (horario) => {
        console.log("Datos del horario recibido para editar:", horario);
        setFormData({
            ...horario,
            fecha_inicio_hora_ingreso: horario.fecha_inicio_hora_ingreso
                ? new Date(horario.fecha_inicio_hora_ingreso).toISOString().slice(0, 16)
                : '',
            fecha_fin_hora_egreso: horario.fecha_fin_hora_egreso
                ? new Date(horario.fecha_fin_hora_egreso).toISOString().slice(0, 16)
                : '',
        });

        // Buscar la ficha correspondiente y actualizar sus valores
        const ficha = fichas.find(f => f.id === horario.ficha_id);
        if (ficha) {
            setFechaInicioSeleccionado(ficha.fecha_inicio || '');
            setFechaFinSeleccionado(ficha.fecha_fin || '');
            setFinLectivaSeleccionado(ficha.fin_lectiva || '');

            const proyecto = proyectos.find(p => p.id === ficha.proyecto_id);
            if (proyecto) {
                setProyectoSeleccionado(proyecto.nombre);
                setJornadaTecnicaSeleccionado(proyecto.jornada_tecnica || '');

                const programa = programas.find(p => p.id === ficha.programa_id);
                if (programa) {
                    setProgramaSeleccionado(programa.nombre);
                    const nivel = niveles.find(n => n.id === programa.nivel_formacion_id);
                    setNivelSeleccionado(nivel ? nivel.nombre : '');
                } else {
                    setProgramaSeleccionado('');
                    setNivelSeleccionado('');
                }
            } else {
                setProyectoSeleccionado('');
                setJornadaTecnicaSeleccionado('');
                setProgramaSeleccionado('');
                setNivelSeleccionado('');
            }
        }

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
                cargarDatosIniciales();
            } catch (error) {
                console.error('Error al eliminar el horario:', error);
                Swal.fire('Error', 'No se pudo eliminar el horario', 'error');
            }
        }
    };

    return (
        <div className="container">
            <h1 className="titulo">Gestión de Horarios</h1>
            <button onClick={abrirModalCrear} className="boton-crear">
                Crear Horario
            </button>

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
                                    <label>Programa:</label>
                                    <input type="text" value={programaSeleccionado} readOnly className="input" />
                                </div>

                                <div className="campo">
                                    <label>Nivel de Formación:</label>
                                    <input type="text" value={nivelSeleccionado} readOnly className="input" />
                                </div>


                                <div className="campo">
                                    <label>Ficha:</label>
                                    <select name="ficha_id" value={formData.ficha_id} onChange={handleFichaChange} required className="input">
                                        <option value="">Seleccione...</option>
                                        {fichas.map((f) => (
                                            <option key={f.id} value={f.id}>{f.codigo}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="fila">
                                <div className="campo">
                                    <label>Ambientes:</label>
                                    <select name="ambiente_id" value={formData.ambiente_id} onChange={handleChange} required className="input">
                                        <option value="">Seleccione...</option>
                                        {ambientes.map((ambi) => (
                                            <option key={ambi.id} value={ambi.id}>{ambi.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="campo">
                                    <label>Proyecto:</label>
                                    <input type="text" value={proyectoSeleccionado} readOnly className="input" />
                                </div>

                                <div className="campo">
                                    <label>Fecha Inicio:</label>
                                    <input type="date" value={fechaInicioSeleccionado} onChange={(e) => setFechaInicioSeleccionado(e.target.value)} className="input" />
                                </div>

                                <div className="campo">
                                    <label>Fecha Fin:</label>
                                    <input type="date" value={fechaFinSeleccionado} onChange={(e) => setFechaFinSeleccionado(e.target.value)} className="input" />
                                </div>
                            </div>

                            <div className="fila">
                                <div className="campo">
                                    <label>Fin Lectiva:</label>
                                    <input type="date" value={finlectivaSeleccionado} onChange={(e) => setFinLectivaSeleccionado(e.target.value)} className="input" />
                                </div>

                                <div className="campo">
                                    <label>Jornada Técnica:</label>
                                    <input type="text" value={jornadaTecnicaSeleccionado} readOnly className="input" />
                                </div>


                                <div className="campo">
                                    <label>Fase:</label>
                                    <input type="text" value={faseSeleccionada} readOnly className="input" />
                                </div>


                                <div className="campo">
                                    <label>Periodo:</label>
                                    <select name="periodo_id" value={formData.periodo_id} onChange={handleChange} required className="input">
                                        <option value="">Seleccione...</option>
                                        {periodos.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.nombre} ({p.fecha_inicio} - {p.fecha_fin})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                </div>

                                <div className="fila">
                                <div className="campo">
                                    <label>Día de la semanda:</label>
                                    <select name="dia" value={formData.dia} onChange={handleChange} required className="input">
                                        <option value="">Seleccione un día de la semana</option>
                                        <option value="Lunes">Lunes</option>
                                        <option value="Martes">Martes</option>
                                        <option value="Miércoles">Miércoles</option>
                                        <option value="Jueves">Jueves</option>
                                        <option value="Viernes">Viernes</option>
                                        <option value="Sábado">Sábado</option>
                                        <option value="Domingo">Domingo</option>
                                    </select>
                                </div>

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
                                    <label>Instructor:</label>
                                    <select name="instructor_id" value={formData.instructor_id} onChange={handleChange} required className="input">
                                        <option value="">Seleccione...</option>
                                        {instructores.map((ins) => (
                                            <option key={ins.id} value={ins.id}>{ins.nombres}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {formData.instructor_id && (
                                <div className="fila">
                                    <div className="campo">
                                        <label>Fecha Inicio y hora Ingreso:</label>
                                        <input
                                            type="datetime-local"
                                            name="fecha_inicio_hora_ingreso"
                                            value={formData.fecha_inicio_hora_ingreso}
                                            onChange={handleChange}
                                            required
                                            className="input"
                                        />
                                    </div>

                                    <div className="campo">
                                        <label>Fecha Fin y hora Egreso:</label>
                                        <input
                                            type="datetime-local"
                                            name="fecha_fin_hora_egreso"
                                            value={formData.fecha_fin_hora_egreso}
                                            onChange={handleChange}
                                            required
                                            className="input"
                                        />
                                    </div>

                                    <div className="campo">
                                        <label>Horas:</label>
                                        <input
                                            type="number"
                                            name="horas"
                                            value={formData.horas}
                                            onChange={handleChange}
                                            required
                                            className="input"
                                        />
                                    </div>

                                    <div className="campo">
                                        <label>Validación:</label>
                                        <input
                                            type="text"
                                            name="validacion"
                                            value={formData.validacion}
                                            onChange={handleChange}
                                            required
                                            className="input"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="fila">
                                <div className="campo">
                                    <label>Observaciones:</label>
                                    <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} className="input" />
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
                                <button className="boton-cancelar" type="button" onClick={() => setModalAbierto(false)}>
                                    Cancelar
                                </button>
                                <button className="boton-guardar" type="submit">
                                    {editando ? 'Actualizar horario' : 'Crear horario'}
                                </button>
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
                                <button
                                    onClick={() => handleEditar(horario)}
                                    className="boton-editar"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleEliminar(horario.id)}
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

export default Horario;
