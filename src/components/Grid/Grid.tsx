import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Column, GridProvider, useGridContext } from "@/contexts/GridContext";
import ColumnConfiguration from "./ColumnConfiguration";
import ExportMenu from "./ExportMenu";
import GroupingMenu from "./GroupingMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GridProps {
  data: any[];
  columns: Column[];
  idField?: string;
  title?: string;
  onRowClick?: (row: any) => void;
  expandableContent?: (row: any) => React.ReactNode;
}

const GridComponent: React.FC<GridProps> = ({
  data,
  columns: initialColumns,
  idField = "id",
  title = "Data Grid",
  onRowClick,
  expandableContent,
}) => {
  const {
    columns,
    sortState,
    groupState,
    searchTerm,
    setSortState,
    setGroupState,
    setSearchTerm,
    toggleRowExpanded,
    isRowExpanded,
  } = useGridContext();

  // Filtrar datos basados en el término de búsqueda
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

  // Ordenar datos
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

  // Agrupar datos
  const groupedData = useMemo(() => {
    if (!groupState.column) return sortedData;

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

  // Manejar clic en encabezado de columna para ordenar
  const handleSort = (columnId: string) => {
    setSortState((prev) => {
      if (prev.column === columnId) {
        // Ciclo: asc -> desc -> null
        if (prev.direction === "asc") {
          return { column: columnId, direction: "desc" };
        } else if (prev.direction === "desc") {
          return { column: null, direction: null };
        } else {
          return { column: columnId, direction: "asc" };
        }
      } else {
        // Nueva columna, comenzar con asc
        return { column: columnId, direction: "asc" };
      }
    });
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

      return (
        <React.Fragment key={rowId}>
          <tr
            className={`hover:bg-muted/50 ${onRowClick ? "cursor-pointer" : ""}`}
            onClick={() => onRowClick && onRowClick(row)}
          >
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
                  (expandableContent ? 1 : 0)
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

              return (
                <React.Fragment key={rowId}>
                  <tr
                    className={`hover:bg-muted/50 ${onRowClick ? "cursor-pointer" : ""}`}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
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
                          (expandableContent ? 1 : 0)
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
          {filteredData.length} {filteredData.length === 1 ? "item" : "items"}
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
export const Grid: React.FC<GridProps> = (props) => {
  return (
    <GridProvider initialColumns={props.columns}>
      <GridComponent {...props} />
    </GridProvider>
  );
};

export default Grid;
