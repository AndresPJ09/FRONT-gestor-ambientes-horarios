import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/proyectofase/';

// Crear un proyectofase
export const crearProyectoFase = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el proyecto fase');
  }
};

// Obtener todos los ProyectoFases
export const obtenerProyectoFases = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los proyecto fases');
  }
};

// Actualizar un ProyectoFase
export const actualizarProyectoFase = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el proyecto fase');
  }
};

// Eliminar un ProyectoFase
export const eliminarProyectoFase = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el proyecto fase');
  }
};
