import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/instructor/'; // Reemplaza con la URL de tu API

export const crearInstructor = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el instructor');
  }
};