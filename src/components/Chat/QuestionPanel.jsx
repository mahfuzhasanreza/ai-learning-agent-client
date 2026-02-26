import React, { useState } from 'react';
import { X, FileText, Image as ImageIcon, ExternalLink, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from 'react-markdown';
import CodeBlock from '../CodeBlock/CodeBlock';

const QuestionCard = ({ question, index }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-300 overflow-hidden">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-300" />

            <div className="p-5 pt-6">
                {/* Header row */}
                <div className="flex items-start justify-between mb-3 gap-2">
                    <span className="text-sm font-bold text-orange-500 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full shrink-0">
                        Q{question.question_number}
                        {question.sub_question && question.sub_question !== '-' && (
                            <span className="lowercase">.{question.sub_question}</span>
                        )}
                    </span>
                    <div className="flex flex-wrap gap-2 justify-end">
                        {question.course_code && (
                            <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                                {question.course_code}
                            </span>
                        )}
                        {question.exam_type && (
                            <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-1 rounded-md uppercase">
                                {question.exam_type}
                            </span>
                        )}
                    </div>
                </div>

                {/* Course title */}
                {question.course_title && (
                    <p className="text-xs text-gray-500 mb-3 capitalize font-medium">
                        📚 {question.course_title}
                    </p>
                )}

                {/* Question text */}
                <div className="text-gray-800 text-sm leading-relaxed mb-4 question-markdown">
                    <Markdown
                        components={{
                            code(props) {
                                const { children, className, ...rest } = props;
                                const match = /language-(\w+)/.exec(className || '');
                                return match ? (
                                    <CodeBlock language={match[1]}>{children}</CodeBlock>
                                ) : (
                                    <code {...rest} className={`bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-xs font-mono border border-orange-100 ${className || ''}`}>
                                        {children}
                                    </code>
                                );
                            },
                            p({ children }) {
                                return <p className="mb-2 last:mb-0 whitespace-pre-line">{children}</p>;
                            }
                        }}
                    >
                        {question.question_text}
                    </Markdown>
                </div>

                {/* Image */}
                {question.has_image && question.image_url && question.image_url !== 'N/A' && !imgError && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-gray-200">
                        <img
                            src={question.image_url}
                            alt={`Question ${question.question_number} diagram`}
                            className="w-full h-auto"
                            style={{ maxHeight: '400px', objectFit: 'contain', background: '#f8f9fa' }}
                            onError={() => setImgError(true)}
                        />
                    </div>
                )}
                {question.has_image && question.image_url && question.image_url !== 'N/A' && imgError && (
                    <div className="mb-4 flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <ImageIcon className="w-4 h-4 text-gray-400 shrink-0" />
                        <a
                            href={question.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-orange-500 hover:underline flex items-center gap-1"
                        >
                            Open image in new tab <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                )}

                {/* Description */}
                {question.has_description && question.description_content && question.description_content !== 'N/A' && (
                    <div className="mb-4 p-3 bg-orange-50 rounded-xl border border-orange-200">
                        <p className="text-xs font-semibold text-orange-500 mb-1">Description</p>
                        <div className="text-xs text-gray-700 leading-relaxed">
                            <Markdown
                                components={{
                                    code(props) {
                                        const { children, className, ...rest } = props;
                                        const match = /language-(\w+)/.exec(className || '');
                                        return match ? (
                                            <CodeBlock language={match[1]}>{children}</CodeBlock>
                                        ) : (
                                            <code {...rest} className={`bg-orange-100 text-orange-600 px-1 py-0.5 rounded font-mono ${className || ''}`}>
                                                {children}
                                            </code>
                                        );
                                    },
                                    p({ children }) {
                                        return <p className="mb-1 last:mb-0 whitespace-pre-line">{children}</p>;
                                    }
                                }}
                            >
                                {question.description_content}
                            </Markdown>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex gap-3 items-center flex-wrap">
                        {question.marks && (
                            <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-md">
                                {question.marks} marks
                            </span>
                        )}
                        {question.semester_term && (
                            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                                Term: {question.semester_term}
                            </span>
                        )}
                    </div>
                    {question.pdf_url && question.pdf_url !== 'N/A' && (
                        <a
                            href={question.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 hover:border-red-600 px-3 py-1.5 rounded-lg transition-all duration-200"
                        >
                            <FileText className="w-3 h-3" />
                            PDF
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

const QuestionPanel = ({ isOpen, onClose, questions = [] }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        className="fixed top-0 right-0 h-full w-full sm:w-[580px] bg-white shadow-2xl z-50 flex flex-col"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-orange-50 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-gray-800">Retrieved Questions</h2>
                                    <p className="text-xs text-gray-500">{questions.length} question{questions.length !== 1 ? 's' : ''} found</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-orange-100 text-gray-500 hover:text-orange-600 transition-all duration-200"
                                aria-label="Close panel"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#fdba74 #fef3ec',
                            }}
                        >
                            {questions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                                    <BookOpen className="w-12 h-12 opacity-30" />
                                    <p className="text-sm">No questions available</p>
                                </div>
                            ) : (
                                questions.map((question, idx) => (
                                    <QuestionCard key={question.id || idx} question={question} index={idx} />
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default QuestionPanel;
