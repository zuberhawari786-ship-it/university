import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleGenAI } from '@google/genai';

// Helper function to convert basic markdown to HTML for printing and doc export
const markdownToHtml = (markdown: string): string => {
    let html = markdown
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>');

    const lines = html.split('\n');
    let inList = false;
    html = lines.map(line => {
        if (line.match(/^\s*[-*] /)) {
            const listItem = `<li>${line.replace(/^\s*[-*] /, '')}</li>`;
            if (!inList) {
                inList = true;
                return `<ul>${listItem}`;
            }
            return listItem;
        } else {
            if (inList) {
                inList = false;
                // Don't wrap headers that follow a list in a p tag
                if (line.match(/^<h[1-3]>/)) {
                    return `</ul>${line}`;
                }
                return `</ul><p>${line}</p>`;
            }
             if (line.match(/^<h[1-3]>/)) {
                return line;
            }
            return line.trim() === '' ? '<br/>' : `<p>${line}</p>`;
        }
    }).join('');

    if (inList) {
        html += '</ul>'; // Close any open list at the end of the document
    }
    
    html = html.replace(/<p><\/p>/g, '').replace(/(<br\/?>\s*)+/g, '<br/>');

    return `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: black; background-color: white; padding: 20px;">${html}</div>`;
};


const SyllabusDesigner: React.FC = () => {
    const { user } = useAuth();
    const [selectedSubject, setSelectedSubject] = useState(user?.subjects?.[0] || '');
    const [topics, setTopics] = useState('');
    const [generatedSyllabus, setGeneratedSyllabus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const teacherSubjects = useMemo(() => user?.subjects || [], [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSubject) {
            setError('Please select a subject.');
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedSyllabus('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `You are an expert curriculum designer for a university. Create a detailed, professional syllabus for the subject "${selectedSubject}". 
            
The syllabus should cover the following key topics or themes: "${topics}". If no topics are provided, create a standard, comprehensive syllabus for the subject.

The output must be a well-structured syllabus in Markdown format. It should include the following sections:
- Course Title
- Course Code
- Credit Hours
- Course Description & Objectives
- A detailed week-by-week breakdown of topics and activities (e.g., Week 1: Topic, Week 2: Topic).
- Assessment Methods (e.g., Mid-term exam, final exam, assignments, projects with percentage breakdown).
- Recommended Reading/Textbooks.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            setGeneratedSyllabus(response.text);

        } catch (err) {
            console.error(err);
            setError('Failed to generate syllabus. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownloadMD = () => {
        const blob = new Blob([generatedSyllabus], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `syllabus-${selectedSubject.replace(/\s+/g, '_')}.md`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDownloadDoc = () => {
        const htmlContent = markdownToHtml(generatedSyllabus);
        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(`<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${htmlContent}</body></html>`);
        const link = document.createElement('a');
        link.href = source;
        link.download = `syllabus-${selectedSubject.replace(/\s+/g, '_')}.doc`;
        link.click();
    };

    const handlePrintPDF = () => {
        const htmlContent = markdownToHtml(generatedSyllabus);
        
        const printableElement = document.createElement('div');
        printableElement.className = 'printable';
        printableElement.innerHTML = htmlContent;
        
        document.body.appendChild(printableElement);
        window.print();
        document.body.removeChild(printableElement);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">AI Syllabus Designer</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="subject" className="label">Select Subject</label>
                        <select
                            id="subject"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="form-select"
                            required
                        >
                            {teacherSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="topics" className="label">Key Topics or Description (Optional)</label>
                        <textarea
                            id="topics"
                            rows={3}
                            value={topics}
                            onChange={(e) => setTopics(e.target.value)}
                            className="form-input"
                            placeholder="e.g., Introduction to neural networks, backpropagation, convolutional neural networks..."
                        />
                    </div>
                    <div className="text-right">
                        <button type="submit" className="btn-primary" disabled={isLoading}>
                            {isLoading ? 'Generating...' : 'Generate Syllabus'}
                        </button>
                    </div>
                </form>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {isLoading && (
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <p>Generating syllabus, please wait...</p>
                </div>
            )}

            {generatedSyllabus && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Generated Syllabus for {selectedSubject}</h3>
                         <div className="flex items-center gap-2">
                            <button onClick={handlePrintPDF} className="btn-secondary">Print / Save PDF</button>
                            <button onClick={handleDownloadDoc} className="btn-secondary">Download .doc</button>
                            <button onClick={handleDownloadMD} className="btn-secondary">Download .md</button>
                        </div>
                    </div>
                    <pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-900 p-4 rounded-md font-mono text-sm overflow-x-auto">
                        {generatedSyllabus}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default SyllabusDesigner;
