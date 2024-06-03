import React, { useState, useEffect } from 'react';
import jsonData from './data.json';
import './game.css'; // Import CSS file for styling
import correctaudio from '../Audio/correct.mp3';
import wrongaudio from '../Audio/hooray.mp3';
import Confetti from 'react-confetti';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const DragAndDropTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tries, setTries] = useState(0);
  const [correctTries, setCorrectTries] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setCorrectTries(0);
    resetButtonsVisibility();
  }, [currentPage]);

  const onDragEnd = result => {
    const { destination, draggableId } = result;

    if (!destination) {
      return;
    }

    const draggedElement = document.getElementById(draggableId);
    const target = document.querySelector(`[data-type="${destination.droppableId}"]`);
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
        <Draggable key={card.id} draggableId={card.id} index={cards.length}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              id={card.id}
              className="draggable"
              data-type={card.type}
            >
              {card.value}
            </div>
          )}
        </Draggable>
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
      {createTable()}
      <div className="cardposition">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="cards" direction="horizontal">
            {(provided) => (
              <div
                className="cards-container justify-content-center align-items-center mb-2"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {createCards()}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div className="buttons">
        {currentPage < Object.keys(jsonData).length ? (
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
              style={{ display: currentPage > Object.keys(jsonData).length - 1 ? 'block' : 'none' }}
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
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight}/>}
    </div>
  );
};

export default DragAndDropTable;
