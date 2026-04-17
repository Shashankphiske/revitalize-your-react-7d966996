import QuestionItem from "./QuestionItem";

const headingColor = {
  Easy: "hsl(145 65% 48%)",
  Medium: "hsl(40 90% 55%)",
  Hard: "hsl(0 72% 58%)",
};

const DifficultySection = ({ difficulty, questions, completed, onToggle }) => {
  if (!questions.length) return null;
  const doneCount = questions.filter((q) => completed.has(q.id)).length;
  const color = headingColor[difficulty];

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3
          className="text-base sm:text-lg font-bold flex items-center gap-2"
          style={{ color }}
        >
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: color }}
          />
          {difficulty}
        </h3>
        <span className="text-xs sm:text-sm" style={{ color: "hsl(220 10% 50%)" }}>
          {doneCount}/{questions.length}
        </span>
      </div>
      <div className="flex flex-col gap-2 sm:gap-3">
        {questions.map((q) => (
          <QuestionItem
            key={q.id}
            question={q}
            checked={completed.has(q.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default DifficultySection;
