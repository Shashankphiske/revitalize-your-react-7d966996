import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import {
  AlgoPageHeader,
  AlgoExplanation,
  AlgoVisualizationContainer,
} from "../AlgoPageTemplate";

const COIN_CHANGE_CODE = [
  "function coinChange(coins, amount) {",
  "  const dp = Array(amount + 1).fill(Infinity);",
  "  dp[0] = 0;",
  "  const steps = [];",
  "",
  "  for (let i = 1; i <= amount; i++) {",
  "    for (const coin of coins) {",
  "      if (i - coin >= 0 && dp[i - coin] !== Infinity) {",
  "        const candidate = dp[i - coin] + 1;",
  "        if (candidate < dp[i]) {",
  "          dp[i] = candidate;",
  "          steps.push({",
  "            currentAmount: i,",
  "            coin,",
  "            dpSnapshot: [...dp],",
  "            explanation: `dp[${i}] = min(dp[${i}], dp[${i - coin}] + 1) = ${dp[i]}`,",
  "          });",
  "        }",
  "      }",
  "    }",
  "  }",
  "  return { steps, result: dp[amount] === Infinity ? -1 : dp[amount] };",
  "}",
];

const getHighlightedLine = (step) => {
  if (!step) return null;

  const explanation = (step.explanation || "").toLowerCase();

  // Check for initialization of dp[0]
  if (explanation.includes("dp[0]") || explanation.includes("initialize")) {
    return 2;
  }

  // Check for outer loop
  if (explanation.includes("i = 1") || explanation.includes("for amount")) {
    return 5;
  }

  // Check if we're checking coins
  if (explanation.includes("coin")) {
    return 6;
  }

  // Check for condition check (i - coin >= 0)
  if (explanation.includes("check") || explanation.includes("valid")) {
    return 7;
  }

  // Check for candidate calculation
  if (explanation.includes("candidate")) {
    return 8;
  }

  // Check for comparison (if candidate < dp[i])
  if (explanation.includes("compare") || explanation.includes("better")) {
    return 9;
  }

  // Check for dp update
  if (explanation.includes("dp[") && explanation.includes("=")) {
    return 10;
  }

  // Check for return/result
  if (explanation.includes("return") || explanation.includes("result")) {
    return 21;
  }

  // If we have currentAmount, we're likely in the computation phase
  if (step.currentAmount !== undefined) {
    return 10;  // dp[i] = candidate;
  }

  return null;
};

const CoinChangePage = () => {
  const [coinsInput, setCoinsInput] = useState("1,2,5");
  const [amount, setAmount] = useState(11);

  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");
  const [explanation, setExplanation] = useState("");
  const [highlightedLine, setHighlightedLine] = useState(null);

  const timerRef = useRef(null);

  const fetchSteps = async (coins) => {
    const res = await fetch(
      "http://localhost:3000/dynamicalgo/coinchange",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coins, amount }),
      }
    );
    return res.json();
  };

  const handlePlay = async () => {
    if (isPlaying) return;

    const coins = coinsInput.split(",").map((c) => Number(c.trim())).filter((c) => !isNaN(c) && c > 0);

    if (coins.length === 0) return;

    setError("");
    setSteps([]);
    setCurrentStepIndex(0);
    setExplanation("Starting Coin Change DP...");

    const data = await fetchSteps(coins);
    setSteps(data.steps || []);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
  };

  const handleReplay = () => {
    clearTimeout(timerRef.current);
    setIsPlaying(false);
    setSteps([]);
    setCurrentStepIndex(0);
    setExplanation("");
  };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) return;

    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];

      setExplanation(step.explanation);
      setHighlightedLine(getHighlightedLine(step));
      setCurrentStepIndex((i) => i + 1);
    }, 1500);

    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const dp =
    steps.length > 0 && currentStepIndex > 0
      ? steps[Math.min(currentStepIndex - 1, steps.length - 1)].dpSnapshot
      : Array(amount + 1).fill(Infinity);

  const inputStyle = {
    background: "hsl(220 20% 6%)",
    border: "1px solid hsl(220 14% 22%)",
    color: "hsl(0 0% 96%)",
  };
  return (
    <div className="min-h-screen pt-32 pb-16 px-6 text-white">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Section */}
        <AlgoPageHeader
          icon="🪙"
          title="Coin Change (DP)"
          description="Find minimum coins required to form a given amount using dynamic programming."
          complexity={{ time: "O(n × m)", space: "O(n)" }}
        />

        {/* Input Section */}
        <div className="card p-5 space-y-4">
          <h3 className="text-lg font-semibold">Input</h3>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-400 mb-1 block">Coins</label>
              <input
                value={coinsInput}
                disabled={isPlaying}
                onChange={(e) => setCoinsInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl"
                style={inputStyle}
                placeholder="e.g. 1,2,5"
              />
            </div>

            <div className="w-32">
              <label className="text-sm text-gray-400 mb-1 block">Amount</label>
              <input
                type="number"
                min="0"
                value={amount}
                disabled={isPlaying}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="card p-5 space-y-4">
          <ControlButtons
            onPlay={handlePlay}
            onPause={handlePause}
            onReplay={handleReplay}
            disabled={isPlaying}
          />
          <AlgoExplanation explanation={explanation} isPlaying={isPlaying} />
        </div>

        {/* Split Layout Section */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Visualization Panel */}
          <div className="card p-4 flex-1">
            <AlgoVisualizationContainer>
              <div className="flex justify-center gap-3 flex-wrap min-h-[200px]">
                {dp.map((value, idx) => {
                  let bg = "#111827";
                  let border = "#1f2937";
                  let textColor = "#fff";

                  if (steps[currentStepIndex - 1]?.currentAmount === idx) {
                    bg = "#f59e0b";
                    textColor = "#000";
                  }

                  return (
                    <div
                      key={idx}
                      className="w-16 h-16 flex flex-col items-center justify-center rounded-xl transition-all duration-300"
                      style={{
                        background: bg,
                        border: `1px solid ${border}`,
                        color: textColor,
                      }}
                    >
                      <div className="text-xs text-gray-400">
                        dp[{idx}]
                      </div>
                      <div className="text-lg font-bold">
                        {value === Infinity ? "∞" : value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </AlgoVisualizationContainer>
          </div>

          {/* Code Panel */}
          <div className="code flex-1">
            <CodeViewer
              code={COIN_CHANGE_CODE}
              highlightedLine={highlightedLine}
              title="coin-change-algorithm.js"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default CoinChangePage;