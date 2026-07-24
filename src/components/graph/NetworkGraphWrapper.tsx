'use client';

import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { MagnifyingGlassIcon, SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useGlobalStore } from '../../store/globalStore';

interface NetworkGraphWrapperProps {
  criminalName?: string;
}

export default function NetworkGraphWrapper({ criminalName = 'Aditya Hegde' }: NetworkGraphWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [layoutType, setLayoutType] = useState<'concentric' | 'cose' | 'grid'>('concentric');
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useGlobalStore((state) => state.theme);
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<any>(null);

  const initialElements = [
    // Nodes
    { data: { id: 'aditya', label: 'Aditya Hegde (Wanted)', type: 'suspect', risk: 88 } },
    { data: { id: 'sanjay', label: 'Sanjay Murthy (Absconding)', type: 'suspect', risk: 72 } },
    { data: { id: 'deepak', label: 'Deepak Rao (Mule Agent)', type: 'associate', risk: 45 } },
    { data: { id: 'meena', label: 'Meena Shenoy (Fin Admin)', type: 'associate', risk: 38 } },
    { data: { id: 'vehicle1', label: 'KA-01-MJ-8822 (Fortuner)', type: 'vehicle' } },
    { data: { id: 'phone1', label: '+91 98450 11223', type: 'phone' } },
    { data: { id: 'phone2', label: '+91 98860 44921', type: 'phone' } },
    { data: { id: 'bank1', label: 'SBI A/C *9282', type: 'bank' } },
    { data: { id: 'bank2', label: 'HDFC A/C *0182', type: 'bank' } },

    // Edges
    { data: { source: 'aditya', target: 'sanjay', label: 'Financier' } },
    { data: { source: 'aditya', target: 'deepak', label: 'Recruited' } },
    { data: { source: 'aditya', target: 'meena', label: 'Reports To' } },
    { data: { source: 'aditya', target: 'vehicle1', label: 'Owner' } },
    { data: { source: 'aditya', target: 'phone1', label: 'Active' } },
    { data: { source: 'aditya', target: 'bank1', label: 'Controls' } },
    { data: { source: 'sanjay', target: 'phone2', label: 'Active' } },
    { data: { source: 'sanjay', target: 'bank2', label: 'Controls' } },
    { data: { source: 'bank1', target: 'bank2', label: '₹4.5L Phish Wire' } }
  ];

  const initCy = () => {
    if (!containerRef.current) return;

    const isDark = theme === 'dark';
    const labelColor = isDark ? '#f8fafc' : '#0f172a';
    const edgeColor = isDark ? '#94a3b8' : '#475569';
    const textBgColor = isDark ? '#020617' : '#ffffff';

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: initialElements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': isDark ? '#1e293b' : '#f1f5f9',
            'label': 'data(label)',
            'color': labelColor,
            'font-size': '12px',
            'text-valign': 'center',
            'text-halign': 'right',
            'text-margin-x': 8,
            'width': '35px',
            'height': '35px',
            'border-width': '2px',
            'border-color': '#475569',
            'overlay-opacity': 0,
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': 0.3
          } as any
        },
        {
          selector: 'node[type="suspect"]',
          style: {
            'background-color': '#7f1d1d',
            'border-color': '#ef4444',
            'width': '45px',
            'height': '45px'
          }
        },
        {
          selector: 'node[type="associate"]',
          style: {
            'background-color': '#78350f',
            'border-color': '#f59e0b'
          }
        },
        {
          selector: 'node[type="vehicle"]',
          style: {
            'background-color': '#1e3a8a',
            'border-color': '#3b82f6',
            'shape': 'hexagon'
          }
        },
        {
          selector: 'node[type="phone"]',
          style: {
            'background-color': '#065f46',
            'border-color': '#10b981',
            'shape': 'diamond'
          }
        },
        {
          selector: 'node[type="bank"]',
          style: {
            'background-color': '#14532d',
            'border-color': '#22c55e',
            'shape': 'round-rectangle'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': isDark ? '#334155' : '#cbd5e1',
            'target-arrow-color': isDark ? '#334155' : '#cbd5e1',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'color': edgeColor,
            'font-size': '10px',
            'text-background-opacity': 0.8,
            'text-background-color': textBgColor,
            'text-background-padding': '3px',
            'text-rotation': 'autorotate'
          } as any
        },
        {
          selector: '.highlighted',
          style: {
            'background-color': '#dc2626',
            'line-color': '#dc2626',
            'target-arrow-color': '#dc2626',
            'border-color': '#fca5a5',
            'border-width': '4px'
          }
        }
      ],
      layout: {
        name: layoutType,
        fit: true,
        padding: 50,
        // Concentric options
        minNodeSpacing: 90,
        avoidOverlap: true,
        // Cose force-directed options
        nodeRepulsion: (node: any) => 9000,
        idealEdgeLength: (edge: any) => 120,
        edgeElasticity: (edge: any) => 100,
        nestingFactor: 1.2,
        gravity: 1.5,
        numIter: 1500
      } as any
    });

    // Handle element selection
    cyRef.current.on('tap', 'node', (evt) => {
      const node = evt.target;
      setSelectedNodeInfo(node.data());
    });

    cyRef.current.on('tap', (evt) => {
      if (evt.target === cyRef.current) {
        setSelectedNodeInfo(null);
      }
    });
  };

  useEffect(() => {
    initCy();
    return () => {
      cyRef.current?.destroy();
    };
  }, [layoutType, theme]);

  const handleSearch = () => {
    if (!cyRef.current) return;
    cyRef.current.elements().removeClass('highlighted');
    if (!searchTerm.trim()) return;

    const matched = cyRef.current.elements().filter((ele) => {
      const label = ele.data('label') || '';
      return label.toLowerCase().includes(searchTerm.toLowerCase());
    });

    matched.addClass('highlighted');
    if (matched.length > 0) {
      cyRef.current.animate({
        center: { eles: matched.first() },
        zoom: 1.2
      });
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedNodeInfo(null);
    cyRef.current?.elements().removeClass('highlighted');
    cyRef.current?.fit();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-[500px] w-full">
      {/* Network control header */}
      <div className="bg-slate-950 p-3 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase text-slate-400">Layout:</span>
          <select
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2 py-1 rounded"
            value={layoutType}
            onChange={(e) => setLayoutType(e.target.value as any)}
          >
            <option value="concentric">Concentric AI Focus</option>
            <option value="cose">Force Directed (COSE)</option>
            <option value="grid">Structured Grid</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 pl-8 pr-3 py-1 rounded w-44 focus:outline-none focus:border-blue-600"
            />
            <MagnifyingGlassIcon className="absolute left-2 top-1.5 w-4 h-4 text-slate-500" />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-900/60 hover:bg-blue-800 border border-blue-700 text-slate-200 text-xs px-3 py-1 rounded"
          >
            Find
          </button>
          <button
            onClick={handleReset}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 p-1 rounded"
            title="Reset Graph View"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex relative">
        {/* Cytoscape Container */}
        <div ref={containerRef} className="flex-1 h-full w-full bg-slate-950" />

        {/* Selected node details panel overlay */}
        {selectedNodeInfo && (
          <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-700 text-slate-200 p-4 rounded-lg w-72 shadow-xl backdrop-blur-sm z-10">
            <h4 className="text-sm font-bold border-b border-slate-800 pb-1 mb-2 text-slate-100 flex items-center justify-between">
              <span>Node Inspector</span>
              <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-mono ${
                selectedNodeInfo.type === 'suspect' ? 'bg-red-950 text-red-400 border border-red-800' :
                selectedNodeInfo.type === 'associate' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                'bg-slate-800 text-slate-300'
              }`}>
                {selectedNodeInfo.type || 'Entity'}
              </span>
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <p><span className="text-slate-500">Label:</span> {selectedNodeInfo.label}</p>
              {selectedNodeInfo.risk && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Threat Index:</span>
                  <span className="font-bold text-red-400 font-mono">{selectedNodeInfo.risk}%</span>
                  <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-red-600 h-full" style={{ width: `${selectedNodeInfo.risk}%` }} />
                  </div>
                </div>
              )}
              <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
                Left-click canvas to close details panel. Expand links in CrimeGPT via contextual reference.
              </p>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute top-3 left-3 bg-slate-900/80 border border-slate-800 p-2 rounded text-[10px] space-y-1 z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-red-400 inline-block" />
            <span className="text-slate-300">Primary Suspect</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 border border-amber-400 inline-block" />
            <span className="text-slate-300">Known Associate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-blue-600 border border-blue-400 inline-block" />
            <span className="text-slate-300">Vehicles</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-600 border border-emerald-400 inline-block" />
            <span className="text-slate-300">Financial Nodes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
