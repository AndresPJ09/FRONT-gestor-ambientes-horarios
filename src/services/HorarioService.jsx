import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/horario/';

// Obtener todos los Horarios
export const obtenerHorarios = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los horario');
  }
};

// Crear un Horario
export const crearHorario = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el horario');
  }
};

// Actualizar un Horario
export const actualizarHorario = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el horario');
  }
};

// Eliminar un Horario
export const eliminarHorario = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el horario');
  }
};