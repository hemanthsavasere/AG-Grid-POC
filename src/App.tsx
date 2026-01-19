import { useState } from 'react';
import DataGrid from './DataGrid';
import { smallDataset, mediumDataset, largeDataset, tooLargeDataset, treeDataset } from './sampleData';
import './App.css';

function App() {
  const [selectedDataset, setSelectedDataset] = useState<'small' | 'medium' | 'large' | 'tooLarge' | 'tree'>('medium');

  const datasets = {
    small: smallDataset,
    medium: mediumDataset,
    large: largeDataset,
    tooLarge: tooLargeDataset,
    tree: treeDataset,
  };

  const currentData = datasets[selectedDataset];

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '10px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '24px', textAlign: 'center' }}>AG Grid Enterprise Demo</h1>
          <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '13px', textAlign: 'center' }}>
            Featuring: Data display, Pagination, Row Grouping, Aggregation, Column pinning, Auto-sizing, Filtering, Sorting, Quick search, and 25k row limit
          </p>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedDataset('small')}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedDataset === 'small' ? '#007bff' : '#e0e0e0',
                color: selectedDataset === 'small' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Small (100 rows)
            </button>
            <button
              onClick={() => setSelectedDataset('medium')}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedDataset === 'medium' ? '#007bff' : '#e0e0e0',
                color: selectedDataset === 'medium' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Medium (1,000 rows)
            </button>
            <button
              onClick={() => setSelectedDataset('large')}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedDataset === 'large' ? '#007bff' : '#e0e0e0',
                color: selectedDataset === 'large' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Large (10,000 rows)
            </button>
            <button
              onClick={() => setSelectedDataset('tooLarge')}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedDataset === 'tooLarge' ? '#dc3545' : '#e0e0e0',
                color: selectedDataset === 'tooLarge' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Too Large (30,000 rows - Error)
            </button>
            <button
              onClick={() => setSelectedDataset('tree')}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedDataset === 'tree' ? '#28a745' : '#e0e0e0',
                color: selectedDataset === 'tree' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Tree Data
            </button>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, width: '100%', overflow: 'hidden' }}>
          <DataGrid
            data={currentData}
            treeData={selectedDataset === 'tree'}
            treePathField="path"
            treeGroupColumnName="Organization"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
