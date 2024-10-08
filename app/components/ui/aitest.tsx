"use client";
import React, { useState } from "react";
import { aitest } from "../../../actions/pizza";

export const AitestComp = () => {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const test = async () => {
    setLoading(true);
    try {
      const result = await aitest();
      setText(result);
    } catch (error) {
      console.error("Error fetching the recipe:", error);
      if (error instanceof Error) {
        setText(error.message);
      } else {
        setText("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={test} className="btn btn-secondary" disabled={loading}>
        {loading ? "Baking..." : "Pizza!"}
      </button>
      {text && <p className="mt-4">{text}</p>}
    </div>
  );
};
