import React, { useState, useEffect, useRef } from "react";
import ControlButtons from "../ControlButtons";
import { AlgoPageHeader, AlgoExplanation, AlgoVisualizationContainer } from "../AlgoPageTemplate";

const CoinChangePage = () => {
  const [coinsInput, setCoinsInput] = useState("1,2,5"); const [amount, setAmount] = useState(11);
  const [steps, setSteps] = useState([]); const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); const [explanation, setExplanation] = useState("");
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);

  const fetchSteps = async (coins) => { const res = await fetch("http://localhost:3000/dynamicalgo/coinchange", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ coins, amount }) }); return res.json(); };

  const handlePlay = async () => {
    if (isPlaying) return;
    if (steps.length === 0) {
      const coins = coinsInput.split(",").map((c) => Number(c.trim())).filter((c) => !isNaN(c) && c > 0);
      if (coins.length === 0) return;
      const data = await fetchSteps(coins);
      setSteps(data.steps || []); setResult(data.result); setCurrentStepIndex(0); setExplanation("Starting Coin Change DP...");
    }
    setIsPlaying(true);
  };

  const handlePause = () => { setIsPlaying(false); clearTimeout(timerRef.current); };
  const handleReplay = () => { clearTimeout(timerRef.current); setIsPlaying(false); setSteps([]); setCurrentStepIndex(0); setExplanation(""); setResult(null); };

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStepIndex < steps.length) {
      timerRef.current = setTimeout(() => { setExplanation(steps[currentStepIndex]?.explanation || ""); setCurrentStepIndex((prev) => prev + 1); }, 900);
    } else { setExplanation("✅ Coin Change computation complete"); setIsPlaying(false); }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const dp = steps.length > 0 && currentStepIndex > 0 ? steps[Math.min(currentStepIndex - 1, steps.length - 1)].dpSnapshot : Array(amount + 1).fill(Infinity);
  const activeStep = currentStepIndex > 0 ? steps[currentStepIndex - 1] : null;
  const inputStyle = { background: 'hsl(220 20% 6%)', border: '1px solid hsl(220 14% 22%)', color: 'hsl(0 0% 96%)' };

  return (
    <div className="min-h-screen pt-32 pb-16 px-6" style={{ color: 'hsl(0 0% 96%)' }}>
      <AlgoPageHeader icon="🪙" title="Coin Change (DP)" description="Find the minimum number of coins to form a given amount using Dynamic Programming." complexity={{ time: "O(n × m)", space: "O(n)" }} />
      <div className="max-w-5xl mx-auto mb-8">
        <div className="card rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1"><label className="text-sm mb-2 block" style={{ color: 'hsl(220 10% 50%)' }}>Coins</label><input value={coinsInput} disabled={isPlaying} onChange={(e) => setCoinsInput(e.target.value)} className="w-full px-4 py-3 rounded-xl outline-none" style={inputStyle} placeholder="e.g. 1,2,5" /></div>
            <div><label className="text-sm mb-2 block" style={{ color: 'hsl(220 10% 50%)' }}>Amount</label><input type="number" min="0" value={amount} disabled={isPlaying} onChange={(e) => setAmount(Number(e.target.value))} className="px-4 py-3 rounded-xl w-32 outline-none" style={inputStyle} /></div>
          </div>
        </div>
      </div>
      <ControlButtons onPlay={handlePlay} onPause={handlePause} onReplay={handleReplay} disabled={isPlaying} />
      <AlgoExplanation explanation={explanation} isPlaying={isPlaying} />
      <AlgoVisualizationContainer>
        <div className="flex justify-center gap-3 flex-wrap">
          {dp.map((value, idx) => {
            let bg = "hsl(220 16% 13%)"; let border = "hsl(220 14% 18%)"; let textColor = "hsl(0 0% 96%)";
            if (activeStep?.currentAmount === idx) { bg = "hsl(40 90% 55%)"; textColor = "hsl(220 20% 6%)"; border = "hsl(40 90% 55%)"; }
            if (activeStep?.from === idx) { bg = "hsl(262 80% 55%)"; textColor = "hsl(0 0% 96%)"; border = "hsl(262 80% 55%)"; }
            return (
              <div key={idx} className="w-16 h-16 flex flex-col items-center justify-center rounded-xl transition-all duration-300" style={{ background: bg, border: `1px solid ${border}`, color: textColor }}>
                <div className="text-xs" style={{ color: 'hsl(220 10% 50%)' }}>dp[{idx}]</div>
                <div className="text-xl font-bold">{value === Infinity ? "∞" : value}</div>
              </div>
            );
          })}
        </div>
        {!isPlaying && result !== null && (
          <div className="mt-8 text-center text-xl font-semibold" style={{ color: result === -1 ? 'hsl(0 72% 58%)' : 'hsl(145 65% 48%)' }}>
            {result === -1 ? "❌ Amount cannot be formed" : `Minimum coins = ${result}`}
          </div>
        )}
      </AlgoVisualizationContainer>
    </div>
  );
};

export default CoinChangePage;
