// import React, { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock, Brain, BookOpen, Zap, Sparkles, Star, ArrowRight } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { UserAuth } from '../../context/AuthContext';

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [focusedField, setFocusedField] = useState('');
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [error, setError] = useState(null);
  
//   const { signInUser } = UserAuth();
//   const navigate = useNavigate();

//   const handleMouseMove = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setMousePosition({
//       x: ((e.clientX - rect.left) / rect.width) * 100,
//       y: ((e.clientY - rect.top) / rect.height) * 100
//     });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       const result = await signInUser(email, password);

//       if (result.success) {
//         // Print auth token and user info for debugging
//         const token = localStorage.getItem('authToken');
//         const user = localStorage.getItem('user');
        
//         console.log('✅ Login Successful!');
//         console.log('🔑 Auth Token:', token);
//         console.log('👤 User Info:', JSON.parse(user || '{}'));
//         console.log('📋 Full Result:', result);
        
//         // Successfully signed in, navigate to dashboard
//         navigate("/dashboard");
//       } else {
//         // Sign-in failed, show error message
//         setError(result.error || "Failed to sign in. Please try again.");
        
//         // Clear error message after 3 seconds
//         setTimeout(() => {
//           setError(null);
//         }, 3000);
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("An unexpected error occurred. Please try again.");
      
//       // Clear error message after 3 seconds
//       setTimeout(() => {
//         setError(null);
//       }, 3000);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Floating particles animation
//   const particles = Array.from({ length: 20 }, (_, i) => (
//     <div
//       key={i}
//       className="absolute animate-float opacity-30"
//       style={{
//         left: `${Math.random() * 100}%`,
//         top: `${Math.random() * 100}%`,
//         animationDelay: `${Math.random() * 5}s`,
//         animationDuration: `${3 + Math.random() * 4}s`
//       }}
//     >
//       <div className={`w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-yellow-300' : i % 3 === 1 ? 'bg-pink-300' : 'bg-blue-300'
//         }`} />
//     </div>
//   ));

//   return (
//     <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex overflow-hidden relative">
//       {/* Animated background grid */}
//       <div className="absolute inset-0 opacity-20">
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(139,69,193,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,69,193,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
//       </div>

//       {/* Left Side - Enhanced Animation Area */}
//       <div
//         className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 relative overflow-hidden"
//         onMouseMove={handleMouseMove}
//       >
//         {/* Dynamic mouse-following gradient */}
//         <div
//           className="absolute inset-0 opacity-30 transition-all duration-300 ease-out"
//           style={{
//             background: `radial-gradient(400px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.1), transparent 70%)`
//           }}
//         />

//         {/* Enhanced animated background elements */}
//         <div className="absolute inset-0">
//           {particles}
//           <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
//           <div className="absolute bottom-32 right-20 w-48 h-48 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s' }} />
//           <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-lg animate-ping" style={{ animationDuration: '5s' }} />

//           {/* Geometric shapes */}
//           <div className="absolute top-1/4 right-1/4 w-16 h-16 border border-white/20 rotate-45 animate-spin" style={{ animationDuration: '8s' }} />
//           <div className="absolute bottom-1/4 left-1/4 w-12 h-12 border-2 border-purple-300/30 rounded-full animate-pulse" />
//         </div>

//         {/* Enhanced Content */}
//         <div className="relative z-10 flex flex-col justify-center mx-auto items-center text-white p-12 text-center ">
//           {/* Enhanced Logo/Brand Area */}
//           <div className="mb-12 transform hover:scale-105 transition-all duration-500 group">
//             <div className="flex items-center justify-center mb-6 relative">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-lg opacity-50 animate-pulse" />
//                 <div className="relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
//                   <Brain className="w-16 h-16 text-white animate-pulse" />
//                   <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce flex items-center justify-center">
//                     <Sparkles className="w-5 h-5 text-white" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-3 tracking-wide">
//               COSMOS-ITS
//             </h1>
//             <p className="text-purple-100 text-xl font-medium tracking-wider">AI-Powered Learning Platform</p>
//             <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mt-4 animate-pulse" />
//           </div>

//           {/* Enhanced Animated Features */}
//           <div className="space-y-8 max-w-md">
//             {[
//               { icon: Brain, title: "Smart AI Tutoring", desc: "Personalized learning paths powered by AI", delay: "0.5s" },
//               { icon: BookOpen, title: "Adaptive Content", desc: "Content that adapts to your learning style", delay: "1s" },
//               { icon: Zap, title: "Real-time Feedback", desc: "Instant insights to accelerate learning", delay: "1.5s" }
//             ].map((feature, index) => (
//               <div
//                 key={index}
//                 className="flex items-center space-x-6 mb-10 opacity-0 animate-fade-in-up group hover:scale-105 transition-all duration-300"
//                 style={{ animationDelay: feature.delay, animationFillMode: 'forwards' }}
//               >
//                 <div className="relative">
//                   <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
//                   <div className="relative w-16 h-16 bg-gradient-to-br from-white/25 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:border-white/40 transition-all duration-300">
//                     <feature.icon className="w-8 h-8 text-white" />
//                   </div>
//                 </div>
//                 <div className="ml-5 text-left">
//                   <h3 className="font-bold text-xl text-white mb-1">{feature.title}</h3>
//                   <p className="text-purple-100 text-sm leading-relaxed">{feature.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Enhanced Floating Elements */}
//           <div className="absolute top-1/4 right-20 animate-float">
//             <Star className="w-6 h-6 text-yellow-300 opacity-70" />
//           </div>
//           <div className="absolute bottom-1/3 left-1/4 animate-float" style={{ animationDelay: '1s' }}>
//             <Sparkles className="w-5 h-5 text-pink-300 opacity-60" />
//           </div>
//           <div className="absolute top-3/4 right-1/3 animate-float" style={{ animationDelay: '2s' }}>
//             <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-70" />
//           </div>
//         </div>
//       </div>

//       {/* Right Side - Enhanced Login Form */}
//       <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative">
//         {/* Background decoration */}
//         <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />

//         <div className="w-full max-w-md space-y-8 relative z-10">
//           {/* Enhanced Mobile Logo */}
//           <div className="lg:hidden text-center mb-8">
//             <div className="flex items-center justify-center mb-4">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-50 animate-pulse" />
//                 <div className="relative bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-3">
//                   <Brain className="w-12 h-12 text-white animate-pulse" />
//                 </div>
//               </div>
//             </div>
//             <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">COSMOS-ITS</h1>
//             <p className="text-gray-300">AI-Powered Learning Platform</p>
//           </div>

//           {/* Enhanced Welcome Text */}
//           <div className="text-center">
//             <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 mb-3">
//               Welcome Back!
//             </h2>
//             <p className="text-gray-300 text-lg">Sign in to continue your learning journey</p>
//             <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mt-4" />
//           </div>

//           {/* Enhanced Login Form */}
//           <div className=" backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
//             {/* Error Message Display */}
//             {error && (
//               <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur-sm">
//                 <p className="text-red-200 text-sm text-center">{error}</p>
//               </div>
//             )}
            
//             <form onSubmit={handleLogin} className="space-y-6">
//               {/* Enhanced Email Field */}
//               <div className="relative group">
//                 <label className="block text-sm font-semibold text-gray-200 mb-3">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${focusedField === 'email'
//                     ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-sm'
//                     : 'bg-transparent'
//                     }`} />
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
//                     <Mail className={`h-5 w-5 transition-all duration-300 ${focusedField === 'email' ? 'text-purple-300 scale-110' : 'text-gray-400'
//                       }`} />
//                   </div>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     onFocus={() => setFocusedField('email')}
//                     onBlur={() => setFocusedField('')}
//                     className={`relative w-full pl-12 pr-4 py-4 bg-white/10 border backdrop-blur-sm rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-300 text-white placeholder-gray-400 ${focusedField === 'email'
//                       ? 'border-purple-400/50 shadow-lg shadow-purple-500/25 bg-white/15'
//                       : 'border-white/20 hover:border-white/30'
//                       }`}
//                     placeholder="Enter your email"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Enhanced Password Field */}
//               <div className="mt-4 relative group">
//                 <label className="block text-sm font-semibold text-gray-200 mb-3">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${focusedField === 'password'
//                     ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-sm'
//                     : 'bg-transparent'
//                     }`} />
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
//                     <Lock className={`h-5 w-5 transition-all duration-300 ${focusedField === 'password' ? 'text-purple-300 scale-110' : 'text-gray-400'
//                       }`} />
//                   </div>
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     onFocus={() => setFocusedField('password')}
//                     onBlur={() => setFocusedField('')}
//                     className={`relative w-full pl-12 pr-14 py-4 bg-white/10 border backdrop-blur-sm rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-300 text-white placeholder-gray-400 ${focusedField === 'password'
//                       ? 'border-purple-400/50 shadow-lg shadow-purple-500/25 bg-white/15'
//                       : 'border-white/20 hover:border-white/30'
//                       }`}
//                     placeholder="Enter your password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-300 transition-all duration-300 z-10 hover:scale-110"
//                   >
//                     {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                   </button>
//                 </div>
//               </div>

//               {/* Enhanced Remember Me & Forgot Password */}
//               <div className="mt-3 flex items-center justify-between">
//                 <label className="flex items-center group cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="w-5 h-5 text-purple-500 focus:ring-purple-400 border-gray-600 bg-white/10 rounded transition-all duration-300"
//                   />
//                   <span className="ml-3 text-sm text-gray-300 group-hover:text-white transition-colors duration-300">Remember me</span>
//                 </label>
//                 <a href="#" className="text-sm text-purple-300 hover:text-purple-100 font-medium transition-all duration-300 hover:underline">
//                   Forgot password?
//                 </a>
//               </div>

//               {/* Enhanced Login Button */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`mt-5 relative w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform overflow-hidden group ${isLoading
//                   ? 'bg-gray-600 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-500 hover:via-violet-500 hover:to-purple-600 hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-1 active:translate-y-0 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent'
//                   } text-white`}
//               >
//                 {!isLoading && (
//                   <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/20 to-purple-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//                 )}
//                 <div className="relative flex items-center justify-center">
//                   {isLoading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
//                       Signing In...
//                     </>
//                   ) : (
//                     <>
//                       Sign In
//                       <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
//                     </>
//                   )}
//                 </div>
//               </button>
//             </form>

//             {/* Enhanced Sign Up Link */}
//             <div className="text-center mt-6">
//               <p className="text-gray-300">
//                 Don't have an account?{' '}
//                 <a href="/register" className="text-purple-300 hover:text-purple-100 font-semibold transition-all duration-300 hover:underline">
//                   Sign up now
//                 </a>
//               </p>
//             </div>

//             {/* Enhanced Divider */}
//             <div className="relative mt-8">
              
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-4 bg-white/10 backdrop-blur-sm rounded-full text-gray-300 border border-white/20">
//                   Or continue with
//                 </span>
//               </div>
//             </div>

//             {/* Enhanced Social Login Buttons */}
//             <div className="grid grid-cols-2 gap-4 mt-6">
//               <button className="group flex items-center justify-center px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:border-white/40 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg">
//                 <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
//                   <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
//                   <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
//                   <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
//                   <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
//                 </svg>
//                 <span className="text-white font-medium">Google</span>
//               </button>
//               <button className="group flex items-center justify-center px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:border-white/40 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg">
//                 <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="white" viewBox="0 0 24 24">
//                   <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.748.097.118.112.223.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.691-1.378l-.731 2.725c-.265 1.026-1.016 2.324-1.527 3.117 1.154.357 2.389.551 3.68.551 6.621 0 11.988-5.367 11.988-11.987C24.005 5.367 18.637.001 12.017.001z" />
//                 </svg>
//                 <span className="text-white font-medium">Microsoft</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Custom Styles */}
//       <style jsx>{`
//         @keyframes fade-in-up {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes float {
//           0%, 100% {
//             transform: translateY(0px) rotate(0deg);
//           }
//           50% {
//             transform: translateY(-15px) rotate(5deg);
//           }
//         }

//         .animate-fade-in-up {
//           animation: fade-in-up 0.8s ease-out;
//         }

//         .animate-float {
//           animation: float 4s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Login;




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
          i % 3 === 0 ? 'bg-[#FF4B00]' : 
          i % 3 === 1 ? 'bg-[#a200ff]' : 
          'bg-cyan-400'
        }`} 
      />
    </div>
  ));

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] flex overflow-hidden relative">
      {/* Animated background with COSMOS colors */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,75,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(162,0,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Animated gradient orbs */}
      {/* <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF4B00] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#a200ff] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" /> */}

      {/* Left Side - Enhanced Animation Area */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1a0a14] via-[#0f0a1a] to-[#0a0a0a] relative overflow-hidden border-r border-white/5"
        onMouseMove={handleMouseMove}
      >
        {/* Dynamic mouse-following gradient with COSMOS colors */}
        <div
          className="absolute inset-0 opacity-40 transition-all duration-500 ease-out"
          style={{
            background: `radial-gradient(500px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,75,0,0.15), rgba(162,0,255,0.1), transparent 70%)`
          }}
        />

        {/* Enhanced animated background elements */}
        <div className="absolute inset-0">
          {particles}
          
          {/* Glowing orbs with COSMOS colors */}
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-[#FF4B00]/20 to-[#a200ff]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-32 right-20 w-56 h-56 bg-gradient-to-r from-[#a200ff]/20 to-cyan-500/20 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '5s' }} />
          <div className="absolute top-1/2 left-10 w-32 h-32 bg-gradient-to-r from-[#FF4B00]/30 to-orange-500/20 rounded-full blur-2xl animate-ping" style={{ animationDuration: '6s' }} />

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
                <div className="relative bg-gradient-to-br from-[#1a0a14] to-[#0f0a1a] rounded-3xl p-6 border-2 border-white/10 backdrop-blur-xl shadow-2xl">
                  <Brain className="w-20 h-20 text-[#FF4B00] animate-pulse" style={{ filter: 'drop-shadow(0 0 20px rgba(255,75,0,0.5))' }} />
                  
                 
                </div>
              </div>
            </div>
            
            {/* Brand name */}
            <h1 className="text-6xl font-black mb-4 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF4B00] via-[#a200ff] to-cyan-400 animate-gradient">
                COSMOS-ITS
              </span>
            </h1>
            <p className="text-gray-300 text-xl font-semibold tracking-wide mb-4">AI-Powered Learning Platform</p>
            
   
            
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
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Enhanced Mobile Logo */}
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

          {/* Enhanced Welcome Text */}
          <div className="text-center mb-8">
            <h2 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-4">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-lg">Continue your learning journey with COSMOS</p>
            
      
          </div>

          {/* Enhanced Login Form */}
          <div className="backdrop-blur-2xl bg-white/[0.03] rounded-3xl p-8 border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-500">
            {/* Error Message Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl backdrop-blur-sm animate-shake">
                <p className="text-red-400 text-sm text-center font-medium">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Enhanced Email Field */}
              <div className="relative group">
                <label className="block text-sm font-bold text-gray-300 mb-3 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  {/* Focus glow effect */}
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                    focusedField === 'email'
                      ? 'bg-gradient-to-r from-[#FF4B00]/20 to-[#a200ff]/20 blur-xl'
                      : 'bg-transparent'
                  }`} />
                  
                  {/* Icon */}
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                    <Mail className={`h-5 w-5 transition-all duration-300 ${
                      focusedField === 'email' ? 'text-[#FF4B00] scale-110' : 'text-gray-500'
                    }`} />
                  </div>
                  
                  {/* Input */}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className={`relative w-full pl-14 pr-5 py-4 bg-white/5 border backdrop-blur-xl rounded-2xl outline-none transition-all duration-300 text-white placeholder-gray-500 font-medium ${
                      focusedField === 'email'
                        ? 'border-[#FF4B00]/50 shadow-lg shadow-[#FF4B00]/10 bg-white/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Enhanced Password Field */}
              <div className="mt-4 relative group">
                <label className="block text-sm font-bold text-gray-300 mb-3 ml-1">
                  Password
                </label>
                <div className=" relative">
                  {/* Focus glow effect */}
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                    focusedField === 'password'
                      ? 'bg-gradient-to-r from-[#a200ff]/20 to-[#FF4B00]/20 blur-xl'
                      : 'bg-transparent'
                  }`} />
                  
                  {/* Icon */}
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                    <Lock className={`h-5 w-5 transition-all duration-300 ${
                      focusedField === 'password' ? 'text-[#a200ff] scale-110' : 'text-gray-500'
                    }`} />
                  </div>
                  
                  {/* Input */}
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className={`relative w-full pl-14 pr-14 py-4 bg-white/5 border backdrop-blur-xl rounded-2xl outline-none transition-all duration-300 text-white placeholder-gray-500 font-medium ${
                      focusedField === 'password'
                        ? 'border-[#a200ff]/50 shadow-lg shadow-[#a200ff]/10 bg-white/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                    }`}
                    placeholder="Enter your password"
                    required
                  />
                  
                  {/* Toggle password visibility */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-500 hover:text-[#a200ff] transition-all duration-300 z-10 hover:scale-110"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Enhanced Remember Me & Forgot Password */}
              {/* <div className="flex items-center justify-between pt-2">
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-[#FF4B00] focus:ring-[#FF4B00] focus:ring-offset-0 border-gray-600 bg-white/5 rounded-lg transition-all duration-300 cursor-pointer"
                  />
                  <span className="ml-3 text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-300 font-medium">
                    Remember me
                  </span>
                </label>
                <a 
                  href="#" 
                  className="text-sm text-[#a200ff] hover:text-[#FF4B00] font-semibold transition-all duration-300 hover:underline"
                >
                  Forgot password?
                </a>
              </div> */}

              {/* Enhanced Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`relative w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-500 transform overflow-hidden group mt-8 ${
                  isLoading
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-orange-600 hover:shadow-2xl hover:shadow-[#FF4B00]/30 hover:-translate-y-1 active:translate-y-0 bg-[length:200%_100%] hover:bg-right'
                } text-white shadow-xl shadow-[#FF4B00]/20`}
                style={{ transition: 'all 0.5s ease, background-position 0.8s ease' }}
              >
                {/* Shimmer effect */}
                {!isLoading && (
                  <div className="absolute inset-0 bg-orange-600 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
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
              <p className="text-gray-400 font-medium">
                Don't have an account?{' '}
                <a 
                  href="/register" 
                  className="text-[#FF4B00] hover:text-[#a200ff] font-bold transition-all duration-300 hover:underline"
                >
                  Sign up now
                </a>
              </p>
            </div>

            {/* Enhanced Divider */}
            <div className="relative mt-10 mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-6 py-2 bg-[#0a0a0a] backdrop-blur-xl rounded-full text-gray-400 border border-white/10 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Enhanced Social Login Buttons */}
            <div className="grid grid-cols-1 gap-4">
              <button className="group flex items-center justify-center px-5 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-[#FF4B00]/50 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF4B00]/10">
                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-white font-semibold">Google</span>
              </button>
              
              {/* <button className="group flex items-center justify-center px-5 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-[#a200ff]/50 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[#a200ff]/10">
                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" fill="white" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                </svg>
                <span className="text-white font-semibold">Microsoft</span>
              </button> */}
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