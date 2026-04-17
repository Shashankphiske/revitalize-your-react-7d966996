import React, { useState, useEffect, useRef } from "react";
import CodeViewer from "../CodeViewer";
import ControlButtons from "../ControlButtons";
import { AlgoPageHeader, AlgoExplanation, AlgoVisualizationContainer } from "../AlgoPageTemplate";

const CODE = [
  "function insert(head, value, pos) {",
  "  const newNode = new Node(value);",
  "  if (pos === 0) {",
  "    newNode.prev = null;",
  "    newNode.next = head;",
  "    if (head) head.prev = newNode;",
  "    return newNode;",
  "  }",
  "  let curr = head;",
  "  for (let i = 0; i < pos - 1; i++)",
  "    curr = curr.next;",
  "  newNode.next = curr.next;",
  "  newNode.prev = curr;",
  "  if (curr.next) curr.next.prev = newNode;",
  "  curr.next = newNode;",
  "  return head;",
  "}",
];

const getHighlightedLine = (step) => {
  if (!step) return null;
  if (step.action === "insert-complete") return 14;
  if (step.current !== null && step.current !== undefined) return 10;
  return null;
};

const DoublyInsertionPage = () => {
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
  const highlightTimerRef = useRef(null);

  const fetchSteps = async (arr, value, index) => {
    const res = await fetch("http://localhost:3000/linkedlist/doublyinsertion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        arr,
        value,
        index,
      }),
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

        const value = parseInt(insertValue);
        const index = parseInt(insertIndex);

        if (arr.length === 0) {
          setError("Invalid list!");
          return;
        }

        if (isNaN(value)) {
          setError("Invalid value!");
          return;
        }

        if (isNaN(index) || index < 0 || index > arr.length) {
          setError(`Index must be between 0 and ${arr.length}`);
          return;
        }

        setError("");
        setCurrentStepIndex(0);
        setExplanation("Starting doubly linked list insertion...");

        const fetchedSteps = await fetchSteps(arr, value, index);
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
          setExplanation(`Inserting ${step.current} at index ${insertIndex}...`);
        } else {
          setExplanation("Insertion completed successfully.");
        }

        setCurrentStepIndex((prev) => prev + 1);
      }, 1500);
    } else {
      setExplanation("✅ Doubly Linked List insertion complete");
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
        icon="🔗"
        title="Doubly Linked List – Insertion"
        description="Insertion involves creating a new node and adjusting both prev and next pointers."
        complexity={{ time: "O(n)", space: "O(1)" }}
      />

      <div className="max-w-5xl mx-auto mb-8">
        <div className="card rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
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
            </div>

            <div>
              <label
                className="text-sm mb-2 block"
                style={{ color: "hsl(220 10% 50%)" }}
              >
                Value
              </label>
              <input
                value={insertValue}
                onChange={(e) => setInsertValue(e.target.value)}
                disabled={isPlaying}
                className="px-4 py-3 rounded-xl w-24 outline-none"
                style={inputStyle}
              />
            </div>

            <div>
              <label
                className="text-sm mb-2 block"
                style={{ color: "hsl(220 10% 50%)" }}
              >
                Index
              </label>
              <input
                value={insertIndex}
                onChange={(e) => setInsertIndex(e.target.value)}
                disabled={isPlaying}
                className="px-4 py-3 rounded-xl w-24 outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          {error && (
            <p
              className="text-sm mt-2"
              style={{ color: "hsl(0 72% 58%)" }}
            >
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
            title="doublyInsert ion.js"
          />
        </div>
      </div>
    </div>
  );
};

export default DoublyInsertionPage;