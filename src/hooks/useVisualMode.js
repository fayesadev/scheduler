import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  // Transitions from one mode (Show, Delete, Confirm, Error, Form, Status) to the next with optional replacement of the previous mode
  function transition(newMode, replace = false) {
    if (replace) {
      setHistory((prev) => [...prev.slice(0, prev.length - 1), newMode]);
      
    } else {
      setHistory(prev => [...prev, newMode]);
    }

    setMode(newMode);
  }

  // Deletes the current mode from history and goes back to the previous mode
  function back() {
    if (history.length > 1) {
      setHistory((prev) => [...prev.slice(0, prev.length - 1)]);
      setMode(history[history.length - 2]);
    };
  }

  return { mode, transition, back };
}