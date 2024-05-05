import React, { useState } from 'react';
import jsonData from './data.json';

const Card = ({ text }) => {
  const dragStart = event => {
    event.dataTransfer.setData('text/plain', text);
  };

  return (
    <div
      draggable="true"
      onDragStart={dragStart}
      style={{ border: '1px solid black', margin: '5px', padding: '5px', width: '200px', cursor: 'move' }}
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

const App = () => {
  const [droppedItems, setDroppedItems] = useState({});
  const [currentKey, setCurrentKey] = useState(1);

  const drop = event => {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const newItem = { ...droppedItems };
    newItem[data] = true;
    setDroppedItems(newItem);
  };

  const dragOver = event => {
    event.preventDefault();
  };

  const getTableCell = header => {
    const dropped = droppedItems[header];
    return (
      <td
        onDrop={drop}
        onDragOver={dragOver}
        style={{
          border: '1px solid black',
          padding: '70px',
          fontSize: '16px',
          textAlign: 'center',
          backgroundColor: dropped ? '#ffff99' : 'transparent',
        }}
      >
        {dropped ? 'Dropped' : ''}
      </td>
    );
  };

  const handleNext = () => {
    if (currentKey < 4) {
      setCurrentKey(currentKey + 1);
    }
  };

  return (
    <div>
      <h1>Table for Key {currentKey}</h1>
      <table
        style={{
          borderCollapse: 'collapse',
          margin: '20px 0',
          width: '100%',
          border: '2px solid black',
        }}
      >
        <thead>
          <tr>
            {Object.keys(jsonData[currentKey]).map((header, index) => (
              <th key={index} style={{ border: '1px solid black', padding: '10px', fontSize: '18px', textAlign: 'center' }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.keys(jsonData[currentKey]).map((header, index) => getTableCell(header))}
          </tr>
        </tbody>
      </table>
      <CardsContainer values={Object.values(jsonData[currentKey]).reduce((acc, cur) => acc.concat(cur), [])} />
      {currentKey < 4 && <button onClick={handleNext}>Next</button>}
      {currentKey > 3 && <button onClick={() => setCurrentKey(1)}>Reset</button>}
    </div>
  );
};

export default App;
