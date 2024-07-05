import React, { useEffect } from 'react';
import axios from 'axios';

export default function Result() {
  useEffect(() => {
    const sendData = async () => {
      try {
        const tries = localStorage.getItem('tries');
        const timer = localStorage.getItem('timer');
        if(tries === null || timer === null){
          return;
        }
        if(tries === 0|| timer === 0){
          return;
        }
        const gameId = 7;
        if (tries && timer) {
          const status = true;
          const response = await axios.post('https://jwlgamesbackend.vercel.app/api/caretaker/sendgamedata', {
            tries,
            timer,
            gameId,
            status
          });
          console.log(response);
        }
        localStorage.removeItem('tries');
        localStorage.removeItem('timer');
      } catch (err) {
        console.log(err);
      }
    };

    sendData();
  }, []);

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
