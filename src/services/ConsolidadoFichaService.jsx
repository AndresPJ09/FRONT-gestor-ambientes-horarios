import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/consolidadoficha/';

// Obtener todos los instructores
export const obtenerConsolidadoFichas = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los consolidados de fichas');
  }
};

// Crear un ConsolidadoFicha
export const crearConsolidadoFicha = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el consolidado de ficha');
  }
};

// Actualizar un ConsolidadoFicha
export const actualizarConsolidadoFicha = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el consolidado de ficha');
  }
};

// Eliminar un ConsolidadoFicha
export const eliminarConsolidadoFicha = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el consolidado ficha');
  }
};