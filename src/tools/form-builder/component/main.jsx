import React, { useState } from 'react';
import { Download, Eye, Plus, Trash2, GripVertical, X, ChevronDown } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

const FormBuilder = () => {
  const [formFields, setFormFields] = useState([]);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [errors, setErrors] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);

  // Available field types with their configurations
  const fieldTypes = [
    { type: 'text', label: 'Text Input', icon: '📝' },
    { type: 'email', label: 'Email', icon: '✉️' },
    { type: 'number', label: 'Number', icon: '🔢' },
    { type: 'tel', label: 'Phone', icon: '📞' },
    { type: 'url', label: 'URL', icon: '🔗' },
    { type: 'password', label: 'Password', icon: '🔒' },
    { type: 'textarea', label: 'Text Area', icon: '📄' },
    { type: 'select', label: 'Dropdown', icon: '📋' },
    { type: 'radio', label: 'Radio Buttons', icon: '⭕' },
    { type: 'checkbox', label: 'Checkboxes', icon: '☑️' },
    { type: 'date', label: 'Date', icon: '📅' },
    { type: 'time', label: 'Time', icon: '⏰' },
    { type: 'datetime-local', label: 'Date & Time', icon: '📆' },
    { type: 'file', label: 'File Upload', icon: '📎' },
    { type: 'range', label: 'Range Slider', icon: '🎚️' },
    { type: 'color', label: 'Color Picker', icon: '🎨' },
  ];

  const addField = (type) => {
    const newField = {
      id: Date.now(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: type === 'textarea' ? 'Enter your text here...' : `Enter ${type}...`,
      required: false,
      options: (type === 'select' || type === 'radio' || type === 'checkbox') 
        ? ['Option 1', 'Option 2', 'Option 3'] 
        : [],
      minLength: '',
      maxLength: '',
      pattern: '',
      min: type === 'range' ? '0' : '',
      max: type === 'range' ? '100' : '',
      step: type === 'range' ? '1' : '',
    };
    setFormFields([...formFields, newField]);
  };

  const removeField = (id) => {
    setFormFields(formFields.filter(field => field.id !== id));
  };

  const updateField = (id, property, value) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, [property]: value } : field
    ));
  };

  const updateOptions = (id, optionIndex, value) => {
    setFormFields(formFields.map(field => {
      if (field.id === id) {
        const newOptions = [...field.options];
        newOptions[optionIndex] = value;
        return { ...field, options: newOptions };
      }
      return field;
    }));
  };

  const addOption = (id) => {
    setFormFields(formFields.map(field => {
      if (field.id === id) {
        return { ...field, options: [...field.options, `Option ${field.options.length + 1}`] };
      }
      return field;
    }));
  };

  const removeOption = (id, optionIndex) => {
    setFormFields(formFields.map(field => {
      if (field.id === id) {
        return { ...field, options: field.options.filter((_, i) => i !== optionIndex) };
      }
      return field;
    }));
  };

  const validateField = (field, value) => {
    if (field.required && !value) {
      return 'This field is required';
    }

    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Invalid email format';
    }

    if (field.type === 'url' && value && !/^https?:\/\/.+/.test(value)) {
      return 'Invalid URL format';
    }

    if (field.type === 'tel' && value && !/^[0-9+\-\s()]+$/.test(value)) {
      return 'Invalid phone number';
    }

    if (field.minLength && value && value.length < parseInt(field.minLength)) {
      return `Minimum ${field.minLength} characters required`;
    }

    if (field.maxLength && value && value.length > parseInt(field.maxLength)) {
      return `Maximum ${field.maxLength} characters allowed`;
    }

    if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
      return 'Invalid format';
    }

    if (field.type === 'number' && value) {
      if (field.min && parseFloat(value) < parseFloat(field.min)) {
        return `Minimum value is ${field.min}`;
      }
      if (field.max && parseFloat(value) > parseFloat(field.max)) {
        return `Maximum value is ${field.max}`;
      }
    }

    return null;
  };

  const handlePreviewChange = (fieldId, value) => {
    setPreviewData({ ...previewData, [fieldId]: value });
    const field = formFields.find(f => f.id === fieldId);
    const error = validateField(field, value);
    setErrors({ ...errors, [fieldId]: error });
  };

  const handlePreviewSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    formFields.forEach(field => {
      const error = validateField(field, previewData[field.id]);
      if (error) newErrors[field.id] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!\n\n' + JSON.stringify(previewData, null, 2));
    }
  };

  const downloadForm = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formTitle.replace(/\s+/g, '_') || 'form'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formTitle || 'Custom Form'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
        body { font-family: 'Outfit', sans-serif; }
    </style>
</head>
<body class="bg-white min-h-screen p-8">
    <div class="max-w-3xl mx-auto">
        <form id="customForm" class="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            ${formTitle ? `<h1 class="text-4xl font-bold mb-4 text-black">${formTitle}</h1>` : ''}
            ${formDescription ? `<p class="text-lg text-gray-700 mb-8">${formDescription}</p>` : ''}
            
            ${formFields.map(field => {
              let fieldHTML = `<div class="mb-6">
                <label class="block text-black font-semibold mb-2">
                    ${field.label}${field.required ? '<span class="text-red-600">*</span>' : ''}
                </label>`;

              switch (field.type) {
                case 'textarea':
                  fieldHTML += `<textarea 
                    name="field_${field.id}" 
                    placeholder="${field.placeholder}"
                    ${field.required ? 'required' : ''}
                    ${field.minLength ? `minlength="${field.minLength}"` : ''}
                    ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}
                    class="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"></textarea>`;
                  break;
                
                case 'select':
                  fieldHTML += `<select 
                    name="field_${field.id}"
                    ${field.required ? 'required' : ''}
                    class="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black bg-white">
                    <option value="">Select an option</option>
                    ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                  </select>`;
                  break;
                
                case 'radio':
                  fieldHTML += `<div class="space-y-2">
                    ${field.options.map(opt => `
                      <label class="flex items-center space-x-2">
                        <input type="radio" name="field_${field.id}" value="${opt}" ${field.required ? 'required' : ''} class="w-4 h-4">
                        <span class="text-black">${opt}</span>
                      </label>
                    `).join('')}
                  </div>`;
                  break;
                
                case 'checkbox':
                  fieldHTML += `<div class="space-y-2">
                    ${field.options.map((opt, idx) => `
                      <label class="flex items-center space-x-2">
                        <input type="checkbox" name="field_${field.id}_${idx}" value="${opt}" class="w-4 h-4">
                        <span class="text-black">${opt}</span>
                      </label>
                    `).join('')}
                  </div>`;
                  break;
                
                case 'range':
                  fieldHTML += `
                    <input type="range" 
                      name="field_${field.id}" 
                      min="${field.min || 0}" 
                      max="${field.max || 100}" 
                      step="${field.step || 1}"
                      ${field.required ? 'required' : ''}
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      oninput="this.nextElementSibling.textContent = this.value">
                    <div class="text-center mt-2 font-semibold text-black">50</div>`;
                  break;
                
                default:
                  fieldHTML += `<input 
                    type="${field.type}" 
                    name="field_${field.id}" 
                    placeholder="${field.placeholder}"
                    ${field.required ? 'required' : ''}
                    ${field.minLength ? `minlength="${field.minLength}"` : ''}
                    ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}
                    ${field.pattern ? `pattern="${field.pattern}"` : ''}
                    ${field.min ? `min="${field.min}"` : ''}
                    ${field.max ? `max="${field.max}"` : ''}
                    class="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black">`;
              }

              fieldHTML += `<div class="error-message text-red-600 text-sm mt-1 hidden"></div></div>`;
              return fieldHTML;
            }).join('')}
            
            <button type="submit" class="w-full bg-black text-white py-4 px-6 font-bold text-lg hover:bg-gray-800 transition-all transform hover:scale-[1.02] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                Submit Form
            </button>
        </form>
    </div>
    
    <script>
        document.getElementById('customForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            alert('Form Submitted Successfully!\\n\\n' + JSON.stringify(data, null, 2));
        });
    </script>
</body>
</html>`;
  };

  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newFields = [...formFields];
    const draggedField = newFields[draggedItem];
    newFields.splice(draggedItem, 1);
    newFields.splice(index, 0, draggedField);
    setFormFields(newFields);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="min-h-screen bg-(--card) text-(--foreground)">
   
              <h1 className="heading text-center animate-fade-up pt-8  ">Form Builder</h1>
              <p className="description text-center animate-fade-up pt-2">Design. Build. Deploy.</p>
           
   
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowPreview(!showPreview)}
                className=" cursor-pointer gap-2"
              >
                <Eye size={20} />
                {showPreview ? 'Edit' : 'Preview'}
              </Button>
              <Button
                onClick={downloadForm}
                disabled={formFields.length === 0}
                className=" cursor-pointer gap-2 bg-green-500"
              >
                <Download size={20} />
                Download
              </Button>
            </div>
          </div>
        </div>
{/*       
 preview section */}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!showPreview ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            <div className="lg:col-span-1 bg-(--card) border border-(--border) rounded-xl shadow-md p-6 h-fit">
              <div className="sticky top-28 ">
                <h2 className="subheading mb-3">Components</h2>
                <div className="  grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2  gap-3 cursor-pointer"> 
                  {fieldTypes.map(({ type, label, icon }) => (
                    <div
                      key={type}
                      onClick={() => addField(type)}
                      className=" flex text-sm sm:text-base
 items-center  p-2 border border-(--border) bg-(--card) font-semibold  text-left text-(--foreground) rounded-md "
                    > 
                      {/* <span className="text-xl">{icon}</span> */}
                      <span className="text-sm">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Form Builder */}
            <div className="lg:col-span-3">
              <div className="bg-(--card) border-4 border-(--border) p-8  rounded-md">
                {/* Form Header */}
                <div className="mb-8">
                  <input
                    type="text"
                    placeholder="Form Title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full text-4xl font-bold mb-4 px-4 py-3 border border-(--border) rounded-md"
                  />
                  <textarea
                    placeholder="Form Description (optional)"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full text-4xl font-sm mb-4 px-4 py-3 border border-(--border) rounded-md resize-none"
                    rows="2"
                  />
                </div>

                {/* Form Fields */}
                {formFields.length === 0 ? (
                  <div className="text-center py-20 border-4 border-dashed border-(--border) rounded-md bg-(--card)">
                    <p className="text-2xl font-bold text-(--muted-foreground) mb-2">No fields yet</p>
                    <p className="text-(--muted-foreground)">Click on components to add them to your form</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {formFields.map((field, index) => (
                      <div
                        key={field.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`field-card border border-(--border) p-6 bg-(--card) rounded-md ${
                          draggedItem === index ? 'dragging' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3 flex-1">
                            <GripVertical size={20} className="cursor-move text-(--muted-foreground)" />
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => updateField(field.id, 'label', e.target.value)}
                              className="flex-1 font-bold text-lg px-3 py-2 border-2 border-(--border) rounded-md "
                              placeholder="Field Label"
                            />
                          </div>
                          <button
                            onClick={() => removeField(field.id)}
                            className="p-3 hover:bg-red-100   ml-3 cursor-pointer"
                          >
                            <Trash2 size={20} className="text-red-600" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block content mb-2">Placeholder</label>
                            <input
                              type="text"
                              value={field.placeholder}
                              onChange={(e) => updateField(field.id, 'placeholder', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-(--border) rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                                className="w-5 h-5 border border-(--border)"
                              />
                              <span className="font-semibold text-(--muted-foreground)">Required Field</span>
                            </label>
                          </div>
                        </div>

                     
                        {(field.type === 'text' || field.type === 'textarea') && (
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-semibold mb-2">Min Length</label>
                              <input
                                type="number"
                                value={field.minLength}
                                onChange={(e) => updateField(field.id, 'minLength', e.target.value)}
                                className="w-full px-3 py-2 border border-(--border) rounded-md text-sm"
                              />
                            </div>
                            <div>
                              <label className="block content mb-2">Max Length</label>
                              <input
                                type="number"
                                value={field.maxLength}
                                onChange={(e) => updateField(field.id, 'maxLength', e.target.value)}
                                className="w-full px-3 py-2 border border-(--border) rounded-md  text-sm"
                              />
                            </div>
                          </div>
                        )}

                        {field.type === 'number' && (
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block content mb-2">Min Value</label>
                              <input
                                type="number"
                                value={field.min}
                                onChange={(e) => updateField(field.id, 'min', e.target.value)}
                                className="w-full px-3 py-2 border border-(--border) rounded-md  text-sm"
                              />
                            </div>
                            <div>
                              <label className="block content mb-2">Max Value</label>
                              <input
                                type="number"
                                value={field.max}
                                onChange={(e) => updateField(field.id, 'max', e.target.value)}
                                className="w-full px-3 py-2 border border-(--border) rounded-md  text-sm"
                              />
                            </div>
                          </div>
                        )}

                        {field.type === 'range' && (
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <label className="block content mb-2">Min</label>
                              <input
                                type="number"
                                value={field.min}
                                onChange={(e) => updateField(field.id, 'min', e.target.value)}
                                className="w-full px-3 py-2 border border-(--border) rounded-md  text-sm"
                              />
                            </div>
                            <div>
                              <label className="block content mb-2">Max</label>
                              <input
                                type="number"
                                value={field.max}
                                onChange={(e) => updateField(field.id, 'max', e.target.value)}
                                className="w-full px-3 py-2 border border-(--border) rounded-md  text-sm"
                              />
                            </div>
                            <div>
                              <label className="block content mb-2">Step</label>
                              <input
                                type="number"
                                value={field.step}
                                onChange={(e) => updateField(field.id, 'step', e.target.value)}
                                className="w-full px-3 py-2 border border-(--border) rounded-md  text-sm"
                              />
                            </div>
                          </div>
                        )}

                        {/* Options for select, radio, checkbox */}
                        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-3">
                              <label className="text-sm font-semibold">Options</label>
                              <button
                                onClick={() => addOption(field.id)}
                                className="flex items-center gap-1 px-3 py-1 bg-(--card) text-(--foreground) text-sm font-semibold border border-(--border) "
                              >
                                <Plus size={16} />
                                Add Option
                              </button>
                            </div>
                            <div className="space-y-2">
                              {field.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => updateOptions(field.id, optIndex, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-(--border)  text-sm"
                                    placeholder={`Option ${optIndex + 1}`}
                                  />
                                  {field.options.length > 1 && (
                                    <button
                                      onClick={() => removeOption(field.id, optIndex)}
                                      className="p-2 hover:bg-red-100 border border-(--border)"
                                    >
                                      <X size={16} className="text-red-600" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Preview Mode */
          <div className="max-w-3xl mx-auto">
            <div className="bg-(--card) border-4 border-(--border) rounded-md p-8 ">
              {formTitle && <h1 className="subheading mb-4">{formTitle}</h1>}
              {formDescription && <p className="text-lg text-(--foreground) mb-8">{formDescription}</p>}

              <form onSubmit={handlePreviewSubmit} className="space-y-6">
                {formFields.map((field) => (
                  <div key={field.id}>
                    <label className="block content mb-2">
                      {field.label}
                      {field.required && <span className="text-red-600 ml-1">*</span>}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        placeholder={field.placeholder}
                        value={previewData[field.id] || ''}
                        onChange={(e) => handlePreviewChange(field.id, e.target.value)}
                        className="w-full px-4 py-3 border border(--border) rounded-md "
                        rows="4"
                      />
                    ) : field.type === 'select' ? (
                      <select
                        value={previewData[field.id] || ''}
                        onChange={(e) => handlePreviewChange(field.id, e.target.value)}
                        className="w-full px-4 py-3 border border-(--border)  bg-(--card) rounded-md "
                      >
                        <option value="">Select an option</option>
                        {field.options.map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'radio' ? (
                      <div className="space-y-2">
                        {field.options.map((opt, i) => (
                          <label key={i} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name={`field_${field.id}`}
                              value={opt}
                              checked={previewData[field.id] === opt}
                              onChange={(e) => handlePreviewChange(field.id, e.target.value)}
                              className="w-5 h-5 border border-(--border) rounded-md"
                            />
                            <span className="text-(--foreground) font-medium">{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : field.type === 'checkbox' ? (
                      <div className="space-y-2">
                        {field.options.map((opt, i) => (
                          <label key={i} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              value={opt}
                              checked={(previewData[field.id] || []).includes(opt)}
                              onChange={(e) => {
                                const current = previewData[field.id] || [];
                                const updated = e.target.checked
                                  ? [...current, opt]
                                  : current.filter(v => v !== opt);
                                handlePreviewChange(field.id, updated);
                              }}
                              className="w-5 h-5 border border-(--border) rounded-md"
                            />
                            <span className="text-(--foreground) font-medium">{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : field.type === 'range' ? (
                      <div>
                        <input
                          type="range"
                          min={field.min || 0}
                          max={field.max || 100}
                          step={field.step || 1}
                          value={previewData[field.id] || (field.min || 0)}
                          onChange={(e) => handlePreviewChange(field.id, e.target.value)}
                          className="w-full h-3 bg-(--card) appearance-none cursor-pointer border border-(--border)"
                        />
                        <div className="text-center mt-2 font-bold text-xl text-(--foreground)">
                          {previewData[field.id] || field.min || 0}
                        </div>
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={previewData[field.id] || ''}
                        onChange={(e) => handlePreviewChange(field.id, e.target.value)}
                        className="w-full px-4 py-3 border border-(--border) rounded-md "
                      />
                    )}

                    {errors[field.id] && (
                      <p className="text-red-600 text-sm mt-2 font-semibold">{errors[field.id]}</p>
                    )}
                  </div>
                ))}

                <Button
                  type="submit"
                  
                >
                  Submit 
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;