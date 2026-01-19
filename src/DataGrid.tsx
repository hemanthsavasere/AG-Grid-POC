import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  GridReadyEvent,
  ModuleRegistry,
} from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import './DataGrid.css';

// Register AG Grid Enterprise modules
ModuleRegistry.registerModules([AllEnterpriseModule]);

interface DataGridProps {
  data: any[];
}

const MAX_ROWS = 25000;

// Helper function to detect the data type of a column
const detectColumnType = (data: any[], field: string): 'number' | 'boolean' | 'date' | 'text' => {
  // Sample multiple rows to determine type (check up to 10 rows for better accuracy)
  const sampleSize = Math.min(10, data.length);
  const samples = data.slice(0, sampleSize).map(row => row[field]).filter(val => val != null);

  if (samples.length === 0) return 'text';

  // Check if all samples are numbers
  const allNumbers = samples.every(val => typeof val === 'number' && !isNaN(val));
  if (allNumbers) return 'number';

  // Check if all samples are booleans
  const allBooleans = samples.every(val => typeof val === 'boolean');
  if (allBooleans) return 'boolean';

  // Check if all samples are valid dates
  const allDates = samples.every(val => {
    if (val instanceof Date) return !isNaN(val.getTime());
    if (typeof val === 'string') {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }
    return false;
  });
  if (allDates) return 'date';

  return 'text';
};

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

  // Column definitions with dynamic type detection and appropriate configurations
  const columnDefs = useMemo<ColDef[]>(() => {
    if (data.length === 0) return [];

    // Dynamically create column definitions from the first row
    const firstRow = data[0];
    return Object.keys(firstRow).map(key => {
      const columnType = detectColumnType(data, key);

      const baseColDef: ColDef = {
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
        sortable: true,
        floatingFilter: true,
        resizable: true,
        enableRowGroup: true,
        enableValue: true,
      };

      // Configure based on detected type
      switch (columnType) {
        case 'number':
          return {
            ...baseColDef,
            filter: 'agNumberColumnFilter',
            aggFunc: 'sum', // Default aggregation for numbers
            valueFormatter: (params: any) => {
              if (params.value == null) return '';
              return params.value.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
              });
            },
          };

        case 'boolean':
          return {
            ...baseColDef,
            filter: 'agSetColumnFilter',
            valueFormatter: (params: any) => {
              if (params.value == null) return '';
              return params.value ? 'Yes' : 'No';
            },
          };

        case 'date':
          return {
            ...baseColDef,
            filter: 'agDateColumnFilter',
            valueFormatter: (params: any) => {
              if (params.value == null) return '';
              const date = params.value instanceof Date ? params.value : new Date(params.value);
              return date.toLocaleDateString('en-US');
            },
          };

        default: // 'text'
          return {
            ...baseColDef,
            filter: 'agTextColumnFilter',
          };
      }
    });
  }, [data]);

  // Default column properties
  const defaultColDef = useMemo<ColDef>(() => ({
    flex: 1,
    minWidth: 100,
    sortable: true, // Enable sorting on all columns
    filter: true, // Enable filtering on all columns
    resizable: true,
    enablePivot: true,
    enableRowGroup: true, // Enable grouping on all columns
    enableValue: true, // Enable aggregation on all columns
  }), []);

  // Auto group column definition for displaying grouped rows
  const autoGroupColumnDef = useMemo<ColDef>(() => ({
    headerName: 'Group',
    minWidth: 250,
    cellRendererParams: {
      suppressCount: false, // Show count in group headers
    },
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  }), []);

  // Handle grid ready event
  const onGridReady = useCallback((params: GridReadyEvent) => {
    // Columns will auto-fill the width due to flex: 1 in defaultColDef
  }, []);

  // Handle quick filter input (search across all columns)
  const onQuickFilterChanged = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuickFilterText(value);
    gridRef.current?.api.setGridOption('quickFilterText', value);
  }, []);

  // Clear all grouping
  const clearGrouping = useCallback(() => {
    gridRef.current?.api.applyColumnState({
      defaultState: { rowGroup: false },
    });
  }, []);

  return (
    <div className="data-grid-container">
      {/* Error message display - Feature 7 */}
      {errorMessage && (
        <div className="data-grid-error">
          {errorMessage}
        </div>
      )}

      {/* Toolbar above grid - Grouping controls */}
      <div className="data-grid-toolbar">
        <button
          onClick={clearGrouping}
          className="data-grid-clear-button"
        >
          Clear Grouping
        </button>
      </div>

      {/* Main grid container */}
      <div className="data-grid-wrapper ag-theme-quartz">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          pagination={true} // Feature 2: Pagination when data exceeds grid height
          paginationAutoPageSize={true} // Auto-calculate page size based on grid height
          onGridReady={onGridReady}
          enableCellTextSelection={true}
          ensureDomOrder={true}
          animateRows={true}
          // Feature 9: Quick filter searches across all columns
          quickFilterText={quickFilterText}
          // Row grouping configuration
          rowGroupPanelShow="always" // Show drag panel for grouping
          groupDefaultExpanded={0} // All groups collapsed initially
          suppressAggFuncInHeader={false} // Show aggregation labels
          groupDisplayType="singleColumn" // Single column for groups
        />
      </div>

      {/* Bottom toolbar - Search bar and action buttons */}
      <div className="data-grid-bottom-toolbar">
        <label htmlFor="quick-filter" className="data-grid-search-label">
          Search:
        </label>
        <input
          id="quick-filter"
          type="text"
          placeholder="Filter across all columns..."
          value={quickFilterText}
          onChange={onQuickFilterChanged}
          className="data-grid-search-input"
        />
      </div>
    </div>
  );
};

export default DataGrid;
