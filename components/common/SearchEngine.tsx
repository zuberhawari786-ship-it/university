import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

type GroundingChunk = {
    web?: {
        uri: string;
        title: string;
    }
}

const SearchEngine: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<{ text: string; sources: GroundingChunk[] } | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: query,
                config: {
                    tools: [{ googleSearch: {} }],
                },
            });
            
            const text = response.text;
            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            
            setResult({ text, sources });

        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching search results. Please check the console for details.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold" style={{ color: 'var(--primary-500)', textShadow: '0 0 8px var(--primary-500)'}}>
                    Gemini Search_
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">AI-powered gateway to web knowledge_</p>
            </div>
            
            <form onSubmit={handleSearch} className="flex items-center gap-2 mb-8">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="form-input flex-grow !text-base"
                    placeholder="Ask anything..."
                />
                <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        'Search'
                    )}
                </button>
            </form>

            {error && <div className="text-red-500 p-4 rounded-none border border-red-500/50 text-center">{error}</div>}

            {result && (
                <div className="space-y-6 animate-fade-in">
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold mb-3">Answer</h2>
                        <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap font-mono" style={{color: 'var(--primary-500)'}}>
                            {result.text}
                        </div>
                    </div>
                    
                    {result.sources && result.sources.length > 0 && (
                         <div className="card p-6">
                            <h2 className="text-xl font-semibold mb-3">Sources</h2>
                            <ul className="space-y-3">
                                {result.sources.map((source, index) => source.web && (
                                    <li key={index} className="border-b border-gray-700 pb-2">
                                        <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium" style={{color: 'var(--primary-500)'}}>
                                            {source.web.title}
                                        </a>
                                        <p className="text-xs truncate" style={{color: 'var(--primary-700)'}}>{source.web.uri}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchEngine;