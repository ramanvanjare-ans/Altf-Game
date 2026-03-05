import React, { useState, useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';

 export default function ToolHome(){
  const [barcodeData, setBarcodeData] = useState('123456789012');
  const [barcodeFormat, setBarcodeFormat] = useState('CODE128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [lineColor, setLineColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(20);
  const [margin, setMargin] = useState(10);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  const barcodeFormats = [
    { value: 'CODE128', label: 'CODE128', example: 'Example123' },
    { value: 'CODE39', label: 'CODE39', example: 'CODE39' },
    { value: 'EAN13', label: 'EAN-13', example: '5901234123457' },
    { value: 'EAN8', label: 'EAN-8', example: '96385074' },
    { value: 'UPC', label: 'UPC-A', example: '123456789999' },
    { value: 'ITF14', label: 'ITF-14', example: '12345678901231' },
    { value: 'MSI', label: 'MSI', example: '1234567' },
    { value: 'pharmacode', label: 'Pharmacode', example: '1234' },
    { value: 'codabar', label: 'Codabar', example: '1234567' }
  ];

  const generateBarcode = () => {
    setError('');
    try {
      if (canvasRef.current && svgRef.current) {
        const options = {
          format: barcodeFormat,
          width: width,
          height: height,
          displayValue: displayValue,
          background: backgroundColor,
          lineColor: lineColor,
          fontSize: fontSize,
          margin: margin,
          valid: (valid) => {
            if (!valid) {
              setError('Invalid data for selected barcode format');
            }
          }
        };

        JsBarcode(canvasRef.current, barcodeData, options);
        JsBarcode(svgRef.current, barcodeData, options);
      }
    } catch (err) {
      setError(err.message || 'Error generating barcode');
    }
  };

  useEffect(() => {
    if (barcodeData) {
      generateBarcode();
    }
  }, [barcodeData, barcodeFormat, width, height, displayValue, backgroundColor, lineColor, fontSize, margin]);

  const downloadBarcode = (format) => {
    if (format === 'png') {
      const canvas = canvasRef.current;
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `barcode-${Date.now()}.png`;
      link.href = url;
      link.click();
    } else if (format === 'svg') {
      const svg = svgRef.current;
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.download = `barcode-${Date.now()}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const setExample = () => {
    const format = barcodeFormats.find(f => f.value === barcodeFormat);
    if (format) {
      setBarcodeData(format.example);
    }
  };

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground) p-4 md:p-8 font-sans">
      

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 ">
          
          <h1 className="heading text-center pt-5 animate-fade-up">
            Barcode Generator 
          </h1>
          <p className="text-slate-400 text-lg">Create professional barcodes with advanced customization</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6 animate-slide-in">
            <div className="bg-(--card) rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                
                Configuration
              </h2>

              {/* Barcode Data Input */}
              <div className="mb-6">
                <label className="content block mb-2">Barcode Data</label>
                <input
                  type="text"
                  value={barcodeData}
                  onChange={(e) => setBarcodeData(e.target.value)}
                  className="w-full px-4 py-3 border border-(--border) rounded-md input-field text-(--foreground) mono"
                  placeholder="Enter barcode data"
                />
              </div>

              {/* Format Selection */}
              <div className="mb-6">
                <label className="content block mb-2">Barcode Format</label>
                <select
                  value={barcodeFormat}
                  onChange={(e) => setBarcodeFormat(e.target.value)}
                  className="w-full bg-(--card) px-4 py-3  border border-(--border) rounded-md input-field text-(--foreground) cursor-pointer"
                >
                  {barcodeFormats.map(format => (
                    <option key={format.value} value={format.value} className="bg-(--card) text-(--foreground)">
                      {format.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={setExample}
                  className="mt-2 text-blue-400 text-sm hover:text-blue-300 transition-colors"
                >
                  Use example data for this format
                </button>
              </div>

              {/* Display Value Toggle */}
              <div className="mb-6 flex items-center justify-between">
                <label className="label-text">Show Text Below Barcode</label>
                <button
                  onClick={() => setDisplayValue(!displayValue)}
                  className={`w-14 h-7 rounded-full transition-colors relative ${
                    displayValue ? 'bg-(--card) text-blue-500' : 'bg-blue-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-(--card) rounded-full absolute top-1 transition-transform ${
                      displayValue ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                  {error}
                </div>
              )}
            </div>

           

  <div className="bg-(--card) rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="content  mb-3 text-(--foreground)">Current Format: {barcodeFormat}</h3>
              <p className="text-sm text-(--foreground) leading-relaxed">
                {barcodeFormat === 'CODE128' && 'CODE128 is a high-density linear barcode symbology that can encode all 128 ASCII characters. Widely used in shipping and packaging industries.'}
                {barcodeFormat === 'CODE39' && 'CODE39 is a variable length barcode symbology. It can encode uppercase letters, digits, and some special characters.'}
                {barcodeFormat === 'EAN13' && 'EAN-13 is a 13-digit barcode standard used worldwide for retail products. The last digit is a checksum.'}
                {barcodeFormat === 'EAN8' && 'EAN-8 is an 8-digit barcode used for small packages where EAN-13 would be too large.'}
                {barcodeFormat === 'UPC' && 'UPC-A is a 12-digit barcode used primarily in North America for retail products.'}
                {barcodeFormat === 'ITF14' && 'ITF-14 is used for packaging levels of products. It encodes a 14-digit number.'}
                {barcodeFormat === 'MSI' && 'MSI barcode is used primarily for inventory control and warehouse applications.'}
                {barcodeFormat === 'pharmacode' && 'Pharmacode is used in the pharmaceutical industry for packaging control.'}
                {barcodeFormat === 'codabar' && 'Codabar is used in libraries, blood banks, and delivery services.'}
              </p>
            </div>

          </div>

          {/* Right Panel - Preview & Download */}
          <div className="space-y-6 animate-slide-in" >
            <div className="bg-(--card) rounded-2xl p-6 backdrop-blur-sm grid-pattern">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
               
                Preview
              </h2>

              <div className="barcode-display flex items-center justify-center min-h-75">
                <div className="text-center">
                  <canvas ref={canvasRef} className="mx-auto" />
                  <svg ref={svgRef} className="hidden" />
                </div>
              </div>
            </div>

            <div className="bg-(--card) rounded-2xl p-6 backdrop-blur-sm">
             

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => downloadBarcode('png')}
                  className="glow-button px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 border border-(--border) cursor-pointer "
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Download PNG
                </button>
                <button
                  onClick={() => downloadBarcode('svg')}
                  className="px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 bg-(--card) transition-all group border border-(--border) cursor-pointer "
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Download SVG
                </button>
              </div>

             
            </div>

            
          
          </div>
        </div>

       
      </div>
    </div>
  );
};

