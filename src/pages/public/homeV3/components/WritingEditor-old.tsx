/**
 * Come with the template. no longer using this component since the writing functionality was already done
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const WritingEditor = ({
  id,
  prompt,
  storageKey,
}: {
  id: string;
  prompt: string;
  storageKey: string;
}) => {
  const [text, setText] = useState("");
  const [timer, setTimer] = useState(0);
  const [status, setStatus] = useState("");
  const [isActive, setIsActive] = useState(false);

  // Load draft
  useEffect(() => {
    const draft = localStorage.getItem(storageKey);
    if (draft) {
      setText(draft);
      setStatus("Draft loaded.");
    }
  }, [storageKey]);

  // Timer
  useEffect(() => {
    let interval = undefined;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleSave = () => {
    localStorage.setItem(storageKey, text);
    setStatus("Draft saved locally.");
  };

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Handles submitting the writing test.
   * If the text is empty, sets a status message to inform the user.
   * Otherwise, removes the draft from local storage, sets a status message and stops the timer.
   */
  /*******  71513ab9-883f-4d65-b3e2-b39df6b1be44  *******/
  const handleSubmit = () => {
    if (!text.trim()) {
      setStatus("Please write something before submitting.");
      return;
    }
    localStorage.removeItem(storageKey);
    setStatus("Submitted! (Connect to AI scoring here.)");
    setIsActive(false);
  };

  const handleClear = () => {
    setText("");
    setTimer(0);
    setIsActive(false);
    setStatus("");
    localStorage.removeItem(storageKey);
  };

  const formatTime = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <>
      <Link to="/test/writing" className="btn brand-btn w-100 mb-2 text-white">
        <i className="bi bi-pencil-square"></i> Start New Writing Task
      </Link>
      <div className={`write-panel mt-3 !hidden}`} id={id}>
        <div className="small text-secondary mb-1">
          Task prompt (sample): <b>{prompt}</b>
        </div>
        <div className="d-flex justify-content-between mb-1 write-meta">
          <span>
            Time: <span>{formatTime(timer)}</span>
          </span>
          <span>
            Words: <span>{wordCount}</span>
          </span>
        </div>
        <textarea
          className="form-control write-textarea"
          placeholder="Type your response here (aim for 150–200 words)..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <div className="d-flex flex-wrap gap-2 mt-2">
          <button className="btn btn-sm btn-primary" onClick={handleSave}>
            <i className="bi bi-save"></i> Save draft
          </button>
          <button className="btn btn-sm btn-success" onClick={handleSubmit}>
            <i className="bi bi-check2-circle"></i> Submit
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={handleClear}
          >
            <i className="bi bi-trash"></i> Clear
          </button>
        </div>
        <div className="small text-secondary mt-1">{status}</div>
      </div>
    </>
  );
};

export default WritingEditor;
