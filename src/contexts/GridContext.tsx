import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Tipos para la configuración de columnas
export interface Column {
  id: string;
  header: string;
  accessor: string;
  visible: boolean;
  sortable?: boolean;
  groupable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

// Tipos para el estado de ordenamiento
export interface SortState {
  column: string | null;
  direction: "asc" | "desc" | null;
}

// Tipos para el estado de agrupamiento
export interface GroupState {
  column: string | null;
}

// Tipos para el estado del grid
interface GridState {
  columns: Column[];
  sortState: SortState;
  groupState: GroupState;
  searchTerm: string;
  expandedRows: Set<string | number>;
}

// Tipos para el contexto
interface GridContextType extends GridState {
  setColumns: (columns: Column[]) => void;
  toggleColumnVisibility: (columnId: string) => void;
  saveColumnConfiguration: () => void;
  resetColumnConfiguration: () => void;
  setSortState: (sortState: SortState) => void;
  setGroupState: (groupState: GroupState) => void;
  setSearchTerm: (searchTerm: string) => void;
  toggleRowExpanded: (rowId: string | number) => void;
  isRowExpanded: (rowId: string | number) => boolean;
}

// Crear el contexto
const GridContext = createContext<GridContextType | undefined>(undefined);

// Props para el proveedor
interface GridProviderProps {
  children: ReactNode;
  initialColumns: Column[];
}

// Proveedor del contexto
export const GridProvider: React.FC<GridProviderProps> = ({
  children,
  initialColumns,
}) => {
  // Estado inicial
  const [state, setState] = useState<GridState>({
    columns: initialColumns,
    sortState: { column: null, direction: null },
    groupState: { column: null },
    searchTerm: "",
    expandedRows: new Set<string | number>(),
  });

  // Cargar configuración de columnas desde localStorage al iniciar
  useEffect(() => {
    const savedColumns = localStorage.getItem("gridColumns");
    if (savedColumns) {
      try {
        const parsedColumns = JSON.parse(savedColumns);
        // Asegurarse de que todas las columnas iniciales estén presentes
        const mergedColumns = initialColumns.map((initialCol) => {
          const savedCol = parsedColumns.find(
            (col: Column) => col.id === initialCol.id,
          );
          return savedCol
            ? { ...initialCol, visible: savedCol.visible }
            : initialCol;
        });
        setState((prev) => ({ ...prev, columns: mergedColumns }));
      } catch (error) {
        console.error("Error loading column configuration:", error);
      }
    }
  }, [initialColumns]);

  // Funciones para manipular el estado
  const setColumns = (columns: Column[]) => {
    setState((prev) => ({ ...prev, columns }));
  };

  const toggleColumnVisibility = (columnId: string) => {
    setState((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, visible: !col.visible } : col,
      ),
    }));
  };

  const saveColumnConfiguration = () => {
    try {
      localStorage.setItem("gridColumns", JSON.stringify(state.columns));
    } catch (error) {
      console.error("Error saving column configuration:", error);
    }
  };

  const resetColumnConfiguration = () => {
    setState((prev) => ({ ...prev, columns: initialColumns }));
    localStorage.removeItem("gridColumns");
  };

  const setSortState = (sortState: SortState) => {
    setState((prev) => ({ ...prev, sortState }));
  };

  const setGroupState = (groupState: GroupState) => {
    setState((prev) => ({ ...prev, groupState }));
  };

  const setSearchTerm = (searchTerm: string) => {
    setState((prev) => ({ ...prev, searchTerm }));
  };

  const toggleRowExpanded = (rowId: string | number) => {
    setState((prev) => {
      const newExpandedRows = new Set(prev.expandedRows);
      if (newExpandedRows.has(rowId)) {
        newExpandedRows.delete(rowId);
      } else {
        newExpandedRows.add(rowId);
      }
      return { ...prev, expandedRows: newExpandedRows };
    });
  };

  const isRowExpanded = (rowId: string | number) => {
    return state.expandedRows.has(rowId);
  };

  // Valor del contexto
  const value: GridContextType = {
    ...state,
    setColumns,
    toggleColumnVisibility,
    saveColumnConfiguration,
    resetColumnConfiguration,
    setSortState,
    setGroupState,
    setSearchTerm,
    toggleRowExpanded,
    isRowExpanded,
  };

  return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
};

// Hook para usar el contexto
export const useGridContext = () => {
  const context = useContext(GridContext);
  if (context === undefined) {
    throw new Error("useGridContext must be used within a GridProvider");
  }
  return context;
};
