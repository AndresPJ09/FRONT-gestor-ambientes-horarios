import React, { useState } from 'react';
import { crearInstructor } from '../../services/instructorService';

const Instructor = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    especialidad: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearInstructor(formData);
      alert('Instructor creado exitosamente');
      setFormData({ nombre: '', especialidad: '' }); // Limpiar el formulario
    } catch (error) {
      console.error('Error al crear el instructor:', error);
    }
  };

  return (
    <div>
      <h1>Formulario de Instructor</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="especialidad">Especialidad:</label>
          <input
            type="text"
            id="especialidad"
            name="especialidad"
            value={formData.especialidad}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Crear Instructor</button>
      </form>
    </div>
  );
};

export default Instructor;