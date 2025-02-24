import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/resultadoaprendizaje/';

// Crear un ResulAprendi
export const crearResulAprendi = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el resultado de aprendizaje');
  }
};

// Obtener todos los ResulAprendis
export const obtenerResulAprendis = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los resultado de aprendizaje');
  }
};

// Actualizar un ResulAprendi
export const actualizarResulAprendis = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el resultado de aprendizaje');
  }
};

// Eliminar un ResulAprendi
export const eliminarResulAprendi = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el resultado de aprendizaje');
  }
};
