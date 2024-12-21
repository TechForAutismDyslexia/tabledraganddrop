import React, { useState, useEffect } from 'react';
import './game.css';
import correctaudio from '../Audio/correct.mp3';
import tryagainaudio from '../Audio/tryagain.mp3'
import hoorayaudio from '../Audio/wrong.mp3';
import instructionaudio from '../Audio/instructionaudio.wav';
import Confetti from 'react-confetti';
import { Popover } from 'bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const DragAndDropTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [correctTries, setCorrectTries] = useState(0);
  const [jsonData, setJsonData] = useState([])
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [shuffledCards, setShuffledCards] = useState([]);
  const [tries, setTries] = useState(0);
  const [timer, setTimer] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showLogDataButton, setShowLogDataButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = '66e28814d4d1ee09f200ccab';
        const response = await axios.get(`https://api.joywithlearning.com/api/tablednd/data/${id}`);
        setJsonData(response.data.data);
        setLoading(false);
        console.log('Data fetched:', response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData(); 
  }, []);
  

  useEffect(() => {
    if(!loading&&jsonData){

      setCorrectTries(0);
      resetButtonsVisibility();
      const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
      const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new Popover(popoverTriggerEl));
      shuffleAndSetCards();
    }
  }, [currentPage,jsonData,loading]);

  useEffect(() => {
    let startTime = new Date().getTime();
    let timerInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const elapsedTimer = currentTime - startTime;
      setTimer(elapsedTimer);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  const shuffleAndSetCards = () => {
    if (jsonData && jsonData[currentPage.toString()]) {
      const currentItem = jsonData[currentPage.toString()].category;
      const cards = [];
  
      for (const key in currentItem) {
        if (key !== 'Distracter') {
          const values = currentItem[key];
          values.forEach((value, index) => {
            const card = {
              id: `card_${key}_${index}_${currentPage}`,
              type: key,
              value: value
            };
            cards.push(card);
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
        cards.push(card);
      });
  
      setShuffledCards(shuffleArray(cards));
    }
  };

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
    let dropTarget = target;
  
    while (dropTarget && dropTarget.tagName !== 'TD') {
      dropTarget = dropTarget.parentNode;
    }
  
    const targetType = dropTarget ? dropTarget.getAttribute('data-type') : null;
    const draggedType = draggedElement.getAttribute('data-type');
  
    if (dropTarget && targetType === draggedType) {
      setTries(prevTries => prevTries + 1);
      const clonedElement = draggedElement.cloneNode(true);
      clonedElement.draggable = false; 
      clonedElement.style.userSelect = 'none'; 
      dropTarget.appendChild(clonedElement);
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
      const audio = new Audio(tryagainaudio);
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
    resetButtonsVisibility();
    setCorrectTries(0);
  };

  const logData = () => {
    console.log('Total Tries:', tries);
    localStorage.setItem('tries', tries);
    console.log('Total timer:', timer);
    localStorage.setItem('timer', timer / 1000);
    navigate('/Result');
  };

  const infoaudio = () => {
    const audio = new Audio(instructionaudio);
    audio.play();
  };

  const createTable = () => {
    if (!jsonData || !jsonData[currentPage.toString()]) {
      return null; // Or a loading indicator like a spinner
    }
  
    const currentItem = jsonData[currentPage.toString()].category;
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
    if (!shuffledCards.length) {
      return null; 
    }
  
    return shuffledCards.map(card => (
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
    ));
  };
  

  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleSubmit = () => {
    const currentItem = jsonData[currentPage.toString()].category;
    const numberOfDraggableCards = Object.keys(currentItem).reduce((sum, key) => {
      if (key !== 'Distracter') {
        sum += currentItem[key].length;
      }
      return sum;
    }, 0);
    console.log('Number of draggable cards:', numberOfDraggableCards);
    console.log('Number of correct tries:', correctTries);
    const numberOfCorrectDropsNeeded = numberOfDraggableCards;
    if (correctTries === numberOfCorrectDropsNeeded) {
      if (currentPage === Object.keys(jsonData).length) {
        setShowNextButton(false);
        setShowLogDataButton(true);
      } else {
        setShowNextButton(true);
      }
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); 
    }
  };

  const resetButtonsVisibility = () => {
    setShowNextButton(false);
    setShowLogDataButton(false);
  };

  return (
    <div className="container-fluid maindiv">
      {loading ? (
        <div>Loading...</div> // You can replace this with a spinner or any other loading indicator
      ) : (
        <>
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
            <div className="cards-container d-flex flex-wrap justify-content-center align-items-center">{createCards()}</div>
          </div>
          <div className="buttons">
            {showNextButton ? (
              <div className='nextbutton d-flex justify-content-center align-items-center'>
                <button
                  onClick={nextPage}
                  id="nextbutton"
                  className='btn btn-custom btn-block'
                >
                  Next
                </button>
              </div>
            ) : (
              showLogDataButton && (
                <div className='logdata d-flex justify-content-center align-items-center'>
                  <button
                    id="logdata"
                    className='btn btn-custom btn-block'
                    onClick={logData}
                  >
                    Result
                  </button>
                </div>
              )
            )}
            {!showNextButton && (
              <div className="submitbutton d-flex justify-content-center align-items-center">
                <button
                  onClick={handleSubmit}
                  id="submitbutton"
                  className='btn btn-custom btn-primary mt-2'
                >
                  Submit
                </button>
              </div>
            )}
          </div>
          {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
        </>
      )}
    </div>
  );
};

export default DragAndDropTable;
