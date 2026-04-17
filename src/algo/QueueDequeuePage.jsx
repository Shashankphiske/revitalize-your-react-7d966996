import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import {
  AlgoPageHeader,
  AlgoExplanation,
  AlgoVisualizationContainer,
} from "../AlgoPageTemplate";

const CODE = [
  "function dequeue(queue) {",
  "  if (queue.front > queue.rear) return 'underflow';",
  "  return queue[queue.front++];",
  "}",
];

const getHighlightedLine = (step) => {
  if (!step) return null;
  if (
    step.action === "dequeue-start" ||
    step.action === "dequeue-complete"
  )
    return 2;
  return null;
};

const QueueDequeuePage = () => {
  const [initialQueue, setInitialQueue] = useState("10,20,30,40,50");
  const [dequeueCount, setDequeueCount] = useState("2");

  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");
  const [highlightedLine, setHighlightedLine] = useState(null);

  const timerRef = useRef(null);

  const fetchSteps = async (queue, count) => {
    const res = await fetch(
      "http://localhost:3000/queuealgo/dequeue",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queue,
          dequeue: Array(count).fill(0),
        }),
      }
    );

    return (await res.json()).steps;
  };

  const handlePlay = async () => {
    if (isPlaying) return;

    try {
      const queue = initialQueue
        .split(",")
        .map((n) => Number(n.trim()))
        .filter((n) => !isNaN(n));

      if (queue.length === 0) {
        setError("Invalid queue!");
        return;
      }

      setError("");
      setCurrentStepIndex(0);
      setExplanation("Starting Dequeue Operation...");

      const data = await fetchSteps(queue, parseInt(dequeueCount));
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
    setExplanation("");
    setError("");
    setHighlightedLine(null);
  };

  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length) return;

    timerRef.current = setTimeout(() => {
      const step = steps[currentStepIndex];

      setExplanation(
        step.action === "dequeue-start"
          ? `Dequeuing ${step.pointer?.current}...`
          : "Dequeued!"
      );

      setHighlightedLine(getHighlightedLine(step));
      setCurrentStepIndex((i) => i + 1);
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
          icon="⬅️"
          title="Queue Dequeue"
          description="Removes an element from the front of the queue (FIFO - First In First Out)."
          complexity={{ time: "O(1)", space: "O(1)" }}
        />

        {/* INPUT CARD */}
        <div className="card p-5 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold">Queue Input</h3>

          <div className="flex flex-col lg:flex-row gap-4">
            <input
              value={initialQueue}
              onChange={(e) => setInitialQueue(e.target.value)}
              disabled={isPlaying}
              placeholder="Enter queue values"
              className="px-3 py-2 rounded-xl flex-1 text-sm"
              style={inputStyle}
            />

            <input
              type="number"
              min="1"
              value={dequeueCount}
              onChange={(e) => setDequeueCount(e.target.value)}
              disabled={isPlaying}
              placeholder="Count"
              className="px-3 py-2 rounded-xl w-32 text-sm"
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
          <div className="card p-4 flex flex-col">
            <AlgoVisualizationContainer>
              <h3 className="text-lg font-semibold text-center mb-4">
                Queue (Front → Rear)
              </h3>

              <div className="flex items-center justify-center gap-2 flex-wrap min-h-[420px]">
                {currentStep.list?.map((value, idx) => {
                  let bg = "hsl(220 60% 55%)";
                  let scale = "scale(1)";
                  let shadow = "none";

                  const isHighlighted =
                    currentStep.highlight?.includes(value);

                  if (isHighlighted) {
                    if (currentStep.action === "dequeue-start") {
                      bg = "hsl(0 72% 58%)";
                      shadow =
                        "0 0 20px hsl(0 72% 58% / 0.8)";
                    } else {
                      bg = "hsl(40 90% 55%)";
                      shadow =
                        "0 0 20px hsl(40 90% 55% / 0.8)";
                    }
                    scale = "scale(1.2)";
                  }

                  return (
                    <div
                      key={idx}
                      className="w-20 h-14 flex items-center justify-center text-xl font-bold rounded-xl transition-all duration-500"
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
                <div className="flex justify-between mt-4 text-xs px-4 text-gray-400">
                  <span>← Front</span>
                  <span>Rear →</span>
                </div>
              )}
            </AlgoVisualizationContainer>
          </div>

          {/* CODE */}
          <div className="card p-4 flex flex-col">
            <CodeViewer
              code={CODE}
              highlightedLine={highlightedLine}
              title="queue-dequeue.js"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default QueueDequeuePage;