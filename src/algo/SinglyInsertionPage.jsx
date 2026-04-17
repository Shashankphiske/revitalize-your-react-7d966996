import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import {
  AlgoPageHeader,
  AlgoExplanation,
  AlgoVisualizationContainer,
} from "../AlgoPageTemplate";

const CODE = [
  "function insert(head, value, pos) {",
  "  const newNode = new Node(value);",
  "  if (pos === 0) {",
  "    newNode.next = head;",
  "    return newNode;",
  "  }",
  "  let curr = head;",
  "  for (let i = 0; i < pos - 1; i++)",
  "    curr = curr.next;",
  "  newNode.next = curr.next;",
  "  curr.next = newNode;",
  "  return head;",
  "}",
];

const getHighlightedLine = (step) => {
  if (!step) return null;
  if (step.action === "insert-complete") return 10;
  if (step.current !== null && step.current !== undefined) return 8;
  return null;
};

const SinglyInsertionPage = () => {
  const [initialList, setInitialList] = useState("10,20,30,40");
  const [insertValue, setInsertValue] = useState("25");
  const [insertIndex, setInsertIndex] = useState("2");

  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");
  const [highlightedLine, setHighlightedLine] = useState(null);

  const timerRef = useRef(null);

  const fetchSteps = async (arr, value, index) => {
    const res = await fetch(
      "http://localhost:3000/linkedlist/singlyinsertion",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          arr,
          value: parseInt(value),
          index: parseInt(index),
        }),
      }
    );

    return (await res.json()).steps;
  };

  const handlePlay = async () => {
    if (isPlaying) return;

    try {
      const arr = initialList
        .split(",")
        .map((n) => Number(n.trim()))
        .filter((n) => !isNaN(n));

      if (arr.length === 0) {
        setError("Invalid list!");
        return;
      }

      if (isNaN(Number(insertValue))) {
        setError("Invalid value!");
        return;
      }

      setError("");
      setSteps([]);
      setCurrentStepIndex(0);
      setExplanation("Starting Insertion...");

      const data = await fetchSteps(arr, insertValue, insertIndex);
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

      setExplanation(
        step.current
          ? `Inserting ${step.current} at index ${insertIndex}...`
          : "Insertion complete!"
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
          icon="🔗"
          title="Singly Linked List – Insertion"
          description="Insertion involves creating a new node and adjusting pointers to insert at the desired position."
          complexity={{
            time: "O(n)",
            space: "O(1)",
          }}
        />

        {/* INPUT CARD */}
        <div className="card p-5 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold">Input</h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <input
              value={initialList}
              onChange={(e) => setInitialList(e.target.value)}
              disabled={isPlaying}
              placeholder="e.g. 10,20,30"
              className="px-3 py-2 rounded-xl text-sm w-full"
              style={inputStyle}
            />

            <input
              value={insertValue}
              onChange={(e) => setInsertValue(e.target.value)}
              disabled={isPlaying}
              placeholder="Value"
              className="px-3 py-2 rounded-xl text-sm w-full"
              style={inputStyle}
            />

            <input
              value={insertIndex}
              onChange={(e) => setInsertIndex(e.target.value)}
              disabled={isPlaying}
              placeholder="Index"
              className="px-3 py-2 rounded-xl text-sm w-full"
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
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {currentStep.list?.map((value, idx) => {
                  let bg = "hsl(220 60% 55%)";
                  let scale = "scale(1)";
                  let shadow = "none";

                  if (currentStep.current === value) {
                    bg = "hsl(40 90% 55%)";
                    scale = "scale(1.2)";
                    shadow = "0 0 20px hsl(40 90% 55% / 0.8)";
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
                        <span className="text-2xl text-gray-500">→</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </AlgoVisualizationContainer>
          </div>

          {/* CODE */}
          <div className="card p-4">
            <CodeViewer
              code={CODE}
              highlightedLine={highlightedLine}
              title="singly-insertion.js"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default SinglyInsertionPage;