"use client";
import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Phone, CreditCard, AlertCircle, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";

const RegisterUser = () => {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    cedula: "",
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validar nombres
    if (!form.nombres.trim()) {
      newErrors.nombres = "Los nombres son requeridos";
    } else if (form.nombres.trim().length < 2) {
      newErrors.nombres = "Los nombres deben tener al menos 2 caracteres";
    }

    // Validar apellidos
    if (!form.apellidos.trim()) {
      newErrors.apellidos = "Los apellidos son requeridos";
    } else if (form.apellidos.trim().length < 2) {
      newErrors.apellidos = "Los apellidos deben tener al menos 2 caracteres";
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "El email no es válido";
    }

    // Validar contraseña
    if (!form.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (form.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = "La contraseña debe contener al menos una mayúscula, una minúscula y un número";
    }

    // Validar confirmación de contraseña
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Validar teléfono
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!form.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    } else if (!phoneRegex.test(form.telefono)) {
      newErrors.telefono = "El teléfono no es válido";
    }

    // Validar cédula
    const cedulaRegex = /^[VE]-\d{7,8}$/i;
    if (!form.cedula.trim()) {
      newErrors.cedula = "La cédula es requerida";
    } else if (!cedulaRegex.test(form.cedula)) {
      newErrors.cedula = "La cédula debe tener formato V-12345678 o E-12345678";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await register({
        nombres: form.nombres,
        apellidos: form.apellidos,
        email: form.email,
        contrasena: form.password,
        telefono: form.telefono,
        cedula: form.cedula,
      });
      router.push("/");
    } catch (err: any) {
      setErrors({ general: err.message || "Error al registrar usuario" });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Si es Google, usar next-auth
    if (provider === "google") {
      signIn("google", { callbackUrl: "/" });
      return;
    }

    // Otros providers (por ahora solo log)
    console.log(`Iniciar sesión con ${provider}`);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold text-blue-900 mb-2">
            Crear Cuenta
          </CardTitle>
          <CardDescription className="text-gray-600">
            Únete a ICA y encuentra tu hogar ideal
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Botones de redes sociales */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
              onClick={() => handleSocialLogin('google')}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
              onClick={() => handleSocialLogin('facebook')}
            >
              <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continuar con Facebook
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">O regístrate con email</span>
            </div>
          </div>

          {/* Error general */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombres y Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombres" className="text-sm font-medium text-gray-700">
                  Nombres *
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    id="nombres"
                    name="nombres"
                    type="text"
                    value={form.nombres}
                    onChange={handleChange}
                    placeholder="Tus nombres"
                    className={`pl-10 ${errors.nombres ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.nombres && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.nombres}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="apellidos" className="text-sm font-medium text-gray-700">
                  Apellidos *
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    id="apellidos"
                    name="apellidos"
                    type="text"
                    value={form.apellidos}
                    onChange={handleChange}
                    placeholder="Tus apellidos"
                    className={`pl-10 ${errors.apellidos ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.apellidos && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.apellidos}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email *
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Contraseña *
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Tu contraseña"
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirmar Contraseña *
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirma tu contraseña"
                    className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Teléfono y Cédula */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefono" className="text-sm font-medium text-gray-700">
                  Teléfono *
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="+58 412 123 4567"
                    className={`pl-10 ${errors.telefono ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.telefono && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.telefono}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="cedula" className="text-sm font-medium text-gray-700">
                  Cédula *
                </Label>
                <div className="relative mt-1">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    id="cedula"
                    name="cedula"
                    type="text"
                    value={form.cedula}
                    onChange={handleChange}
                    placeholder="V-12345678"
                    className={`pl-10 ${errors.cedula ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.cedula && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.cedula}
                  </p>
                )}
              </div>
            </div>

            {/* Botón de registro */}
            <Button
              type="submit"
              className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-medium text-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registrando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} />
                  Crear Cuenta
                </div>
              )}
            </Button>
          </form>

          {/* Enlace a login */}
          <div className="text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                className="text-blue-900 hover:text-blue-700 font-medium"
                onClick={() => router.push('/login')}
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default RegisterUser;
