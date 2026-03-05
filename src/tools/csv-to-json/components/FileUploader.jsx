

import React, { useState ,useRef} from "react";
 import { Upload, FileText } from "lucide-react";
 import toast from "react-hot-toast";


const FileUploader = ({ onFileUpload }) => {
  const [manualCsv, setManualCsv] = useState("");
  const [fileName, setFileName] = useState("");
 const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

if (manualCsv.trim()) {
      toast.error("Please use only one input: file OR manual CSV");
      e.target.value = "";
      return;
    }


    setFileName(file.name);
    

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target.result; // STRING
      console.log("CSV TEXT TYPE:", typeof csvText); // string
      onFileUpload(csvText);
       toast.success("CSV file uploaded successfully");
    };

    reader.readAsText(file);
  };

   const handleManualChange = (e) => {
    const value = e.target.value;
      if (fileName) {
      toast.error("Please use only one input: file OR manual CSV");
      return;
    }
    setManualCsv(value);

   
    if (value.trim()) {
      onFileUpload(value);
    } else {
      onFileUpload(""); 
    }
  };

  return (
    <div className="mb-6 space-y-6 ">


  <div>
  <label className="block text-(--primary) text-sm font-bold mb-3">
    Upload CSV File
  </label>

  <label
    htmlFor="csv-upload"
    className="flex flex-col items-center justify-center
               w-full h-36 border-2 border-dashed
               border-(--border) rounded-xl
               cursor-pointer
               bg-(--card)
               hover:bg-(--hover)
               transition"
  >
    {fileName ? (
      <>
        {/* 🔦 FILE ICON */}
        <FileText className="w-8 h-8 text-blue-600 mb-2" />

        <p className="text-sm font-medium text-(--primary) truncate max-w-[90%]">
          {fileName}
        </p>

        {/* <p className="text-xs text-green-600">
          File uploaded successfully
        </p> */}
      </>
    ) : (
      <>
        {/* 🔦 DEFAULT STATE */}
        <Upload className="w-8 h-8 text-(--primary) mb-2" />

        <p className="text-sm font-medium text-(--primary)">
          Click to upload CSV
        </p>

        <p className="text-xs text-(--secondary)">
          Only .csv files supported
        </p>
      </>
    )}

    <input
      id="csv-upload"
      type="file"
      accept=".csv"
      onChange={handleFileChange}
      className="hidden"
    />
  </label>
</div>

      <div>
        <label className="block text-(--primary) text-sm font-bold mb-2">
          Or Paste CSV Data 
        </label>

        <textarea
          rows={6}
          value={manualCsv}
         onChange={handleManualChange}
          placeholder={`name,age,city
John,25,Delhi`}
          className="w-full px-3 py-2 mt-4 bg-(--card) border border-(--border) rounded-md text-(--foreground)"
        />

      </div>
    </div>
  );
};

export default FileUploader;
