
"use client"




import React, { useState, useEffect, useCallback } from 'react';
import DropdownSelector from '../components/DropdownSelector';
import InputArea from '../components/InputArea';
import ResultView from '../components/ResultView';
import { getEncoderDecoder } from '../utils/encodeDecode';

export default function ToolHome(){
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [encodingType, setEncodingType] = useState('base64-encode');
    const [error, setError] = useState('');

    // Function to process text based on encoding type
    const processText = useCallback((text, type) => {
        if (!text) {
            setOutputText('');
            setError('');
            return;
        }
        try {
            const processor = getEncoderDecoder(type);
            const result = processor(text);
            setOutputText(result);
            setError('');
        } catch (err) {
            setError(err.message);
            setOutputText('');
        }
    }, []);

    useEffect(() => {
        processText(inputText, encodingType);
    }, [inputText, encodingType, processText]);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="heading text-center animate-fade-up mb-4">
                    Encode & Decode
                </h1>
                <p className="description text-center animate-fade-up">
                    Professional  tool for encoding and decoding text in multiple formats.<br/>
                    Fast, secure, and completely free.
                </p>

               
            </div>

            {/* Main Tool */}
            <div className="bg-(--card)  rounded-lg shadow-lg p-6 md:p-8 mb-12">
                <div className="flex flex-col gap-6">
                    {/* Encoding Type Selector */}
                    <div>
                        <DropdownSelector value={encodingType} onChange={setEncodingType} />
                    </div>

                    {/* Input and Result Areas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Input Area */}
                        <div>
                            <InputArea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onClear={() => setInputText('')}
                            />
                        </div>

                        {/* Result Area */}
                        <div>
                            <ResultView value={outputText} error={error} />
                        </div>
                    </div>
                </div>
            </div>

           
        </div>
    );
};


