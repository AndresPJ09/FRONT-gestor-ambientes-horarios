import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/competencia/';

// Crear un Competencia
export const crearCompetencia = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear la competencia');
  }
};

// Obtener todos los Competencias
export const obtenerCompetencias = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener la competencia');
  }
};

// Actualizar un Competencia
export const actualizarCompetencias = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar la competencia');
  }
};

// Eliminar un Competencia
export const eliminarCompetencia = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar la competencia');
  }
};
