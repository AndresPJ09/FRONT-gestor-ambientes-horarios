import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/nivelformacion/';

// Crear un NivelFormacion
export const crearNivelFormacion = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el nivel formacion');
  }
};

// Obtener todos los NivelFormacions
export const obtenerNivelesFormacion = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los nivel formacion');
  }
};

// Actualizar un NivelFormacion
export const actualizarNivelFormacion = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el NivelFormacion');
  }
};

// Eliminar un NivelFormacion
export const eliminarNivelFormacion = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el nivel formacion');
  }
};
