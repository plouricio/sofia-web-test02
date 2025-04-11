import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Search,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Column, GridProvider } from "@/contexts/GridContext";
import { useGridData } from "@/hooks/useGridData";
import ColumnConfiguration from "./ColumnConfiguration";
import ExportMenu from "./ExportMenu";
import GroupingMenu from "./GroupingMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SelectableGridProps {
  data: any[];
  columns: Column[];
  idField?: string;
  title?: string;
  onRowClick?: (row: any) => void;
  expandableContent?: (row: any) => React.ReactNode;
  onSelectionChange?: (selectedRows: any[]) => void;
  selectedRowIds?: string[] | number[];
}

const SelectableGridComponent: React.FC<SelectableGridProps> = ({
  data,
  columns: initialColumns,
  idField = "id",
  title = "Data Grid",
  onRowClick,
  expandableContent,
  onSelectionChange,
  selectedRowIds: externalSelectedRowIds,
}) => {
  // Use the custom hook for grid data management
  const {
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
  } = useGridData({ data, columns: initialColumns });

  // State for selected rows
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string | number>>(
    new Set(externalSelectedRowIds || []),
  );

  // Update external state when selection changes
  useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = data.filter((row) =>
        selectedRowIds.has(row[idField]),
      );
      onSelectionChange(selectedRows);
    }
  }, [selectedRowIds, data, idField, onSelectionChange]);

  // Update internal state when external selection changes
  useEffect(() => {
    if (externalSelectedRowIds) {
      setSelectedRowIds(new Set(externalSelectedRowIds));
    }
  }, [externalSelectedRowIds]);

  // Toggle selection of a single row
  const toggleRowSelection = (rowId: string | number) => {
    setSelectedRowIds((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(rowId)) {
        newSelection.delete(rowId);
      } else {
        newSelection.add(rowId);
      }
      return newSelection;
    });
  };

  // Toggle selection of all visible rows
  const toggleAllRows = () => {
    if (groupState.column) {
      // If grouped, we need to handle each group separately
      const allVisibleRowIds = Object.values(groupedData)
        .flat()
        .map((row) => row[idField]);

      const allSelected = allVisibleRowIds.every((id) =>
        selectedRowIds.has(id),
      );

      if (allSelected) {
        // Deselect all visible rows
        setSelectedRowIds((prev) => {
          const newSelection = new Set(prev);
          allVisibleRowIds.forEach((id) => newSelection.delete(id));
          return newSelection;
        });
      } else {
        // Select all visible rows
        setSelectedRowIds((prev) => {
          const newSelection = new Set(prev);
          allVisibleRowIds.forEach((id) => newSelection.add(id));
          return newSelection;
        });
      }
    } else {
      // If not grouped, handle all visible rows
      const allVisibleRowIds = sortedData.map((row) => row[idField]);
      const allSelected = allVisibleRowIds.every((id) =>
        selectedRowIds.has(id),
      );

      if (allSelected) {
        // Deselect all visible rows
        setSelectedRowIds((prev) => {
          const newSelection = new Set(prev);
          allVisibleRowIds.forEach((id) => newSelection.delete(id));
          return newSelection;
        });
      } else {
        // Select all visible rows
        setSelectedRowIds((prev) => {
          const newSelection = new Set(prev);
          allVisibleRowIds.forEach((id) => newSelection.add(id));
          return newSelection;
        });
      }
    }
  };

  // Check if all visible rows are selected
  const areAllRowsSelected = () => {
    if (groupState.column) {
      const allVisibleRowIds = Object.values(groupedData)
        .flat()
        .map((row) => row[idField]);
      return (
        allVisibleRowIds.length > 0 &&
        allVisibleRowIds.every((id) => selectedRowIds.has(id))
      );
    } else {
      return (
        sortedData.length > 0 &&
        sortedData.every((row) => selectedRowIds.has(row[idField]))
      );
    }
  };

  // Renderizar encabezados de columna
  const renderHeaders = () => {
    return columns
      .filter((column) => column.visible)
      .map((column) => (
        <th
          key={column.id}
          className={`px-4 py-2 text-left font-medium text-sm ${column.sortable ? "cursor-pointer hover:bg-muted/50" : ""}`}
          onClick={() => column.sortable && handleSort(column.accessor)}
        >
          <div className="flex items-center">
            {column.header}
            {sortState.column === column.accessor && (
              <span className="ml-1">
                {sortState.direction === "asc" ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </span>
            )}
          </div>
        </th>
      ));
  };

  // Renderizar celdas de una fila
  const renderCells = (row: any) => {
    return columns
      .filter((column) => column.visible)
      .map((column) => (
        <td key={column.id} className="px-4 py-2 border-t">
          {column.render
            ? column.render(row[column.accessor], row)
            : row[column.accessor] != null
              ? String(row[column.accessor])
              : ""}
        </td>
      ));
  };

  // Renderizar filas normales (sin agrupar)
  const renderRows = () => {
    if (groupState.column) return null;

    return sortedData.map((row) => {
      const rowId = row[idField];
      const isExpanded = isRowExpanded(rowId);
      const isSelected = selectedRowIds.has(rowId);

      return (
        <React.Fragment key={rowId}>
          <tr
            className={`hover:bg-muted/50 ${isSelected ? "bg-muted/30" : ""} ${onRowClick ? "cursor-pointer" : ""}`}
            onClick={() => onRowClick && onRowClick(row)}
          >
            <td className="px-4 py-2 border-t w-10">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => toggleRowSelection(rowId)}
                onClick={(e) => e.stopPropagation()}
              />
            </td>
            {expandableContent && (
              <td className="px-4 py-2 border-t w-10">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRowExpanded(rowId);
                  }}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </td>
            )}
            {renderCells(row)}
          </tr>
          {expandableContent && isExpanded && (
            <tr>
              <td
                colSpan={
                  columns.filter((col) => col.visible).length +
                  (expandableContent ? 1 : 0) +
                  1 // +1 for the checkbox column
                }
                className="bg-muted/20 p-4"
              >
                {expandableContent(row)}
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    });
  };

  // Renderizar filas agrupadas
  const renderGroupedRows = () => {
    if (!groupState.column) return null;

    return Object.entries(groupedData).map(([groupName, rows]) => {
      const groupId = `group-${groupName}`;
      const isExpanded = isRowExpanded(groupId);

      return (
        <React.Fragment key={groupId}>
          <tr className="bg-muted/30">
            <td className="px-4 py-2 w-10">
              {/* No checkbox for group header */}
            </td>
            <td
              colSpan={
                columns.filter((col) => col.visible).length +
                (expandableContent ? 1 : 0)
              }
              className="px-4 py-2 font-medium"
            >
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleRowExpanded(groupId)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                <span>
                  {
                    columns.find((col) => col.accessor === groupState.column)
                      ?.header
                  }
                  : {groupName} ({rows.length} items)
                </span>
              </div>
            </td>
          </tr>
          {isExpanded &&
            rows.map((row) => {
              const rowId = row[idField];
              const rowExpanded = isRowExpanded(rowId);
              const isSelected = selectedRowIds.has(rowId);

              return (
                <React.Fragment key={rowId}>
                  <tr
                    className={`hover:bg-muted/50 ${isSelected ? "bg-muted/30" : ""} ${onRowClick ? "cursor-pointer" : ""}`}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    <td className="px-4 py-2 border-t w-10">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleRowSelection(rowId)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    {expandableContent && (
                      <td className="px-4 py-2 border-t w-10">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowExpanded(rowId);
                          }}
                        >
                          {rowExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    )}
                    {renderCells(row)}
                  </tr>
                  {expandableContent && rowExpanded && (
                    <tr>
                      <td
                        colSpan={
                          columns.filter((col) => col.visible).length +
                          (expandableContent ? 1 : 0) +
                          1 // +1 for the checkbox column
                        }
                        className="bg-muted/20 p-4"
                      >
                        {expandableContent(row)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="bg-background border rounded-lg shadow-sm">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
          <ColumnConfiguration columns={columns} />
          <ExportMenu
            data={sortedData}
            columns={columns}
            filename={title.replace(/\s+/g, "-").toLowerCase()}
          />
          <GroupingMenu columns={columns} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-10 px-4 py-2">
                <Checkbox
                  checked={areAllRowsSelected()}
                  onCheckedChange={toggleAllRows}
                />
              </th>
              {expandableContent && <th className="w-10"></th>}
              {renderHeaders()}
            </tr>
          </thead>
          <tbody>
            {groupState.column ? renderGroupedRows() : renderRows()}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
        <div>
          {filteredData.length} {filteredData.length === 1 ? "item" : "items"} |{" "}
          {selectedRowIds.size} selected
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>Page 1 of 1</span>
          <Button variant="outline" size="icon" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Componente contenedor que proporciona el contexto
export const SelectableGrid: React.FC<SelectableGridProps> = (props) => {
  // No need for GridProvider anymore as we're using the useGridData hook directly
  return <SelectableGridComponent {...props} />;
};

export default SelectableGrid;
