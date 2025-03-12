import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/actividad/';

// Crear un actividad
export const crearActividad = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el actividad');
  }
};

// Obtener todos los actividads
export const obtenerActividades = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los actividades');
  }
};

// Actualizar un actividad
export const actualizarActividad = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el actividad');
  }
};

// Eliminar un actividad
export const eliminarActividad = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el actividad');
  }
};
