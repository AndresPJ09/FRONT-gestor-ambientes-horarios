import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/ambiente/';

// Crear un ambiente
export const crearAmbiente = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el ambiente');
  }
};

// Obtener todos los ambientes
export const obtenerAmbientes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los ambientes');
  }
};

// Actualizar un ambiente
export const actualizarAmbiente = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el ambiente');
  }
};

// Eliminar un ambiente
export const eliminarAmbiente = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el ambiente');
  }
};
