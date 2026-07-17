import React, { useState } from "react";
import type { AnalysisEntry } from "./hooks/useAnalysisHistory";

interface HistorySidebarProps {
  entries: AnalysisEntry[];
  activeFileName?: string;
  onSelect: (entry: AnalysisEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  entries,
  activeFileName,
  onSelect,
  onDelete,
  onClear,
  isOpen,
  onToggle,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Toggle button — always visible */}
      <button
        className="history-toggle-btn"
        onClick={onToggle}
        aria-label={isOpen ? "Close history" : "Open history"}
        title={isOpen ? "Close history" : "View history"}
      >
        {isOpen ? "✕" : "📋"}
        {!isOpen && entries.length > 0 && (
          <span className="history-badge">{entries.length}</span>
        )}
      </button>

      {/* Sidebar panel */}
      <div 
        className={`history-sidebar ${isOpen ? "history-sidebar--open" : ""}`}
        aria-hidden={!isOpen}
      >
        <div className="history-sidebar-header">
          <h3>📚 History</h3>
          {entries.length > 0 && (
            <button
              className="history-clear-btn"
              onClick={() => {
                if (confirmClear) {
                  onClear();
                  setConfirmClear(false);
                } else {
                  setConfirmClear(true);
                  setTimeout(() => setConfirmClear(false), 2500);
                }
              }}
            >
              {confirmClear ? "Confirm?" : "Clear All"}
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <p className="history-empty">No past analyses yet.</p>
        ) : (
          <ul className="history-list">
            {entries.map((entry) => (
              <li
                key={entry.id}
                role="button"
                tabIndex={0}
                aria-current={activeFileName === entry.fileName ? "true" : undefined}
                className={`history-item ${activeFileName === entry.fileName ? 'history-item--active' : ''}`}
                onClick={() => onSelect(entry)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(entry);
                  }
                }}
              >
                <div className="history-item-top">
                  <span className="history-item-score">{entry.score}%</span>
                  <button
                    className="history-item-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(entry.id);
                    }}
                    aria-label="Delete analysis"
                    title="Delete entry"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
                <div className="history-item-role">{entry.targetRole}</div>
                <div className="history-item-file">{entry.fileName}</div>
                <div className="history-item-time">{formatDate(entry.timestamp)}</div>
                <div className="history-item-skills">
                  {entry.skills.slice(0, 4).join(" · ")}
                  {entry.skills.length > 4 && ` +${entry.skills.length - 4} more`}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};