import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './CodeBlock.css';

const CodeBlock = ({ language, children }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="code-block-wrapper">
            <div className="code-block-header">
                <span className="code-block-language">{language}</span>
                <button
                    onClick={copyToClipboard}
                    className="code-block-copy-btn"
                    title={copied ? "Copied!" : "Copy code"}
                >
                    {copied ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    )}
                    
                </button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={vs}
                customStyle={{
                    margin: 0,
                    border: 0,
                    borderRadius: '0 0 15px 15px',
                    fontSize: '18px',
                    lineHeight: '1.5',
                    background: '#ffffff',
                }}
                showLineNumbers={false}
                wrapLines={true}
                PreTag="div"
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;
