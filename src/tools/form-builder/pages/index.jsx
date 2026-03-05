import FormBuilder from "../component/main";


export default function ToolHome(){
  return (

  <div className="bg-(--background) "> 
<FormBuilder/>
  </div>


  )
}








// import React, { useEffect, useRef, useState } from "react";

// export default function ToolHOme() {
//   // ================== STATE ==================
//   const [formState, setFormState] = useState({
//     title: "Untitled Form",
//     description: "",
//     fields: [],
//     submitButtonText: "Submit",
//     responses: [],
//     multiStep: false,
//     steps: []
//   });

//   const [selectedFieldId, setSelectedFieldId] = useState(null);
//   const [currentView, setCurrentView] = useState("builder");
//   const [currentDevice, setCurrentDevice] = useState("desktop");

//   const historyRef = useRef([]);
//   const historyIndexRef = useRef(-1);
//   const fieldIdCounter = useRef(0);

//   // ================== INIT ==================
//   useEffect(() => {
//     const saved = localStorage.getItem("formBuilderState");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       setFormState(parsed);
//       historyRef.current = [JSON.stringify(parsed)];
//       historyIndexRef.current = 0;
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("formBuilderState", JSON.stringify(formState));
//   }, [formState]);

//   const saveState = (newState) => {
//     const stateStr = JSON.stringify(newState);
//     if (historyIndexRef.current < historyRef.current.length - 1) {
//       historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
//     }
//     historyRef.current.push(stateStr);
//     historyIndexRef.current++;
//     setFormState(newState);
//   };

//   // ================== FIELD ==================
//   const getFieldLabel = (type) => ({
//     text: "Text Input",
//     email: "Email Address",
//     number: "Number",
//     tel: "Phone Number",
//     textarea: "Long Text",
//     date: "Date",
//     time: "Time",
//     select: "Dropdown",
//     radio: "Radio Buttons",
//     checkbox: "Checkboxes",
//     file: "File Upload",
//     signature: "Signature"
//   }[type] || "Field");

//   const addField = (type) => {
//     const newField = {
//       id: `field_${++fieldIdCounter.current}`,
//       type,
//       label: getFieldLabel(type),
//       placeholder: "",
//       required: false,
//       helpText: "",
//       defaultValue: "",
//       options: ["select", "radio", "checkbox"].includes(type)
//         ? ["Option 1", "Option 2", "Option 3"]
//         : [],
//       validation: {},
//       conditionalLogic: null,
//       calculation: ""
//     };
//     saveState({ ...formState, fields: [...formState.fields, newField] });
//     setSelectedFieldId(newField.id);
//   };

//   const updateFieldProperty = (prop, value) => {
//     const updated = formState.fields.map(f =>
//       f.id === selectedFieldId ? { ...f, [prop]: value } : f
//     );
//     saveState({ ...formState, fields: updated });
//   };

//   const deleteField = (id) => {
//     saveState({ ...formState, fields: formState.fields.filter(f => f.id !== id) });
//     setSelectedFieldId(null);
//   };

//   // ================== RENDER INPUT ==================
//   const renderInput = (field) => {
//     const base = "w-full border rounded px-3 py-2 mt-2";
//     switch (field.type) {
//       case "textarea":
//         return <textarea className={base} placeholder={field.placeholder} />;
//       case "select":
//         return (
//           <select className={base}>
//             {field.options.map((o, i) => <option key={i}>{o}</option>)}
//           </select>
//         );
//       case "radio":
//         return (
//           <div className="mt-2 space-y-1">
//             {field.options.map((o, i) => (
//               <label key={i} className="flex gap-2">
//                 <input type="radio" name={field.id} />
//                 <span>{o}</span>
//               </label>
//             ))}
//           </div>
//         );
//       case "checkbox":
//         return (
//           <div className="mt-2 space-y-1">
//             {field.options.map((o, i) => (
//               <label key={i} className="flex gap-2">
//                 <input type="checkbox" />
//                 <span>{o}</span>
//               </label>
//             ))}
//           </div>
//         );
//       default:
//         return <input type={field.type} className={base} placeholder={field.placeholder} />;
//     }
//   };

//   // ================== UI ==================
//   return (
//     <div className="flex h-screen bg-slate-100 text-sm">

//       {/* Sidebar */}
//       <div className="w-64 bg-white border-r p-4 overflow-y-auto">
//         <h1 className="text-xl font-bold mb-1">🎨 Form Builder</h1>
//         <p className="text-gray-500 mb-4">Drag and drop to create</p>

//         <div className="mb-4">
//           <h3 className="font-semibold mb-2">Field Types</h3>
//           <div className="grid grid-cols-2 gap-2">
//             {["text","email","number","tel","textarea","date","time","select","radio","checkbox","file","signature"].map(t => (
//               <button
//                 key={t}
//                 onClick={() => addField(t)}
//                 className="bg-slate-100 hover:bg-slate-200 p-2 rounded"
//               >
//                 {t}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Main */}
//       <div className="flex-1 flex flex-col">

//         {/* Toolbar */}
//         <div className="flex justify-between items-center bg-white border-b p-3">
//           <div className="flex gap-2">
//             {["builder","preview","responses"].map(v => (
//               <button
//                 key={v}
//                 onClick={() => setCurrentView(v)}
//                 className={`px-3 py-1 rounded ${currentView===v ? "bg-blue-600 text-white" : "bg-slate-200"}`}
//               >
//                 {v}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Canvas */}
//         <div className="flex flex-1 overflow-hidden">

//           <div className="flex-1 p-6 overflow-y-auto">
//             <div className="bg-white rounded shadow p-6 max-w-3xl mx-auto">
//               <input
//                 className="text-2xl font-bold w-full outline-none"
//                 value={formState.title}
//                 onChange={e => setFormState({...formState, title:e.target.value})}
//               />
//               <textarea
//                 className="w-full mt-2 text-gray-500"
//                 placeholder="Description"
//                 value={formState.description}
//                 onChange={e => setFormState({...formState, description:e.target.value})}
//               />

//               <div className="mt-6 space-y-4">
//                 {formState.fields.map(field => (
//                   <div
//                     key={field.id}
//                     onClick={() => setSelectedFieldId(field.id)}
//                     className={`border rounded p-4 ${selectedFieldId===field.id ? "border-blue-500" : ""}`}
//                   >
//                     <div className="flex justify-between">
//                       <div className="font-semibold">{field.label}</div>
//                       <button onClick={() => deleteField(field.id)}>🗑️</button>
//                     </div>
//                     {renderInput(field)}
//                   </div>
//                 ))}
//               </div>

//               <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded">
//                 {formState.submitButtonText}
//               </button>
//             </div>
//           </div>

//           {/* Properties */}
//           <div className="w-72 bg-white border-l p-4 overflow-y-auto">
//             <h2 className="font-bold mb-3">Field Properties</h2>
//             {!selectedFieldId && <p className="text-gray-400">Select a field</p>}
//             {selectedFieldId && (() => {
//               const field = formState.fields.find(f => f.id === selectedFieldId);
//               return (
//                 <div className="space-y-3">
//                   <div>
//                     <label className="text-xs">Label</label>
//                     <input
//                       className="w-full border rounded px-2 py-1"
//                       value={field.label}
//                       onChange={e => updateFieldProperty("label", e.target.value)}
//                     />
//                   </div>

//                   <div>
//                     <label className="text-xs">Placeholder</label>
//                     <input
//                       className="w-full border rounded px-2 py-1"
//                       value={field.placeholder}
//                       onChange={e => updateFieldProperty("placeholder", e.target.value)}
//                     />
//                   </div>

//                   <label className="flex gap-2">
//                     <input
//                       type="checkbox"
//                       checked={field.required}
//                       onChange={e => updateFieldProperty("required", e.target.checked)}
//                     />
//                     Required
//                   </label>
//                 </div>
//               );
//             })()}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }



