import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import jsonData from './data.json';

const Card = ({ text }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { text },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div
      ref={drag}
      style={{ opacity, border: '1px solid black', margin: '5px', padding: '5px', width: '200px', cursor: 'move' }}
    >
      {text}
    </div>
  );
};

const CardsContainer = ({ values }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {values.map((value, index) => (
        <Card key={index} text={value} />
      ))}
    </div>
  );
};
;
const TableComponent = ({ data }) => {
  const headers = Object.keys(data);
  const [droppedItems, setDroppedItems] = useState({});

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item, monitor) => {
      const newItem = {...droppedItems };
      newItem[item.text] = true;
      setDroppedItems(newItem);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  }));

  const getTableCell = (header) => {
    const dropped = droppedItems[header];
    return (
      <td
        ref={drop}
        style={{
          border: '1px solid black',
          padding: '70px',
          fontSize: '16px',
          textAlign: 'center',
          backgroundColor: dropped? '#ffff99' : 'transparent',
        }}
      >
        {dropped? 'Dropped' : ''}
      </td>
    );
  };

  return (
    <table
      style={{
        borderCollapse: 'collapse',
        margin: '20px 0',
        width: '100%',
        border: '2px solid black',
        backgroundColor: isOver? '#f0f0f0' : 'transparent',
      }}
    >
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} style={{ border: '1px solid black', padding: '10px', fontSize: '18px', textAlign: 'center' }}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {headers.map((header, index) => getTableCell(header))}
        </tr>
      </tbody>
    </table>
  );
}

const App = () => {
  const [currentKey, setCurrentKey] = useState(1);

  const handleNext = () => {
    if (currentKey < 4) {
      setCurrentKey(currentKey + 1);
    }
  };

  return (
    <div>
      <h1>Table for Key {currentKey}</h1>
      <DndProvider backend={HTML5Backend}>
        <TableComponent data={jsonData[currentKey]} />
        <CardsContainer values={Object.values(jsonData[currentKey]).reduce((acc, cur) => acc.concat(cur), [])} />
      </DndProvider>
      {currentKey < 4 && <button onClick={handleNext}>Next</button>}
      {currentKey>3 && <button onClick={()=>setCurrentKey(1)}>Reset</button>}
    </div>
  );
};

export default App;
