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

  // Column definitions with row grouping and aggregation support on ALL columns
  const columnDefs = useMemo<ColDef[]>(() => {
    if (data.length === 0) return [];

    // Dynamically create column definitions from the first row
    const firstRow = data[0];
    return Object.keys(firstRow).map(key => {
      const baseColDef: ColDef = {
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        sortable: true,
        floatingFilter: true,
        resizable: true,
        enableRowGroup: true, // Enable grouping on ALL columns
      };

      // Configure salary column with aggregation and currency formatting
      if (key === 'salary') {
        return {
          ...baseColDef,
          enableValue: true,
          aggFunc: 'avg',
          filter: 'agNumberColumnFilter',
          valueFormatter: (params: any) => {
            if (params.value == null) return '';
            return '$' + params.value.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            });
          },
        };
      }

      // Configure ID column with count aggregation
      if (key === 'id') {
        return {
          ...baseColDef,
          enableValue: true,
          aggFunc: 'count',
          filter: 'agNumberColumnFilter',
        };
      }

      // Use number filter for numeric columns
      if (key === 'id' || key === 'salary') {
        return {
          ...baseColDef,
          filter: 'agNumberColumnFilter',
        };
      }

      // Default configuration with text filter
      return {
        ...baseColDef,
        filter: 'agTextColumnFilter',
      };
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
