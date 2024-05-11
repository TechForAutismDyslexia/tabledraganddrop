import React, { useState, useEffect } from 'react';
import jsonData from './data.json';
import './game.css'; // Import CSS file for styling

const DragAndDropTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tries, setTries] = useState(0);
  const [arrayOfTries, setArrayOfTries] = useState([]);
  useEffect(() => {
    setTries(0);
    if(currentPage===4){
      logData();
    }
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
        target.appendChild(clonedElement);
        clonedElement.classList.add('correct-drop');
        clonedElement.classList.add('hover-animation');
        setTimeout(() => {
          if (clonedElement) {
            clonedElement.classList.remove('correct-drop');
            clonedElement.classList.remove('hover-animation');
          }
        }, 500);
        draggedElement.style.display = 'none';
        // const draggedElementParent = draggedElement.parentNode;
        // if (draggedElementParent) {
        //   console.log("Dragged element found:", draggedElement);
        //   draggedElementParent.removeChild(draggedElement);
        // }
        // else{
        //   console.log("Dragged element not found:", draggedElement);
        // }
      } else {
        setTries(prevTries => prevTries + 1);
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
    setArrayOfTries(prevArray => [...prevArray, tries]);
    setCurrentPage(prevPage => prevPage + 1);
  };

  const logData = () => {
    setArrayOfTries(prevArray => [...prevArray, tries]);
    console.log('The number of tries for each page are:', arrayOfTries);
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
      <table className="custom-table">
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

    for (const key in currentItem) {
      if (key !== 'Distracter') {
        const values = currentItem[key];
        values.forEach((value, index) => {
          const card = (
            <div
              key={`${key}_${index}_${currentPage}`}
              id={`card_${key}_${index}_${currentPage}`}
              className="draggable"
              style={{color:'black'}}
              draggable
              onDragStart={drag}
              data-type={key}
            >
              {value}
            </div>
          );
          cards.push(card);
        });
      }
    }

    // Add Distracter cards
    const distracterValues = currentItem['Distracter'];
    distracterValues.forEach((value, index) => {
      const card = (
        <div
          key={`Distracter_${index}_${currentPage}`}
          id={`card_Distracter_${index}_${currentPage}`}
          className="draggable"
          draggable
          onDragStart={drag}
          data-type="Distracter"
        >
          {value}
        </div>
      );
      cards.push(card);
    });

    return cards;
  };

  return (
    <div className='body'>
      <h1 id="title" style={{color:'black'}}>Drag and Drop Table</h1>
      <p id="tries-counter" style={{color:'black'}}>Tries: {tries}</p>
      {createTable()}
      <div className='cardposition'>
        <div className="cards-container justify-content-center">{createCards()}</div>
      </div>
      <div className="next">
        <button style={{ display: currentPage < 4 ? 'block' : 'none'  }} onClick={nextPage} id="nextbutton" className='btn btn-dark'>Next</button>
      </div>
      <button onClick={() => window.location.reload()} id="Restart" className='btn btn-dark' style={{ display: currentPage > 3 ? 'block' : 'none' } }>Restart</button>
      <button id="logdata" style={{ display: currentPage > 3 ? 'block' : 'none' }} className='btn btn-info' onClick={logData}>Logdata</button>
    </div>
  );
};

export default DragAndDropTable;
