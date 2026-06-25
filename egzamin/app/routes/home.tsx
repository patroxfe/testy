import { useState } from "react";
import type { Route } from "./+types/home";
import quizData from "../quiz.json";

export function meta({}: Route.MetaArgs) {
  return [
    { title: quizData.title },
    { name: "description", content: "Quiz – adaptacja dziecka do przedszkola i szkoły" },
  ];
}

type Answers = Record<number, number | null>;

type ShuffledQuestion = {
  id: number;
  text: string;
  options: string[];
  correct: number;
};

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleQuestions(): ShuffledQuestion[] {
  return shuffle(quizData.questions).map((q) => {
    const indexed = q.options.map((text, i) => ({ text, isCorrect: i === q.correct }));
    const shuffledOptions = shuffle(indexed);
    return {
      id: q.id,
      text: q.text,
      options: shuffledOptions.map((o) => o.text),
      correct: shuffledOptions.findIndex((o) => o.isCorrect),
    };
  });
}

export default function Home() {
  const { title } = quizData;
  const [questions, setQuestions] = useState<ShuffledQuestion[]>(shuffleQuestions);
  const [answers, setAnswers] = useState<Answers>(() =>
    Object.fromEntries(quizData.questions.map((q) => [q.id, null]))
  );
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = questions.filter((q) => answers[q.id] !== null).length;
  const allAnswered = answeredCount === questions.length;

  const score = questions.reduce((sum, q) => {
    return sum + (answers[q.id] === q.correct ? 1 : 0);
  }, 0);

  const percent = Math.round((score / questions.length) * 100);

  function selectAnswer(questionId: number, optionIndex: number) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  function handleSubmit() {
    if (!allAnswered) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleReset() {
    const fresh = shuffleQuestions();
    setQuestions(fresh);
    setAnswers(Object.fromEntries(fresh.map((q) => [q.id, null])));
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
          background: #f4f6f8;
          color: #1a1a1a;
          line-height: 1.5;
          -webkit-text-size-adjust: 100%;
        }

        .quiz-page {
          max-width: 640px;
          margin: 0 auto;
          padding: 16px 16px 32px;
        }

        .quiz-header {
          background: #fff;
          border-radius: 12px;
          padding: 20px 16px;
          margin-bottom: 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }

        .quiz-header h1 {
          font-size: 1.15rem;
          font-weight: 700;
          line-height: 1.35;
          margin-bottom: 8px;
        }

        .quiz-progress {
          font-size: 0.875rem;
          color: #555;
        }

        .progress-bar {
          height: 6px;
          background: #e0e4e8;
          border-radius: 3px;
          margin-top: 8px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: #2563eb;
          border-radius: 3px;
          transition: width 0.3s;
        }

        .result-box {
          background: #fff;
          border-radius: 12px;
          padding: 24px 16px;
          margin-bottom: 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
          text-align: center;
        }

        .result-box h2 {
          font-size: 1.25rem;
          margin-bottom: 8px;
        }

        .result-score {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2563eb;
          line-height: 1.2;
        }

        .result-percent {
          font-size: 1rem;
          color: #555;
          margin-top: 4px;
        }

        .result-message {
          margin-top: 12px;
          font-size: 0.95rem;
          color: #333;
        }

        .question-card {
          background: #fff;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }

        .question-card.answered-correct {
          border-left: 4px solid #16a34a;
        }

        .question-card.answered-wrong {
          border-left: 4px solid #dc2626;
        }

        .question-number {
          font-size: 0.75rem;
          font-weight: 600;
          color: #2563eb;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .question-text {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .options-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .option-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px;
          border: 2px solid #e0e4e8;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: border-color 0.15s, background 0.15s;
          -webkit-tap-highlight-color: transparent;
          min-height: 48px;
        }

        .option-label:active {
          background: #f0f4ff;
        }

        .option-label.selected {
          border-color: #2563eb;
          background: #eff6ff;
        }

        .option-label.correct-answer {
          border-color: #16a34a;
          background: #f0fdf4;
        }

        .option-label.wrong-selected {
          border-color: #dc2626;
          background: #fef2f2;
        }

        .option-label input {
          margin-top: 3px;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          accent-color: #2563eb;
        }

        .option-text {
          flex: 1;
        }

        .submit-area {
          position: sticky;
          bottom: 0;
          background: linear-gradient(transparent, #f4f6f8 30%);
          padding: 16px 0 8px;
          margin-top: 8px;
        }

        .btn {
          display: block;
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          min-height: 48px;
        }

        .btn-primary {
          background: #2563eb;
          color: #fff;
        }

        .btn-primary:disabled {
          background: #93b4f0;
          cursor: not-allowed;
        }

        .btn-primary:not(:disabled):active {
          background: #1d4ed8;
        }

        .btn-secondary {
          background: #fff;
          color: #2563eb;
          border: 2px solid #2563eb;
          margin-top: 10px;
        }

        .btn-secondary:active {
          background: #eff6ff;
        }

        .hint {
          text-align: center;
          font-size: 0.8rem;
          color: #888;
          margin-top: 8px;
        }

        @media (min-width: 480px) {
          .quiz-page { padding: 24px 20px 40px; }
          .quiz-header h1 { font-size: 1.35rem; }
          .question-text { font-size: 1rem; }
        }
      `}</style>

      <div className="quiz-page">
        <header className="quiz-header">
          <h1>{title}</h1>
          {!submitted ? (
            <>
              <p className="quiz-progress">
                Odpowiedziano: {answeredCount} / {questions.length}
              </p>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                />
              </div>
            </>
          ) : (
            <p className="quiz-progress">Wynik quizu</p>
          )}
        </header>

        {submitted && (
          <div className="result-box">
            <h2>Twój wynik</h2>
            <div className="result-score">
              {score} / {questions.length}
            </div>
            <div className="result-percent">{percent}%</div>
            <p className="result-message">
              {percent === 100
                ? "Świetnie! Wszystkie odpowiedzi poprawne."
                : percent >= 70
                  ? "Dobry wynik! Sprawdź pytania z błędami poniżej."
                  : "Warto powtórzyć materiał. Zobacz poprawne odpowiedzi poniżej."}
            </p>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Rozpocznij od nowa
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {questions.map((q) => {
            const selected = answers[q.id];
            const isCorrect = selected === q.correct;

            let cardClass = "question-card";
            if (submitted && selected !== null) {
              cardClass += isCorrect ? " answered-correct" : " answered-wrong";
            }

            return (
              <div key={q.id} className={cardClass}>
                <div className="question-number">Pytanie {q.id}</div>
                <p className="question-text">{q.text}</p>
                <ul className="options-list">
                  {q.options.map((option, index) => {
                    const isSelected = selected === index;
                    const isCorrectOption = index === q.correct;

                    let labelClass = "option-label";
                    if (!submitted && isSelected) labelClass += " selected";
                    if (submitted && isCorrectOption) labelClass += " correct-answer";
                    if (submitted && isSelected && !isCorrectOption)
                      labelClass += " wrong-selected";

                    return (
                      <li key={index}>
                        <label className={labelClass}>
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            checked={isSelected}
                            onChange={() => selectAnswer(q.id, index)}
                            disabled={submitted}
                          />
                          <span className="option-text">{option}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          {!submitted && (
            <div className="submit-area">
              <button type="submit" className="btn btn-primary" disabled={!allAnswered}>
                Sprawdź wynik
              </button>
              {!allAnswered && (
                <p className="hint">Odpowiedz na wszystkie pytania, aby zobaczyć wynik</p>
              )}
            </div>
          )}
        </form>
      </div>
    </>
  );
}
