import React, { useState, useEffect } from 'react';
import jsonData from './data.json';
import './game.css'; // Import CSS file for styling
import correctaudio from '../Audio/correct.mp3';
import wrongaudio from '../Audio/hooray.mp3';
import Confetti from 'react-confetti';

const DragAndDropTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tries, setTries] = useState(0);

  const [correctTries, setCorrectTries] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setCorrectTries(0);
    resetButtonsVisibility();
  }, [currentPage]);

  const drag = event => {
    event.dataTransfer.setData("text", event.target.id);
  };

  const allowDrop = event => {
    event.preventDefault();
  };

  const drop = event => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    const target = event.target;
    const targetType = target.getAttribute('data-type');
    const draggedType = draggedElement.getAttribute('data-type');

    if (target.tagName === 'TD') {
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
    }
  };

  const nextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const logData = () => {
    console.log("The number of tries:", tries);
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
      if (key !== 'Distracter') {
        sum += currentItem[key].length;
      }
      return sum;
    }, 0);
    const numberOfCorrectDropsNeeded = numberOfDraggableCards;
    if (correctTries === numberOfCorrectDropsNeeded) {
      const nextButton = document.getElementById('nextbutton');
      nextButton.style.display = 'block';
      const submitButton = document.getElementById('submitbutton');
      submitButton.style.display = 'none';
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
      {/* <p id="tries-counter" className="text-center">Tries: {tries}</p> */}
      {createTable()}
      <div className="cardposition">
        <div className="cards-container justify-content-center mb-2">{createCards()}</div>
      </div>
      <div className="buttons">
        {currentPage < (Object.keys(jsonData).length) ? (
          <div className='nextbutton d-flex justify-content-center'>
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
          <button
            id="logdata"
            className='btn btn-custom btn-block'
            style={{ display: currentPage > ((Object.keys(jsonData).length) - 1) ? 'block' : 'none' }}
            onClick={logData}
          >
            Logdata
          </button>
        )}
        <div className="submitbutton d-flex justify-content-center">
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
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight}/>}
    </div>
  );
};

export default DragAndDropTable;
