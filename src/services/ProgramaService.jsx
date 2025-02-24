import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/programa/';

// Crear un Programa
export const crearPrograma = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el Programa');
  }
};

// Obtener todos los Programas
export const obtenerProgramas = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los Programas');
  }
};

// Actualizar un Programa
export const actualizarPrograma = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el Programa');
  }
};

// Eliminar un Programa
export const eliminarPrograma = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el Programa');
  }
};
