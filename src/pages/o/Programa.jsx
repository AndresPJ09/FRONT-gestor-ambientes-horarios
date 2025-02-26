import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { obtenerNivelesFormacion } from '../../services/NivelFormacionService';
import {
    crearPrograma,
    actualizarPrograma,
    eliminarPrograma,
    obtenerProgramas,
} from '../../services/ProgramaService';

const Programa = () => {
    // Estado para manejar los datos del formulario
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        nivel_formacion_id: 0,
        estado: true,
    });

    // Función para abrir el modal en modo creación
    const abrirModalCrear = () => {
        setFormData({
            codigo: '',
            nombre: '',
            nivel_formacion_id: 0,
            estado: true,
        });
        setEditando(false);
        setIdEditar(null);
        setModalAbierto(true); // Abrir el modal
    };

    const [editando, setEditando] = useState(false);
    const [idEditar, setIdEditar] = useState(null);
    const [programas, setProgramas] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [nivelesFormacion, setNivelFormacion] = useState([]);

    // Obtener los programas al cargar el componente
    useEffect(() => {
          cargarNivelesFormacion();
          cargarProgramas();
    }, []);

    // Función para cargar los programas
    const cargarProgramas = async () => {
        try {
            const data = await obtenerProgramas();
            setProgramas(data);
        } catch (error) {
            console.error('Error al cargar programas:', error);
        }
    };

    const cargarNivelesFormacion = async () => {
        try {
          const data = await obtenerNivelesFormacion();
          setNivelFormacion(data); // Almacena los tipos en el estado
        } catch (error) {
          console.error('Error al obtener los tipos de vinculación:', error);
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
                await actualizarPrograma(idEditar, data);
                Swal.fire('Actualizado', 'Programa actualizado exitosamente', 'success');
            } else {
                await crearPrograma(data);
                Swal.fire('Creado', 'Programa creado exitosamente', 'success');
            }

            // Limpiar el formulario después del envío
            resetFormulario();
            cargarProgramas();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un problema', 'error');
        }
    };

    // Función para restablecer el formulario
    const resetFormulario = () => {
        setFormData({
            codigo: '', 
            nombre: '', 
            nivel_formacion_id: 0, 
            estado: true,
        });
        setEditando(false);
        setIdEditar(null);
        setModalAbierto(false);
    };

    // Función para editar un programa
    const handleEditar = (programa) => {
        setFormData({
            ...programa,
        });
        setEditando(true);
        setIdEditar(programa.id);
        setModalAbierto(true);
    };

    // Función para eliminar un programa con confirmación
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
                await eliminarPrograma(id);
                Swal.fire('Eliminado', 'Programa eliminado exitosamente', 'success');
                cargarProgramas();
            } catch (error) {
                console.error('Error al eliminar el programa:', error);
                Swal.fire('Error', 'No se pudo eliminar el programa', 'error');
            }
        }
    };

    return (
        <div className="container">
            <h1 className="titulo">Gestión de Programas</h1>

            {/* Botón para abrir el modal de creación */}
            <button onClick={abrirModalCrear} className="boton-crear">
                Crear Programa
            </button>

            {/* Modal para el formulario */}
            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2 className="modal-titulo">
                            {editando ? 'Editar Programa' : 'Crear Programa'}
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
                                    <label htmlFor="nivel_formacion_id">Nivel formacion:</label>
                                    <select
                                        id="nivel_formacion_id"
                                        name="nivel_formacion_id"
                                        value={formData.nivel_formacion_id}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    >
                                        <option value="">Seleccione...</option>
                                        {nivelesFormacion.map((tipo) => (
                                            <option key={tipo.id} value={tipo.id}>
                                                {tipo.nombre}
                                            </option>
                                        ))}
                                    </select>
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

            {/* Tabla para mostrar los programs */}
            <h2 className="subtitulo">Lista de programas</h2>
            <table className="tabla">
                <thead>
                    <tr>
                        <th className="th">Código</th>
                        <th className="th">Nombre</th>
                        <th className="th">Nivel de formacion</th>
                        <th className="th">Estado</th>
                        <th className="th">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {programas.map((programa) => (
                        <tr key={programa.id} className="tr">
                            <td className="td">{programa.codigo}</td>
                            <td className="td">{programa.nombre}</td>
                            <td>
                                {nivelesFormacion.find(tipo => tipo.id === programa.nivel_formacion_id)?.nombre || "No asignado"}
                            </td>
                            <td className="td">{programa.estado ? 'Activo' : 'Inactivo'}</td>
                            <td className="td">
                                <button
                                    onClick={() => handleEditar(programa)}
                                    className="boton-editar"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleEliminar(programa.id)}
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

export default Programa;
