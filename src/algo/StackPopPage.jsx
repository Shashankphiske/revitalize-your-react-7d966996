import { useState } from "react";
import { ArrowDownFromLine } from "lucide-react";
import CodeViewer from "../CodeViewer";
import { AlgoPageHeader, AlgoPageShell } from "../AlgoPageTemplate";
import ControlBar from "../components/ControlBar";
import ExplanationBox from "../components/ExplanationBox";
import Legend from "../components/Legend";
import StackViz from "../components/StackViz";
import useAlgoPlayer from "../hooks/useAlgoPlayer";

const CODE = [
  "function pop(stack) {",
  "  if (stack.top < 0) return 'underflow';",
  "  return stack[stack.top--];",
  "}",
];

const fetchSteps = async (stack, pop) => {
  const res = await fetch("http://localhost:3000/stackalgo/stackpop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stack, pop }),
  });
  return (await res.json()).steps;
};

const StackPopPage = () => {
  const [initial, setInitial] = useState("10,20,30,40,50");
  const [count, setCount] = useState("2");
  const player = useAlgoPlayer();
  const { step, isPlaying, error, setError } = player;

  const handlePlay = async () => {
    if (player.steps.length === 0) {
      const stack = initial.split(",").map((n) => Number(n.trim())).filter((n) => !isNaN(n));
      const c = parseInt(count);
      if (stack.length === 0 || isNaN(c) || c <= 0) { setError("Invalid input"); return; }
      const data = await player.load(() => fetchSteps(stack, c));
      if (!data) return;
    }
    player.play();
  };

  const items = step?.list ?? initial.split(",").map(Number).filter((n) => !isNaN(n));
  const explain = step
    ? (step.underflow ? "Stack underflow" : step.action === "pop-start" ? `Popping ${step.pointer?.current}…` : "Popped")
    : "";
  const highlightedLine = step ? (step.underflow ? 1 : 2) : null;

  return (
    <AlgoPageShell>
      <AlgoPageHeader
        icon={ArrowDownFromLine}
        title="Stack Pop"
        description="Remove the top element from a stack — the canonical LIFO removal."
        complexity={{ time: "O(1)", space: "O(1)" }}
        badge="Stack"
      />

      <section className="card p-5 space-y-4">
        <div className="card-title">Input</div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className="field-label">Initial stack</label><input className="input" value={initial} onChange={(e) => setInitial(e.target.value)} disabled={isPlaying} /></div>
          <div><label className="field-label">Pop count</label><input className="input" type="number" min="1" value={count} onChange={(e) => setCount(e.target.value)} disabled={isPlaying} /></div>
        </div>
        {error && <p className="text-xs text-[hsl(var(--accent-4))] font-mono">{error}</p>}
      </section>

      <section className="card p-5 space-y-4">
        <ControlBar player={player} onPlay={handlePlay} />
        <ExplanationBox text={explain} isPlaying={isPlaying} />
      </section>

      <section className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <div className="card-title mb-4">Visualization</div>
          <div className="min-h-[260px] flex items-center justify-center">
            <StackViz items={items} highlightTop={step?.action === "pop-start"} danger />
          </div>
          <Legend items={[
            { label: "Stack",          color: "hsl(220 30% 19%)" },
            { label: "Top (popping)",  color: "hsl(0 84% 60%)" },
          ]} />
        </div>
        <div className="card overflow-hidden">
          <CodeViewer code={CODE} highlightedLine={highlightedLine} title="stack-pop.js" />
        </div>
      </section>
    </AlgoPageShell>
  );
};

export default StackPopPage;
