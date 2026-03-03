// Reusable template styles for algorithm visualization pages

export const AlgoPageHeader = ({ icon, title, description, complexity }) => (
  <div className="text-center max-w-4xl mx-auto mb-8">
    <div className="inline-block mb-4">
      <div className="w-14 h-14 rounded-xl flex items-center justify-center glow" style={{ background: 'hsl(168 80% 50%)' }}>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
    <h1 className="text-4xl md:text-5xl font-bold mb-4">
      <span className="gradient-text">{title}</span>
    </h1>
    
    <div className="card rounded-2xl p-6 text-left">
      <h2 className="text-xl font-semibold mb-3 gradient-text-secondary">About {title}</h2>
      <p className="text-sm mb-3 leading-relaxed" style={{ color: 'hsl(220 10% 60%)' }}>
        {description}
      </p>
      {complexity && (
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="px-4 py-2 rounded-lg" style={{ background: 'hsl(220 16% 10%)', border: '1px solid hsl(220 14% 18%)' }}>
            <span className="text-xs" style={{ color: 'hsl(220 10% 50%)' }}>Time</span>
            <div className="font-semibold" style={{ color: 'hsl(40 90% 55%)' }}>{complexity.time}</div>
          </div>
          <div className="px-4 py-2 rounded-lg" style={{ background: 'hsl(220 16% 10%)', border: '1px solid hsl(220 14% 18%)' }}>
            <span className="text-xs" style={{ color: 'hsl(220 10% 50%)' }}>Space</span>
            <div className="font-semibold" style={{ color: 'hsl(145 65% 48%)' }}>{complexity.space}</div>
          </div>
          {complexity.stable && (
            <div className="px-4 py-2 rounded-lg" style={{ background: 'hsl(220 16% 10%)', border: '1px solid hsl(220 14% 18%)' }}>
              <span className="text-xs" style={{ color: 'hsl(220 10% 50%)' }}>Stability</span>
              <div className="font-semibold" style={{ color: 'hsl(168 80% 50%)' }}>{complexity.stable}</div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

export const AlgoControls = ({ 
  input, setInput, isPlaying, error, 
  handlePlay, handlePause, handleReplay,
  inputLabel = "Enter array (comma-separated numbers)",
  placeholder = "e.g., 5,3,8,4,2",
  examples = "Try: 5,3,8,4,2 or 64,34,25,12,22,11,90"
}) => (
  <div className="max-w-5xl mx-auto mb-8">
    <div className="card rounded-2xl p-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end justify-between">
        <div className="flex-1 w-full lg:w-auto">
          <label className="text-sm mb-2 block" style={{ color: 'hsl(220 10% 50%)' }}>
            {inputLabel}
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isPlaying}
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-xl transition-all outline-none"
            style={{
              background: 'hsl(220 20% 6%)',
              border: '1px solid hsl(220 14% 22%)',
              color: 'hsl(0 0% 96%)',
            }}
          />
          {error && <p className="text-sm mt-2" style={{ color: 'hsl(0 72% 58%)' }}>{error}</p>}
          {examples && <p className="text-xs mt-2" style={{ color: 'hsl(220 10% 40%)' }}>{examples}</p>}
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handlePlay} disabled={isPlaying} 
            className="px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-40 flex items-center gap-2"
            style={{ background: 'hsl(168 80% 50%)', color: 'hsl(220 20% 6%)' }}
          >
            ▶ Play
          </button>
          <button 
            onClick={handlePause} disabled={!isPlaying}
            className="px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-40 flex items-center gap-2"
            style={{ background: 'hsl(40 90% 55%)', color: 'hsl(220 20% 6%)' }}
          >
            ⏸ Pause
          </button>
          <button 
            onClick={handleReplay}
            className="px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 btn-outline"
          >
            ↻ Replay
          </button>
        </div>
      </div>
    </div>
  </div>
);

export const AlgoExplanation = ({ explanation, isPlaying }) => (
  <div className="max-w-5xl mx-auto mb-8">
    <div className="card rounded-2xl p-6 text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'pulse' : ''}`} style={{ background: isPlaying ? 'hsl(168 80% 50%)' : 'hsl(220 10% 40%)' }} />
        <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'hsl(220 10% 50%)' }}>
          {isPlaying ? 'Running' : 'Ready'}
        </span>
      </div>
      <p className="text-lg font-medium" style={{ color: 'hsl(168 80% 60%)' }}>
        {explanation || "Click Play to start the visualization"}
      </p>
    </div>
  </div>
);

export const AlgoVisualizationContainer = ({ children, className = "" }) => (
  <div className="max-w-6xl mx-auto">
    <div className={`card rounded-2xl p-8 ${className}`}>
      {children}
    </div>
  </div>
);
