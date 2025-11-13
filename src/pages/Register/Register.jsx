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
    agreeTerms: false,
    agreeNewsletter: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

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

    // Validate terms agreement
    if (!formData.agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
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
        navigate('/dashboard');
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

  // return (
  //   <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex xl:p-8">
  //     {/* Left Side - Animated Content */}
  //     <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 relative overflow-hidden xl:rounded-2xl shadow-2xl">
  //       {/* Animated Background Elements */}
  //       <div className="absolute inset-0">
  //         <div className="absolute top-20 left-20 w-48 h-48 xl:w-64 xl:h-64 bg-white/10 rounded-full blur-xl animate-pulse"></div>
  //         <div className="absolute bottom-32 right-20 w-64 h-64 xl:w-80 xl:h-80 bg-teal-300/20 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }}></div>
  //         <div className="absolute top-1/2 left-10 w-32 h-32 xl:w-40 xl:h-40 bg-cyan-300/15 rounded-full blur-lg animate-ping" style={{ animationDuration: '4s' }}></div>
  //         <div className="absolute top-1/3 right-1/3 w-24 h-24 xl:w-32 xl:h-32 bg-emerald-300/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }}></div>
  //         <div className="absolute bottom-1/4 left-1/3 w-16 h-16 xl:w-20 xl:h-20 bg-yellow-300/15 rounded-full blur-md animate-bounce" style={{ animationDelay: '1.5s' }}></div>
  //       </div>

  //       {/* Content */}
  //       <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 xl:p-16 2xl:p-20 text-center max-w-2xl mx-auto">
  //         {/* Logo/Brand Area */}
  //         <div className="mb-12 transform hover:scale-105 transition-transform duration-300">
  //           <div className="flex items-center justify-center mb-6">
  //             <div className="relative">
  //               <Brain className="w-20 h-20 xl:w-24 xl:h-24 text-white animate-pulse" />
  //               <div className="absolute -top-3 -right-3 w-8 h-8 xl:w-10 xl:h-10 bg-yellow-400 rounded-full animate-bounce">
  //                 <Zap className="w-5 h-5 xl:w-6 xl:h-6 text-emerald-800 m-1.5 xl:m-2" />
  //               </div>
  //             </div>
  //           </div>
  //           <h1 className="text-5xl xl:text-6xl 2xl:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-200 mb-4">
  //             COSMOS-ITS
  //           </h1>
  //           <p className="text-teal-100 text-xl xl:text-2xl font-medium">Join the Future of Learning</p>
  //         </div>

  //         {/* Registration Benefits */}
  //         <div className=" space-y-8 xl:space-y-10 max-w-lg xl:max-w-xl">
  //           <div className="mb-2 flex items-center space-x-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
  //             <div className="w-16 h-16 xl:w-20 xl:h-20 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
  //               <Users className="w-8 h-8 xl:w-10 xl:h-10 text-white" />
  //             </div>
  //             <div className="ml-5 text-left">
  //               <h3 className="font-semibold text-xl xl:text-2xl">Join 10,000+ Learners</h3>
  //               <p className="text-teal-100 text-base xl:text-lg">Connect with a global learning community</p>
  //             </div>
  //           </div>

  //           <div className="mb-2 flex items-center space-x-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
  //             <div className="w-16 h-16 xl:w-20 xl:h-20 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
  //               <Trophy className="w-8 h-8 xl:w-10 xl:h-10 text-white" />
  //             </div>
  //             <div className="ml-5 text-left">
  //               <h3 className="font-semibold text-xl xl:text-2xl">Earn Certificates</h3>
  //               <p className="text-teal-100 text-base xl:text-lg">Get verified certificates for your achievements</p>
  //             </div>
  //           </div>

  //           <div className="flex items-center space-x-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
  //             <div className=" w-16 h-16 xl:w-20 xl:h-20 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
  //               <Shield className="w-8 h-8 xl:w-10 xl:h-10 text-white" />
  //             </div>
  //             <div className="ml-5 text-left">
  //               <h3 className="font-semibold text-xl xl:text-2xl">Free Forever</h3>
  //               <p className="text-teal-100 text-base xl:text-lg">Start learning with our free tier, upgrade anytime</p>
  //             </div>
  //           </div>
  //         </div>

  //         {/* Floating Elements Animation */}
  //         <div className="absolute top-1/4 right-20 animate-float">
  //           <div className="w-4 h-4 bg-yellow-400 rounded-full opacity-70"></div>
  //         </div>
  //         <div className="absolute bottom-1/3 left-1/4 animate-float" style={{ animationDelay: '1s' }}>
  //           <div className="w-3 h-3 bg-pink-300 rounded-full opacity-60"></div>
  //         </div>
  //         <div className="absolute top-2/3 right-1/4 animate-float" style={{ animationDelay: '2s' }}>
  //           <div className="w-2 h-2 bg-blue-300 rounded-full opacity-50"></div>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Right Side - Registration Form */}
  //     <div className="flex-1 flex items-center justify-center bg-white xl:bg-transparent ">
  //       <div className="w-full space-y-8 xl:space-y-10 xl:bg-white xl:px-16 xl:pt-2 xl:rounded-2xl xl:shadow-2xl xl:border xl:border-gray-100">
  //         {/* Mobile Logo */}
  //         <div className="lg:hidden text-center mb-8">
  //           <div className="flex items-center justify-center mb-4">
  //             <Brain className="w-12 h-12 text-emerald-600 animate-pulse" />
  //           </div>
  //           <h1 className="text-3xl font-bold text-gray-900">COSMOS-ITS</h1>
  //           <p className="text-gray-600">AI-Powered Learning Platform</p>
  //         </div>

  //         {/* Welcome Text */}
  //         <div className="text-center">
  //           <h2 className="text-4xl xl:text-5xl font-bold text-gray-900 mb-4">Create Account</h2>
  //           <p className="text-gray-600 text-lg xl:text-xl">Start your intelligent learning journey today</p>
  //         </div>

  //         {/* Registration Form */}
  //         <div className="space-y-8 xl:space-y-10">
  //           {/* Error Message Display */}
  //           {error && (
  //             <div className="p-4 bg-red-100 border border-red-400 rounded-xl">
  //               <p className="text-red-700 text-sm text-center">{error}</p>
  //             </div>
  //           )}

  //           {/* User Type Selection */}
  //           <div className="relative">
  //             <label className="block text-base xl:text-lg font-medium text-gray-700 mb-3">
  //               I am a
  //             </label>
  //             <div className="grid grid-cols-2 gap-4">
  //               {['student', 'teacher'].map((type) => (
  //                 <button
  //                   key={type}
  //                   type="button"
  //                   onClick={() => handleInputChange({ target: { name: 'userType', value: type } })}
  //                   className={`p-4 xl:p-5 rounded-xl xl:rounded-2xl border-2 transition-all duration-200 transform hover:-translate-y-0.5 ${formData.userType === type
  //                       ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg'
  //                       : 'border-gray-300 bg-white text-gray-700 hover:border-emerald-300'
  //                     }`}
  //                 >
  //                   <div className="flex items-center justify-center space-x-2">
  //                     {type === 'student' ? <BookOpen className="w-5 h-5" /> : <Users className="w-5 h-5" />}
  //                     <span className="font-medium capitalize">{type}</span>
  //                   </div>
  //                 </button>
  //               ))}
  //             </div>
  //           </div>

  //           {/* Name Fields */}
  //           <div className="grid grid-cols-2 mt-4 gap-4 xl:gap-6">
  //             <div className="relative">
  //               <label className="block text-base xl:text-lg font-medium text-gray-700 mb-3">
  //                 First Name
  //               </label>
  //               <div className="relative">
  //                 <div className="absolute inset-y-0 left-0 pl-4 xl:pl-5 flex items-center pointer-events-none">
  //                   <User className={`h-6 w-6 xl:h-7 xl:w-7 transition-colors duration-200 ${focusedField === 'firstName' ? 'text-emerald-600' : 'text-gray-400'
  //                     }`} />
  //                 </div>
  //                 <input
  //                   type="text"
  //                   name="firstName"
  //                   value={formData.firstName}
  //                   onChange={handleInputChange}
  //                   onFocus={() => setFocusedField('firstName')}
  //                   onBlur={() => setFocusedField('')}
  //                   className={`w-full pl-12 xl:pl-14 pr-4 xl:pr-6 py-4 xl:py-5 border rounded-xl xl:rounded-2xl text-base xl:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 ${focusedField === 'firstName' ? 'border-emerald-500 shadow-lg' : 'border-gray-300'
  //                     }`}
  //                   placeholder="First name"
  //                   required
  //                 />
  //               </div>
  //             </div>

  //             <div className="relative">
  //               <label className="block text-base xl:text-lg font-medium text-gray-700 mb-3">
  //                 Last Name
  //               </label>
  //               <div className="relative">
  //                 <div className="absolute inset-y-0 left-0 pl-4 xl:pl-5 flex items-center pointer-events-none">
  //                   <User className={`h-6 w-6 xl:h-7 xl:w-7 transition-colors duration-200 ${focusedField === 'lastName' ? 'text-emerald-600' : 'text-gray-400'
  //                     }`} />
  //                 </div>
  //                 <input
  //                   type="text"
  //                   name="lastName"
  //                   value={formData.lastName}
  //                   onChange={handleInputChange}
  //                   onFocus={() => setFocusedField('lastName')}
  //                   onBlur={() => setFocusedField('')}
  //                   className={`w-full pl-12 xl:pl-14 pr-4 xl:pr-6 py-4 xl:py-5 border rounded-xl xl:rounded-2xl text-base xl:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 ${focusedField === 'lastName' ? 'border-emerald-500 shadow-lg' : 'border-gray-300'
  //                     }`}
  //                   placeholder="Last name"
  //                   required
  //                 />
  //               </div>
  //             </div>
  //           </div>

  //           {/* Email Field */}
  //           <div className="relative mt-4">
  //             <label className="block text-base xl:text-lg font-medium text-gray-700 mb-3">
  //               Email Address
  //             </label>
  //             <div className="relative">
  //               <div className="absolute inset-y-0 left-0 pl-4 xl:pl-5 flex items-center pointer-events-none">
  //                 <Mail className={`h-6 w-6 xl:h-7 xl:w-7 transition-colors duration-200 ${focusedField === 'email' ? 'text-emerald-600' : 'text-gray-400'
  //                   }`} />
  //               </div>
  //               <input
  //                 type="email"
  //                 name="email"
  //                 value={formData.email}
  //                 onChange={handleInputChange}
  //                 onFocus={() => setFocusedField('email')}
  //                 onBlur={() => setFocusedField('')}
  //                 className={`w-full pl-12 xl:pl-14 pr-4 xl:pr-6 py-4 xl:py-5 border rounded-xl xl:rounded-2xl text-base xl:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 ${focusedField === 'email' ? 'border-emerald-500 shadow-lg' : 'border-gray-300'
  //                   }`}
  //                 placeholder="Enter your email"
  //                 required
  //               />
  //             </div>
  //           </div>

  //           {/* Phone and Gender Fields */}
  //           <div className="grid grid-cols-2 mt-4 gap-4 xl:gap-6">
  //             <div className="relative">
  //               <label className="block text-base xl:text-lg font-medium text-gray-700 mb-3">
  //                 Phone Number <span className="text-gray-400 text-sm">(Optional)</span>
  //               </label>
  //               <div className="relative">
  //                 <div className="absolute inset-y-0 left-0 pl-4 xl:pl-5 flex items-center pointer-events-none">
  //                   <Phone className={`h-6 w-6 xl:h-7 xl:w-7 transition-colors duration-200 ${focusedField === 'phone' ? 'text-emerald-600' : 'text-gray-400'
  //                     }`} />
  //                 </div>
  //                 <input
  //                   type="tel"
  //                   name="phone"
  //                   value={formData.phone}
  //                   onChange={handleInputChange}
  //                   onFocus={() => setFocusedField('phone')}
  //                   onBlur={() => setFocusedField('')}
  //                   className={`w-full pl-12 xl:pl-14 pr-4 xl:pr-6 py-4 xl:py-5 border rounded-xl xl:rounded-2xl text-base xl:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 ${focusedField === 'phone' ? 'border-emerald-500 shadow-lg' : 'border-gray-300'
  //                     }`}
  //                   placeholder="Phone number"
  //                 />
  //               </div>
  //             </div>

  //             <div className="relative">
  //               <label className="block text-base xl:text-lg font-medium text-gray-700 mb-3">
  //                 Gender <span className="text-gray-400 text-sm">(Optional)</span>
  //               </label>
  //               <div className="relative">
  //                 <select
  //                   name="gender"
  //                   value={formData.gender}
  //                   onChange={handleInputChange}
  //                   onFocus={() => setFocusedField('gender')}
  //                   onBlur={() => setFocusedField('')}
  //                   className={`w-full px-4 xl:px-6 py-4 xl:py-5 border rounded-xl xl:rounded-2xl text-base xl:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 ${focusedField === 'gender' ? 'border-emerald-500 shadow-lg' : 'border-gray-300'
  //                     }`}
  //                 >
  //                   <option value="">Select gender</option>
  //                   <option value="male">Male</option>
  //                   <option value="female">Female</option>
  //                   <option value="other">Other</option>
  //                   <option value="prefer-not-to-say">Prefer not to say</option>
  //                 </select>
  //               </div>
  //             </div>
  //           </div>

  //           {/* Password Field */}
  //           <div className="relative mt-4">
  //             <label className="block text-base xl:text-lg font-medium text-gray-700 mb-3">
  //               Password
  //             </label>
  //             <div className="relative">
  //               <div className="absolute inset-y-0 left-0 pl-4 xl:pl-5 flex items-center pointer-events-none">
  //                 <Lock className={`h-6 w-6 xl:h-7 xl:w-7 transition-colors duration-200 ${focusedField === 'password' ? 'text-emerald-600' : 'text-gray-400'
  //                   }`} />
  //               </div>
  //               <input
  //                 type={showPassword ? 'text' : 'password'}
  //                 name="password"
  //                 value={formData.password}
  //                 onChange={handleInputChange}
  //                 onFocus={() => setFocusedField('password')}
  //                 onBlur={() => setFocusedField('')}
  //                 className={`w-full pl-12 xl:pl-14 pr-14 xl:pr-16 py-4 xl:py-5 border rounded-xl xl:rounded-2xl text-base xl:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 ${focusedField === 'password' ? 'border-emerald-500 shadow-lg' : 'border-gray-300'
  //                   }`}
  //                 placeholder="Create a password"
  //                 required
  //               />
  //               <button
  //                 type="button"
  //                 onClick={() => setShowPassword(!showPassword)}
  //                 className="absolute inset-y-0 right-0 pr-4 xl:pr-5 flex items-center text-gray-400 hover:text-emerald-600 transition-colors duration-200"
  //               >
  //                 {showPassword ? <EyeOff className="h-6 w-6 xl:h-7 xl:w-7" /> : <Eye className="h-6 w-6 xl:h-7 xl:w-7" />}
  //               </button>
  //             </div>

  //             {/* Password Strength Indicator */}
  //             {formData.password && (
  //               <div className="mt-3">
  //                 <div className="flex items-center space-x-2">
  //                   <div className="flex-1 bg-gray-200 rounded-full h-2">
  //                     <div
  //                       className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
  //                       style={{ width: `${(passwordStrength / 5) * 100}%` }}
  //                     ></div>
  //                   </div>
  //                   <span className={`text-sm font-medium ${passwordStrength <= 2 ? 'text-red-500' :
  //                       passwordStrength <= 3 ? 'text-yellow-500' :
  //                         passwordStrength <= 4 ? 'text-blue-500' : 'text-green-500'
  //                     }`}>
  //                     {getStrengthText()}
  //                   </span>
  //                 </div>
  //               </div>
  //             )}
  //           </div>

  //           {/* Confirm Password Field */}
  //           <div className="mt-4 relative">
  //             <label className="block text-base xl:text-lg font-medium text-gray-700 mb-3">
  //               Confirm Password
  //             </label>
  //             <div className="relative">
  //               <div className="absolute inset-y-0 left-0 pl-4 xl:pl-5 flex items-center pointer-events-none">
  //                 <Lock className={`h-6 w-6 xl:h-7 xl:w-7 transition-colors duration-200 ${focusedField === 'confirmPassword' ? 'text-emerald-600' : 'text-gray-400'
  //                   }`} />
  //               </div>
  //               <input
  //                 type={showConfirmPassword ? 'text' : 'password'}
  //                 name="confirmPassword"
  //                 value={formData.confirmPassword}
  //                 onChange={handleInputChange}
  //                 onFocus={() => setFocusedField('confirmPassword')}
  //                 onBlur={() => setFocusedField('')}
  //                 className={`w-full pl-12 xl:pl-14 pr-14 xl:pr-16 py-4 xl:py-5 border rounded-xl xl:rounded-2xl text-base xl:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 ${focusedField === 'confirmPassword' ? 'border-emerald-500 shadow-lg' : 'border-gray-300'
  //                   } ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300' : ''
  //                   }`}
  //                 placeholder="Confirm your password"
  //                 required
  //               />
  //               <button
  //                 type="button"
  //                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  //                 className="absolute inset-y-0 right-0 pr-4 xl:pr-5 flex items-center text-gray-400 hover:text-emerald-600 transition-colors duration-200"
  //               >
  //                 {showConfirmPassword ? <EyeOff className="h-6 w-6 xl:h-7 xl:w-7" /> : <Eye className="h-6 w-6 xl:h-7 xl:w-7" />}
  //               </button>
  //             </div>
  //             {formData.confirmPassword && formData.password !== formData.confirmPassword && (
  //               <p className="mt-2 text-sm text-red-500">Passwords don't match</p>
  //             )}
  //             {formData.confirmPassword && formData.password === formData.confirmPassword && (
  //               <div className="mt-2 flex items-center text-green-500">
  //                 <CheckCircle className="w-4 h-4 mr-2" />
  //                 <span className="text-sm">Passwords match</span>
  //               </div>
  //             )}
  //           </div>

  //           {/* Terms and Newsletter */}
  //           <div className="space-y-4 mt-4">
  //             <label className="flex items-start">
  //               <input
  //                 type="checkbox"
  //                 name="agreeTerms"
  //                 checked={formData.agreeTerms}
  //                 onChange={handleInputChange}
  //                 className="w-5 h-5 xl:w-6 xl:h-6 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded transition-colors duration-200 mt-1"
  //                 required
  //               />
  //               <span className="ml-3 text-base xl:text-lg text-gray-600">
  //                 I agree to the{' '}
  //                 <a href="#" className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors duration-200">
  //                   Terms of Service
  //                 </a>{' '}
  //                 and{' '}
  //                 <a href="#" className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors duration-200">
  //                   Privacy Policy
  //                 </a>
  //               </span>
  //             </label>

  //             {/* <label className="flex items-start">
  //               <input
  //                 type="checkbox"
  //                 name="agreeNewsletter"
  //                 checked={formData.agreeNewsletter}
  //                 onChange={handleInputChange}
  //                 className="w-5 h-5 xl:w-6 xl:h-6 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded transition-colors duration-200 mt-1"
  //               />
  //               <span className="ml-3 text-base xl:text-lg text-gray-600">
  //                 Send me updates about new courses and features
  //               </span>
  //             </label> */}
  //           </div>

  //           {/* Register Button */}
  //           <button
  //             type="submit"
  //             disabled={isLoading || !formData.agreeTerms || formData.password !== formData.confirmPassword}
  //             onClick={handleRegister}
  //             className={`mt-4 w-full py-4 xl:py-5 px-6 rounded-xl xl:rounded-2xl text-lg xl:text-xl font-medium transition-all duration-200 transform ${isLoading || !formData.agreeTerms || formData.password !== formData.confirmPassword
  //                 ? 'bg-gray-400 cursor-not-allowed'
  //                 : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
  //               } text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`}
  //           >
  //             {isLoading ? (
  //               <div className="flex items-center justify-center">
  //                 <div className="animate-spin rounded-full h-6 w-6 xl:h-7 xl:w-7 border-b-2 border-white mr-3"></div>
  //                 Creating Account...
  //               </div>
  //             ) : (
  //               'Create Account'
  //             )}
  //           </button>
  //         </div>

  //         {/* Sign In Link */}
  //         <div className="text-center mt-4">
  //           <p className="text-gray-600 text-base xl:text-lg">
  //             Already have an account?{' '}
  //             <a href="#" className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors duration-200">
  //               Sign in here
  //             </a>
  //           </p>
  //         </div>

  //         {/* Divider */}
  //         <div className="relative mt-4">
  //           <div className="absolute inset-0 flex items-center">
  //             <div className="w-full border-t border-gray-300"></div>
  //           </div>
  //           <div className="relative flex justify-center text-base xl:text-lg">
  //             <span className="px-6 bg-white text-gray-500">Or register with</span>
  //           </div>
  //         </div>

  //         {/* Social Registration Buttons */}
  //         <div className="mt-4 mb-4 grid grid-cols-2 gap-6">
  //           <button className="flex items-center justify-center px-6 py-4 xl:py-5 border border-gray-300 rounded-xl xl:rounded-2xl hover:border-gray-400 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 text-base xl:text-lg font-medium">
  //             <svg className="w-6 h-6 xl:w-7 xl:h-7 mr-3" viewBox="0 0 24 24">
  //               <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
  //               <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
  //               <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
  //               <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  //             </svg>
  //             Google
  //           </button>
  //           <button className="flex items-center justify-center px-6 py-4 xl:py-5 border border-gray-300 rounded-xl xl:rounded-2xl hover:border-gray-400 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 text-base xl:text-lg font-medium">
  //             <svg className="w-6 h-6 xl:w-7 xl:h-7 mr-3" fill="currentColor" viewBox="0 0 24 24">
  //               <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.748.097.118.112.223.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.691-1.378l-.731 2.725c-.265 1.026-1.016 2.324-1.527 3.117 1.154.357 2.389.551 3.68.551 6.621 0 11.988-5.367 11.988-11.987C24.005 5.367 18.637.001 12.017.001z" />
  //             </svg>
  //             Microsoft
  //           </button>
  //         </div>
  //       </div>
  //     </div>

  //     <style jsx>{`
  //       @keyframes fade-in-up {
  //         from {
  //           opacity: 0;
  //           transform: translateY(20px);
  //         }
  //         to {
  //           opacity: 1;
  //           transform: translateY(0);
  //         }
  //       }

  //       @keyframes float {
  //         0%, 100% {
  //           transform: translateY(0px);
  //         }
  //         50% {
  //           transform: translateY(-10px);
  //         }
  //       }

  //       .animate-fade-in-up {
  //         animation: fade-in-up 0.6s ease-out;
  //       }

  //       .animate-float {
  //         animation: float 3s ease-in-out infinite;
  //       }
  //     `}</style>
  //   </div>
  // );



  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] flex overflow-hidden relative">
      {/* Animated background with COSMOS colors */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,75,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(162,0,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF4B00] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#a200ff] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />

      {/* Left Side - Enhanced Animation Area */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1a0a14] via-[#0f0a1a] to-[#0a0a0a] relative overflow-hidden xl:rounded-2xl border-r border-white/5"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
          e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
        }}
        style={{
          '--mouse-x': '50%',
          '--mouse-y': '50%',
        }}
      >
        {/* Dynamic mouse-following gradient */}
        <div
          className="absolute inset-0 opacity-40 transition-all duration-500 ease-out"
          style={{
            background: 'radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(255,75,0,0.15), rgba(162,0,255,0.1), transparent 70%)'
          }}
        />

        {/* Enhanced animated background elements */}
        <div className="absolute inset-0">
          {/* Floating particles */}
          {Array.from({ length: 20 }, (_, i) => (
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
                className={`w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-[#FF4B00]' :
                    i % 3 === 1 ? 'bg-[#a200ff]' :
                      'bg-cyan-400'
                  }`}
              />
            </div>
          ))}

          {/* Glowing orbs */}
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-[#FF4B00]/20 to-[#a200ff]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-32 right-20 w-56 h-56 bg-gradient-to-r from-[#a200ff]/20 to-cyan-500/20 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '5s' }} />
          <div className="absolute top-1/2 left-10 w-32 h-32 bg-gradient-to-r from-[#FF4B00]/30 to-orange-500/20 rounded-full blur-2xl animate-ping" style={{ animationDuration: '6s' }} />

          {/* Geometric shapes */}
          <div className="absolute top-1/4 right-1/4 w-20 h-20 border-2 border-[#FF4B00]/30 rotate-45 animate-spin" style={{ animationDuration: '10s' }} />
          <div className="absolute bottom-1/4 left-1/4 w-16 h-16 border-2 border-[#a200ff]/30 rounded-full animate-pulse" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center mx-auto items-center text-white p-12 xl:p-16 2xl:p-20 text-center max-w-2xl">
          {/* Logo/Brand Area */}
          <div className="mb-16 transform hover:scale-105 transition-all duration-700 group">
            <div className="flex items-center justify-center mb-8 relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B00] to-[#a200ff] rounded-3xl blur-2xl opacity-60 animate-pulse" />
                <div className="relative bg-gradient-to-br from-[#1a0a14] to-[#0f0a1a] rounded-3xl p-6 border-2 border-white/10 backdrop-blur-xl shadow-2xl">
                  <Brain className="w-20 h-20 xl:w-24 xl:h-24 text-[#FF4B00] animate-pulse" style={{ filter: 'drop-shadow(0 0 20px rgba(255,75,0,0.5))' }} />
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-[#FF4B00] to-[#a200ff] rounded-full animate-bounce flex items-center justify-center shadow-lg shadow-[#FF4B00]/50">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-6xl xl:text-7xl 2xl:text-8xl font-black mb-4 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF4B00] via-[#a200ff] to-cyan-400 animate-gradient">
                COSMOS-ITS
              </span>
            </h1>
            <p className="text-gray-300 text-xl xl:text-2xl font-semibold tracking-wide mb-4">Join the Future of Learning</p>

            <div className="relative w-32 h-1 mx-auto overflow-hidden rounded-full bg-white/10">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B00] via-[#a200ff] to-cyan-400 animate-shimmer" />
            </div>
          </div>

          {/* Registration Benefits */}
          <div className="space-y-10 max-w-lg xl:max-w-xl">
            {[
              {
                icon: Users,
                title: "Join 10,000+ Learners",
                desc: "Connect with a global learning community",
                gradient: "from-[#FF4B00]/30 to-orange-500/30",
                iconColor: "text-[#FF4B00]",
                delay: "0.5s"
              },
              {
                icon: Trophy,
                title: "Earn Certificates",
                desc: "Get verified certificates for your achievements",
                gradient: "from-[#a200ff]/30 to-purple-500/30",
                iconColor: "text-[#a200ff]",
                delay: "1s"
              },
              {
                icon: Shield,
                title: "Free Forever",
                desc: "Start learning with our free tier, upgrade anytime",
                gradient: "from-cyan-500/30 to-blue-500/30",
                iconColor: "text-cyan-400",
                delay: "1.5s"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-6 opacity-0 animate-fade-in-up group hover:scale-105 transition-all duration-500 cursor-pointer"
                style={{ animationDelay: feature.delay, animationFillMode: 'forwards' }}
              >
                <div className="relative flex-shrink-0">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100`} />
                  <div className="relative w-20 h-20 xl:w-24 xl:h-24 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 group-hover:border-white/30 transition-all duration-500 shadow-xl">
                    <feature.icon className={`w-10 h-10 xl:w-12 xl:h-12 ${feature.iconColor} group-hover:scale-110 transition-transform duration-500`} />
                  </div>
                </div>

                <div className="flex-1 text-left pt-2">
                  <h3 className="font-bold text-xl xl:text-2xl text-white mb-2 group-hover:text-[#FF4B00] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-base xl:text-lg leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Elements */}
          <div className="absolute top-1/4 right-16 animate-float">
            <Star className="w-8 h-8 text-[#FF4B00] opacity-60" style={{ filter: 'drop-shadow(0 0 10px rgba(255,75,0,0.5))' }} />
          </div>
          <div className="absolute bottom-1/3 left-1/4 animate-float" style={{ animationDelay: '1.5s' }}>
            <Sparkles className="w-7 h-7 text-[#a200ff] opacity-60" style={{ filter: 'drop-shadow(0 0 10px rgba(162,0,255,0.5))' }} />
          </div>
          <div className="absolute top-2/3 right-1/3 animate-float" style={{ animationDelay: '2.5s' }}>
            <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-60 shadow-lg shadow-cyan-400/50" />
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 xl:bg-transparent relative overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />

        <div className="w-full max-w-2xl space-y-6 relative z-10 my-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B00] to-[#a200ff] rounded-2xl blur-xl opacity-60 animate-pulse" />
                <div className="relative bg-gradient-to-br from-[#1a0a14] to-[#0f0a1a] rounded-2xl p-4 border border-white/20">
                  <Brain className="w-14 h-14 text-[#FF4B00] animate-pulse" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#FF4B00] to-[#a200ff]">
              COSMOS-ITS
            </h1>
            <p className="text-gray-400 mt-2">AI-Powered Learning Platform</p>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-6">
            <h2 className="text-4xl xl:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-3">
              Create Account
            </h2>
            <p className="text-gray-400 text-lg xl:text-xl">Start your intelligent learning journey today</p>

            <div className="relative w-20 h-1 mx-auto mt-4 overflow-hidden rounded-full bg-white/10">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF4B00] to-[#a200ff] animate-shimmer" />
            </div>
          </div>

          {/* Registration Form */}
          <div className="backdrop-blur-2xl bg-white/[0.03] rounded-3xl p-6 md:p-8 xl:p-10 border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-500">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl backdrop-blur-sm animate-shake">
                <p className="text-red-400 text-sm text-center font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              {/* User Type Selection */}
              {/* <div className="relative">
                <label className="block text-base xl:text-lg font-bold text-gray-300 mb-3 ml-1">
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
                <label className="block text-base xl:text-lg font-bold text-gray-300 mb-3 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${focusedField === 'firstName'
                      ? 'bg-gradient-to-r from-[#FF4B00]/20 to-[#a200ff]/20 blur-xl'
                      : 'bg-transparent'
                    }`} />
                  <div className="absolute inset-y-0 left-0 pl-4 xl:pl-5 flex items-center pointer-events-none z-10">
                    <User className={`h-6 w-6 xl:h-7 xl:w-7 transition-all duration-300 ${focusedField === 'firstName' ? 'text-[#FF4B00] scale-110' : 'text-gray-500'
                      }`} />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('firstName')}
                    onBlur={() => setFocusedField('')}
                    className={`relative w-full pl-12 xl:pl-14 pr-4 xl:pr-6 py-4 xl:py-5 bg-white/5 border backdrop-blur-xl rounded-2xl outline-none transition-all duration-300 text-white placeholder-gray-500 font-medium text-base xl:text-lg ${focusedField === 'firstName'
                        ? 'border-[#FF4B00]/50 shadow-lg shadow-[#FF4B00]/10 bg-white/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                      }`}
                    placeholder="Full name"
                    required
                  />
                </div>
              </div>

              {/* <div className="relative group">
                  <label className="block text-base xl:text-lg font-bold text-gray-300 mb-3 ml-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                      focusedField === 'lastName'
                        ? 'bg-gradient-to-r from-[#FF4B00]/20 to-[#a200ff]/20 blur-xl'
                        : 'bg-transparent'
                    }`} />
                    <div className="absolute inset-y-0 left-0 pl-4 xl:pl-5 flex items-center pointer-events-none z-10">
                      <User className={`h-6 w-6 xl:h-7 xl:w-7 transition-all duration-300 ${
                        focusedField === 'lastName' ? 'text-[#FF4B00] scale-110' : 'text-gray-500'
                      }`} />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField('')}
                      className={`relative w-full pl-12 xl:pl-14 pr-4 xl:pr-6 py-4 xl:py-5 bg-white/5 border backdrop-blur-xl rounded-2xl outline-none transition-all duration-300 text-white placeholder-gray-500 font-medium text-base xl:text-lg ${
                        focusedField === 'lastName'
                          ? 'border-[#FF4B00]/50 shadow-lg shadow-[#FF4B00]/10 bg-white/10'
                          : 'border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                      }`}
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div> */}
              {/* </div> */}

              {/* Email Field */}
              <div className="relative group">
                <label className="block text-base xl:text-lg font-bold text-gray-300 mb-3 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${focusedField === 'email'
                      ? 'bg-gradient-to-r from-[#FF4B00]/20 to-[#a200ff]/20 blur-xl'
                      : 'bg-transparent'
                    }`} />
                  <div className="absolute inset-y-0 left-0 pl-4 xl:pl-5 flex items-center pointer-events-none z-10">
                    <Mail className={`h-6 w-6 xl:h-7 xl:w-7 transition-all duration-300 ${focusedField === 'email' ? 'text-[#FF4B00] scale-110' : 'text-gray-500'
                      }`} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className={`relative w-full pl-12 xl:pl-14 pr-4 xl:pr-6 py-4 xl:py-5 bg-white/5 border backdrop-blur-xl rounded-2xl outline-none transition-all duration-300 text-white placeholder-gray-500 font-medium text-base xl:text-lg ${focusedField === 'email'
                        ? 'border-[#FF4B00]/50 shadow-lg shadow-[#FF4B00]/10 bg-white/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                      }`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Phone and Gender Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6">
                <div className="relative group">
                  <label className="block text-base xl:text-lg font-bold text-gray-300 mb-3 ml-1">
                    Phone <span className="text-gray-500 text-sm">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${focusedField === 'phone'
                        ? 'bg-gradient-to-r from-[#a200ff]/20 to-cyan-500/20 blur-xl'
                        : 'bg-transparent'
                      }`} />
                    <div className="absolute inset-y-0 left-0 pl-4 xl:pl-5 flex items-center pointer-events-none z-10">
                      <Phone className={`h-6 w-6 xl:h-7 xl:w-7 transition-all duration-300 ${focusedField === 'phone' ? 'text-[#a200ff] scale-110' : 'text-gray-500'
                        }`} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField('')}
                      className={`relative w-full pl-12 xl:pl-14 pr-4 xl:pr-6 py-4 xl:py-5 bg-white/5 border backdrop-blur-xl rounded-2xl outline-none transition-all duration-300 text-white placeholder-gray-500 font-medium text-base xl:text-lg ${focusedField === 'phone'
                          ? 'border-[#a200ff]/50 shadow-lg shadow-[#a200ff]/10 bg-white/10'
                          : 'border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                        }`}
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-base xl:text-lg font-bold text-gray-300 mb-3 ml-1">
                    Gender <span className="text-gray-500 text-sm">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${focusedField === 'gender'
                        ? 'bg-gradient-to-r from-[#a200ff]/20 to-cyan-500/20 blur-xl'
                        : 'bg-transparent'
                      }`} />
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('gender')}
                      onBlur={() => setFocusedField('')}
                      className={`relative w-full px-4 xl:px-6 py-4 xl:py-5 bg-white/5 border backdrop-blur-xl rounded-2xl outline-none transition-all duration-300 text-white font-medium text-base xl:text-lg ${focusedField === 'gender'
                          ? 'border-[#a200ff]/50 shadow-lg shadow-[#a200ff]/10 bg-white/10'
                          : 'border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                        }`}
                    >
                      <option value="" className="bg-[#1a1a1a]">Select gender</option>
                      <option value="male" className="bg-[#1a1a1a]">Male</option>
                      <option value="female" className="bg-[#1a1a1a]">Female</option>
                      <option value="other" className="bg-[#1a1a1a]">Other</option>
                      <option value="prefer-not-to-say" className="bg-[#1a1a1a]">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="relative group">
                <label className="block text-base xl:text-lg font-bold text-gray-300 mb-3 ml-1">
                  Password
                </label>
                <div className="relative">
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${focusedField === 'password'
                      ? 'bg-gradient-to-r from-[#a200ff]/20 to-[#FF4B00]/20 blur-xl'
                      : 'bg-transparent'
                    }`} />
                  <div className="absolute inset-y-0 left-0 pl-4 xl:pl-5 flex items-center pointer-events-none z-10">
                    <Lock className={`h-6 w-6 xl:h-7 xl:w-7 transition-all duration-300 ${focusedField === 'password' ? 'text-[#a200ff] scale-110' : 'text-gray-500'
                      }`} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className={`relative w-full pl-12 xl:pl-14 pr-14 xl:pr-16 py-4 xl:py-5 bg-white/5 border backdrop-blur-xl rounded-2xl outline-none transition-all duration-300 text-white placeholder-gray-500 font-medium text-base xl:text-lg ${focusedField === 'password'
                        ? 'border-[#a200ff]/50 shadow-lg shadow-[#a200ff]/10 bg-white/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                      }`}
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 xl:pr-5 flex items-center text-gray-500 hover:text-[#a200ff] transition-all duration-300 z-10 hover:scale-110"
                  >
                    {showPassword ? <EyeOff className="h-6 w-6 xl:h-7 xl:w-7" /> : <Eye className="h-6 w-6 xl:h-7 xl:w-7" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-white/10 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${passwordStrength <= 2 ? 'text-red-400' :
                          passwordStrength <= 3 ? 'text-yellow-400' :
                            passwordStrength <= 4 ? 'text-blue-400' : 'text-green-400'
                        }`}>
                        {getStrengthText()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="relative group">
                <label className="block text-base xl:text-lg font-bold text-gray-300 mb-3 ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${focusedField === 'confirmPassword'
                      ? 'bg-gradient-to-r from-[#a200ff]/20 to-[#FF4B00]/20 blur-xl'
                      : 'bg-transparent'
                    }`} />
                  <div className="absolute inset-y-0 left-0 pl-4 xl:pl-5 flex items-center pointer-events-none z-10">
                    <Lock className={`h-6 w-6 xl:h-7 xl:w-7 transition-all duration-300 ${focusedField === 'confirmPassword' ? 'text-[#a200ff] scale-110' : 'text-gray-500'
                      }`} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField('')}
                    className={`relative w-full pl-12 xl:pl-14 pr-14 xl:pr-16 py-4 xl:py-5 bg-white/5 border backdrop-blur-xl rounded-2xl outline-none transition-all duration-300 text-white placeholder-gray-500 font-medium text-base xl:text-lg ${focusedField === 'confirmPassword'
                        ? 'border-[#a200ff]/50 shadow-lg shadow-[#a200ff]/10 bg-white/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                      } ${formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-red-500/50'
                        : ''
                      }`}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 xl:pr-5 flex items-center text-gray-500 hover:text-[#a200ff] transition-all duration-300 z-10 hover:scale-110"
                  >
                    {showConfirmPassword ? <EyeOff className="h-6 w-6 xl:h-7 xl:w-7" /> : <Eye className="h-6 w-6 xl:h-7 xl:w-7" />}
                  </button>
                </div>

                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-2 text-sm text-red-400 ml-1">Passwords don't match</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="mt-2 flex items-center text-green-400 ml-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Passwords match</span>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4 pt-2">
                <label className="flex items-start cursor-pointer group">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="w-5 h-5 xl:w-6 xl:h-6 text-[#FF4B00] focus:ring-[#FF4B00] focus:ring-offset-0 border-gray-600 bg-white/5 rounded-lg transition-all duration-300 cursor-pointer mt-0.5"
                    required
                  />
                  <span className="ml-3 text-base xl:text-lg text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    I agree to the{' '}
                    <a href="#" className="text-[#FF4B00] hover:text-[#a200ff] font-semibold transition-colors duration-300">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-[#FF4B00] hover:text-[#a200ff] font-semibold transition-colors duration-300">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading || !formData.agreeTerms || formData.password !== formData.confirmPassword}
                onClick={handleRegister}
                className={`relative w-full py-4 xl:py-5 px-6 rounded-2xl font-bold text-lg xl:text-xl transition-all duration-500 transform overflow-hidden group mt-6 ${isLoading || !formData.agreeTerms || formData.password !== formData.confirmPassword
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#FF4B00] via-[#a200ff] to-[#FF4B00] hover:shadow-2xl hover:shadow-[#FF4B00]/30 hover:-translate-y-1 active:translate-y-0 bg-[length:200%_100%] hover:bg-right'
                  } text-white shadow-xl shadow-[#FF4B00]/20`}
                style={{ transition: 'all 0.5s ease, background-position 0.8s ease' }}
              >
                {!isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
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
              <p className="text-gray-400 font-medium text-base xl:text-lg">
                Already have an account?{' '}
                <a
                  href="#"
                  className="text-[#FF4B00] hover:text-[#a200ff] font-bold transition-all duration-300 hover:underline"
                >
                  Sign in here
                </a>
              </p>
            </div>

            {/* Divider */}
            <div className="relative mt-8 mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-base xl:text-lg">
                <span className="px-6 py-2 bg-[#0a0a0a] backdrop-blur-xl rounded-full text-gray-400 border border-white/10 font-medium">
                  Or register with
                </span>
              </div>
            </div>

            {/* Social Registration Buttons */}
            <div className="grid grid-cols-2 gap-4 xl:gap-6">
              <button className="group flex items-center justify-center px-6 py-4 xl:py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-[#FF4B00]/50 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF4B00]/10 text-base xl:text-lg font-medium">
                <svg className="w-6 h-6 xl:w-7 xl:h-7 mr-3 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-white font-semibold">Google</span>
              </button>

              <button className="group flex items-center justify-center px-6 py-4 xl:py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-[#a200ff]/50 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[#a200ff]/10 text-base xl:text-lg font-medium">
                <svg className="w-6 h-6 xl:w-7 xl:h-7 mr-3 group-hover:scale-110 transition-transform duration-300" fill="white" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.748.097.118.112.223.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.691-1.378l-.731 2.725c-.265 1.026-1.016 2.324-1.527 3.117 1.154.357 2.389.551 3.68.551 6.621 0 11.988-5.367 11.988-11.987C24.005 5.367 18.637.001 12.017.001z" />
                </svg>
                <span className="text-white font-semibold">Microsoft</span>
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