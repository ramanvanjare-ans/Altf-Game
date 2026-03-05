import { useState, useCallback, useRef, useMemo } from 'react';
import {ReactFlow,Controls, MiniMap, Background,BackgroundVariant,addEdge, useNodesState, useEdgesState, Connection,Node,  Edge, ReactFlowProvider,Panel, MarkerType,  useReactFlow, 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {Download, Plus, Trash2, ArrowLeft, Sparkles, Workflow, Edit3, ChevronLeft,ChevronRight, Undo2, Redo2, ZoomIn, ZoomOut,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { Sidebar } from '../components/sidebar';
import { ProcessNode } from '../nodes/processNode';
import { DecisionNode } from '../nodes/decisionNode';
import { StartNode } from '../nodes/startNode';
import { IONode } from '../nodes/IONode';
import { DatabaseNode } from '../nodes/dataBaseNode';
import { DocumentNode } from '../nodes/documentNode';
import { CommentNode } from '../nodes/commentNode';
import { SubprocessNode } from '../nodes/subProcessNode';
import { demoEdges, demoNodes } from '../data/demoFlowChart';
import { Button } from '@/shared/ui/Button';



const nodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
  startEnd: StartNode,
  ioNode: IONode,
  database: DatabaseNode,
  document: DocumentNode,
  comment: CommentNode,
  subprocess: SubprocessNode,
};

const defaultEdgeOptions = {
  style: { strokeWidth: 2, stroke: '#6366f1' },
  type: 'smoothstep' ,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#6366f1',
  },
  animated: true,
};

let nodeIdCounter = 1;
const getNodeId = () => `node_${nodeIdCounter++}_${Date.now()}`;

 function FlowChartEditor() {
  const [isCreating, setIsCreating] = useState(false);
  const [flowchartTitle, setFlowchartTitle] = useState('My Flowchart');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [dNodes] = useNodesState(demoNodes);
  const [dEdges] = useEdgesState(demoEdges);

  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            ...defaultEdgeOptions,
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow-type');
      const label = event.dataTransfer.getData('application/reactflow-label');

      if (!type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getNodeId(),
        type,
        position,
        data: {
          label: label || type,
          onLabelChange: undefined,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes]
  );

  const onDeleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) => eds.filter((e) => !e.selected));
  }, [setNodes, setEdges]);

  const onClearAll = useCallback(() => {
    if (confirm('Are you sure you want to clear all nodes?')) {
      setNodes([]);
      setEdges([]);
    }
  }, [setNodes, setEdges]);

  const handleStartCreating = useCallback(() => {
    setIsCreating(true);
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  const handleBackToDemo = useCallback(() => {
    setIsCreating(false);
    setNodes([]);
    setEdges([]);
    setFlowchartTitle('My Flowchart');
  }, [setNodes, setEdges]);

  const downloadPDF = useCallback(async () => {
    const flowElement = document.querySelector('.react-flow') ;
    if (!flowElement) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(flowElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imgWidth + 40, imgHeight + 100],
      });

      // Add title
      pdf.setFontSize(24);
      pdf.setTextColor(99, 102, 241);
      pdf.text(flowchartTitle, 20, 35);

      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, 55);

      // Add the flowchart image
      pdf.addImage(imgData, 'PNG', 20, 70, imgWidth, imgHeight);

      pdf.save(`${flowchartTitle.replace(/\s+/g, '_')}_flowchart.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Error generating PDF. Please try again.');
    }
  }, [flowchartTitle]);














  // Demo View
  if (!isCreating) {
    return (

         
<div>

 <h1 className="heading text-center animate-fade-up pt-5">Flow Chart Maker</h1>
             <p className="description text-center animate-fade-up pt-1 ">Create flowcharts with ease for your project working flow process.</p>


      <div className="h-screen w-screen flex bg-(--background) text-(--foreground) overflow-hidden">


 
  


        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-72'} bg-(--card) border-r border-(--border) flex flex-col transition-all duration-300 shadow-sm`}>
          {/* Logo */}
          <div className="p-4 border-b border-(--border)">  
            <div className="flex items-center gap-2">
              {/* <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Workflow size={18} className="text-white" />
              </div> */}
              {!sidebarCollapsed && (
                <div>
                  <h1 className="subheading">FlowCraft</h1>
                  {/* <p className="text-[10px] text-slate-400">Flow Chart Maker</p> */}
                </div>
              )}
            </div>
          </div>

          {/* Toggle */}
          {/* <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute left-[calc(theme(spacing.72)-12px)] top-20 z-50 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-all"
            style={sidebarCollapsed ? { left: '52px' } : {}}
          >
            {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button> */}











          {/* Content */}
          {!sidebarCollapsed && (
            <div className="flex-1 overflow-y-auto p-4">
              <Sidebar />

              {/* <div className="mt-6 pt-4 border-t border-(--border)">
                <button
                  onClick={handleStartCreating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 active:scale-[0.98]"
                >
                  <Plus size={18} />
                  Create Flowchart
                </button>
              </div> */}
            </div>
          )}
        </div>






        {/* Demo Area */}
        <div className="flex-1 flex flex-col">

          




          




          {/* Header */}
          <div className="bg-(--card) border-b border-(--border) px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
             





              {/* <Sparkles size={20} className="text-amber-500" /> */}
              {/* <div>
                <h2 className="text-lg font-bold text-slate-800">Demo Flowchart</h2>
                <p className="text-xs text-slate-400">Interactive preview - Click "Create Flowchart" to start building</p>
              </div> */}
            </div>
            <Button
              onClick={handleStartCreating}
              
            >
              <Plus size={16} />
              Create Your Flowchart
            </Button>
          </div>

          {/* Demo Flow */}
          <div className="flex-1">
            <ReactFlow
              nodes={dNodes}
              edges={dEdges}
              nodeTypes={nodeTypes}
              defaultEdgeOptions={defaultEdgeOptions}
              fitView
              attributionPosition="bottom-left"
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              panOnDrag={true}
              zoomOnScroll={true}
            >
              <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e2e8f0" />
              <Controls showInteractive={false} />
              <MiniMap
                nodeColor={(n) => {
                  switch (n.type) {
                    case 'startEnd': return '#22c55e';
                    case 'process': return '#3b82f6';
                    case 'decision': return '#f59e0b';
                    case 'ioNode': return '#8b5cf6';
                    case 'database': return '#06b6d4';
                    case 'document': return '#f43f5e';
                    default: return '#6366f1';
                  }
                }}
                maskColor="rgba(0,0,0,0.08)"
                className="bg-(--card) border border-(--border) rounded-xl shadow-lg"
              />
            </ReactFlow>
          </div>
        </div>
      </div>
      </div>
    );
  }

  // Create Mode
  return (
    <div className="h-screen w-screen flex  overflow-hidden">
        
        


      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-72'} bg-(--card) border-r border-(--border) flex flex-col transition-all duration-300 shadow-sm relative`}>
        {/* Logo */}
        <div className="p-4 border-b border-(--border)">
          <div className="flex items-center gap-2">
          
            {!sidebarCollapsed && (
              <div>
                <h1 className="subheading">FlowCraft</h1>
               
              </div>
            )}
          </div>
        </div>

        {/* Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute top-20 z-50 w-6 h-6 bg-(--card) border border-(--border) rounded-full flex items-center justify-center shadow-sm  transition-all"
          style={sidebarCollapsed ? { left: '52px' } : { left: 'calc(288px - 12px)' }}
        >
          {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {!sidebarCollapsed && (
          <div className="flex-1 overflow-y-auto p-4">
            <Sidebar />

            <div className="mt-6 pt-4 border-t border-(--border) space-y-3">
              <button
                onClick={onDeleteSelected}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all border border-red-100 cursor-pointer"
              >
                <Trash2 size={15} />
                Delete Selected
              </button>
              <button
                onClick={onClearAll}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium  transition-all border border-(--border) cursor-pointer"
              >
                <Trash2 size={15} />
                Clear All
              </button>
              <button
                onClick={handleBackToDemo}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-(--primary) text-white  rounded-xl font-medium  transition-all border border-(--border) cursor-pointer"
              >
                <ArrowLeft size={15} />
                Back to Demo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col" ref={reactFlowWrapper}>
        {/* Header */}
        <div className="bg-(--card) border-b border-(--border) px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Edit3 size={18} className="text-(--primary)" />
            {isEditingTitle ? (
              <input
                type="text"
                value={flowchartTitle}
                onChange={(e) => setFlowchartTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingTitle(false); }}
                autoFocus
                className="text-lg font-bold text-(--foreground) outline-none border-b-2   px-1"
                placeholder="Enter flowchart title..."
              />
            ) : (
              <h2
                className="text-lg font-bold text-(--foreground) cursor-pointer transition-colors"
                onClick={() => setIsEditingTitle(true)}
                title="Click to edit title"
              >
                {flowchartTitle}
              </h2>
            )}
            <button
              onClick={() => setIsEditingTitle(!isEditingTitle)}
              className="p-1 rounded-lg  transition-colors"
            >
              <Edit3 size={14} className="text-(--muted-foreground)" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs text-(--foreground) mr-3 bg-(--card) px-3 py-1.5 rounded-lg">
              {nodes.length} nodes · {edges.length} connections
            </div>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg cursor-pointer "
            >
              <Download size={16} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onInit={(instance) => setReactFlowInstance(instance)}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
            deleteKeyCode={['Backspace', 'Delete']}
            multiSelectionKeyCode="Shift"
            attributionPosition="bottom-left"
            connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1}  />
            <Controls />
            <MiniMap
              nodeColor={(n) => {
                switch (n.type) {
                  case 'startEnd': return '#22c55e';
                  case 'process': return '#3b82f6';
                  case 'decision': return '#f59e0b';
                  case 'ioNode': return '#8b5cf6';
                  case 'database': return '#06b6d4';
                  case 'document': return '#f43f5e';
                  case 'comment': return '#eab308';
                  case 'subprocess': return '#6366f1';
                  default: return '#6366f1';
                }
              }}
              maskColor="rgba(0,0,0,0.08)"
              className="bg-(--card) border border-(--border) rounded-xl shadow-lg "
            />

            {/* Empty state */}
            {nodes.length === 0 && (
              <Panel position="top-center">
                <div className="mt-32 text-center bg-(--card) backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-(--border) max-w-md">
                  <div className="w-16 h-16 bg-(--card) rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Workflow size={32} className="text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-bold text-(--muted-foreground) mb-2">Start Building!</h3>
                  <p className="text-(--muted-foreground) text-sm leading-relaxed">
                    Drag nodes from the sidebar and drop them here. Connect nodes by dragging from one handle to another. Double-click any node to edit its text.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">Drag & Drop</span>
                    <span className="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-full font-medium">Connect Nodes</span>
                    <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full font-medium">Double Click to Edit</span>
                    <span className="text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-medium">Export as PDF</span>
                  </div>
                </div>
              </Panel>
            )}
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default  function ToolHome() {
  return (
    <ReactFlowProvider>
      <FlowChartEditor />
    </ReactFlowProvider>
  );
}
