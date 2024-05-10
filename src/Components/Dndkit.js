import React, { useState, useEffect } from 'react';
import jsonData from './data.json';
import './game.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Dndkit = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tries, setTries] = useState(0);
  const [arrayOfTries, setArrayOfTries] = useState([]);

  useEffect(() => {
    setTries(0);
  }, [currentPage]);

  const nextPage = () => {
    setArrayOfTries((prevArray) => [...prevArray, tries]);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const logData = () => {
    setArrayOfTries((prevArray) => [...prevArray, tries]);
    console.log('The number of tries for each page are:', arrayOfTries);
  };

  const createTable = () => {
    const currentItem = jsonData[currentPage.toString()];
    const headers = Object.keys(currentItem).filter((key) => key !== 'Distracter');

    const TableCell = ({ header }) => {
        const [{ isOver, canDrop }, drop] = useDrop({
          accept: header,
          drop: (item) => {
            if (item.type === header) {
              setTries((prevTries) => prevTries + 1);
              const draggedElement = document.getElementById(item.id);
              if (draggedElement) {
                const clonedElement = draggedElement.cloneNode(true);
                drop(clonedElement);
                clonedElement.classList.add('correct-drop');
                clonedElement.classList.add('hover-animation');
                setTimeout(() => {
                  if (clonedElement) {
                    clonedElement.classList.remove('correct-drop');
                    clonedElement.classList.remove('hover-animation');
                  }
                }, 500);
      
                const draggedElementParent = draggedElement.parentNode;
                if (draggedElementParent) {
                  draggedElementParent.removeChild(draggedElement);
                }
              }
            } else {
              setTries((prevTries) => prevTries + 1);
              const draggedElement = document.getElementById(item.id);
              if (draggedElement) {
                draggedElement.classList.add('wrong-drop');
                setTimeout(() => {
                  if (draggedElement) {
                    draggedElement.classList.remove('wrong-drop');
                  }
                }, 500);
              }
            }
          },
          collect: (monitor) => ({
            isOver: monitor.isOver({ shallow: true }),
            canDrop: monitor.canDrop(),
          }),
        });
      
        return (
          <td
            ref={drop}
            data-type={header}
            className={`table-cell ${isOver && canDrop ? 'over' : ''}`}
          ></td>
        );
      };

    const tableHeaders = headers.map((header) => (
      <th key={header} className="table-header">
        {header}
      </th>
    ));

    const tableCells = headers.map((header) => <TableCell key={header} header={header} />);

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

  const Card = ({ id, type, value }) => {
    const [{ isDragging }, drag] = useDrag({
      type,
      item: { id, type },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        id={id}
        className={`draggable ${isDragging ? 'dragging' : ''}`}
        style={{ color: 'black' }}
        data-type={type}
      >
        {value}
      </div>
    );
  };

  const createCards = () => {
    const currentItem = jsonData[currentPage.toString()];
    const cards = [];

    for (const key in currentItem) {
      if (key !== 'Distracter') {
        const values = currentItem[key];
        values.forEach((value, index) => {
          const id = `card_${key}_${index}_${currentPage}`;
          const card = <Card key={id} id={id} type={key} value={value} />;
          cards.push(card);
        });
      }
    }

    // Add Distracter cards
    const distracterValues = currentItem['Distracter'];
    distracterValues.forEach((value, index) => {
      const id = `card_Distracter_${index}_${currentPage}`;
      const card = <Card key={id} id={id} type="Distracter" value={value} />;
      cards.push(card);
    });

    return cards;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="body">
        <h1 id="title" style={{ color: 'black' }}>
          Drag and Drop Table
        </h1>
        <p id="tries-counter" style={{ color: 'black' }}>
          Tries: {tries}
        </p>
        {createTable()}
        <div className="cardposition">
          <div className="cards-container justify-content-center">{createCards()}</div>
        </div>
        <div className="next">
          <button
            style={{ display: currentPage < 4 ? 'block' : 'none' }}
            onClick={nextPage}
            id="nextbutton"
            className="btn btn-dark"
          >
            Next
          </button>
        </div>
        <button
          onClick={() => window.location.reload()}
          id="Restart"
          className="btn btn-dark"
          style={{ display: currentPage > 3 ? 'block' : 'none' }}
        >
          Restart
        </button>
        <button
          id="logdata"
          style={{ display: currentPage > 3 ? 'block' : 'none' }}
          className="btn btn-dark"
          onClick={logData}
        >
          Logdata
        </button>
      </div>
    </DndProvider>
  );
};

export default Dndkit;