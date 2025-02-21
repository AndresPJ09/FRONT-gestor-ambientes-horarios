import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/instructor/';

// Crear un instructor
export const crearInstructor = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el instructor');
  }
};

// Obtener todos los instructores
export const obtenerInstructores = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los instructores');
  }
};

// Actualizar un instructor
export const actualizarInstructor = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el instructor');
  }
};

// Eliminar un instructor
export const eliminarInstructor = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el instructor');
  }
};