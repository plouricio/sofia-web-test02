import { useState, useMemo } from "react";
import { Column } from "@/contexts/GridContext";

interface SortState {
  column: string | null;
  direction: "asc" | "desc" | null;
}

interface GroupState {
  column: string | null;
}

interface UseGridDataProps {
  data: any[];
  columns: Column[];
}

interface UseGridDataReturn {
  filteredData: any[];
  sortedData: any[];
  groupedData: Record<string, any[]>;
  sortState: SortState;
  groupState: GroupState;
  searchTerm: string;
  expandedRows: Set<string | number>;
  setSortState: (
    sortState: SortState | ((prev: SortState) => SortState),
  ) => void;
  setGroupState: (
    groupState: GroupState | ((prev: GroupState) => GroupState),
  ) => void;
  setSearchTerm: (searchTerm: string) => void;
  toggleRowExpanded: (rowId: string | number) => void;
  isRowExpanded: (rowId: string | number) => boolean;
  handleSort: (columnId: string) => void;
}

export const useGridData = ({
  data,
  columns,
}: UseGridDataProps): UseGridDataReturn => {
  // State for sorting, grouping, searching, and expanded rows
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: null,
  });
  const [groupState, setGroupState] = useState<GroupState>({ column: null });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(
    new Set(),
  );

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((row) => {
      return columns.some((column) => {
        if (!column.visible) return false;
        const value = row[column.accessor];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, columns, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortState.column || !sortState.direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valueA = a[sortState.column as string];
      const valueB = b[sortState.column as string];

      if (valueA === valueB) return 0;

      const direction = sortState.direction === "asc" ? 1 : -1;

      if (valueA == null) return 1 * direction;
      if (valueB == null) return -1 * direction;

      if (typeof valueA === "string" && typeof valueB === "string") {
        return valueA.localeCompare(valueB) * direction;
      }

      return (valueA > valueB ? 1 : -1) * direction;
    });
  }, [filteredData, sortState]);

  // Group data
  const groupedData = useMemo(() => {
    if (!groupState.column) return {};

    const groups: Record<string, any[]> = {};

    sortedData.forEach((row) => {
      const groupValue = row[groupState.column as string];
      const groupKey = groupValue != null ? String(groupValue) : "Undefined";

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }

      groups[groupKey].push(row);
    });

    return groups;
  }, [sortedData, groupState]);

  // Toggle row expanded state
  const toggleRowExpanded = (rowId: string | number) => {
    setExpandedRows((prev) => {
      const newExpandedRows = new Set(prev);
      if (newExpandedRows.has(rowId)) {
        newExpandedRows.delete(rowId);
      } else {
        newExpandedRows.add(rowId);
      }
      return newExpandedRows;
    });
  };

  // Check if row is expanded
  const isRowExpanded = (rowId: string | number) => {
    return expandedRows.has(rowId);
  };

  // Handle column header click for sorting
  const handleSort = (columnId: string) => {
    setSortState((prev) => {
      if (prev.column === columnId) {
        // Cycle: asc -> desc -> null
        if (prev.direction === "asc") {
          return { column: columnId, direction: "desc" };
        } else if (prev.direction === "desc") {
          return { column: null, direction: null };
        } else {
          return { column: columnId, direction: "asc" };
        }
      } else {
        // New column, start with asc
        return { column: columnId, direction: "asc" };
      }
    });
  };

  return {
    filteredData,
    sortedData,
    groupedData,
    sortState,
    groupState,
    searchTerm,
    expandedRows,
    setSortState,
    setGroupState,
    setSearchTerm,
    toggleRowExpanded,
    isRowExpanded,
    handleSort,
  };
};
