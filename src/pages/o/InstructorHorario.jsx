import React, { useState, useEffect } from 'react';
import { obtenerPeriodos } from '../../services/PeriodoService';
import { obtenerUsuarios } from '../../services/S/UsuarioService';
import Swal from 'sweetalert2'; 
import {
    obtenerHorariosInstructores,
    obtenerHorariosPorUsuario,
    obtenerHorariosPorPeriodo
} from '../../services/InstructorHorarioService';

const InstructorHorario = () => {
    const [instructorHorarios, setInstructorHorarios] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [filtroUsuario, setFiltroUsuario] = useState('');
    const [filtroPeriodo, setFiltroPeriodo] = useState('');

    useEffect(() => {
        cargarInstructoresHorarios();
        cargarPeriodos();
        cargarUsuarios();
    }, []);

    useEffect(() => {
        if (filtroUsuario) filtrarPorUsuario();
    }, [filtroUsuario]);

    useEffect(() => {
        if (filtroPeriodo) filtrarPorPeriodo();
    }, [filtroPeriodo]);

    const cargarInstructoresHorarios = async () => {
        try {
            const data = await obtenerHorariosInstructores();
            setInstructorHorarios(data);
        } catch (error) {
            console.error("Error al obtener los horarios de instructores:", error);
        }
    };

    const cargarPeriodos = async () => {
        try {
            const data = await obtenerPeriodos();
            setPeriodos(data);
        } catch (error) {
            console.error("Error al obtener los periodos:", error);
        }
    };

    const cargarUsuarios = async () => {
        try {
            const data = await obtenerUsuarios();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        }
    };

    const filtrarPorUsuario = async () => {
        try {
            const data = await obtenerHorariosPorUsuario(filtroUsuario);
            if (data.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'No hay registros',
                    text: 'No se encontraron horarios para el usuario seleccionado.',
                    confirmButtonText: 'Aceptar'
                });
                return; // No actualiza el estado, evitando que la tabla se vacíe
            }
            setInstructorHorarios(data);
        } catch (error) {
            console.error("Error al filtrar horarios por usuario:", error);
        }
    };
    
    const filtrarPorPeriodo = async () => {
        try {
            const data = await obtenerHorariosPorPeriodo(filtroPeriodo);
            if (data.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'No hay registros',
                    text: 'No se encontraron horarios para el período seleccionado.',
                    confirmButtonText: 'Aceptar'
                });
                return; // No actualiza el estado, evitando que la tabla se vacíe
            }
            setInstructorHorarios(data);
        } catch (error) {
            console.error("Error al filtrar horarios por período:", error);
        }
    };

    const limpiarFiltros = () => {
        setFiltroUsuario('');
        setFiltroPeriodo('');
        cargarInstructoresHorarios();
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return 'N/A'; // Manejo si el valor es null o undefined
        const date = new Date(dateTime);
        return new Intl.DateTimeFormat('es-ES', {
            dateStyle: 'long', // Ejemplo: 5 de marzo de 2024
            timeStyle: 'short', // Ejemplo: 14:30
        }).format(date);
    };

    return (
        <div>
            <h2 className="subtitulo">Lista de horarios de instructores</h2>

            <div className="filtros">
                <select value={filtroUsuario} onChange={(e) => setFiltroUsuario(e.target.value)}>
                    <option value="">Filtrar por usuario</option>
                    {usuarios.map((usuario) => (
                        <option key={usuario.id} value={usuario.id}>
                            {usuario.nombres} {usuario.apellidos}
                        </option>
                    ))}
                </select>

                <select value={filtroPeriodo} onChange={(e) => setFiltroPeriodo(e.target.value)}>
                    <option value="">Filtrar por período</option>
                    {periodos.map((periodo) => (
                        <option key={periodo.id} value={periodo.id}>
                            {periodo.nombre} ({periodo.fecha_inicio} - {periodo.fecha_fin})
                        </option>
                    ))}
                </select>

                <button onClick={limpiarFiltros} className="btn-limpiar">Limpiar filtros</button>
            </div>

            <table className="tabla">
                <thead>
                    <tr>
                        <th className="th">Día</th>
                        <th className="th">Programa</th>
                        <th className="th">Nivel de formación</th>
                        <th className="th">Ficha</th>
                        <th className="th">Ambiente</th>
                        <th className="th">Jornada programa</th>
                        <th className="th">Instructor</th>
                        <th className="th">Fecha de inicio y hora de ingreso</th>
                        <th className="th">Fecha de fin y hora de egreso</th>
                        <th className="th">Horas</th>
                        <th className="th">Observaciones</th>
                        <th className="th">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {instructorHorarios.map((instructorHorario) => (
                        <tr key={instructorHorario.id} className="tr">
                            <td className="td">{instructorHorario.dia}</td>
                            <td className="td">{instructorHorario.programa_nombre}</td>
                            <td className="td">{instructorHorario.nivelformacion_nombre}</td>
                            <td className="td">{instructorHorario.ficha_codigo}</td>
                            <td className="td">{instructorHorario.ambiente_codigo} {instructorHorario.ambiente_nombre}</td>
                            <td className="td">{instructorHorario.instructor_jornada_programada}</td>
                            <td className="td">{instructorHorario.instructor_nombres} {instructorHorario.instructor_apellidos}</td>
                            <td className="td">{formatDateTime(instructorHorario.instructor_fecha_inicio_hora_ingreso)}</td>
                            <td className="td">{formatDateTime(instructorHorario.instructor_fecha_fin_hora_egreso)}</td>
                            <td className="td">{instructorHorario.instructor_horas}</td>
                            <td className="td">{instructorHorario.observaciones}</td>
                            <td className="td">{instructorHorario.estado ? 'Activo' : 'Inactivo'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InstructorHorario;
