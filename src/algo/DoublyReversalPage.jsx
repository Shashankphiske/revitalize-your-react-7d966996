import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import { AlgoPageHeader, AlgoExplanation, AlgoVisualizationContainer } from "../AlgoPageTemplate";

const CODE = [
  "function reverse(head) {",
  "  let curr = head;",
  "  let temp = null;",
  "  while (curr !== null) {",
  "    // Swap prev and next pointers",
  "    temp = curr.prev;",
  "    curr.prev = curr.next;",
  "    curr.next = temp;",
  "    // Move to next node",
  "    curr = curr.prev;",
  "  }",
  "  // Return new head",
  "  return temp ? temp.prev : head;",
  "}",
];

const getHighlightedLine = (step) => {
  if (!step) return null;
  if (step.action === "reverse-complete") return 12;
  if (step.current !== null && step.current !== undefined) return 9;
  return null;
};

const DoublyReversalPage = () => {
  const [initialList, setInitialList] = useState("10,20,30,40,50");

  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");
  const [highlightedLine, setHighlightedLine] = useState(null);

  const timerRef = useRef(null);
  const highlightTimerRef = useRef(null);

  const fetchSteps = async (arr) => {
    const res = await fetch("http://localhost:3000/linkedlist/doublyreversal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ arr }),
    });

    return (await res.json()).steps;
  };

  const handlePlay = async () => {
    if (isPlaying) return;

    try {
      if (steps.length === 0) {
        const arr = initialList
          .split(",")
          .map((n) => Number(n.trim()))
          .filter((n) => !isNaN(n));

        if (arr.length === 0) {
          setError("Invalid list!");
          return;
        }

        setError("");
        setCurrentStepIndex(0);
        setExplanation("Starting doubly linked list reversal...");

        const fetchedSteps = await fetchSteps(arr);
        setSteps(fetchedSteps || []);
      }

      setIsPlaying(true);
    } catch (err) {
      setError("Failed to process input.");
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
  };

  const handleReplay = () => {
    clearTimeout(timerRef.current);
    clearTimeout(highlightTimerRef.current);
    setIsPlaying(false);
    setSteps([]);
    setCurrentStepIndex(0);
    setExplanation("");
    setError("");
    setHighlightedLine(null);
  };

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStepIndex < steps.length) {
      // Early highlighting phase (200ms)
      highlightTimerRef.current = setTimeout(() => {
        const step = steps[currentStepIndex];
        setHighlightedLine(getHighlightedLine(step));
      }, 200);

      // Full state update phase (1500ms)
      timerRef.current = setTimeout(() => {
        const step = steps[currentStepIndex];

        if (step.current !== undefined) {
          setExplanation(`Swapping pointers. Current node: ${step.current}`);
        } else {
          setExplanation("Reversal completed successfully.");
        }

        setCurrentStepIndex((prev) => prev + 1);
      }, 1500);
    } else {
      setExplanation("✅ Doubly Linked List reversal complete");
      setIsPlaying(false);
    }

    return () => {
      clearTimeout(highlightTimerRef.current);
      clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps]);

  const currentStep = steps[currentStepIndex - 1] || {};

  const inputStyle = {
    background: "hsl(220 20% 6%)",
    border: "1px solid hsl(220 14% 22%)",
    color: "hsl(0 0% 96%)",
  };

  return (
    <div
      className="min-h-screen pt-32 pb-16 px-6"
      style={{ color: "hsl(0 0% 96%)" }}
    >
      <AlgoPageHeader
        icon="🔄"
        title="Doubly Linked List – Reversal"
        description="Reversal swaps prev and next pointers for each node."
        complexity={{ time: "O(n)", space: "O(1)" }}
      />

      <div className="max-w-5xl mx-auto mb-8">
        <div className="card rounded-2xl p-6">
          <label
            className="text-sm mb-2 block"
            style={{ color: "hsl(220 10% 50%)" }}
          >
            List
          </label>

          <input
            value={initialList}
            onChange={(e) => setInitialList(e.target.value)}
            disabled={isPlaying}
            className="w-full px-4 py-3 rounded-xl outline-none"
            style={inputStyle}
          />

          {error && (
            <p className="text-sm mt-2" style={{ color: "hsl(0 72% 58%)" }}>
              {error}
            </p>
          )}
        </div>
      </div>

      <ControlButtons
        onPlay={handlePlay}
        onPause={handlePause}
        onReplay={handleReplay}
        disabled={isPlaying}
      />

      <AlgoExplanation explanation={explanation} isPlaying={isPlaying} />

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6">
        <AlgoVisualizationContainer>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {currentStep.list &&
            currentStep.list.map((value, idx) => {
              let bg = "hsl(220 60% 55%)";
              let scale = "scale(1)";
              let shadow = "none";

              if (currentStep.current === value) {
                bg = "hsl(40 90% 55%)";
                scale = "scale(1.25)";
                shadow = "0 0 20px hsl(40 90% 55% / 0.8)";
              } else if (currentStep.prev === value) {
                bg = "hsl(262 80% 55%)";
                scale = "scale(1.1)";
                shadow = "0 0 15px hsl(262 80% 55% / 0.5)";
              }

              return (
                <React.Fragment key={idx}>
                  <div
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

                  {idx < currentStep.list.length - 1 && (
                    <span
                      className="text-2xl"
                      style={{ color: "hsl(220 10% 40%)" }}
                    >
                      ⇄
                    </span>
                  )}
                </React.Fragment>
              );
            })}
        </div>
        </AlgoVisualizationContainer>

        <div className="card p-4">
          <CodeViewer
            code={CODE}
            highlightedLine={highlightedLine}
            title="doublyReversal.js"
          />
        </div>
      </div>
    </div>
  );
};

export default DoublyReversalPage;