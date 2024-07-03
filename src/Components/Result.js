import React from 'react';

export default function Result() {
  
  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">Result</h1>
          <h2 className="card-subtitle mb-2 text-muted">
            Time taken: {localStorage.getItem('timer')} seconds
          </h2>
          <h2 className="card-subtitle mb-2 text-muted">
            Attempts: {localStorage.getItem('tries')}
          </h2>
        </div>
      </div>
    </div>
  );
}
