import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaComments,
    FaChartLine,
    FaRoute,
    FaCalendarAlt,
    FaArrowRight,
    FaGraduationCap,
    FaBrain,
    FaBook,
    FaBolt,
} from 'react-icons/fa';
import { UserAuth } from '../../context/AuthContext';
import { Context } from '../../context/Context';

/* ─── animation helpers ─────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: 'easeOut' },
});

/* ─── quick-action cards ─────────────────────────────────────── */
const QUICK_ACTIONS = [
    {
        id: 'chatbot',
        title: 'Ask COSMOS',
        description: 'Get instant answers, explanations, and previous exam questions from your AI professor.',
        href: '/cosmos-chatbot',
        icon: FaComments,
        cta: 'Open Chatbot',
    },
    {
        id: 'performance',
        title: 'Performance Tracking',
        description: 'Track your CT scores, assignment progress, and topic mastery for every enrolled course.',
        href: '/performance-tracking',
        icon: FaChartLine,
        cta: 'View Performance',
    },
    {
        id: 'roadmap',
        title: 'Learning Roadmap',
        description: 'Generate an interactive, AI-powered roadmap for any topic you want to master.',
        href: '/roadmap',
        icon: FaRoute,
        cta: 'Generate Roadmap',
    },
    {
        id: 'studyplan',
        title: 'Study Plan',
        description: 'Build and manage a structured study schedule tailored to your upcoming exams.',
        href: '/study-plan',
        icon: FaCalendarAlt,
        cta: 'Plan Studies',
    },
];

/* ─── feature highlights ─────────────────────────────────────── */
const FEATURES = [
    {
        icon: FaBrain,
        title: 'AI-Powered Agents',
        body: 'Specialized professors for DBMS, OOP, SPL, SE, and more — routed automatically based on your question.',
    },
    {
        icon: FaBook,
        title: 'Previous Exam Questions',
        body: 'Instantly retrieve past trimester questions with marks, PDF papers, and relevant diagrams.',
    },
    {
        icon: FaGraduationCap,
        title: 'Personalized Learning',
        body: 'Adaptive study plans and roadmaps built around your enrolled courses and performance data.',
    },
    {
        icon: FaBolt,
        title: 'Real-Time Chat',
        body: 'Thread-based conversations with full history — continue any session right where you left off.',
    },
];

/* ─── suggested prompts ─────────────────────────────────────── */
const SUGGESTED_PROMPTS = [
    'Give me 5 previous DBMS mid-exam questions on SQL',
    'Explain pointers in C with examples',
    'Create a roadmap for learning Machine Learning',
    'What are the weak topics in my current courses?',
    'Write a study plan for my upcoming finals',
    'Explain the difference between a process and a thread',
];

/* ═══════════════════════════════════════════════════════════════ */
const Dashboard = () => {
    const { user } = UserAuth();
    const { onSent, setInput } = useContext(Context);
    const navigate = useNavigate();

    const displayName = user?.email?.split('@')[0].replace(/\d+$/, '') || 'Student';

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const handlePrompt = (prompt) => {
        setInput(prompt);
        navigate('/cosmos-chatbot');
        setTimeout(() => onSent(prompt), 300);
    };

    /* ── card component ── */
    const ActionCard = ({ item, delay }) => {
        const Icon = item.icon;
        return (
            <motion.div
                {...fadeUp(delay)}
                onClick={() => navigate(item.href)}
                className="group bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-orange-400 hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 flex flex-col gap-4"
            >
                <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                        <Icon className="w-5 h-5 text-orange-500 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <FaArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <div>
                    <h3 className="text-base font-bold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
                <span className="mt-auto text-xs font-semibold text-orange-500 group-hover:underline">
                    {item.cta} →
                </span>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* ── Hero Greeting ── */}
                <motion.div {...fadeUp(0)} className="mb-10">
                    <p className="text-sm font-medium text-orange-500 mb-1 tracking-wide uppercase">
                        {getGreeting()}
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                        Welcome back,{' '}
                        <span className="text-orange-500 capitalize">{displayName}</span>
                    </h1>
                    <p className="text-gray-500 text-base max-w-xl">
                        COSMOS is ready to help you study smarter. Ask questions, track performance, or generate a learning roadmap.
                    </p>
                </motion.div>

                {/* ── Quick Actions ── */}
                <motion.h2 {...fadeUp(0.05)} className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                    Quick Actions
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {QUICK_ACTIONS.map((item, i) => (
                        <ActionCard key={item.id} item={item} delay={0.1 + i * 0.07} />
                    ))}
                </div>

                {/* ── Two-column: prompts + features ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">

                    {/* Suggested Prompts */}
                    <motion.div {...fadeUp(0.35)} className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <FaComments className="w-4 h-4 text-orange-500" />
                            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Try Asking</h2>
                        </div>
                        <ul className="space-y-2">
                            {SUGGESTED_PROMPTS.map((prompt, i) => (
                                <li key={i}>
                                    <button
                                        onClick={() => handlePrompt(prompt)}
                                        className="w-full text-left text-sm text-gray-600 px-4 py-2.5 rounded-xl bg-[#f9fafb] border border-gray-200 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 group"
                                    >
                                        <span className="text-orange-400 mr-2 group-hover:text-orange-500">›</span>
                                        {prompt}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Feature Highlights */}
                    <motion.div {...fadeUp(0.4)} className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <FaBolt className="w-4 h-4 text-orange-500" />
                            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">What COSMOS Can Do</h2>
                        </div>
                        <ul className="space-y-4">
                            {FEATURES.map((f, i) => {
                                const Icon = f.icon;
                                return (
                                    <li key={i} className="flex gap-4">
                                        <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0 mt-0.5">
                                            <Icon className="w-4 h-4 text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800 mb-0.5">{f.title}</p>
                                            <p className="text-xs text-gray-500 leading-relaxed">{f.body}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </motion.div>
                </div>

                {/* ── CTA Banner ── */}
                <motion.div
                    {...fadeUp(0.5)}
                    className="rounded-2xl bg-orange-500 px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                    <div>
                        <h3 className="text-white text-lg font-bold mb-1">Start a new conversation</h3>
                        <p className="text-orange-100 text-sm">Ask anything — your AI professors are ready.</p>
                    </div>
                    <button
                        onClick={() => navigate('/cosmos-chatbot')}
                        className="shrink-0 flex items-center gap-2 bg-white text-orange-500 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors duration-200 shadow-sm"
                    >
                        <FaComments className="w-4 h-4" />
                        Open Chatbot
                    </button>
                </motion.div>

            </div>
        </div>
    );
};

export default Dashboard;
