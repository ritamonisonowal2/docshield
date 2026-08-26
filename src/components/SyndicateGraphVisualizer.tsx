import React, { useState } from 'react';
import { SyndicateGraphData, GraphNode } from '../types';
import { 
  Network, 
  AlertOctagon, 
  Play, 
  User, 
  Phone, 
  Home, 
  Camera, 
  ShieldCheck,
  Check,
  Radio,
  FileCheck2
} from 'lucide-react';



interface SyndicateGraphVisualizerProps {
  graphData: SyndicateGraphData;
  applicantName: string;
  theme?: 'dark' | 'light';
}

export const SyndicateGraphVisualizer: React.FC<SyndicateGraphVisualizerProps> = ({
  graphData,
  applicantName,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const hasData = graphData && graphData.nodes && graphData.nodes.length > 0;
  const activeGraph = graphData;

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isBfsTraversing, setIsBfsTraversing] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(-1);

  const startBfsSimulation = () => {
    if (!hasData) return;
    setIsBfsTraversing(true);
    setActiveStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= activeGraph.nodes.length) {
        clearInterval(interval);
        setIsBfsTraversing(false);
      } else {
        setActiveStep(step);
        setSelectedNode(activeGraph.nodes[step]);
      }
    }, 600);
  };

  const getNodeIcon = (type: GraphNode['type']) => {
    switch (type) {
      case 'applicant':
        return <User className="w-4.5 h-4.5" />;
      case 'phone':
        return <Phone className="w-4.5 h-4.5" />;
      case 'address':
        return <Home className="w-4.5 h-4.5" />;
      case 'photo_hash':
        return <Camera className="w-4.5 h-4.5" />;
      default:
        return <Network className="w-4.5 h-4.5" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* SECTION HERO HEADER */}
      <div className={`surface-card rounded-3xl p-6 sm:p-8 border shadow-xl ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161b27] border-slate-800 text-white'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-[#0a0d16] border-slate-750 text-accent-400'
            }`}>
              <Network className="w-3.5 h-3.5 text-accent-500" />
              <span>GRAPH BFS TRAVERSAL ENGINE</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Identity Recycling Syndicate Network
            </h1>
            <p className={`text-sm max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Multi-hop graph traversal algorithm identifies linked phone numbers, drop addresses, 
              and perceptual facial duplicate hashes across organized fraud rings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {hasData ? (
              activeGraph.fraudRingDetected ? (
                <span className="bg-rose-950/70 text-rose-200 text-xs font-bold px-4 py-2 rounded-xl border border-rose-800 flex items-center gap-2 shadow-sm">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  <span>FRAUD RING DETECTED</span>
                </span>
              ) : (
                <span className="bg-emerald-950/70 text-emerald-200 text-xs font-bold px-4 py-2 rounded-xl border border-emerald-800 flex items-center gap-2 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>CLEAN ISOLATED ENTITY</span>
                </span>
              )
            ) : (
              <span className={`text-xs font-mono px-4 py-2 rounded-xl border flex items-center gap-2 ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}>
                <Network className="w-4 h-4" />
                <span>Awaiting Document Upload</span>
              </span>
            )}

            <button
              type="button"
              onClick={startBfsSimulation}
              disabled={!hasData || isBfsTraversing}
              className={`px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md ${
                !hasData || isBfsTraversing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                  : 'bg-accent-600 hover:bg-accent-500 text-white cursor-pointer'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>{isBfsTraversing ? 'Running BFS Traversal...' : 'Run BFS Traversal'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* EMPTY STATE — shown when no document is uploaded */}
      {!hasData && (
        <div className={`surface-card rounded-3xl border flex flex-col items-center justify-center py-24 px-8 text-center ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#161b27] border-slate-800'
        }`}>
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border ${
            isLight ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-slate-800/60 border-slate-700 text-slate-500'
          }`}>
            <Network className="w-10 h-10" />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${isLight ? 'text-slate-800' : 'text-white'}`}>
            No Syndicate Data Available
          </h3>
          <p className={`text-sm max-w-sm leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Upload and analyse a document first. The network graph will automatically populate with identity linkage data once a case is processed.
          </p>
        </div>
      )}

      {/* Main Interactive Graph & Details Grid — only shown when data is loaded */}
      {hasData && <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left 8 Cols: Interactive Graph SVG Canvas */}
        <div className={`lg:col-span-8 surface-card rounded-3xl p-6 sm:p-8 border flex flex-col justify-between min-h-[480px] relative overflow-hidden shadow-xl ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161b27] border-slate-800 text-white'
        }`}>
          
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-mesh-pattern opacity-30 pointer-events-none" />

          {/* Top Canvas Bar */}
          <div className={`relative z-10 flex items-center justify-between pb-4 border-b mb-4 text-xs ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <span className={`font-mono font-bold flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
              <Radio className="w-3.5 h-3.5 text-accent-500" />
              TOPOLOGY: {activeGraph.nodes.length} ENTITIES • {activeGraph.links.length} RELATIONAL EDGES
            </span>
            <span className={`font-mono hidden sm:inline ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Click node to inspect identity chain
            </span>
          </div>

          {/* SVG for Network Graph */}
          <div className="relative flex-1 flex items-center justify-center min-h-[380px]">
            <svg className="w-full h-full min-h-[380px] relative z-10" viewBox="0 0 540 440">
              {/* Draw Links */}
              {activeGraph.links.map((link, idx) => {
                const srcNode = activeGraph.nodes.find(n => n.id === link.source);
                const tgtNode = activeGraph.nodes.find(n => n.id === link.target);
                if (!srcNode || !tgtNode) return null;

                const isFraud = link.isFraudLink || srcNode.status === 'fraud_ring' || tgtNode.status === 'fraud_ring';

                return (
                  <g key={idx}>
                    <line
                      x1={srcNode.x ?? 250}
                      y1={srcNode.y ?? 200}
                      x2={tgtNode.x ?? 250}
                      y2={tgtNode.y ?? 200}
                      stroke={isFraud ? '#f43f5e' : isLight ? '#cbd5e1' : '#334155'}
                      strokeWidth={isFraud ? '2.5' : '1.5'}
                      strokeDasharray={isFraud ? '5 3' : undefined}
                    />
                    {/* Link Label */}
                    <text
                      x={((srcNode.x ?? 250) + (tgtNode.x ?? 250)) / 2}
                      y={((srcNode.y ?? 200) + (tgtNode.y ?? 200)) / 2 - 5}
                      fill={isFraud ? '#e11d48' : isLight ? '#64748b' : '#94a3b8'}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {link.label}
                    </text>
                  </g>
                );
              })}

              {/* Draw Nodes */}
              {activeGraph.nodes.map((node, idx) => {
                const isSelected = selectedNode?.id === node.id;
                const isHighlightedByBfs = activeStep >= idx;
                const isFraud = node.status === 'fraud_ring';
                const isTarget = node.status === 'active_target';

                const x = node.x ?? 250;
                const y = node.y ?? 200;

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer group"
                  >
                    {/* Outer Pulse Ring */}
                    {(isFraud || isTarget) && (
                      <circle
                        cx={x}
                        cy={y}
                        r={isTarget ? 32 : 28}
                        fill={isFraud ? '#f43f5e' : '#e5a52e'}
                        opacity={isSelected || isHighlightedByBfs ? '0.35' : '0.12'}
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isTarget ? 24 : 20}
                      fill={
                        isTarget
                          ? '#b26f12'
                          : isFraud
                          ? '#881337'
                          : isLight
                          ? '#f1f5f9'
                          : '#1e293b'
                      }
                      stroke={
                        isSelected
                          ? '#2563eb'
                          : isFraud
                          ? '#f43f5e'
                          : isTarget
                          ? '#e5a52e'
                          : isLight
                          ? '#94a3b8'
                          : '#475569'
                      }
                      strokeWidth={isSelected ? '3' : '1.5'}
                    />

                    {/* Node Label Text */}
                    <text
                      x={x}
                      y={y + 36}
                      fill={isLight ? '#0f172a' : '#ffffff'}
                      fontSize="11.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {node.label}
                    </text>

                    {node.subLabel && (
                      <text
                        x={x}
                        y={y + 50}
                        fill={isFraud ? '#e11d48' : isLight ? '#64748b' : '#94a3b8'}
                        fontSize="9.5"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {node.subLabel}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Graph Legend Overlay */}
          <div className={`relative z-10 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-600 inline-block shadow-sm" />
                <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Target Applicant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-600 inline-block shadow-sm" />
                <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Duplicate Syndicate Entity</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full inline-block shadow-sm ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />
                <span className={`font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Clean Entity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Syndicate Analysis & Node Inspector */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          
          {/* Syndicate Status Card */}
          <div
            className={`surface-card rounded-3xl p-7 border flex flex-col justify-between ${
              activeGraph.fraudRingDetected
                ? isLight ? 'border-rose-200 bg-rose-50' : 'border-rose-900/60 bg-rose-950/25'
                : isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161b27] border-slate-800 text-white'
            }`}
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activeGraph.fraudRingDetected
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {activeGraph.fraudRingDetected ? (
                    <AlertOctagon className="w-5 h-5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className={`font-bold text-sm uppercase tracking-wide ${
                    activeGraph.fraudRingDetected ? 'text-rose-700' : isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {activeGraph.syndicateName || 'Entity Topology Summary'}
                  </h4>
                  <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Cluster Analysis
                  </span>
                </div>
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                {activeGraph.explanation}
              </p>
            </div>

            <div className={`text-xs font-mono p-3.5 rounded-2xl border space-y-1.5 ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0a0d16] border-slate-800'
            }`}>
              <div className="flex justify-between">
                <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Total Network Entities:</span>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{activeGraph.nodes.length} Nodes</span>
              </div>
              <div className="flex justify-between">
                <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Flagged Duplicates:</span>
                <span className="text-rose-500 font-bold">{activeGraph.duplicateCount} Connected</span>
              </div>
            </div>
          </div>

          {/* Selected Node Details Card */}
          {selectedNode ? (
            <div className={`surface-card rounded-3xl p-7 border shadow-md ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161b27] border-slate-800 text-white'
            }`}>
              <span className="text-xs font-bold uppercase tracking-wider text-accent-500 block mb-3">
                Node Inspector
              </span>
              
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl border ${
                  isLight ? 'bg-slate-100 text-accent-600 border-slate-200' : 'bg-[#0a0d16] text-accent-400 border-slate-750'
                }`}>
                  {getNodeIcon(selectedNode.type)}
                </div>
                <div>
                  <div className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{selectedNode.label}</div>
                  <div className={`text-xs font-mono mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-300'}`}>{selectedNode.subLabel}</div>
                </div>
              </div>

              <div className={`text-xs space-y-2 pt-3 border-t font-mono ${
                isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800 text-slate-200'
              }`}>
                <div className="flex justify-between">
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Entity Type:</span>
                  <span className={`font-bold uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>{selectedNode.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Security Classification:</span>
                  <span
                    className={`font-bold ${
                      selectedNode.status === 'fraud_ring'
                        ? 'text-rose-500'
                        : selectedNode.status === 'active_target'
                        ? 'text-amber-500'
                        : 'text-emerald-500'
                    }`}
                  >
                    {selectedNode.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className={`surface-card rounded-3xl p-7 border text-xs italic ${
              isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-[#161b27] border-slate-800 text-slate-400'
            }`}>
              Click on any graph node to inspect identity connections.
            </div>
          )}

          {/* BFS Path Breakdown */}
          {activeGraph.bfsTraversalPaths.length > 0 && (
            <div className={`surface-card rounded-3xl p-6 border ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161b27] border-slate-800 text-white'
            }`}>
              <span className={`text-xs font-bold uppercase tracking-wider block mb-3 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Flagged Multi-Hop Traversal Chains
              </span>
              <div className="space-y-2">
                {activeGraph.bfsTraversalPaths.map((path, idx) => (
                  <div
                    key={idx}
                    className={`text-xs font-mono px-3 py-2 rounded-xl border truncate ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0a0d16] border-slate-800 text-slate-200'
                    }`}
                    title={path.join(' ➔ ')}
                  >
                    Chain #{idx + 1}: {path.join(' ➔ ')}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>}
    </div>
  );
};
