import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/consolidadoambiente/';

// Obtener todos los instructores
export const obtenerConsolidadoAmbientes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los consolidados de ambientes');
  }
};

// Crear un ConsolidadoAmbiente
export const crearConsolidadoAmbiente = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el consolidado de ambiente');
  }
};

// Actualizar un ConsolidadoAmbiente
export const actualizarConsolidadoAmbiente = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el consolidado de ambiente');
  }
};

// Eliminar un ConsolidadoAmbiente
export const eliminarConsolidadoAmbiente = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el consolidado ambiente');
  }
};