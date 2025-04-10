import React from "react";
import { Group, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Column, GroupState, useGridContext } from "@/contexts/GridContext";

interface GroupingMenuProps {
  columns: Column[];
}

const GroupingMenu: React.FC<GroupingMenuProps> = ({ columns }) => {
  const { groupState, setGroupState } = useGridContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={groupState.column ? "default" : "outline"}
          size="icon"
          className="relative"
          title="Group Data"
        >
          <Group className="h-4 w-4" />
          {groupState.column && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {groupState.column ? (
          <DropdownMenuItem onClick={() => setGroupState({ column: null })}>
            <X className="mr-2 h-4 w-4" />
            <span>Quitar agrupación</span>
          </DropdownMenuItem>
        ) : (
          <div className="text-sm px-2 py-1.5 text-muted-foreground">
            Agrupar por:
          </div>
        )}
        {columns
          .filter((col) => col.groupable && col.visible)
          .map((column) => (
            <DropdownMenuItem
              key={column.id}
              onClick={() => setGroupState({ column: column.accessor })}
              className={
                groupState.column === column.accessor ? "bg-muted" : ""
              }
            >
              <Group className="mr-2 h-4 w-4" />
              <span>{column.header}</span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GroupingMenu;
