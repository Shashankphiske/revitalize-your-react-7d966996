import { useEffect, useMemo, useState, useCallback } from "react";
import { LEETCODE_QUESTIONS } from "../data/leetcodeQuestions";
import { fetchProgress, saveProgress } from "../lib/progressApi";
import DifficultySection from "./DifficultySection";

const LeetCodeQuestionsPanel = ({ topic, title = "Practice on LeetCode" }) => {
  const questions = useMemo(() => LEETCODE_QUESTIONS[topic] || [], [topic]);
  const [completed, setCompleted] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial load: GET /user
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProgress(topic)
      .then((ids) => {
        if (!cancelled) setCompleted(new Set(ids));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [topic]);

  // Optimistic toggle + background POST
  const handleToggle = useCallback(
    (id) => {
      setError(null);
      const previous = completed;
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setCompleted(next);

      saveProgress(topic, Array.from(next)).then((ok) => {
        if (!ok) {
          setError("Couldn't sync progress. Your change is saved locally.");
        }
      });
    },
    [completed, topic]
  );

  const grouped = useMemo(() => {
    const g = { Easy: [], Medium: [], Hard: [] };
    questions.forEach((q) => g[q.difficulty]?.push(q));
    return g;
  }, [questions]);

  const totalDone = completed.size;
  const total = questions.length;
  const pct = total ? Math.round((totalDone / total) * 100) : 0;

  if (!questions.length) return null;

  return (
    <div className="max-w-5xl mx-auto px-2 mt-10 sm:mt-14">
      <div className="card rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">
              {title}
            </h2>
            <p
              className="text-xs sm:text-sm mt-1"
              style={{ color: "hsl(220 10% 55%)" }}
            >
              Curated problems to practice this topic
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider" style={{ color: "hsl(220 10% 50%)" }}>
              Progress
            </div>
            <div className="text-base sm:text-lg font-semibold" style={{ color: "hsl(168 80% 60%)" }}>
              {totalDone}/{total} ({pct}%)
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="h-2 w-full rounded-full overflow-hidden mb-6"
          style={{ background: "hsl(220 16% 10%)" }}
        >
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background:
                "linear-gradient(90deg, hsl(168 80% 50%), hsl(190 80% 55%))",
            }}
          />
        </div>

        {error && (
          <p className="text-xs sm:text-sm mb-4" style={{ color: "hsl(0 72% 58%)" }}>
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-center py-6" style={{ color: "hsl(220 10% 50%)" }}>
            Loading your progress…
          </p>
        ) : (
          <>
            <DifficultySection
              difficulty="Easy"
              questions={grouped.Easy}
              completed={completed}
              onToggle={handleToggle}
            />
            <DifficultySection
              difficulty="Medium"
              questions={grouped.Medium}
              completed={completed}
              onToggle={handleToggle}
            />
            <DifficultySection
              difficulty="Hard"
              questions={grouped.Hard}
              completed={completed}
              onToggle={handleToggle}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default LeetCodeQuestionsPanel;
