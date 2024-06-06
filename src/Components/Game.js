import React, { useState, useEffect } from 'react';
import jsonData from './data.json';
import './game.css';
import correctaudio from '../Audio/correct.mp3';
import wrongaudio from '../Audio/hooray.mp3';
import hoorayaudio from '../Audio/wrong.mp3';
import instructionaudio from '../Audio/instructionaudio.wav';
import Confetti from 'react-confetti';
import { Popover } from 'bootstrap';

const DragAndDropTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tries, setTries] = useState(0);
  const [correctTries, setCorrectTries] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setCorrectTries(0);
    resetButtonsVisibility();
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new Popover(popoverTriggerEl));
  }, [currentPage]);

  const drag = event => {
    event.dataTransfer.setData("text", event.target.id);
  };

  const touchStart = event => {
    const touch = event.targetTouches[0];
    event.target.dataset.dragged = true;
    event.target.dataset.touchId = touch.identifier;
  };

  const touchMove = event => {
    const touch = event.targetTouches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && event.target.dataset.dragged) {
      event.target.style.position = "absolute";
      event.target.style.left = `${touch.clientX}px`;
      event.target.style.top = `${touch.clientY}px`;
    }
  };

  const touchEnd = event => {
    const touchId = event.target.dataset.touchId;
    const touch = [...event.changedTouches].find(t => t.identifier == touchId);

    if (touch) {
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      event.target.style.position = "initial";
      event.target.style.left = "initial";
      event.target.style.top = "initial";
      if (target && target.tagName === 'TD') {
        handleDrop(target, event.target);
      }
    }

    event.target.dataset.dragged = false;
    delete event.target.dataset.touchId;
  };

  const allowDrop = event => {
    event.preventDefault();
  };

  const drop = event => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    handleDrop(event.target, draggedElement);
  };

  const handleDrop = (target, draggedElement) => {
    const targetType = target.getAttribute('data-type');
    const draggedType = draggedElement.getAttribute('data-type');

    if (targetType === draggedType) {
      setTries(prevTries => prevTries + 1);
      const clonedElement = draggedElement.cloneNode(true);
      clonedElement.draggable = false; // Prevent further dragging
      clonedElement.style.userSelect = 'none'; // Disable text selection
      target.appendChild(clonedElement);
      const audio = new Audio(correctaudio);
      audio.play();
      setCorrectTries(prevCorrectTries => prevCorrectTries + 1);
      clonedElement.classList.add('correct-drop');
      clonedElement.classList.add('hover-animation');
      setTimeout(() => {
        if (clonedElement) {
          clonedElement.classList.remove('hover-animation');
        }
      }, 500);
      draggedElement.style.display = 'none';
    } else {
      setTries(prevTries => prevTries + 1);
      const audio = new Audio(wrongaudio);
      audio.play();
      draggedElement.classList.add('wrong-drop');
      setTimeout(() => {
        if (draggedElement) {
          draggedElement.classList.remove('wrong-drop');
        }
      }, 500);
    }
  };

  const nextPage = () => {
    const audio = new Audio(hoorayaudio);
    audio.play();
    setCurrentPage(prevPage => prevPage + 1);
  };

  const logData = () => {
    console.log("The number of tries:", tries);
  };

  const infoaudio = () => {
    const audio = new Audio(instructionaudio);
    audio.play();
  };

  const createTable = () => {
    const currentItem = jsonData[currentPage.toString()];
    const headers = Object.keys(currentItem).filter(key => key !== 'Distracter');

    const getTableCell = header => {
      return (
        <td
          key={header}
          onDrop={drop}
          onDragOver={allowDrop}
          data-type={header}
          className="table-cell"
        ></td>
      );
    };

    const tableHeaders = headers.map(header => (
      <th key={header} className="table-header">
        {header}
      </th>
    ));

    const tableCells = headers.map(header => getTableCell(header));

    return (
      <table className="custom-table mt-3">
        <thead>
          <tr>{tableHeaders}</tr>
        </thead>
        <tbody>
          <tr>{tableCells}</tr>
        </tbody>
      </table>
    );
  };

  const createCards = () => {
    const currentItem = jsonData[currentPage.toString()];
    const cards = [];

    // Collect all cards including main and distracter cards
    const allCards = [];
    for (const key in currentItem) {
      if (key !== 'Distracter') {
        const values = currentItem[key];
        values.forEach((value, index) => {
          const card = {
            id: `card_${key}_${index}_${currentPage}`,
            type: key,
            value: value
          };
          allCards.push(card);
        });
      }
    }

    const distracterValues = currentItem['Distracter'];
    distracterValues.forEach((value, index) => {
      const card = {
        id: `card_Distracter_${index}_${currentPage}`,
        type: 'Distracter',
        value: value
      };
      allCards.push(card);
    });

    // Shuffle the cards
    const shuffledCards = shuffleArray(allCards);

    // Create JSX elements for shuffled cards
    shuffledCards.forEach(card => {
      const jsxCard = (
        <div
          key={card.id}
          id={card.id}
          className="draggable"
          draggable
          onDragStart={drag}
          onTouchStart={touchStart}
          onTouchMove={touchMove}
          onTouchEnd={touchEnd}
          data-type={card.type}
        >
          {card.value}
        </div>
      );
      cards.push(jsxCard);
    });

    return cards;
  };

  // Function to shuffle an array
  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleSubmit = () => {
    const currentItem = jsonData[currentPage.toString()];
    const numberOfDraggableCards = Object.keys(currentItem).reduce((sum, key) => {
      if (key!== 'Distracter') {
        sum += currentItem[key].length;
      }
      return sum;
    }, 0);
    const numberOfCorrectDropsNeeded = numberOfDraggableCards;
    if (correctTries === numberOfCorrectDropsNeeded) {
      if (currentPage === Object.keys(jsonData).length) {
        const submitButton = document.getElementById('submitbutton');
        if (submitButton) {
          submitButton.style.display = 'none';
        }
        const logDataButton = document.getElementById('logdata');
        if (logDataButton) {
          logDataButton.style.display = 'block';
        }
      } else {
        const nextButton = document.getElementById('nextbutton');
        if (nextButton) {
          nextButton.style.display = 'block';
        }
      }
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); // Confetti for 5 seconds
    }
  };

  const resetButtonsVisibility = () => {
    const nextButton = document.getElementById('nextbutton');
    const submitButton = document.getElementById('submitbutton');
    if (nextButton) nextButton.style.display = 'none';
    if (submitButton) submitButton.style.display = 'block';
  };



  return (
    <div className="body container-fluid maindiv">
      <div className='infobutton d-flex justify-content-end'>
        <button type="button" className='btn btn-warning mt-1' data-bs-container='body' data-bs-toggle="popover" data-bs-title="Instruction" data-bs-placement="left" data-bs-content="The distractor card doesm't drop in any table cell.">
          Instruction
        </button>
        <button type='button' className='btn audiobutton' onClick={infoaudio}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="yellow" className="bi bi-play-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z" />
          </svg>
        </button>
      </div>
      {createTable()}
      <div className="cardposition d-flex flex-wrap justify-content-center">
        <div className="cards-container justify-content-center align-items-center">{createCards()}</div>
      </div>
      <div className="buttons">
        {currentPage < (Object.keys(jsonData).length) ? (
          <div className='nextbutton d-flex justify-content-center align-items-center'>
            <button
              style={{ display: 'none' }}
              onClick={nextPage}
              id="nextbutton"
              className='btn btn-custom btn-block'
            >
              Next
            </button>
          </div>
        ) : (
          <div className='logdata d-flex justify-content-center align-items-center'>
            <button
              id="logdata"
              className='btn btn-custom btn-block'
              style={{ display: 'none' }}
              onClick={logData}
            >
              Logdata
            </button>
          </div>
        )}
        <div className="submitbutton d-flex justify-content-center align-items-center">
          <button
            style={{ display: 'block' }}
            onClick={handleSubmit}
            id="submitbutton"
            className='btn btn-custom btn-primary mt-2'
          >
            Submit
          </button>
        </div>
      </div>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
    </div>
  );
};

export default DragAndDropTable;
