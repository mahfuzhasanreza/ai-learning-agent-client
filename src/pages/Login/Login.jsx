

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Brain, BookOpen, Zap, Sparkles, Star, ArrowRight, TrendingUp, Target, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [error, setError] = useState(null);



  const { signInUser } = UserAuth();
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signInUser(email, password);

      if (result.success) {
        // Print auth token and user info for debugging
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        
        console.log('✅ Login Successful!');
        console.log('🔑 Auth Token:', token);
        console.log('👤 User Info:', JSON.parse(user || '{}'));
        console.log('📋 Full Result:', result);
        
        // Successfully signed in, navigate to dashboard
        navigate("/cosmos-chatbot");
      } else {
        // Sign-in failed, show error message
        setError(result.error || "Failed to sign in. Please try again.");
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="w-full min-h-screen bg-white flex overflow-hidden relative">
      {/* Animated background with COSMOS colors */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Animated gradient orbs */}
      {/* <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF4B00] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#a200ff] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" /> */}

      {/* Left Side - Enhanced Animation Area */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-gray-100 relative overflow-hidden border-r border-gray-300"
        onMouseMove={handleMouseMove}
      >
        {/* Dynamic mouse-following gradient with COSMOS colors */}
        <div
          className="absolute inset-0 opacity-20 transition-all duration-500 ease-out"
          style={{
            background: `radial-gradient(500px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(249,115,22,0.08), transparent 70%)`
          }}
        />

        {/* Enhanced animated background elements */}
        <div className="absolute inset-0">
          {particles}
          
          {/* Glowing orbs with COSMOS colors */}
          <div className="absolute top-20 left-20 w-40 h-40 bg-orange-200 opacity-30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-32 right-20 w-56 h-56 bg-orange-300 opacity-20 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '5s' }} />
          <div className="absolute top-1/2 left-10 w-32 h-32 bg-orange-400 opacity-25 rounded-full blur-2xl animate-ping" style={{ animationDuration: '6s' }} />

          {/* Geometric shapes */}
          {/* <div className="absolute top-1/4 right-1/4 w-20 h-20 border-2 border-[#FF4B00]/30 rotate-45 animate-spin" style={{ animationDuration: '10s' }} /> */}
          {/* <div className="absolute bottom-1/4 left-1/4 w-16 h-16 border-2 border-[#a200ff]/30 rounded-full animate-pulse" /> */}
          {/* <div className="absolute top-1/3 right-1/3 w-12 h-12 border border-cyan-400/20 animate-spin" style={{ animationDuration: '7s' }} /> */}
        </div>

        {/* Enhanced Content */}
        <div className="relative z-10 flex flex-col justify-center mx-auto items-center text-white p-12 text-center">
          {/* Enhanced Logo/Brand Area with COSMOS colors */}
          <div className="mb-16 transform hover:scale-105 transition-all duration-700 group">
            <div className="flex items-center justify-center mb-8 relative">
              <div className="relative">
                {/* Glowing background */}
                {/* <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B00] to-[#a200ff] rounded-3xl blur-2xl opacity-60 animate-pulse" /> */}
                
                {/* Main logo container */}
                <div className="relative bg-white rounded-3xl p-6 border-2 border-gray-300 shadow-xl">
                  <Brain className="w-20 h-20 text-orange-500 animate-pulse" />
                  
                 
                </div>
              </div>
            </div>
            
            {/* Brand name */}
            <h1 className="text-6xl font-black mb-4 tracking-tight text-orange-500">
              COSMOS-ITS
            </h1>
            <p className="text-gray-700 text-xl font-semibold tracking-wide mb-4">AI-Powered Learning Platform</p>
            
   
            
          </div>

      

          {/* Enhanced Floating Elements */}
          {/* <div className="absolute top-1/4 right-16 animate-float">
            <Star className="w-8 h-8 text-[#FF4B00] opacity-60" style={{ filter: 'drop-shadow(0 0 10px rgba(255,75,0,0.5))' }} />
          </div> */}
          {/* <div className="absolute bottom-1/3 left-1/4 animate-float" style={{ animationDelay: '1.5s' }}>
            <Sparkles className="w-7 h-7 text-[#a200ff] opacity-60" style={{ filter: 'drop-shadow(0 0 10px rgba(162,0,255,0.5))' }} />
          </div> */}
          {/* <div className="absolute top-2/3 right-1/3 animate-float" style={{ animationDelay: '2.5s' }}>
            <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-60 shadow-lg shadow-cyan-400/50" />
          </div> */}
        </div>
      </div>

      {/* Right Side - Enhanced Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gray-50" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Enhanced Mobile Logo */}
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

          {/* Enhanced Welcome Text */}
          <div className="text-center mb-8">
            <h2 className="text-5xl font-black text-gray-800 mb-4">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-lg">Continue your learning journey with COSMOS</p>
            
      
          </div>

          {/* Enhanced Login Form */}
          <div className="backdrop-blur-2xl bg-white rounded-3xl p-8 border border-gray-300 shadow-xl hover:border-gray-400 transition-all duration-500">
            {/* Error Message Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-2xl animate-shake">
                <p className="text-red-600 text-sm text-center font-medium">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Enhanced Email Field */}
              <div className="relative group">
                <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  {/* Focus glow effect */}
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                    focusedField === 'email'
                      ? 'bg-orange-100 opacity-50 blur-sm'
                      : 'bg-transparent'
                  }`} />
                  
                  {/* Icon */}
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                    <Mail className={`h-5 w-5 transition-all duration-300 ${
                      focusedField === 'email' ? 'text-orange-500 scale-110' : 'text-gray-400'
                    }`} />
                  </div>
                  
                  {/* Input */}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className={`relative w-full pl-14 pr-5 py-4 bg-gray-50 border rounded-2xl outline-none transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium ${
                      focusedField === 'email'
                        ? 'border-orange-500 shadow-lg shadow-orange-200 bg-white'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-white'
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Enhanced Password Field */}
              <div className="mt-4 relative group">
                <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
                  Password
                </label>
                <div className=" relative">
                  {/* Focus glow effect */}
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                    focusedField === 'password'
                      ? 'bg-orange-100 opacity-50 blur-sm'
                      : 'bg-transparent'
                  }`} />
                  
                  {/* Icon */}
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                    <Lock className={`h-5 w-5 transition-all duration-300 ${
                      focusedField === 'password' ? 'text-orange-500 scale-110' : 'text-gray-400'
                    }`} />
                  </div>
                  
                  {/* Input */}
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className={`relative w-full pl-14 pr-14 py-4 bg-gray-50 border rounded-2xl outline-none transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium ${
                      focusedField === 'password'
                        ? 'border-orange-500 shadow-lg shadow-orange-200 bg-white'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-white'
                    }`}
                    placeholder="Enter your password"
                    required
                  />
                  
                  {/* Toggle password visibility */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-orange-500 transition-all duration-300 z-10 hover:scale-110"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              
              <button
                type="submit"
                disabled={isLoading}
                className={`relative w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-500 transform overflow-hidden group mt-8 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-200 hover:-translate-y-1 active:translate-y-0'
                } text-white shadow-lg`}
              >
                {/* Shimmer effect */}
                {!isLoading && (
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}
                
                <div className="relative flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Enhanced Sign Up Link */}
            <div className="text-center mt-8">
              <p className="text-gray-600 font-medium">
                Don't have an account?{' '}
                <a 
                  href="/register" 
                  className="text-orange-500 hover:text-orange-600 font-bold transition-all duration-300 hover:underline"
                >
                  Sign up now
                </a>
              </p>
            </div>

            {/* Enhanced Divider */}
            <div className="relative mt-10 mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-6 py-2 bg-white rounded-full text-gray-600 border border-gray-300 font-medium">
                  Or continue with
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

export default Login