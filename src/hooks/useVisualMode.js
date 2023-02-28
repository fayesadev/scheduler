import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    if (replace) {
      history.pop();
      console.log("history replace", history);
    }
    console.log("history", history);
    setMode(newMode);
    setHistory(prev => [...prev, newMode]);
    return { mode };
  }

  function back() {
    if (history.length === 1) {
      return;
    }
   
    history.pop();
    const back = history[history.length - 1];
    setMode(back);
  }

  return { mode, transition, back };
}