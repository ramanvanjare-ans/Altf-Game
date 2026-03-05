import React, { useState, useRef } from 'react';
import FileUploader from '../components/FileUploader';
import CSVPreview from '../components/CSVPreview';
import JSONOutput from '../components/JSONOutput';


import ActionButtons from '../components/ActionButton';
import { parseCSV, convertToJson } from '../utils/csvParser';

export default function ToolHome() {
  const [csvData, setCsvData] = useState([]);
  const [jsonData, setJsonData] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);
  const [resetKey, setResetKey] = useState(0);


  const handleFileUpload = (fileContent) => {
     console.log("File content:", fileContent);
  const parsedData = parseCSV(fileContent);
  console.log("Parsed CSV Data:", parsedData);
  setCsvData(parsedData);
  };

  const handleConvert = () => {
    if (csvData.length === 0) return;
    const json = convertToJson(csvData);
    setJsonData(json);
  };

  const handleDownload = () => {
    if (!jsonData) return;
    
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName ? `${fileName.replace('.csv', '')}.json` : 'converted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setCsvData([]);
    setJsonData('');
    setFileName('');
     setResetKey(prev => prev + 1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-(--background)">
      <div className="max-w-4xl mx-auto  ">
        <div className=" mb-16 px-8 ">
          <h1 className="heading text-center pt-5 animate-fade-up">CSV to JSON Converter</h1>
          <p className="description text-center pt-5 animate-fade-up">
            Upload a CSV file, preview data, and convert to JSON format
          </p>
        </div>

        <div className=" shadow-lg  p-6 sm:p-8 bg-(--background) border border-(--border) rounded-lg">
          <FileUploader 
            key={resetKey}  
            onFileUpload={handleFileUpload} 
            fileInputRef={fileInputRef}
          />
          
          <CSVPreview csvData={csvData} />
          
         
          
          <JSONOutput jsonData={jsonData} />
           <ActionButtons
            onConvert={handleConvert}
            onDownload={handleDownload}
            onClear={handleClear}
            hasData={csvData.length > 0}
          />
        </div>

        {/* <div className="mt-6 text-center text-sm text-(--secondary)">
          <p>Your CSV data is processed locally in the browser. No data is uploaded to any server.</p>
        </div> */}
      </div>
    </div>
  );
}

