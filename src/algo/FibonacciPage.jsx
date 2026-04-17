import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import {
  AlgoPageHeader,
  AlgoExplanation,
  AlgoVisualizationContainer,
} from "../AlgoPageTemplate";

const CODE = [
  "function fibonacci(n) {",
  "  if (n <= 1) return n;",
  "  // Create dp array to memoize results",
  "  const dp = new Array(n + 1);",
  "  dp[0] = 0;",
  "  dp[1] = 1;",
  "  // Fill dp array bottom-up",
  "  for (let i = 2; i <= n; i++) {",
  "    dp[i] = dp[i - 1] + dp[i - 2];",
  "  }",
  "  return dp[n];",
  "}",
];

const getHighlightedLine = (step) => {
  if (!step) return null;

  const explanation = (step.explanation || "").toLowerCase();

  // Check for base case logic
  if (explanation.includes("base case") || explanation.includes("n <= 1")) {
    return 1;
  }

  // Check for setting dp[1]
  if (explanation.includes("dp[1]")) {
    return 5;
  }

  // Check for setting dp[0]
  if (explanation.includes("dp[0]")) {
    return 4;
  }

  // Check for initialization
  if (
    explanation.includes("initialize") ||
    explanation.includes("create dp") ||
    explanation.includes("array")
  ) {
    return 3;
  }

  // Check for loop
  if (explanation.includes("i = 2") || explanation.includes("loop")) {
    return 7;
  }

  // Fallback: if we have an index and it's >= 2, we're likely in the computation phase
  if (step.index !== undefined && step.index >= 2) {
    return 8;  // dp[i] = dp[i - 1] + dp[i - 2];
  }

  // Check for computation (filling dp array)
  if (explanation.includes("dp[i]") && explanation.includes("=")) {
    return 8;
  }

  // Check for return
  if (explanation.includes("return") || explanation.includes("result")) {
    return 10;
  }

  return null;
};

const FibonacciPage = () => {
  const [n, setN] = useState(8);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [result, setResult] = useState(null);
  const [highlightedLine, setHighlightedLine] = useState(null);

  const timerRef = useRef(null);
  const highlightTimerRef = useRef(null);

  const fetchSteps = async () => {
    const res = await fetch("http://localhost:3000/dynamicalgo/fibonacci", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ n }),
    });
    return res.json();
  };

  const handlePlay = async () => {
    if (isPlaying) return;

    if (steps.length === 0) {
      const data = await fetchSteps();
      setSteps(data.steps || []);
      setResult(data.result);
      setCurrentStepIndex(0);
      setExplanation("Starting Fibonacci DP...");
    }

    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
    clearTimeout(highlightTimerRef.current);
  };

  const handleReplay = () => {
    clearTimeout(timerRef.current);
    clearTimeout(highlightTimerRef.current);
    setIsPlaying(false);
    setSteps([]);
    setCurrentStepIndex(0);
    setExplanation("");
    setResult(null);
    setHighlightedLine(null);
  };

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStepIndex < steps.length) {
      timerRef.current = setTimeout(() => {
        setExplanation(steps[currentStepIndex]?.explanation || "");
        const newHighlightedLine = getHighlightedLine(steps[currentStepIndex]);
        setHighlightedLine(newHighlightedLine);
        setCurrentStepIndex((prev) => prev + 1);
      }, 1000);
    } else {
      setExplanation("✅ Fibonacci computation complete");
      setIsPlaying(false);
      setHighlightedLine(null);
    }

    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const dp =
    steps.length > 0 && currentStepIndex > 0
      ? steps[Math.min(currentStepIndex - 1, steps.length - 1)].dpSnapshot
      : Array(n + 1).fill(0);

  const activeStep = currentStepIndex > 0 ? steps[currentStepIndex - 1] : null;

  const inputStyle = {
    background: "hsl(220 20% 6%)",
    border: "1px solid hsl(220 14% 22%)",
    color: "hsl(0 0% 96%)",
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 px-4 sm:px-6 text-white">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <AlgoPageHeader
          icon="🔢"
          title="Fibonacci (Dynamic Programming)"
          description="Each Fibonacci number is the sum of the two preceding numbers. DP optimizes by storing previously computed results."
          complexity={{ time: "O(n)", space: "O(n)" }}
        />

        {/* INPUT CARD */}
        <div className="card p-5 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold">Input</h3>

          <div>
            <label className="text-sm mb-2 block">Enter n (0-20)</label>
            <input
              type="number"
              min="0"
              max="20"
              value={n}
              disabled={isPlaying}
              onChange={(e) => setN(Number(e.target.value))}
              className="px-4 py-3 rounded-xl w-40 outline-none"
              style={inputStyle}
            />
          </div>
        </div>

        {/* CONTROLS + EXPLANATION */}
        <div className="card p-5 space-y-4">
          <ControlButtons
            onPlay={handlePlay}
            onPause={handlePause}
            onReplay={handleReplay}
            disabled={isPlaying}
          />

          <AlgoExplanation explanation={explanation} isPlaying={isPlaying} />
        </div>

        {/* SPLIT LAYOUT - VISUALIZATION + CODE */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* VISUALIZATION PANEL */}
          <div className="card p-4 flex-1">
            <AlgoVisualizationContainer>
              <div className="flex justify-center gap-3 flex-wrap min-h-[200px]">
                {dp.map((value, index) => {
                  let bg = "hsl(220 16% 13%)";
                  let border = "hsl(220 14% 18%)";
                  let textColor = "hsl(0 0% 96%)";

                  if (activeStep?.index === index) {
                    bg = "hsl(40 90% 55%)";
                    textColor = "hsl(220 20% 6%)";
                    border = "hsl(40 90% 55%)";
                  }

                  if (activeStep?.from?.includes(index)) {
                    bg = "hsl(262 80% 55%)";
                    textColor = "hsl(0 0% 96%)";
                    border = "hsl(262 80% 55%)";
                  }

                  return (
                    <div
                      key={index}
                      className="w-16 h-16 flex flex-col items-center justify-center rounded-xl transition-all duration-300"
                      style={{
                        background: bg,
                        border: `1px solid ${border}`,
                        color: textColor,
                      }}
                    >
                      <div className="text-xs" style={{ color: "hsl(220 10% 50%)" }}>
                        dp[{index}]
                      </div>
                      <div className="text-xl font-bold">{value}</div>
                    </div>
                  );
                })}
              </div>

              {!isPlaying && result !== null && (
                <div className="mt-8 text-center text-xl font-semibold text-green-400">
                  Fibonacci({n}) = {result}
                </div>
              )}
            </AlgoVisualizationContainer>
          </div>

          {/* CODE PANEL */}
          <div className="code flex-1">
            <CodeViewer 
              code={CODE} 
              highlightedLine={highlightedLine}
              title="fibonacci-dp.js"
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default FibonacciPage;