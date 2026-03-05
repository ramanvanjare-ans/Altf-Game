// ImageCropper.jsx
import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';


const ImageCropper = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(1); // Default to 1:1
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const aspectRatios = [
    { name: '1:1', value: 1, label: 'Square' },
    { name: '3:4', value: 3/4, label: 'Portrait' },
    { name: '4:3', value: 4/3, label: 'Landscape' },
    { name: '9:16', value: 9/16, label: 'Mobile Story' },
    { name: 'Free', value: undefined, label: 'Free Select' },
  ];

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
        setCroppedImage(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const reset = useCallback(() => {
    setImageSrc(null);
    setCroppedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const generateCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    
    setIsProcessing(true);
    
    try {
      const image = new Image();
      image.src = imageSrc;
      
      await image.decode();
      
      // Maximum dimensions for the output image
      const maxWidth = 1000;
      const maxHeight = 1000;
      
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = croppedAreaPixels;
      
      // Scale down if larger than max dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }
      
      // Create canvas for resizing and compression
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = width;
      canvas.height = height;
      
      // Set white background for transparent images
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the cropped image on canvas
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        width,
        height
      );
      
      // Convert to JPEG with compression (quality 0.8)
      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            setIsProcessing(false);
            resolve(URL.createObjectURL(blob));
          },
          'image/jpeg',
          0.8 // Compression quality (0.8 = 80%)
        );
      });
    } catch (error) {
      console.error('Error generating cropped image:', error);
      setIsProcessing(false);
      return null;
    }
  }, [croppedAreaPixels, imageSrc]);

  const handleCropImage = useCallback(async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    
    const croppedImageUrl = await generateCroppedImage();
    if (croppedImageUrl) {
      setCroppedImage(croppedImageUrl);
    }
  }, [croppedAreaPixels, imageSrc, generateCroppedImage]);

  const downloadCroppedImage = useCallback(() => {
    if (!croppedImage) return;
    
    const link = document.createElement('a');
    link.download = `cropped-image-${new Date().getTime()}.jpg`;
    link.href = croppedImage;
    link.click();
  }, [croppedImage]);

  return (
    <div className="  bg-(--card) item-center text-(--foreground) py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        

        {!imageSrc && !croppedImage && (
          <div className="border-2 border-dashed border-(--border) rounded-xl p-12 text-center bg-(--card)  transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              ref={fileInputRef}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-medium text-(--muted-foreground)">Upload an image</h3>
              <p className="mt-2 text-sm text-(--muted-foreground)">  
                Click to browse or drag and drop your image here
              </p>
              <p className="mt-1 text-xs text-(--muted-foreground)">
                Supports JPG, PNG, GIF and other common image formats
              </p>
            </label>
          </div>
        )}

        {imageSrc && !croppedImage && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold">Adjust Your Crop</h2>
              <button
                onClick={reset}
                className="px-4 py-2 bg-(--primary) border border-(--border) rounded-md  transition-colors cursor-pointer flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                New Image
              </button>
            </div>
            
            <div className="relative w-full h-80 sm:h-96 md:h-125 bg-(--card) rounded-xl overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape="rect"
                showGrid={true}
                classes={{
                  containerClassName: 'cropper-container',
                  mediaClassName: 'cropper-media',
                  cropAreaClassName: 'cropper-crop-area',
                }}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--muted-foreground) mb-2">Aspect Ratio</label>
                <div className="flex flex-wrap gap-2">
                  {aspectRatios.map((ratio) => (
                    <button
                      key={ratio.name}
                      onClick={() => setAspect(ratio.value)}
                      className={`px-4 py-2 border rounded-md transition-all cursor-pointer ${
                        aspect === ratio.value
                          ? 'bg-(--primary) text-white border-(--border) shadow-md'
                          : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                      }`}
                      title={ratio.label}
                    >
                      {ratio.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-(--muted-foreground) mb-1">Zoom</label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer accent-(--primary)"
                  />
                </div>
                <button
                  onClick={handleCropImage}
                  disabled={isProcessing}
                  className={`px-6 py-3 font-medium rounded-md transition-colors cursor-pointer ${
                    isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-(--primary) text-white '
                  } w-full sm:w-auto`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Crop & Optimize Image'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {croppedImage && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold">Cropped Result</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={downloadCroppedImage}
                  className="px-4 py-2 bg-green-500  text-white rounded-md   flex items-center justify-center cursor-pointer"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Download Image
                </button>
                <button
                  onClick={() => setCroppedImage(null)}
                  className="px-4 py-2 bg-gray-500  border border-(--border) rounded-md    cursor-pointer"
                >
                  Re-crop
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-(--primary) border border-(--border) rounded-md   cursor-pointer"
                >
                  Start Over
                </button>
              </div>
            </div>
            
            <div className="border rounded-xl overflow-hidden bg-(--card)">
              <img 
                src={croppedImage} 
                alt="Cropped preview" 
                className="max-w-full h-auto mx-auto block"
              />
            </div>
            
            <div className=" p-4 rounded-r-lg">
              <div className="flex">
                <div className="shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-green-500">
                    Your image has been cropped & optimized sucessfully.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
       
      </div>
    </div>
  );
};

export default ImageCropper;