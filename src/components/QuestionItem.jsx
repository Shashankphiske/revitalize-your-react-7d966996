const difficultyColor = {
  Easy: "hsl(145 65% 48%)",
  Medium: "hsl(40 90% 55%)",
  Hard: "hsl(0 72% 58%)",
};

const QuestionItem = ({ question, checked, onToggle }) => {
  const color = difficultyColor[question.difficulty] || "hsl(168 80% 50%)";

  return (
    <div
      className="flex items-center gap-3 p-3 sm:p-4 rounded-xl transition-all hover:translate-x-1"
      style={{
        background: "hsl(220 16% 10%)",
        border: "1px solid hsl(220 14% 18%)",
      }}
    >
      <label className="flex items-center cursor-pointer shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(question.id)}
          className="peer sr-only"
        />
        <span
          className="w-5 h-5 rounded-md flex items-center justify-center transition-all"
          style={{
            background: checked ? "hsl(168 80% 50%)" : "hsl(220 20% 6%)",
            border: `1.5px solid ${checked ? "hsl(168 80% 50%)" : "hsl(220 14% 25%)"}`,
          }}
        >
          {checked && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="hsl(220 20% 6%)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
      </label>

      <a
        href={question.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-0 group"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs font-mono shrink-0"
            style={{ color: "hsl(220 10% 45%)" }}
          >
            #{question.id}
          </span>
          <span
            className={`text-sm sm:text-base font-medium truncate group-hover:underline ${
              checked ? "line-through opacity-60" : ""
            }`}
            style={{ color: "hsl(0 0% 96%)" }}
          >
            {question.title}
          </span>
        </div>
      </a>

      <span
        className="text-xs font-semibold px-2 py-1 rounded-md shrink-0"
        style={{
          background: `${color.replace(")", " / 0.12)").replace("hsl(", "hsl(")}`,
          color,
          border: `1px solid ${color.replace(")", " / 0.3)").replace("hsl(", "hsl(")}`,
        }}
      >
        {question.difficulty}
      </span>
    </div>
  );
};

export default QuestionItem;
