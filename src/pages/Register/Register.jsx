import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Brain, BookOpen, Zap, Shield, Users, Trophy, CheckCircle, Phone } from 'lucide-react';
import { UserAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Star } from "lucide-react";


const Register = () => {
  const navigate = useNavigate();
  const { signUpNewUser } = UserAuth();
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: '',
    userType: 'student',
    agreeNewsletter: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };


   // Enhanced particles with COSMOS colors
  const particles = Array.from({ length: 25 }, (_, i) => (
    <div
      key={i}
      className="absolute animate-float opacity-20"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${3 + Math.random() * 4}s`
      }}
    >
      <div 
        className={`w-2 h-2 rounded-full ${
          i % 3 === 0 ? 'bg-orange-400' : 
          i % 3 === 1 ? 'bg-orange-500' : 
          'bg-orange-300'
        }`} 
      />
    </div>
  ));

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      setTimeout(() => setError(''), 3000);
      return;
    }



    try {
      // Prepare user data for API
      const userData = {
        email: formData.email,
        password: formData.password,
        // name: `${formData.firstName} ${formData.lastName}`.trim(),
        name: formData.firstName,
        phone: formData.phone || '',
        gender: formData.gender || '',
      };

      const result = await signUpNewUser(userData);

      if (result.success) {
        // Successfully registered, navigate to dashboard
        navigate('/login');
      } else {
        // Registration failed, show error message
        setError(result.error || 'Failed to create account. Please try again.');

        // Clear error message after 5 seconds
        setTimeout(() => setError(''), 5000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred. Please try again.');

      // Clear error message after 5 seconds
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Strong';
  };


  return (
    <div className="w-full min-h-screen bg-white flex overflow-hidden relative">
      {/* Animated background with COSMOS colors */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Left Side - Enhanced Animation Area */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-gray-100 relative overflow-hidden border-r border-gray-300"
        onMouseMove={handleMouseMove}
      >
        {/* Dynamic mouse-following gradient */}
        <div
          className="absolute inset-0 opacity-20 transition-all duration-300 ease-out"
          style={{
            background: `radial-gradient(500px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(249,115,22,0.08), transparent 70%)`
          }}
        />

        {/* Enhanced animated background elements */}
        <div className="absolute inset-0">
          {particles}
          <div className="absolute top-20 left-20 w-40 h-40 bg-orange-200 opacity-30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-32 right-20 w-56 h-56 bg-orange-300 opacity-20 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '5s' }} />
          <div className="absolute top-1/2 left-10 w-32 h-32 bg-orange-400 opacity-25 rounded-full blur-2xl animate-ping" style={{ animationDuration: '6s' }} />

        
        </div>

        {/* Enhanced Content */}
        <div className="relative z-10 flex flex-col justify-center mx-auto items-center p-12 text-center">
          {/* Enhanced Logo/Brand Area */}
          <div className="mb-12 transform hover:scale-105 transition-all duration-500 group">
            <div className="flex items-center justify-center mb-6 relative">
              <div className="relative">
                <div className="relative bg-white rounded-3xl p-6 border-2 border-gray-300 shadow-xl">
                  <Brain className="w-20 h-20 text-orange-500 animate-pulse" />
                  
                </div>
              </div>
            </div>
            <h1 className="text-6xl font-black text-orange-500 mb-3 tracking-tight">
              COSMOS-ITS
            </h1>
            <p className="text-gray-700 text-xl font-semibold tracking-wide">AI-Powered Learning Platform</p>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 xl:bg-transparent relative overflow-y-auto">
        <div className="absolute inset-0 bg-gray-50" />

        <div className="w-full max-w-md space-y-6 relative z-10 my-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="relative bg-white rounded-2xl p-4 border border-gray-300 shadow-lg">
                  <Brain className="w-14 h-14 text-orange-500 animate-pulse" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-black text-orange-500">
              COSMOS-ITS
            </h1>
            <p className="text-gray-600 mt-2">AI-Powered Learning Platform</p>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-6">
            <h2 className="text-5xl xl:text-5xl font-black text-gray-800 mb-3">
              Create Account
            </h2>
            <p className="text-gray-600 text-sm xl:text-lg">Start your intelligent learning journey today</p>
          </div>

          {/* Registration Form */}
          <div className="backdrop-blur-2xl bg-white rounded-3xl p-6 md:p-8 border border-gray-300 shadow-xl hover:border-gray-400 transition-all duration-500">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-2xl animate-shake">
                <p className="text-red-600 text-sm text-center font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              {/* User Type Selection */}
              {/* <div className="relative">
                <label className="block text-base xl:text-sm font-bold text-gray-300 mb-3 ml-1">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {['student', 'teacher'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleInputChange({ target: { name: 'userType', value: type } })}
                      className={`p-4 xl:p-5 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-0.5 ${
                        formData.userType === type
                          ? 'border-[#FF4B00] bg-[#FF4B00]/10 text-[#FF4B00] shadow-lg shadow-[#FF4B00]/20'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        {type === 'student' ? <BookOpen className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                        <span className="font-semibold capitalize">{type}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Name Fields */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6"> */}
              <div className="relative group">
                <label className="block text-base xl:text-sm font-bold text-gray-700 mb-3 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                    focusedField === 'firstName'
                      ? 'bg-orange-100 opacity-50 blur-sm'
                      : 'bg-transparent'
                  }`} />
                  <div className="absolute inset-y-0 left-0 pl-4 xl:pl-5 flex items-center pointer-events-none z-10">
                    <User className={`h-6 w-6 xl:h-7 xl:w-7 transition-all duration-300 ${
                      focusedField === 'firstName' ? 'text-orange-500 scale-110' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('firstName')}
                    onBlur={() => setFocusedField('')}
                    className={`relative w-full pl-12 xl:pl-14 pr-4 xl:pr-6 py-4 xl:py-5 bg-gray-50 border rounded-2xl outline-none transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium text-base xl:text-sm ${
                      focusedField === 'firstName'
                        ? 'border-orange-500 shadow-lg shadow-orange-200 bg-white'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-white'
                    }`}
                    placeholder="Full name"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="mt-4 relative group">
                <label className="block text-base xl:text-sm font-bold text-gray-700 mb-3 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                    focusedField === 'email'
                      ? 'bg-orange-100 opacity-50 blur-sm'
                      : 'bg-transparent'
                  }`} />
                  <div className="absolute inset-y-0 left-0 pl-4 xl:pl-5 flex items-center pointer-events-none z-10">
                    <Mail className={`h-6 w-6 xl:h-7 xl:w-7 transition-all duration-300 ${
                      focusedField === 'email' ? 'text-orange-500 scale-110' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className={`relative w-full pl-12 xl:pl-14 pr-4 xl:pr-6 py-4 xl:py-5 bg-gray-50 border rounded-2xl outline-none transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium text-base xl:text-sm ${
                      focusedField === 'email'
                        ? 'border-orange-500 shadow-lg shadow-orange-200 bg-white'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-white'
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

            

              {/* Password Field */}
              <div className="mt-4 relative group">
                <label className="block text-base xl:text-sm font-bold text-gray-700 mb-3 ml-1">
                  Password
                </label>
                <div className="relative">
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                    focusedField === 'password'
                      ? 'bg-orange-100 opacity-50 blur-sm'
                      : 'bg-transparent'
                  }`} />
                  <div className="absolute inset-y-0 left-0 pl-4 xl:pl-5 flex items-center pointer-events-none z-10">
                    <Lock className={`h-6 w-6 xl:h-7 xl:w-7 transition-all duration-300 ${
                      focusedField === 'password' ? 'text-orange-500 scale-110' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className={`relative w-full pl-12 xl:pl-14 pr-14 xl:pr-16 py-4 xl:py-5 bg-gray-50 border rounded-2xl outline-none transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium text-base xl:text-sm ${
                      focusedField === 'password'
                        ? 'border-orange-500 shadow-lg shadow-orange-200 bg-white'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-white'
                    }`}
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 xl:pr-5 flex items-center text-gray-400 hover:text-orange-500 transition-all duration-300 z-10 hover:scale-110"
                  >
                    {showPassword ? <EyeOff className="h-6 w-6 xl:h-7 xl:w-7" /> : <Eye className="h-6 w-6 xl:h-7 xl:w-7" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${
                        passwordStrength <= 2 ? 'text-red-500' :
                        passwordStrength <= 3 ? 'text-yellow-500' :
                        passwordStrength <= 4 ? 'text-blue-500' : 'text-green-500'
                      }`}>
                        {getStrengthText()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="mt-4 relative group">
                <label className="block text-base xl:text-sm font-bold text-gray-700 mb-3 ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                    focusedField === 'confirmPassword'
                      ? 'bg-orange-100 opacity-50 blur-sm'
                      : 'bg-transparent'
                  }`} />
                  <div className="absolute inset-y-0 left-0 pl-4 xl:pl-5 flex items-center pointer-events-none z-10">
                    <Lock className={`h-6 w-6 xl:h-7 xl:w-7 transition-all duration-300 ${
                      focusedField === 'confirmPassword' ? 'text-orange-500 scale-110' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField('')}
                    className={`relative w-full pl-12 xl:pl-14 pr-14 xl:pr-16 py-4 xl:py-5 bg-gray-50 border rounded-2xl outline-none transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium text-base xl:text-sm ${
                      focusedField === 'confirmPassword'
                        ? 'border-orange-500 shadow-lg shadow-orange-200 bg-white'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-white'
                    } ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-red-500'
                        : ''
                    }`}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 xl:pr-5 flex items-center text-gray-400 hover:text-orange-500 transition-all duration-300 z-10 hover:scale-110"
                  >
                    {showConfirmPassword ? <EyeOff className="h-6 w-6 xl:h-7 xl:w-7" /> : <Eye className="h-6 w-6 xl:h-7 xl:w-7" />}
                  </button>
                </div>

                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-2 text-sm text-red-500 ml-1">Passwords don't match</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="mt-2 flex items-center text-green-500 ml-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Passwords match</span>
                  </div>
                )}
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading || formData.password !== formData.confirmPassword}
                onClick={handleRegister}
                className={`relative w-full py-4 xl:py-5 px-6 rounded-2xl font-bold text-sm xl:text-xl transition-all duration-500 transform overflow-hidden group mt-6 ${
                  isLoading || formData.password !== formData.confirmPassword
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-200 hover:-translate-y-1 active:translate-y-0'
                } text-white shadow-lg`}
              >
                {!isLoading && (
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}

                <div className="relative flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 xl:h-7 xl:w-7 border-b-2 border-white mr-3" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </div>
              </button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600 font-medium text-base xl:text-sm">
                Already have an account?{' '}
                <a
                  href="/login"
                  className="text-orange-500 hover:text-orange-600 font-bold transition-all duration-300 hover:underline"
                >
                  Sign in here
                </a>
              </p>
            </div>

            {/* Divider */}
            <div className="relative mt-8 mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-base xl:text-sm">
                <span className="px-6 py-2 bg-white rounded-full text-gray-600 border border-gray-300 font-medium">
                  Or register with
                </span>
              </div>
            </div>

            {/* Enhanced Social Login Buttons */}
            <div className="grid grid-cols-1 gap-4">
              <button className="group flex items-center justify-center px-5 py-4 bg-gray-50 border border-gray-300 rounded-2xl hover:border-orange-500 hover:bg-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100">
                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-gray-800 font-semibold">Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
};

export default Register;