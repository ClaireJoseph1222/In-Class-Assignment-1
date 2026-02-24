import React, { useState } from "react";
import { Calculator } from "./components/Calculator";
import { History } from "./components/History";

type View = "calculator" | "history";

const App: React.FC = () => {
  const [view, setView] = useState<View>("calculator");

  return (
    <div style={{ fontFamily: "sans-serif", padding: "1rem" }}>
      <h1>Math Evaluator</h1>
      <div style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          onClick={() => setView("calculator")}
          disabled={view === "calculator"}
          style={{ marginRight: "0.5rem" }}
        >
          Calculator
        </button>
        <button
          type="button"
          onClick={() => setView("history")}
          disabled={view === "history"}
        >
          History
        </button>
      </div>

      {view === "calculator" ? <Calculator /> : <History />}
    </div>
  );
};

export default App;
