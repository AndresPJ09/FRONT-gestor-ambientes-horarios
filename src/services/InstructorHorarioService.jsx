import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/instructorhorario/';

// Obtener todos los HorarioInstructor
export const obtenerHorariosInstructores = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los horarios de los instructores');
  }
};

// Obtener horarios por usuario
export const obtenerHorariosPorUsuario = async (usuarioId) => {
  try {
    const response = await axios.get(`${API_URL}usuario/${usuarioId}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los horarios del usuario');
  }
};

// Obtener horarios por período
export const obtenerHorariosPorPeriodo = async (periodoId) => {
  try {
    const response = await axios.get(`${API_URL}periodo/${periodoId}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los horarios del período');
  }
};

// Crear un HorarioInstructor
export const crearHorarioInstructor = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el horario del instructor');
  }
};

// Actualizar un HorarioInstructor
export const actualizarHorarioInstructor = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el horario del nstructor');
  }
};

// Eliminar un HorarioInstructor
export const eliminarHorarioInstructor = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el horario del instructor');
  }
};