import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/usuario/';

// Obtener todos los usuarios
export const obtenerUsuarios = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los usuarios');
  }
};

// Crear un Usuario
export const crearUsuario = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el Usuario');
  }
};

// Actualizar un Usuario
export const actualizarUsuario = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el usuario');
  }
};

// Eliminar un Usuario
export const eliminarUsuario = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el usuario');
  }
};