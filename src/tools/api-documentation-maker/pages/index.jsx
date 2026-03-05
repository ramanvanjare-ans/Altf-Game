import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { 
  FileText, 
  Download, 
  Copy, 
  RefreshCw, 
  Code, 
  FileJson 
} from 'lucide-react';

export default function ToolHome() {
  const [inputData, setInputData] = useState('');
  const [formattedData, setFormattedData] = useState('');
  const outputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  const formatData = () => {
    try {
     
      const parsedData = JSON.parse(inputData);
      const formatted = JSON.stringify(parsedData, null, 2);
      setFormattedData(formatted);
    } catch (error) {
      
      setFormattedData(inputData || 'Invalid JSON format');
    }
  };

  const downloadPDF = () => {
    if (!formattedData) return;
    
    const doc = new jsPDF();
    doc.text('API Documentation', 20, 10);
    doc.setFontSize(10);
    
  
    const splitText = doc.splitTextToSize(formattedData, 170);
    doc.text(splitText, 20, 20);
    
    doc.save('api-documentation.pdf');
  };

  const copyToClipboard = () => {
    if (outputRef.current) {
      navigator.clipboard.writeText(formattedData);
    }
  };

  const resetAll = () => {
    setInputData('');
    setFormattedData('');
  };

  const handleSampleData = () => {
    const sampleData = {
      "openapi": "3.0.0",
      "info": {
        "title": "Sample API",
        "version": "1.0.0",
        "description": "A sample API for demonstration"
      },
      "paths": {
        "/users": {
          "get": {
            "summary": "Get all users",
            "responses": {
              "200": {
                "description": "A list of users"
              }
            }
          }
        }
      }
    };
    
    setInputData(JSON.stringify(sampleData, null, 2));
    setFormattedData(JSON.stringify(sampleData, null, 2));
  };

  return (
    <div className="min-h-screen bg-(--card) p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="heading text-center animate-fade-up pt-5">
           
            API Docs Maker
          </h1>
          <p className="description text-center animate-fade-up ">
            Convert your Swagger/JSON data into  formatted API documentation
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
          <div className="bg-(--card) rounded-xl shadow-md p-5 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-(--foreground) flex items-center gap-2">
               
                Input Data
              </h2>
              <button
                onClick={handleSampleData}
                className="text-sm bg-(--card) text-(--foreground) px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
              >
                Load Sample
              </button>
            </div>
            
            <div className="mb-4">
              <label htmlFor="input-data" className="sr-only block mb-2 text-sm font-medium text-(--muted-foreground)">
                Paste your Swagger/JSON data here
              </label>
              <textarea
                id="input-data"
                value={inputData}
                onChange={handleInputChange}
                className="w-full h-64 px-4 py-3 text-sm font-mono border rounded-lg focus:ring-2  resize-y"
                placeholder="Paste your JSON/Swagger data here..."
              />
            </div>
            
            <button
              onClick={formatData}
              className="w-full bg-(--primary) text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Code className="w-4 h-4" />
              Format Documentation
            </button>
          </div>

        
          <div className="bg-(--card) rounded-xl shadow-md p-5 transition-all duration-200 hover:shadow-lg">
            <h2 className="text-xl font-semibold text-(--foreground) mb-4 flex items-center gap-2">
             
              Formatted Output
            </h2>
            
            <div className="mb-4 relative">
              <pre
                ref={outputRef}
                className="w-full h-64 p-4 text-sm font-mono bg-(--card) border rounded-lg overflow-auto resize-y"
              >
                {formattedData || 'Formatted documentation will appear here...'}
              </pre>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={downloadPDF}
                disabled={!formattedData}
                className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Download 
              </button>
              
              <button
                onClick={copyToClipboard}
                disabled={!formattedData}
                className="bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Copy className="w-4 h-4" />
                Copy Text
              </button>
              
              <button
                onClick={resetAll}
                className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                Reset All
              </button>
              
              <button
                onClick={formatData}
                disabled={!inputData}
                className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Code className="w-4 h-4" />
                Reformat
              </button>
            </div>
          </div>
        </div>

        
       
          
         
          
         
        </div>

       
      </div>
    // </div>
  );
}