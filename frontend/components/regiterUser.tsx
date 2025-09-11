import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterUser() {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    contrasena: "",
    telefono: "",
    cedula: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de registro
    setError("");
    // Validación simple
    for (const key in form) {
      if (!form[key as keyof typeof form].trim()) {
        setError("Por favor, completa todos los campos.");
        return;
      }
    }
    // Simulación de registro exitoso
    alert("Registro exitoso!");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md border border-blue-100"
      >
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Registro de Usuario</h2>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-4 text-sm">{error}</div>
        )}
        <div className="space-y-4">
          <div>
            <Label htmlFor="nombres" className="text-blue-900 font-medium">Nombres</Label>
            <Input
              id="nombres"
              name="nombres"
              type="text"
              value={form.nombres}
              onChange={handleChange}
              placeholder="Tus nombres"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="apellidos" className="text-blue-900 font-medium">Apellidos</Label>
            <Input
              id="apellidos"
              name="apellidos"
              type="text"
              value={form.apellidos}
              onChange={handleChange}
              placeholder="Tus apellidos"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-blue-900 font-medium">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="contrasena" className="text-blue-900 font-medium">Contraseña</Label>
            <Input
              id="contrasena"
              name="contrasena"
              type="password"
              value={form.contrasena}
              onChange={handleChange}
              placeholder="Tu contraseña"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="telefono" className="text-blue-900 font-medium">Teléfono</Label>
            <Input
              id="telefono"
              name="telefono"
              type="tel"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Tu teléfono"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="cedula" className="text-blue-900 font-medium">Cédula</Label>
            <Input
              id="cedula"
              name="cedula"
              type="text"
              value={form.cedula}
              onChange={handleChange}
              placeholder="Tu cédula"
              className="mt-1"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white mt-6">
          Registrarse
        </Button>
      </form>
    </section>
  );
}
