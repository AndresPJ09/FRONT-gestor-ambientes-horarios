import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/periodo/';

// Crear un periodo
export const crearPeriodo = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el periodo');
  }
};

// Obtener todos los periodos
export const obtenerPeriodos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los periodos');
  }
};

// Actualizar un periodo
export const actualizarPeriodo = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el periodo');
  }
};

// Eliminar un periodo
export const eliminarPeriodo = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el periodo');
  }
};
