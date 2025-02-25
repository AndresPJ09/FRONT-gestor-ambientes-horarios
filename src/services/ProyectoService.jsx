import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/proyecto/';

// Crear un Proyecto
export const crearProyecto = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el proyecto');
  }
};

// Obtener todos los Proyectos
export const obtenerProyectos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los proyectos');
  }
};

// Actualizar un Proyecto
export const actualizarProyecto = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el proyecto');
  }
};

// Eliminar un Proyecto
export const eliminarProyecto = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el proyecto');
  }
};
