import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { obtenerProgramas } from '../../services/ProgramaService';
import { obtenerProyectos } from '../../services/ProyectoService';
import {
    crearFicha,
    actualizarFicha,
    eliminarFicha,
    obtenerFichas,
} from '../../services/FichaService';

const Ficha = () => {
    const [formData, setFormData] = useState({
        codigo: '',
        programa_id: 0,
        proyecto_id: 0,
        fecha_inicio: '',
        fecha_fin: '',
        fin_lectiva: '',
        numero_semanas: 0,
        cupo: 0,
        estado: true,
    });

    const abrirModalCrear = () => {
        setEditando(false);
        setFormData({
            codigo: '', 
            programa_id: 0, 
            proyecto_id: 0, 
            fecha_inicio: '', 
            fecha_fin: '', 
            fin_lectiva: '', 
            numero_semanas: '', 
            cupo: 0, 
            estado: true
        });
        setEditando(false);
        setIdEditar(null);
        setModalAbierto(true); // Abrir el modal
    };

    const [editando, setEditando] = useState(false);
    const [idEditar, setIdEditar] = useState(null);
    const [fichas, setFichas] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [programas, setProgramas] = useState([]);
    const [proyectos, setProyectos] = useState([]);

    useEffect(() => {
        cargarFichas();
        cargarProgramas();
        cargarProyectos();
    }, []);

    const cargarFichas = async () => {
        try {
            const data = await obtenerFichas();
            setFichas(data);
        } catch (error) {
            console.error('Error al cargar fichas:', error);
        }
    };

    const cargarProgramas = async () => {
        try {
            const data = await obtenerProgramas();
            console.log("Programas cargados:", data); 
            setProgramas(data);
        } catch (error) {
            console.error('Error al cargar programas:', error);
        }
    };

    const cargarProyectos = async () => {
        try {
            const data = await obtenerProyectos();
            console.log("Proyectos cargados:", data); 
            setProyectos(data);
        } catch (error) {
            console.error('Error al cargar proyectos:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            let newData = { ...prevData, [name]: value };

            // Calcular número de semanas si se cambia la fecha
            if (name === "fecha_inicio" || name === "fecha_fin") {
                const { fecha_inicio, fecha_fin } = newData;
                if (fecha_inicio && fecha_fin) {
                    const startDate = new Date(fecha_inicio);
                    const endDate = new Date(fecha_fin);
                    const diffWeeks = Math.floor((endDate - startDate) / (7 * 24 * 60 * 60 * 1000));
                    newData.numero_semanas = diffWeeks > 0 ? diffWeeks : 0;
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
                await actualizarFicha(idEditar, data);
                Swal.fire('Actualizado', 'Ficha actualizada exitosamente', 'success');
            } else {
                await crearFicha(data);
                Swal.fire('Creado', 'Ficha creada exitosamente', 'success');
            }
            resetFormulario();
            cargarFichas();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un problema', 'error');
        }
    };

    const resetFormulario = () => {
        setFormData({
            codigo: '', 
            programa_id: 0, 
            proyecto_id: 0, 
            fecha_inicio: '', 
            fecha_fin: '', 
            fin_lectiva: '', 
            numero_semanas: 0, 
            cupo: 0, 
            estado: true,
        });
        setEditando(false);
        setIdEditar(null);
        setModalAbierto(false);
    };

    const handleEditar = (ficha) => {
        setFormData({ ...ficha });
        setEditando(true);
        setIdEditar(ficha.id);
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
                await eliminarFicha(id);
                Swal.fire('Eliminado', 'Ficha eliminada exitosamente', 'success');
                cargarFichas();
            } catch (error) {
                console.error('Error al eliminar la ficha:', error);
                Swal.fire('Error', 'No se pudo eliminar la ficha', 'error');
            }
        }
    };

    return (
        <div className="container">
            <h1 className="titulo">Gestión de Fichas</h1>

            <button onClick={abrirModalCrear} className="boton-crear">
                Crear Ficha
            </button>

            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2 className="modal-titulo">
                            {editando ? 'Editar ficha' : 'Crear ficha'}
                        </h2>
                        <form onSubmit={handleSubmit} className="formulario">

                            <div className="fila">
                                <div className="campo">
                                    <label htmlFor="codigo">Código:</label>
                                    <input type="text" id="codigo" name="codigo" value={formData.codigo} onChange={handleChange} required className="input" />
                                </div>
                                <div className="campo">
                                    <label htmlFor="programa_id">Programa:</label>
                                    <select id="programa_id" name="programa_id" value={formData.programa_id} onChange={handleChange} required className="input">
                                        <option value="">Seleccione...</option>
                                        {programas.map((programa) => (
                                            <option key={programa.id} value={programa.id}>{programa.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="fila">
                                <div className="campo">
                                    <label htmlFor="proyecto_id">Proyecto:</label>
                                    <select id="proyecto_id" name="proyecto_id" value={formData.proyecto_id} onChange={handleChange} required className="input">
                                        <option value="">Seleccione...</option>
                                        {proyectos.map((proyecto) => (
                                            <option key={proyecto.id} value={proyecto.id}>
                                                {proyecto.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="campo">
                                    <label htmlFor="fecha_inicio">Fecha de inicio:</label>
                                    <input type="date" id="fecha_inicio" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} required className="input" />
                                </div>
                            </div>

                            <div className="fila">
                                <div className="campo">
                                    <label htmlFor="fecha_fin">Fecha de fin:</label>
                                    <input type="date" id="fecha_fin" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} required className="input" />
                                </div>
                                
                                <div className="campo">
                                    <label htmlFor="fin_lectiva">Fin de lectiva:</label>
                                    <input type="date" id="fin_lectiva" name="fin_lectiva" value={formData.fin_lectiva} onChange={handleChange} required className="input" />
                                </div>
                                </div>

                                <div className="fila">
                                <div className="campo">
                                    <label htmlFor="numero_semanas">Número de semanas:</label>
                                    <input
                                        type="number"
                                        id="numero_semanas"
                                        name="numero_semanas"
                                        value={formData.numero_semanas}
                                        required
                                        className="input"
                                        readOnly
                                    />
                                </div>

                                <div className="campo">
                                    <label htmlFor="cupo">Cupo:</label>
                                    <input
                                        type="number"
                                        id="cupo"
                                        name="cupo"
                                        value={formData.cupo}
                                        onChange={(e) => setFormData({ ...formData, cupo: Number(e.target.value) })}
                                        required
                                        className="input"
                                    />

                                </div>
                                
                                {editando && (
                                    
                                    <div className="campo">
                                        <label htmlFor="estado">Estado:</label>
                                        <select id="estado" name="estado" value={formData.estado} onChange={handleChange} required className="input">
                                            <option value={true}>Activo</option>
                                            <option value={false}>Inactivo</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="botones">
                                <button className="boton-cancelar" type="button" onClick={() => setModalAbierto(false)}>Cancelar</button>
                                <button className="boton-guardar" type="submit">{editando ? 'Actualizar Ficha' : 'Crear Ficha'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <h2 className="subtitulo">Lista de Fichas</h2>
            <table className="tabla">
                <thead>
                    <tr>
                        <th className="th">Código</th>
                        <th className="th">Programa</th>
                        <th className="th">Proyecto</th>
                        <th className="th">Fecha de inicio</th>
                        <th className="th">Fecha de fin</th>
                        <th className="th">fecha fin de lectiva</th>
                        <th className="th">Número de semanas</th>
                        <th className="th">Cupo</th>
                        <th className="th">Estado</th>
                        <th className="th">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {fichas.map((ficha) => (
                        <tr key={ficha.id} className="tr">
                            <td className="td">{ficha.codigo}</td>
                            <td className="td">{programas.find(proy => proy.id === ficha.programa_id)?.nombre || "No asignado"}</td>
                            <td className="td">{proyectos.find(prog => prog.id === ficha.proyecto_id)?.nombre || "No asignado"}</td>
                            <td className="td">{ficha.fecha_inicio}</td>
                            <td className="td">{ficha.fecha_fin}</td>
                            <td className="td">{ficha.fin_lectiva}</td>
                            <td className="td">{ficha.numero_semanas}</td>
                            <td className="td">{ficha.cupo}</td>
                            <td className="td">{ficha.estado ? 'Activo' : 'Inactivo'}</td>
                            <td className="td">
                                <button
                                    onClick={() => handleEditar(ficha)}
                                    className="boton-editar"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleEliminar(ficha.id)}
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

export default Ficha;
