import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/ficha/';

// Obtener todos los fichas
export const obtenerFichas = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener las ficha');
  }
};

// Crear un ficha
export const crearFicha = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al crear la ficha');
  }
};

// Actualizar un ficha
export const actualizarFicha = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar la ficha');
  }
};

// Eliminar un ficha
export const eliminarFicha = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar la ficha');
  }
};