import React, { useState } from 'react';
import jsonData from './data.json';

const Card = ({ text }) => {
  return (
    <div style={{ border: '1px solid black', margin: '5px', padding: '5px', width: '200px' }}>
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

const TableComponent = ({ data }) => {
  const headers = Object.keys(data);

  return (
    <table style={{ borderCollapse: 'collapse', margin: '20px 0', width: '100%', border: '2px solid black' }}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} style={{ border: '1px solid black', padding: '10px', fontSize: '18px', textAlign: 'center' }}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {headers.map((_, index) => (
            <td key={index} style={{ border: '1px solid black', padding: '10px', fontSize: '16px', textAlign: 'center' }} />
          ))}
        </tr>
      </tbody>
    </table>
  );
};

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
      <TableComponent data={jsonData[currentKey]} />
      <CardsContainer values={Object.values(jsonData[currentKey]).reduce((acc, cur) => acc.concat(cur), [])} />
      {currentKey < 4 && <button onClick={handleNext}>Next</button>}
    </div>
  );
};

export default App;
