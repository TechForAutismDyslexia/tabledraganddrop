import React, { useState, useEffect } from 'react';
import jsonData from './data.json';
import './game.css'; // Import CSS file for styling
import correctaudio from '../Audio/correct.mp3';
import wrongaudio from '../Audio/hooray.mp3';
import instructionaudio from '../Audio/instructionaudio.wav';
import Confetti from 'react-confetti';
import { Popover } from 'bootstrap';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  CARD: 'card',
};

const DragAndDropTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tries, setTries] = useState(0);
  const [correctTries, setCorrectTries] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setCorrectTries(0);
    resetButtonsVisibility();
  }, [currentPage]);

  const nextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const logData = () => {
    console.log("The number of tries:", tries);
  };

  const infoaudio = () => {
    const audio = new Audio(instructionaudio);
    audio.play();
  };

  const handleDrop = (item, monitor, type) => {
    if (item.type === type &&monitor.canDrop()) {
      setTries(prevTries => prevTries + 1);
      const audio = new Audio(correctaudio);
      audio.play();
      setCorrectTries(prevCorrectTries => prevCorrectTries + 1);
      return { accepted: true };
    } else {
      setTries(prevTries => prevTries + 1);
      const audio = new Audio(wrongaudio);
      audio.play();
      return { accepted: false };
    }
  };

  const createTable = () => {
    const currentItem = jsonData[currentPage.toString()];
    const headers = Object.keys(currentItem).filter(key => key !== 'Distracter');

    const getTableCell = header => (
      <TableCell key={header} header={header} onDrop={handleDrop} />
    );

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
        <DraggableCard key={card.id} card={card} />
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

  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
  const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new Popover(popoverTriggerEl));
  console.log(popoverList);

  return (
    <DndProvider backend={HTML5Backend}>
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
        <div className="cardposition">
          <div className="cards-container justify-content-center align-items-center mb-2">{createCards()}</div>
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
                style={{ display: currentPage > ((Object.keys(jsonData).length) - 1) ? 'block' : 'none' }}
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
    </DndProvider>
  );
};

const DraggableCard = ({ card }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { id: card.id, type: card.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [card]);

  const cardStyle = {
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
  };

  return (
    <div
      ref={drag}
      style={cardStyle}
      className="draggable"
      draggable
      data-type={card.type}
    >
      <img src={card.value} alt={card.type} />
    </div>
  );
};

const TableCell = ({ header, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item, monitor) => onDrop(item, monitor, header),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [header]);

  const cellStyle = {
    backgroundColor: isOver ? (canDrop ? 'lightgreen' : 'red') : 'white',
  };

  return (
    <td
      ref={drop}
      style={cellStyle}
      className="table-cell"
      data-type={header}
    ></td>
  );
};

export default DragAndDropTable;
