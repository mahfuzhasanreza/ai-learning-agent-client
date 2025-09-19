import React from 'react';

export default function TopicBar({ name, percent }) {
  return (
    <div className="topic-bar">
      <div className="topic-name">{name}</div>
      <div className="bar">
        <div className="fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="pct">{percent}%</div>
    </div>
  );
}