"use client";
import type React from "react";
import { useState, useRef } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Users,
  Search,
  Filter,
  Eye,
  Layers,
  MoreHorizontal,
} from "react-feather";
import { ArrowUpDown } from "lucide-react";

type ColumnType = "text" | "number" | "date" | "select";

interface Column {
  id: string;
  name: string;
  type: ColumnType;
  width: number;
}

const defaultColumns: Column[] = [
  { id: "task", name: "Task", type: "text", width: 200 },
  { id: "status", name: "Status", type: "text", width: 100 },
  { id: "owner", name: "Owner", type: "text", width: 100 },
  { id: "dueDate", name: "Due Date", type: "date", width: 100 },
];

interface TaskData {
  task: string;
  status: string;
  owner: string;
  dueDate: string;
}

interface Task {
  id: string;
  data: TaskData;
  isExpanded: boolean;
  subitems?: SubTask[];
  subtaskColumns: Column[]; // Add subtask columns to each task
}

interface SubTask {
  id: string;
  data: { [key: string]: string };
}

interface GroupType {
  id: string;
  name: string;
  isExpanded: boolean;
  tasks: Task[];
  columns: Column[];
}

interface ColumnTypeMenuProps {
  position: {
    x: number;
    y: number;
    groupId: string;
    taskId?: string;
    isSubTask?: boolean;
  } | null;
  onSelect: (type: ColumnType) => void;
  onClose: () => void;
}

const ColumnTypeMenu: React.FC<ColumnTypeMenuProps> = ({
  position,
  onSelect,
  onClose,
}) => {
  if (!position) return null;

  return (
    <div
      className="absolute bg-white shadow-md rounded-md border"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="p-2">
        <button onClick={() => onSelect("text")}>Text</button>
        <button onClick={() => onSelect("number")}>Number</button>
        <button onClick={() => onSelect("date")}>Date</button>
        <button onClick={() => onSelect("select")}>Select</button>
      </div>
    </div>
  );
};

export default function TaskScheduler() {
  const [groups, setGroups] = useState<GroupType[]>([
    {
      id: "1",
      name: "School work",
      isExpanded: true,
      tasks: [
        {
          id: "1",
          data: {
            task: "Learning Math",
            status: "Stuck",
            owner: "John Doe",
            dueDate: "2024-02-09",
          },
          isExpanded: true,
          subtaskColumns: [...defaultColumns], // Initialize subtask columns for each task
          subitems: [
            {
              id: "1-1",
              data: {
                task: "Do Calculus",
                status: "",
                owner: "",
                dueDate: "",
              },
            },
            {
              id: "1-2",
              data: {
                task: "Do Trig",
                status: "",
                owner: "",
                dueDate: "",
              },
            },
          ],
        },
      ],
      columns: [...defaultColumns],
    },
  ]);
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
    groupId: string;
    taskId?: string;
    isSubTask?: boolean;
  } | null>(null);
  const [editingColumn, setEditingColumn] = useState<{
    columnId: string;
    value: string;
    groupId: string;
    taskId?: string;
    isSubTask?: boolean;
  } | null>(null);
  const [editingCell, setEditingCell] = useState<{
    groupId: string;
    taskId: string;
    columnId: string;
    subitemId?: string;
    value: string;
  } | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

  const draggedColumn = useRef<{
    id: string;
    startX: number;
    startWidth: number;
    isSubTask?: boolean;
    groupId: string;
    taskId?: string;
  } | null>(null);

  const handleColumnResize = (
    e: React.MouseEvent,
    columnId: string,
    groupId: string,
    taskId?: string,
    isSubTask = false
  ) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    const task = isSubTask ? group.tasks.find((t) => t.id === taskId) : null;
    const columnsToUse = isSubTask ? task?.subtaskColumns : group.columns;
    const column = columnsToUse?.find((col) => col.id === columnId);
    if (!column) return;

    draggedColumn.current = {
      id: columnId,
      startX: e.clientX,
      startWidth: column.width,
      isSubTask,
      groupId,
      taskId,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!draggedColumn.current) return;

      const diff = e.clientX - draggedColumn.current.startX;
      const newWidth = Math.max(100, draggedColumn.current.startWidth + diff);

      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === draggedColumn.current?.groupId
            ? {
                ...group,
                ...(draggedColumn.current.isSubTask
                  ? {
                      tasks: group.tasks.map((task) =>
                        task.id === draggedColumn.current?.taskId
                          ? {
                              ...task,
                              subtaskColumns: task.subtaskColumns.map((col) =>
                                col.id === columnId
                                  ? { ...col, width: newWidth }
                                  : col
                              ),
                            }
                          : task
                      ),
                    }
                  : {
                      columns: group.columns.map((col) =>
                        col.id === columnId ? { ...col, width: newWidth } : col
                      ),
                    }),
              }
            : group
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

  const handleColumnDoubleClick = (
    column: Column,
    groupId: string,
    taskId?: string,
    isSubTask?: boolean
  ) => {
    setEditingColumn({
      columnId: column.id,
      value: column.name,
      groupId,
      taskId,
      isSubTask,
    });
  };

  const handleColumnNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingColumn) {
      setEditingColumn({ ...editingColumn, value: e.target.value });
    }
  };

  const handleColumnNameSave = () => {
    if (editingColumn) {
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === editingColumn.groupId
            ? {
                ...group,
                ...(editingColumn.isSubTask
                  ? {
                      tasks: group.tasks.map((task) =>
                        task.id === editingColumn.taskId
                          ? {
                              ...task,
                              subtaskColumns: task.subtaskColumns.map((col) =>
                                col.id === editingColumn.columnId
                                  ? { ...col, name: editingColumn.value }
                                  : col
                              ),
                            }
                          : task
                      ),
                    }
                  : {
                      columns: group.columns.map((col) =>
                        col.id === editingColumn.columnId
                          ? { ...col, name: editingColumn.value }
                          : col
                      ),
                    }),
              }
            : group
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
      value: value || "",
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

  const handleAddColumn = (
    e: React.MouseEvent,
    groupId: string,
    taskId?: string,
    isSubTask = false
  ) => {
    setMenuPosition({
      x: e.clientX,
      y: e.clientY,
      groupId,
      taskId,
      isSubTask,
    });
  };

  const handleSelectColumnType = (type: ColumnType) => {
    if (!menuPosition) return;

    const newColumnId = `col-${Date.now()}`;
    const newColumn: Column = {
      id: newColumnId,
      name: "New Column",
      type,
      width: 150,
    };

    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === menuPosition.groupId
          ? {
              ...group,
              ...(menuPosition.isSubTask
                ? {
                    tasks: group.tasks.map((task) =>
                      task.id === menuPosition.taskId
                        ? {
                            ...task,
                            subtaskColumns: [...task.subtaskColumns, newColumn],
                            subitems: task.subitems?.map((subitem) => ({
                              ...subitem,
                              data: { ...subitem.data, [newColumnId]: "" },
                            })),
                          }
                        : task
                    ),
                  }
                : {
                    columns: [...group.columns, newColumn],
                    tasks: group.tasks.map((task) => ({
                      ...task,
                      data: { ...task.data, [newColumnId]: "" },
                    })),
                  }),
            }
          : group
      )
    );
    setMenuPosition(null);
  };

  const closeMenu = () => {
    setMenuPosition(null);
  };

  const handleAddSubtask = (groupId: string, taskId: string) => {
    const newSubtaskId = `${taskId}-${Date.now()}`;
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      isExpanded: true,
                      subitems: [
                        ...(task.subitems || []),
                        {
                          id: newSubtaskId,
                          data: task.subtaskColumns.reduce(
                            (acc, col) => ({ ...acc, [col.id]: "" }),
                            {}
                          ),
                        },
                      ],
                    }
                  : task
              ),
            }
          : group
      )
    );
  };

  const handleAddGroup = () => {
    const newGroupId = `group-${Date.now()}`;
    const newGroup: GroupType = {
      id: newGroupId,
      name: "New Group",
      isExpanded: true,
      tasks: [],
      columns: [...defaultColumns],
    };
    setGroups([...groups, newGroup]);
    setEditingGroupId(newGroupId);
  };

  const handleAddTask = (groupId: string) => {
    const newTaskId = `task-${Date.now()}`;
    const group = groups.find((g) => g.id === groupId);
    const newTask: Task = {
      id: newTaskId,
      data: (group?.columns || defaultColumns).reduce(
        (acc, col) => ({ ...acc, [col.id]: "" }),
        {} as TaskData
      ),
      isExpanded: false,
      subitems: [],
      subtaskColumns: [...defaultColumns], // Initialize subtask columns for new tasks
    };
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? { ...group, tasks: [...group.tasks, newTask] }
          : group
      )
    );
  };

  return (
    <div className="min-h-screen bg-white p-8 rounded-xl border">
      <div>
        <div className="flex items-center gap-2 p-2">
          <button
            onClick={handleAddGroup}
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            New Group
            <Plus className="w-4 h-4" />
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
              <Layers className="w-4 h-4" />
              Group by
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <div className="min-w-max">
          {groups.map((group) => (
            <div key={group.id} className="border-b">
              <div className="flex items-center justify-between gap-2 p-2 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleGroup(group.id)}>
                    {group.isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {editingGroupId === group.id ? (
                    <input
                      type="text"
                      value={group.name}
                      onChange={(e) => {
                        setGroups(
                          groups.map((g) =>
                            g.id === group.id
                              ? { ...g, name: e.target.value }
                              : g
                          )
                        );
                      }}
                      onBlur={() => setEditingGroupId(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setEditingGroupId(null);
                        }
                      }}
                      className="px-1 rounded border border-blue-500 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <span
                      className="font-medium"
                      onDoubleClick={() => setEditingGroupId(group.id)}
                    >
                      {group.name}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleAddTask(group.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded-md text-sm"
                >
                  Add Task
                </button>
              </div>

              {group.isExpanded && (
                <>
                  <div className="flex border-y bg-gray-50">
                    {group.columns.map((column) => (
                      <div
                        key={column.id}
                        className="flex items-center border-r"
                        style={{ width: column.width }}
                      >
                        <div
                          className="flex-1 p-2 text-sm font-medium"
                          onDoubleClick={() =>
                            handleColumnDoubleClick(column, group.id)
                          }
                        >
                          {editingColumn?.columnId === column.id &&
                          editingColumn.groupId === group.id &&
                          !editingColumn.isSubTask ? (
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
                          onMouseDown={(e) =>
                            handleColumnResize(e, column.id, group.id)
                          }
                        />
                      </div>
                    ))}
                    <button
                      onClick={(e) => handleAddColumn(e, group.id)}
                      className="p-2 hover:bg-gray-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {group.tasks.map((task) => (
                    <div key={task.id}>
                      <div className="flex border-b hover:bg-gray-50 group">
                        {group.columns.map((column) => (
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
                                  <div className="font-medium">
                                    {task.data[column.id] || ""}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddSubtask(group.id, task.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-200 transition-opacity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {task.isExpanded && (
                        <>
                          <div className="flex border-y bg-gray-50/50 pl-8 border-l-2 border-l-blue-200">
                            {task.subtaskColumns.map((column) => (
                              <div
                                key={column.id}
                                className="flex items-center border-r"
                                style={{ width: column.width }}
                              >
                                <div
                                  className="flex-1 p-2 text-sm font-medium"
                                  onDoubleClick={() =>
                                    handleColumnDoubleClick(
                                      column,
                                      group.id,
                                      task.id,
                                      true
                                    )
                                  }
                                >
                                  {editingColumn?.columnId === column.id &&
                                  editingColumn.isSubTask &&
                                  editingColumn.taskId === task.id ? (
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
                                  onMouseDown={(e) =>
                                    handleColumnResize(
                                      e,
                                      column.id,
                                      group.id,
                                      task.id,
                                      true
                                    )
                                  }
                                />
                              </div>
                            ))}
                            <button
                              onClick={(e) =>
                                handleAddColumn(e, group.id, task.id, true)
                              }
                              className="p-2 hover:bg-gray-200"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {task.subitems?.map((subitem) => (
                            <div
                              key={subitem.id}
                              className="flex border-b hover:bg-gray-50 bg-gray-50/50 group pl-8 border-l-2 border-l-blue-200"
                            >
                              {task.subtaskColumns.map((column) => (
                                <div
                                  key={column.id}
                                  className="p-2 border-r relative"
                                  style={{ width: column.width }}
                                >
                                  <div className="flex items-center gap-2">
                                    {column.id === "task" && (
                                      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gray-100/50 border-r" />
                                    )}
                                    <div
                                      className={`min-h-[24px] cursor-text flex-1 ${
                                        column.id === "task" ? "pl-8" : ""
                                      }`}
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
                                        <div className="text-gray-600">
                                          {subitem.data[column.id] || ""}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-200 transition-opacity">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </>
                      )}
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
