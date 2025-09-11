"use client"

import { useState } from "react"

export default function RegisterProperty() {
  const [form, setForm] = useState({
    municipio: "",
    zona: "",
    precio: "",
    direccion: "",
    habitaciones: "",
    banos: "",
    metros_cuadrados: "",
    tipo: "",
    puestos_estacionamiento: "",
    terreno_construccion: "",
    ano_construccion: "",
    propietario_nombre: "",
    descripcion: "",
    foto: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("¡Inmueble registrado!")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 mt-10 mb-20 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Registro de Inmueble</h2>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <select
            name="municipio"
            value={form.municipio}
            onChange={handleChange}
            className="w-full p-2 border rounded text-blue-900"
            required
          >
            <option value="">Selecciona un municipio</option>
            <option value="Bejuma">Bejuma</option>
            <option value="Diego Ibarra">Diego Ibarra</option>
            <option value="Carlos Arvelo">Carlos Arvelo</option>
            <option value="Guacara">Guacara</option>
            <option value="Juan José Mora">Juan José Mora</option>
            <option value="Miguel Peña">Miguel Peña</option>
            <option value="Miranda">Miranda</option>
            <option value="Montalbán">Montalbán</option>
            <option value="Puerto Cabello">Puerto Cabello</option>
            <option value="Valencia">Valencia</option>
            <option value="San Joaquín">San Joaquín</option>
            <option value="Los Guayos">Los Guayos</option>
            <option value="Naguanagua">Naguanagua</option>
            <option value="San Diego">San Diego</option>
            <option value="Libertador">Libertador</option>
          </select>
          <input
            name="zona"
            value={form.zona}
            onChange={handleChange}
            placeholder="Zona"
            className="w-full p-2 border rounded text-blue-900"
            required
          />
          <input
            name="precio"
            value={form.precio}
            onChange={handleChange}
            placeholder="Precio"
            type="number"
            className="w-full p-2 border rounded text-blue-900"
            required
          />
          <input
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            placeholder="Dirección"
            className="w-full p-2 border rounded text-blue-900"
            required
          />
          <input
            name="habitaciones"
            value={form.habitaciones}
            onChange={handleChange}
            placeholder="Habitaciones"
            type="number"
            className="w-full p-2 border rounded text-blue-900"
            required
          />
          <input
            name="banos"
            value={form.banos}
            onChange={handleChange}
            placeholder="Baños"
            type="number"
            className="w-full p-2 border rounded text-blue-900"
            required
          />
          <input
            name="metros_cuadrados"
            value={form.metros_cuadrados}
            onChange={handleChange}
            placeholder="Metros cuadrados"
            type="number"
            className="w-full p-2 border rounded text-blue-900"
            required
          />
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="w-full p-2 border rounded text-blue-900"
            required
          >
            <option value="">Selecciona el tipo de inmueble</option>
            <option value="Casa">Casa</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Locales">Locales</option>
            <option value="Oficinas">Oficinas</option>
            <option value="Galpones">Galpones</option>
            <option value="Penthouse">Penthouse</option>
            <option value="Terrenos">Terrenos</option>
          </select>
          <input
            name="puestos_estacionamiento"
            value={form.puestos_estacionamiento}
            onChange={handleChange}
            placeholder="Puestos de estacionamiento"
            type="number"
            className="w-full p-2 border rounded text-blue-900"
            required
          />
          <input
            name="terreno_construccion"
            value={form.terreno_construccion}
            onChange={handleChange}
            placeholder="Terreno de construcción (m²)"
            type="number"
            className="w-full p-2 border rounded text-blue-900"
            required
          />
          <input
            name="ano_construccion"
            value={form.ano_construccion}
            onChange={handleChange}
            placeholder="Año de construcción"
            type="number"
            className="w-full p-2 border rounded text-blue-900"
            required
          />
          <input
            name="propietario_nombre"
            value={form.propietario_nombre}
            onChange={handleChange}
            placeholder="Propietario - Nombre"
            className="w-full p-2 border rounded text-blue-900"
            required
          />
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            className="w-full p-2 border rounded text-blue-900"
            required
          />
          <input
            name="foto"
            value={form.foto}
            onChange={handleChange}
            placeholder="URL de la foto"
            className="w-full p-2 border rounded text-blue-900"
            required
          />
          <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 mt-4 mb-4">
            Registrar inmueble
          </button>
        </form>
      </div>
    </div>
  )
}