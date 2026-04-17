import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import {
  AlgoPageHeader,
  AlgoExplanation,
  AlgoVisualizationContainer,
} from "../AlgoPageTemplate";

const STACK_POP_CODE = [
  "function pop(stack) {",
  "  if (stack.top < 0) return 'underflow';",
  "  return stack[stack.top--];",
  "}",
];

const getHighlightedLine = (step) => {
  if (!step) return null;
  if (step.underflow) return 1;
  if (step.action === "pop-start" || step.action === "pop-complete") return 2;
  return null;
};

const StackPopPage = () => {
  const [initialStack, setInitialStack] = useState("10,20,30,40,50");
  const [popCount, setPopCount] = useState("2");

  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");
  const [highlightedLine, setHighlightedLine] = useState(null);

  const timerRef = useRef(null);

  const fetchSteps = async (stack, count) => {
    const res = await fetch(
      "http://localhost:3000/stackalgo/stackpop",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stack,
          pop: count,
        }),
      }
    );

    return (await res.json()).steps;
  };

  const handlePlay = async () => {
    if (isPlaying) return;

    try {
      const stack = initialStack
        .split(",")
        .map((n) => Number(n.trim()))
        .filter((n) => !isNaN(n));

      const count = parseInt(popCount);

      if (stack.length === 0) {
        setError("Invalid stack!");
        return;
      }

      if (isNaN(count) || count <= 0) {
        setError("Pop count must be positive!");
        return;
      }

      setError("");
      setSteps([]);
      setCurrentStepIndex(0);
      setExplanation("Starting Stack Pop...");

      const data = await fetchSteps(stack, count);
      setSteps(data);

      setIsPlaying(true);
    } catch {
      setError("Something went wrong.");
    }
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
    setError("");
    setExplanation("");
    setHighlightedLine(null);
  };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) return;

    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];

      if (step.underflow) {
        setExplanation("Stack empty!");
        setIsPlaying(false);
        return;
      }

      setExplanation(
        step.action === "pop-start"
          ? `Popping ${step.pointer?.current}...`
          : "Pop complete."
      );

      setHighlightedLine(getHighlightedLine(step));
      setCurrentStepIndex((prev) => prev + 1);
    }, 1500);

    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps]);

  const currentStep = steps[currentStepIndex - 1] || {};

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
          icon="📤"
          title="Stack Pop"
          description="Pop removes the top element from the stack (LIFO – Last In First Out)."
          complexity={{
            time: "O(1)",
            space: "O(1)",
          }}
        />

        {/* INPUT CARD */}
        <div className="card p-5 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold">Input</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              value={initialStack}
              onChange={(e) => setInitialStack(e.target.value)}
              disabled={isPlaying}
              placeholder="e.g. 10,20,30"
              className="px-3 py-2 rounded-xl w-full text-sm"
              style={inputStyle}
            />

            <input
              type="number"
              min="1"
              value={popCount}
              onChange={(e) => setPopCount(e.target.value)}
              disabled={isPlaying}
              placeholder="Pop Count"
              className="px-3 py-2 rounded-xl w-full text-sm"
              style={inputStyle}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* CONTROLS + EXPLANATION */}
        <div className="card p-5 space-y-4">
          <ControlButtons
            onPlay={handlePlay}
            onPause={handlePause}
            onReplay={handleReplay}
            disabled={isPlaying}
          />

          <AlgoExplanation
            explanation={explanation}
            isPlaying={isPlaying}
          />
        </div>

        {/* MAIN SPLIT */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* VISUALIZATION */}
          <div className="card p-4">
            <AlgoVisualizationContainer>

              <h3 className="text-lg font-semibold mb-4 text-center text-gray-300">
                Stack (Top → Bottom)
              </h3>

              <div className="flex flex-col-reverse items-center gap-2">
                {currentStep.list?.map((value, idx) => {
                  let bg = "hsl(220 60% 55%)";
                  let scale = "scale(1)";
                  let shadow = "none";

                  const isTop =
                    value ===
                    currentStep.list[currentStep.list.length - 1];

                  if (
                    isTop &&
                    currentStep.action === "pop-start"
                  ) {
                    bg = "hsl(0 72% 58%)";
                    scale = "scale(1.2)";
                    shadow =
                      "0 0 20px hsl(0 72% 58% / 0.8)";
                  }

                  return (
                    <div
                      key={idx}
                      className="w-32 h-14 flex items-center justify-center text-xl font-bold rounded-xl transition-all duration-500"
                      style={{
                        background: bg,
                        color: "hsl(220 20% 6%)",
                        transform: scale,
                        boxShadow: shadow,
                      }}
                    >
                      {value}
                    </div>
                  );
                })}
              </div>

              {currentStep.list?.length > 0 && (
                <div className="text-center mt-4 text-xs text-gray-500">
                  ↑ Top of Stack
                </div>
              )}
            </AlgoVisualizationContainer>
          </div>

          {/* CODE */}
          <div className="card p-4">
            <CodeViewer
              code={STACK_POP_CODE}
              highlightedLine={highlightedLine}
              title="stack-pop.js"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default StackPopPage;