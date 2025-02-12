"use client";
import { useState, useRef } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Users,
  Filter,
  ArrowUpDown,
  Eye,
  Group,
} from "lucide-react";

import type {
  Column,
  Group as GroupType,
  ColumnType,
} from "@/app/types/estimates";
import { ColumnTypeMenu } from "@/app/_components/ColumnTypeMenu";

const defaultColumns: Column[] = [
  { id: "task", name: "Task", type: "text", width: 300 },
  { id: "status", name: "Status", type: "status", width: 150 },
  { id: "owner", name: "Owner", type: "owner", width: 150 },
  { id: "dueDate", name: "Due date", type: "date", width: 150 },
];

export default function TaskScheduler() {
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [groups, setGroups] = useState<GroupType[]>([
    {
      id: "1",
      name: "To-Do fortnite",
      isExpanded: true,
      tasks: [
        {
          id: "1",
          data: {
            task: "Task hello",
            status: "Stuck",
            owner: "John Doe",
            dueDate: "2024-02-09",
          },
          isExpanded: true,
          subitems: [
            {
              id: "1-1",
              data: {
                task: "something",
                status: "",
                owner: "",
                dueDate: "",
              },
            },
          ],
        },
      ],
    },
  ]);
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [editingColumn, setEditingColumn] = useState<{
    columnId: string;
    value: string;
  } | null>(null);
  const [editingCell, setEditingCell] = useState<{
    groupId: string;
    taskId: string;
    columnId: string;
    subitemId?: string;
    value: string;
  } | null>(null);

  const draggedColumn = useRef<{
    id: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  const handleColumnResize = (e: React.MouseEvent, columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column) return;

    draggedColumn.current = {
      id: columnId,
      startX: e.clientX,
      startWidth: column.width,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!draggedColumn.current) return;

      const diff = e.clientX - draggedColumn.current.startX;
      const newWidth = Math.max(100, draggedColumn.current.startWidth + diff);

      setColumns(
        columns.map((col) =>
          col.id === columnId ? { ...col, width: newWidth } : col
        )
      );
    };

    const handleMouseUp = () => {
      draggedColumn.current = null;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleColumnDoubleClick = (column: Column) => {
    setEditingColumn({ columnId: column.id, value: column.name });
  };

  const handleColumnNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingColumn) {
      setEditingColumn({ ...editingColumn, value: e.target.value });
    }
  };

  const handleColumnNameSave = () => {
    if (editingColumn) {
      setColumns(
        columns.map((col) =>
          col.id === editingColumn.columnId
            ? { ...col, name: editingColumn.value }
            : col
        )
      );
      setEditingColumn(null);
    }
  };

  const handleCellDoubleClick = (
    groupId: string,
    taskId: string,
    columnId: string,
    value: string,
    subitemId?: string
  ) => {
    setEditingCell({
      groupId,
      taskId,
      columnId,
      subitemId,
      value: value || "", // Ensure value is never undefined
    });
  };

  const handleCellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingCell) {
      setEditingCell({ ...editingCell, value: e.target.value });
    }
  };

  const handleCellSave = () => {
    if (!editingCell) return;

    setGroups(
      groups.map((group) =>
        group.id === editingCell.groupId
          ? {
              ...group,
              tasks: group.tasks.map((task) =>
                task.id === editingCell.taskId
                  ? editingCell.subitemId
                    ? {
                        ...task,
                        subitems: (task.subitems || []).map((subitem) =>
                          subitem.id === editingCell.subitemId
                            ? {
                                ...subitem,
                                data: {
                                  ...subitem.data,
                                  [editingCell.columnId]: editingCell.value,
                                },
                              }
                            : subitem
                        ),
                      }
                    : {
                        ...task,
                        data: {
                          ...task.data,
                          [editingCell.columnId]: editingCell.value,
                        },
                      }
                  : task
              ),
            }
          : group
      )
    );
    setEditingCell(null);
  };

  const toggleGroup = (groupId: string) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? { ...group, isExpanded: !group.isExpanded }
          : group
      )
    );
  };

  const toggleTask = (groupId: string, taskId: string) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, isExpanded: !task.isExpanded }
                  : task
              ),
            }
          : group
      )
    );
  };

  const handleAddColumn = (e: React.MouseEvent) => {
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleSelectColumnType = (type: ColumnType) => {
    const newColumnId = `col-${Date.now()}`; // Use timestamp for unique ID
    const newColumn: Column = {
      id: newColumnId,
      name: "New Column",
      type,
      width: 150,
    };

    // Update all tasks and subitems with the new column, initializing with empty string
    const updatedGroups = groups.map((group) => ({
      ...group,
      tasks: group.tasks.map((task) => ({
        ...task,
        data: {
          ...task.data,
          [newColumnId]: "", // Initialize with empty string
        },
        subitems:
          task.subitems?.map((subitem) => ({
            ...subitem,
            data: {
              ...subitem.data,
              [newColumnId]: "", // Initialize with empty string
            },
          })) || [],
      })),
    }));

    setColumns([...columns, newColumn]);
    setGroups(updatedGroups);
    setMenuPosition(null);
  };

  const closeMenu = () => {
    setMenuPosition(null);
  };

  return (
    <div className="min-h-screen bg-white p-8 rounded-xl border">
      <div>
        <div className="flex items-center gap-2 p-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
            New task
            <ChevronDown className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1">
              <Search className="w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                className="border-none outline-none bg-transparent"
              />
            </div>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Users className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <ArrowUpDown className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded flex items-center gap-1">
              <Group className="w-4 h-4" />
              Group by
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <div className="min-w-max">
          {groups.map((group) => (
            <div key={group.id} className="border-b">
              <div
                className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleGroup(group.id)}
              >
                {group.isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <span className="font-medium">{group.name}</span>
              </div>

              {group.isExpanded && (
                <>
                  <div className="flex border-y bg-gray-50">
                    {columns.map((column) => (
                      <div
                        key={column.id}
                        className="flex items-center border-r"
                        style={{ width: column.width }}
                      >
                        <div
                          className="flex-1 p-2 text-sm font-medium"
                          onDoubleClick={() => handleColumnDoubleClick(column)}
                        >
                          {editingColumn?.columnId === column.id ? (
                            <input
                              type="text"
                              value={editingColumn.value}
                              onChange={handleColumnNameChange}
                              onBlur={handleColumnNameSave}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleColumnNameSave();
                                }
                              }}
                              className="w-full px-1 rounded border border-blue-500 focus:outline-none"
                              autoFocus
                            />
                          ) : (
                            column.name
                          )}
                        </div>
                        <div
                          className="w-1 h-full cursor-col-resize hover:bg-blue-500"
                          onMouseDown={(e) => handleColumnResize(e, column.id)}
                        />
                      </div>
                    ))}
                    <button
                      onClick={handleAddColumn}
                      className="p-2 hover:bg-gray-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {group.tasks.map((task) => (
                    <div key={task.id}>
                      <div className="flex border-b hover:bg-gray-50">
                        {columns.map((column) => (
                          <div
                            key={column.id}
                            className="p-2 border-r"
                            style={{ width: column.width }}
                          >
                            <div className="flex items-center gap-2">
                              {column.id === "task" && (
                                <button
                                  onClick={() => toggleTask(group.id, task.id)}
                                  className="p-1 hover:bg-gray-200 rounded"
                                >
                                  {task.isExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                              <div
                                className="flex-1 min-h-[24px] cursor-text"
                                onDoubleClick={() =>
                                  handleCellDoubleClick(
                                    group.id,
                                    task.id,
                                    column.id,
                                    task.data[column.id] || ""
                                  )
                                }
                              >
                                {editingCell?.groupId === group.id &&
                                editingCell?.taskId === task.id &&
                                editingCell?.columnId === column.id &&
                                !editingCell?.subitemId ? (
                                  <input
                                    type="text"
                                    value={editingCell.value}
                                    onChange={handleCellChange}
                                    onBlur={handleCellSave}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleCellSave();
                                      }
                                    }}
                                    className="w-full px-1 rounded border border-blue-500 focus:outline-none"
                                    autoFocus
                                  />
                                ) : (
                                  task.data[column.id] || ""
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {task.isExpanded &&
                        task.subitems?.map((subitem) => (
                          <div
                            key={subitem.id}
                            className="flex border-b hover:bg-gray-50 pl-8"
                          >
                            {columns.map((column) => (
                              <div
                                key={column.id}
                                className="p-2 border-r"
                                style={{ width: column.width }}
                              >
                                <div
                                  className="min-h-[24px] cursor-text"
                                  onDoubleClick={() =>
                                    handleCellDoubleClick(
                                      group.id,
                                      task.id,
                                      column.id,
                                      subitem.data[column.id] || "",
                                      subitem.id
                                    )
                                  }
                                >
                                  {editingCell?.groupId === group.id &&
                                  editingCell?.taskId === task.id &&
                                  editingCell?.columnId === column.id &&
                                  editingCell?.subitemId === subitem.id ? (
                                    <input
                                      type="text"
                                      value={editingCell.value}
                                      onChange={handleCellChange}
                                      onBlur={handleCellSave}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          handleCellSave();
                                        }
                                      }}
                                      className="w-full px-1 rounded border border-blue-500 focus:outline-none"
                                      autoFocus
                                    />
                                  ) : (
                                    subitem.data[column.id] || ""
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <ColumnTypeMenu
        position={menuPosition}
        onSelect={handleSelectColumnType}
        onClose={closeMenu}
      />
    </div>
  );
}
