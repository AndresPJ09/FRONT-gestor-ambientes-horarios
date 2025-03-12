import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/actividadfase/';

// Crear un actividadfase
export const crearActividadfase = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el actividadfase');
  }
};

// Obtener todos los actividadfases
export const obtenerActividadfases = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los actividadfases');
  }
};

// Actualizar un actividadfase
export const actualizarActividadfase = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el actividadfase');
  }
};

// Eliminar un actividadfase
export const eliminarActividadfase = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el actividadfase');
  }
};
