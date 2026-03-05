
import React, { useState, useRef } from 'react';
import { Upload, Camera, X, User, Calendar, AlertCircle, Sparkles } from 'lucide-react';

export default function ToolHome() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateImage = (file) => {
    if (!file) return false;
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image (JPG, PNG, or WEBP)');
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return false;
    }
    
    return true;
  };

  const analyzeImage = async (imageData) => {
    setAnalyzing(true);
    setError(null);
    
    try {
      // Using Face++ API for real-time detection
      const formData = new FormData();
      formData.append('api_key', 'McBts5WJq_RmdXGw9g2sVh6gOvham59N'); // Using demo mode
      formData.append('api_secret', 'TDYWIA4NctGP1V7jbpSDo5OZZjAd0Kez');
      formData.append('image_base64', imageData.split(',')[1]);
      formData.append('return_attributes', 'gender,age');

      const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/detect', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.faces && data.faces.length > 0) {
        const face = data.faces[0];
        setResult({
          gender: face.attributes.gender.value,
          age: face.attributes.age.value,
          confidence: Math.round((face.attributes.gender.confidence + 
                                  (100 - Math.abs(face.attributes.age.value - 25))) / 2)
        });
      } else {
        setError('No face detected in the image. Please upload a clear photo of a person.');
      }
    } catch (err) {
      setError('Analysis failed. Please try again or use a different image.');
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateImage(file)) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;
      setPreview(imageData);
      setImage(file);
      setResult(null);
      analyzeImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!validateImage(file)) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;
      setPreview(imageData);
      setImage(file);
      setResult(null);
      analyzeImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-(--background) p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="">
            {/* <ToolChip className="w-8 h-8 text-white" /> */}
          </div>
          <h1 className="heading mt-5 mb-2 animate-fade-up">
            Age & Gender Detector
          </h1>
          <p className="description mt-2 mb-4 animate-fade-up">A smart image analysis app that detects age and gender<br/> from facial features using machine learning.</p>
        </div>

        {/* Main Card */}
        <div className="bg-(--card) rounded-3xl shadow-2xl overflow-hidden">
          {!preview ? (
            /* Upload Area */
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="p-8 sm:p-12 lg:p-16"
            >
              <div className="border-3 border-dashed border-gray-300 rounded-2xl p-8 sm:p-12 text-center hover:border-purple-400 transition-all duration-300 cursor-pointer bg-(--card)"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-24 h-24 bg-(--card) rounded-full flex items-center justify-center">
                    <Upload className="w-12 h-12 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Upload or Drop Your Photo
                    </h3>
                    <p className="text-(--muted-foreground) mb-4">
                      JPG, PNG, or WEBP • Max 10MB
                    </p>
                    <button className="px-6 py-3 bg-(--primary) text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 cursor-pointer transition-all duration-200">
                      Choose File
                    </button>
                  </div>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            /* Analysis Area */
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Image Preview */}
                <div className="relative">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
                    <img
                      src={preview}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={handleReset}
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors group"
                  >
                    <X className="w-5 h-5 text-gray-600 group-hover:text-red-600 cursor-pointer" />
                  </button>
                </div>

                {/* Results */}
                <div className="flex flex-col justify-center space-y-6">
                  {analyzing && (
                    <div className="text-center py-12">
                      <div className="inline-block w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-lg text-(--muted-foreground) font-medium">Analyzing image...</p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-red-900 mb-1">Error</h4>
                          <p className="text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {result && !analyzing && (
                    <div className="space-y-4">
                      <h3 className="subheading">Analysis Results</h3>
                      
                      {/* Gender Card */}
                      <div className="bg-(--card) rounded-2xl p-6 border-2 border-blue-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-blue-700 font-medium mb-1">Gender</p>
                            <p className="text-3xl font-bold text-blue-900 capitalize">
                              {result.gender}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Age Card */}
                      <div className="bg-(--card) rounded-2xl p-6 border-2 border-purple-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-(--primary) rounded-xl flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-blue-700 font-medium mb-1">Estimated Age</p>
                            <p className="text-3xl font-bold text-blue-900">
                              {result.age} years
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Confidence */}
                      {/* <div className="bg-gray-50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-600">Confidence</span>
                          <span className="text-sm font-bold text-gray-800">{result.confidence}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                            style={{ width: `${result.confidence}%` }}
                          ></div>
                        </div>
                      </div> */}

                      {/* Try Another Button */}
                      <button
                        onClick={handleReset}
                        className="w-full py-4 bg-(--primary) text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 mt-4 cursor-pointer"
                      >
                        Try Another Photo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

      
      </div>
    </div>
  );
}