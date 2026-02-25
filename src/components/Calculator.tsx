import React, { useState } from "react";
import type { Operator, PostCalculationBody } from "../types";

const API_BASE_URL = "http://localhost:3000/calc";

interface AnswerState {
  val1: number;
  val2: number;
  operator: Operator;
  answer: number;
}

export const Calculator: React.FC = () => {
  const [val1, setVal1] = useState<string>("");
  const [val2, setVal2] = useState<string>("");
  const [answer, setAnswer] = useState<AnswerState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const parseInputs = (): { v1: number; v2: number } | null => {
    const v1 = Number(val1);
    const v2 = Number(val2);

    if (Number.isNaN(v1) || Number.isNaN(v2)) {
      setError("Both inputs must be valid numbers.");
      return null;
    }

    setError(null);
    return { v1, v2 };
  };

  const compute = (operator: Operator) => {
    const parsed = parseInputs();
    if (!parsed) return;

    const { v1, v2 } = parsed;

    if (operator === "/" && v2 === 0) {
      setError("Cannot divide by 0.");
      return;
    }

    let result: number;
    switch (operator) {
      case "+":
        result = v1 + v2;
        break;
      case "-":
        result = v1 - v2;
        break;
      case "*":
        result = v1 * v2;
        break;
      case "/":
        result = v1 / v2;
        break;
      default:
        return;
    }

    const newAnswer: AnswerState = {
      val1: v1,
      val2: v2,
      operator,
      answer: result,
    };

    setAnswer(newAnswer);
    void sendToServer(newAnswer);
  };

  const sendToServer = async (calc: AnswerState): Promise<void> => {
    setIsSubmitting(true);
    try {
      const body: PostCalculationBody = {
        val1: calc.val1,
        val2: calc.val2,
        operator: calc.operator,
        answer: calc.answer,
      };

      const response = await fetch(`${API_BASE_URL}/calculation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        setError("Failed to save calculation to server.");
      }
    } catch {
      setError("Network error while saving calculation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Value 1:
          <input
            type="number"
            value={val1}
            onChange={(e) => setVal1(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Value 2:
          <input
            type="number"
            value={val2}
            onChange={(e) => setVal2(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          onClick={() => compute("+")}
          style={{ marginRight: "0.5rem" }}
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => compute("-")}
          style={{ marginRight: "0.5rem" }}
        >
          Subtract
        </button>
        <button
          type="button"
          onClick={() => compute("*")}
          style={{ marginRight: "0.5rem" }}
        >
          Multiply
        </button>
        <button type="button" onClick={() => compute("/")}>
          Divide
        </button>
      </div>

      {isSubmitting && <p>Saving calculation...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "1rem" }}>
        <h2>Answer</h2>
        {answer ? (
          <p>
            {answer.val1} {answer.operator} {answer.val2} = {answer.answer}
          </p>
        ) : (
          <p>No calculation yet.</p>
        )}
      </div>
    </div>
  );
};
