import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FaRobot, FaChartLine, FaClipboardList, FaRoute, FaGraduationCap, FaQuestionCircle, FaPlay, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import HeroLottie from '../../../lottie/hero-lottie.json'
import Lottie from 'lottie-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const typewriterWords = ['Intelligently', 'Strategically'];
  const typeSpeed = 150;
  const deleteSpeed = 100;
  const pauseTime = 1000;

  // Typewriter effect
  React.useEffect(() => {
    const currentWord = typewriterWords[currentIndex];

    if (!isDeleting) {
      if (typewriterText.length < currentWord.length) {
        const timeout = setTimeout(() => {
          setTypewriterText(currentWord.slice(0, typewriterText.length + 1));
        }, typeSpeed);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
        return () => clearTimeout(timeout);
      }
    } else {
      if (typewriterText.length > 0) {
        const timeout = setTimeout(() => {
          setTypewriterText(typewriterText.slice(0, -1));
        }, deleteSpeed);
        return () => clearTimeout(timeout);
      } else {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % typewriterWords.length);
      }
    }
  }, [typewriterText, currentIndex, isDeleting, typewriterWords]);

  const slides = [
    // {
    //   title: "Master Programming",
    //   subtitle: "With AI-Powered Personalized Learning",
    //   description: "Experience the future of education with topic-specific AI agents, intelligent weakness prediction, and personalized study plans",
    //   features: ["Topic-wise AI Agents", "Weakness Prediction", "Smart Study Plans"],
    //   // gradient: "from-blue-600 via-purple-600 to-pink-600",
    //   gradient: "from-green-600 via-teal-600 to-cyan-600",
    //   icon: <FaRobot className="text-5xl" />,
    //   bgImage: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    //   lottieUrl: HeroLottie
    // },
    // {
    //   title: "Adaptive Learning",
    //   subtitle: "That Grows With You",
    //   description: "Our AI continuously adapts to your learning style, pace, and progress to ensure optimal knowledge retention",
    //   features: ["Customized Learning Paths", "Real-time Adjustments", "Performance Tracking"],
    //   gradient: "from-green-600 via-teal-600 to-cyan-600",
    //   icon: <FaChartLine className="text-5xl" />,
    //   bgImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    //   lottieUrl: HeroLottie
    // },
    {
      title: "Collaborative Success",
      subtitle: "With AI-Powered Personalized Learning",
      description: "Experience the future of education with topic-specific AI agents, intelligent weakness prediction, and personalized study plans",
      features: ["Study Groups", "Peer Support", "Shared Insights"],
      // gradient: "from-green-600 via-teal-600 to-cyan-600",
      gradient: "from-amber-600 via-yellow-700 to-orange-800",
      icon: <FaGraduationCap className="text-5xl" />,
      bgImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      lottieUrl: HeroLottie
    }
  ];

  // Auto-play functionality
  // useEffect(() => {
  //   if (!isAutoPlaying) return;

  //   const interval = setInterval(() => {
  //     setDirection(-1);
  //     setCurrentSlide((prev) => (prev + 1) % slides.length);
  //   }, 3500);

  //   return () => clearInterval(interval);
  // }, [isAutoPlaying, slides.length]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      rotateY: direction > 0 ? 15 : -15
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        x: { type: "spring", stiffness: 200, damping: 25, duration: 0.8 },
        opacity: { duration: 0.6, delay: 0.2 },
        scale: { duration: 0.6, delay: 0.1 },
        rotateY: { duration: 0.6, delay: 0.1 }
      }
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      rotateY: direction < 0 ? 15 : -15,
      transition: {
        x: { type: "spring", stiffness: 200, damping: 25, duration: 0.6 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
        rotateY: { duration: 0.4 }
      }
    })
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const backgroundVariants = {
    enter: { opacity: 0, scale: 1.1 },
    center: {
      opacity: 0.2,
      scale: 1,
      transition: { duration: 1, ease: "easeInOut" }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  return (
    <section className="hero-section relative overflow-hidden min-h-screen w-full">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Carousel Container - Full Width */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full h-full flex items-center justify-center relative"
            style={{ perspective: '1000px' }}
          >
            {/* Background Image for Current Slide */}
            <AnimatePresence mode="wait">
              <div
                key={`bg-${currentSlide}`}
                variants={backgroundVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${slides[currentSlide].bgImage})`,
                  filter: 'blur(2px) brightness(0.3)'
                }}
              />
            </AnimatePresence>

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].gradient} opacity-30 transition-all duration-1000 ease-in-out`} />

            <div className="mt-30 md:mt-0 w-full mx-38 px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

                {/* Left Content */}
                <div
                  className="flex-1 text-center lg:text-left max-w-2xl lg:max-w-none"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  key={`content-${currentSlide}`}
                >
                  {/* Title */}
                  <h1
                    className="mb-6 w-full"
                    variants={textVariants}
                  >
                    <span className="md:hero-title-main block text-3xl md:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 leading-tight">

                      <span>Learn </span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-400">
                        {typewriterText}
                      </span>
                      {/* <span className="inline-block w-1 md:h-12 bg-orange-500 ml-1 animate-pulse"></span> */}
                      {/* <div>With COSMOS-ITS</div> */}
                    </span>
                    <span className="md:hero-title-sub block md:text-lg sm:text-xl lg:text-2xl xl:text-3xl font-medium text-blue-200 leading-relaxed">
                      {slides[currentSlide].subtitle}
                    </span>
                  </h1>

                  {/* Description */}
                  <p
                    className="text-sm md:text-base sm:text-lg lg:text-xl text-gray-300 mb-8 lg:mb-10 leading-relaxed"
                    variants={textVariants}
                  >
                    {slides[currentSlide].description}
                  </p>

                 

                  {/* CTA Buttons */}
                  <div
                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                    variants={textVariants}
                  >
                    <Link to={'/login'}>
                      <button
                        className="w-full cursor-pointer btn-bg-primary text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center group"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaPlay className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                        Start Learning Now
                      </button>
                    </Link>
                    <Link to={'/login'}>
                    <button
                      className="cursor-pointer border-2 border-white/30 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center group"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Learn More
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                    </Link>
                  </div>
                </div>

                {/* Right Visual Element - Lottie Animation */}
                <div
                  className="flex-1 flex justify-center lg:justify-end"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  key={`visual-${currentSlide}`}
                >
                  <div className="relative">
                    {/* Lottie Animation Container */}
                    <div
                      className="w-80 h-80 lg:w-96 lg:h-96 relative"
                      variants={textVariants}
                    >
                      {/* <iframe
                        src={slides[currentSlide].lottieUrl}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                        title={`${slides[currentSlide].title} Animation`}
                      /> */}

                      <div className='w-70 md:w-full justify-center items-center mx-auto'>
                        <Lottie animationData={slides[currentSlide].lottieUrl} loop={true} />
                      </div>
                    </div>

                    {/* Fallback Gradient Orb */}
                    <div
                      className={`absolute inset-0 w-80 h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-r ${slides[currentSlide].gradient} opacity-20 blur-3xl animate-pulse`}
                      variants={textVariants}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroSection; 