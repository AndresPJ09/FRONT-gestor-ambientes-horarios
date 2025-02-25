import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/fase/';

// Crear un Fase
export const crearFase = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear la fase');
  }
};

// Obtener todos los Fases
export const obtenerFases = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener las ases');
  }
};

// Actualizar un Fase
export const actualizarFase = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar la Fase');
  }
};

// Eliminar un Fase
export const eliminarFase = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar al Fase');
  }
};
