import React, { useEffect, useState } from "react";
import type { CalculationRecord, GetDataResponse } from "../types";

const API_BASE_URL = "http://localhost:3000/calc";

export const History: React.FC = () => {
  const [records, setRecords] = useState<CalculationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/getdata`);
      if (!response.ok) {
        setError("Failed to fetch history from server.");
        setLoading(false);
        return;
      }

      const json: GetDataResponse = (await response.json()) as GetDataResponse;

      if (!json.success) {
        setError("Server reported failure fetching history.");
        setLoading(false);
        return;
      }

      const [rows] = json.data;
      setRecords(rows);
    } catch {
      setError("Network error while fetching history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchHistory();
  }, []);

  return (
    <div>
      <h2>Calculation History</h2>
      <button
        type="button"
        onClick={() => {
          void fetchHistory();
        }}
        style={{ marginBottom: "1rem" }}
      >
        Refresh
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && records.length === 0 && (
        <p>No calculations found.</p>
      )}

      {!loading && !error && records.length > 0 && (
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                ID
              </th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                Value 1
              </th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                Operator
              </th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                Value 2
              </th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                Answer
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => {
              //const expression = `${rec.val1} ${rec.operator} ${rec.val2}`;
              return (
                <tr key={rec.id}>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {rec.id}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {rec.val1}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {rec.operator}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {rec.val2}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {rec.answer}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
