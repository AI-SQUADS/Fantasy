import React, { useState } from 'react';
import { UserPlus, Loader, CheckCircle } from 'lucide-react';

const RegisterScreen = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',    
    last_name: ''      
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error de validación cuando el usuario escribe
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validación de username
    if (!formData.username.trim()) {
      errors.username = 'El usuario es obligatorio';
    } else if (formData.username.length < 3) {
      errors.username = 'El usuario debe tener al menos 3 caracteres';
    }

    // Validación de email
    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El formato del email no es válido';
    }

    // Validación de nombre
    if (!formData.first_name.trim()) {
      errors.first_name = 'El nombre es obligatorio';
    }

    // Validación de apellido
    if (!formData.last_name.trim()) {
      errors.last_name = 'El apellido es obligatorio';
    }

    // Validación de contraseña
    if (!formData.password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.password2) {
      errors.password2 = 'Confirma tu contraseña';
    } else if (formData.password !== formData.password2) {
      errors.password2 = 'Las contraseñas no coinciden';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const requestData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.password2,
        first_name: formData.first_name,
        last_name: formData.last_name
      };

      console.log('📤 Datos enviados al registro:', requestData);

      const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('📥 Respuesta del servidor:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || JSON.stringify(errorData));
        } catch {
          throw new Error(errorText || 'Error en el registro');
        }
      }

      const data = await response.json();
      console.log('✅ Registro exitoso:', data);
          setFormData({
            username: '',
            email: '',
            password: '',
            password2: '',
            first_name: '',
            last_name: ''
          });
      setError('');
      // Mostrar mensaje de éxito
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSwitchToLogin();
      }, 2000);
      
    } catch (err) {
      console.error('❌ Error en registro:', err);
      setError(err.message || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (fieldName) => {
    const baseClass = "w-full border-2 p-3 rounded bg-white focus:outline-none transition-colors";
    if (validationErrors[fieldName]) {
      return `${baseClass} border-red-500 focus:border-red-500`;
    }
    return `${baseClass} border-gray-300 focus:border-blue-500`;
  };

  // Si se muestra éxito
  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 border border-gray-200 text-center">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Cuenta Creada!</h2>
          <p className="text-gray-600 mb-6">
            Tu cuenta ha sido creada exitosamente. Redirigiendo al login...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus size={24} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Crear Cuenta</h2>
          <p className="text-gray-600">Únete a Fantasy Fútbol Sala</p>
        </div>

        {/* Errores */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Campos en grid para nombre y apellido */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={getInputClass('first_name')}
                placeholder="Tu nombre"
                disabled={loading}
              />
              {validationErrors.first_name && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.first_name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={getInputClass('last_name')}
                placeholder="Tu apellido"
                disabled={loading}
              />
              {validationErrors.last_name && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.last_name}</p>
              )}
            </div>
          </div>

          {/* Usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuario *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={getInputClass('username')}
              placeholder="Elige un usuario"
              disabled={loading}
            />
            {validationErrors.username && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={getInputClass('email')}
              placeholder="tu@email.com"
              disabled={loading}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={getInputClass('password')}
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
            />
            {validationErrors.password && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className={getInputClass('password2')}
              placeholder="Repite tu contraseña"
              disabled={loading}
            />
            {validationErrors.password2 && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.password2}</p>
            )}
          </div>

          {/* Botón de Registro */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Creando cuenta...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Crear Cuenta
              </>
            )}
          </button>

          {/* Enlace a Login */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                disabled={loading}
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </form>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 text-center">
            🔒 Tus datos están protegidos y seguros.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;