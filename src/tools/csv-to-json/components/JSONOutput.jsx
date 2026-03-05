"use client";

import { useState } from 'react';

import { Check, Copy } from 'lucide-react';
import React from 'react';

const JSONOutput = ({ jsonData }) => {
const [copied, setCopied] = useState(false);

  if (!jsonData) return null;


const handleCopy=async()=>{
  try{
    await navigator.clipboard.writeText(jsonData);
    setCopied(true);
    setTimeout(()=>setCopied(false),2000);
  }
  catch(err){
    console.error('Failed to copy: ', err);
  }
}






  return (
   <div className="mb-6">
  {/*  HEADER */}
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
    <h3 className="text-lg font-semibold text-(--primary)">
      JSON Output
    </h3>

  <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-sm px-2 py-1 rounded-md border border-(--border)  transition text-(--secondary) hover:bg-(--secondary) hover:text-(--background) cursor-pointer mr-10"
        >
          {copied ? (
            <>
              <Check size={16} className="text-green-600" />
              Copied
            </>
          ) : (
            <>
              <Copy size={16} className="text-gray-500" />
         
            </>
          )}
        </button>


  </div>

  {/*  OUTPUT CONTAINER */}
  <div className="relative border border-(--border) rounded-lg overflow-hidden scroll-hidden">
    <pre
      className="
        bg-(--background)
        p-4
        text-sm
        text-(--secondary)
        rounded-lg
        max-h-[300px]
        overflow-y-auto
        overflow-x-auto
        whitespace-pre-wrap
        break-words
      "
    >
      {jsonData}
    </pre>
  </div>
</div>

  );
};

export default JSONOutput;