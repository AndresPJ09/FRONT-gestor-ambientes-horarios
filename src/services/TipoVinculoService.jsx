import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/tipovinculo/';

// Crear un TipoVinculo
export const crearTipoVinculo = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el tipo vinculo');
  }
};

// Obtener todos los TipoVinculos
export const obtenerTipoVinculos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los tipo vinculo');
  }
};

// Actualizar un TipoVinculo
export const actualizarTipoVinculo = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el tipo vinculo');
  }
};

// Eliminar un TipoVinculo
export const eliminarTipoVinculo = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el tipo vinculo');
  }
};
