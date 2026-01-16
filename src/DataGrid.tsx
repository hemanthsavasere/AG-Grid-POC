import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  GridReadyEvent,
  ModuleRegistry,
} from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';

// Register AG Grid Enterprise modules
ModuleRegistry.registerModules([AllEnterpriseModule]);

interface DataGridProps {
  data: any[];
}

const MAX_ROWS = 25000;

const DataGrid: React.FC<DataGridProps> = ({ data }) => {
  const gridRef = useRef<AgGridReact>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [quickFilterText, setQuickFilterText] = useState<string>('');

  // Check if data exceeds max rows
  const rowData = useMemo(() => {
    if (data.length > MAX_ROWS) {
      setErrorMessage(
        `Error: Cannot display more than ${MAX_ROWS.toLocaleString()} rows. ` +
        `Currently attempting to load ${data.length.toLocaleString()} rows.`
      );
      return [];
    }
    setErrorMessage('');
    return data;
  }, [data]);

  // Column definitions with all features enabled
  const columnDefs = useMemo<ColDef[]>(() => {
    if (data.length === 0) return [];

    // Dynamically create column definitions from the first row
    const firstRow = data[0];
    return Object.keys(firstRow).map(key => ({
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1),
      sortable: true,
      filter: 'agTextColumnFilter', // Text filter for each column
      floatingFilter: true, // Enable floating filter for string search per column
      resizable: true,
      enablePivot: true,
    }));
  }, [data]);

  // Default column properties
  const defaultColDef = useMemo<ColDef>(() => ({
    flex: 1,
    minWidth: 100,
    sortable: true, // Enable sorting on all columns
    filter: true, // Enable filtering on all columns
    resizable: true,
    enablePivot: true,
  }), []);

  // Auto-size all columns to fit content
  const autoSizeAll = useCallback(() => {
    const allColumnIds = gridRef.current?.api
      .getColumns()
      ?.map(column => column.getId()) || [];

    gridRef.current?.api.autoSizeColumns(allColumnIds);
  }, []);

  // Handle grid ready event
  const onGridReady = useCallback((params: GridReadyEvent) => {
    // Columns will auto-fill the width due to flex: 1 in defaultColDef
    // Users can manually click "Auto-size All Columns" button if needed
  }, []);

  // Handle quick filter input (search across all columns)
  const onQuickFilterChanged = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuickFilterText(value);
    gridRef.current?.api.setGridOption('quickFilterText', value);
  }, []);

  const containerStyle = useMemo(() => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const
  }), []);

  const gridStyle = useMemo(() => ({
    width: '100%',
    flex: 1,
    minHeight: 0, // Allow flex item to shrink below content size
    overflow: 'hidden'
  }), []);

  return (
    <div style={containerStyle}>
      {/* Error message display - Feature 7 */}
      {errorMessage && (
        <div style={{
          padding: '10px',
          backgroundColor: '#ff4444',
          color: 'white',
          marginBottom: '10px',
          borderRadius: '4px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          {errorMessage}
        </div>
      )}

      {/* Main grid container */}
      <div style={gridStyle} className="ag-theme-quartz">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true} // Feature 2: Pagination when data exceeds grid height
          paginationAutoPageSize={true} // Auto-calculate page size based on grid height
          onGridReady={onGridReady}
          enableCellTextSelection={true}
          ensureDomOrder={true}
          animateRows={true}
          // Feature 9: Quick filter searches across all columns
          quickFilterText={quickFilterText}
        />
      </div>

      {/* Bottom search bar - Feature 8 & 9 */}
      <div style={{
        padding: '10px',
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <label htmlFor="quick-filter" style={{ fontWeight: 'bold', fontSize: '14px' }}>
          Search:
        </label>
        <input
          id="quick-filter"
          type="text"
          placeholder="Filter across all columns..."
          value={quickFilterText}
          onChange={onQuickFilterChanged}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            outline: 'none'
          }}
        />
        <button
          onClick={autoSizeAll}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
        >
          Auto-size All Columns
        </button>
      </div>
    </div>
  );
};

export default DataGrid;
