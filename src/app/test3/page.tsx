"use client";

import React, { useState, useRef, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  MoreHorizontal,
  ArrowUpDown,
  User,
} from "lucide-react";

interface Column {
  id: string;
  text: string;
  value: string;
  width: number;
}

interface SubTask {
  id: string;
  subitem: string;
  owner: string;
  status: string;
  date: string;
  [key: string]: string;
}

interface Task {
  id: string;
  name: string;
  person: string;
  status: string;
  date: string;
  subitems: SubTask[];
  [key: string]: string | SubTask[];
}

const TaskScheduler: React.FC = () => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [parentColumns, setParentColumns] = useState<Column[]>([
    { id: "name", text: "Item", value: "name", width: 300 },
    { id: "person", text: "Person", value: "person", width: 150 },
    { id: "status", text: "Status", value: "status", width: 150 },
    { id: "date", text: "Date", value: "date", width: 100 },
  ]);
  const [subtaskColumns, setSubtaskColumns] = useState<Column[]>([
    { id: "subitem", text: "Subitem", value: "subitem", width: 300 },
    { id: "owner", text: "Owner", value: "owner", width: 150 },
    { id: "status", text: "Status", value: "status", width: 150 },
    { id: "date", text: "Date", value: "date", width: 100 },
  ]);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      name: "Project kickoff meeting",
      person: "John Doe",
      status: "Completed",
      date: "Feb 15",
      subitems: [
        {
          id: "1-1",
          subitem: "Prepare agenda",
          owner: "Sarah",
          status: "Completed",
          date: "Feb 14",
        },
        {
          id: "1-2",
          subitem: "Send invitations",
          owner: "John",
          status: "Completed",
          date: "Feb 13",
        },
      ],
    },
    {
      id: "2",
      name: "Design system update",
      person: "Emily Chen",
      status: "In Progress",
      date: "Mar 1",
      subitems: [
        {
          id: "2-1",
          subitem: "Review current design system",
          owner: "Emily",
          status: "Completed",
          date: "Feb 25",
        },
        {
          id: "2-2",
          subitem: "Propose updates",
          owner: "Emily",
          status: "In Progress",
          date: "Mar 1",
        },
      ],
    },
  ]);

  const [editingCell, setEditingCell] = useState<{
    taskId: string;
    columnId: string;
    subtaskId?: string;
    value: string;
  } | null>(null);

  const [draggedColumn, setDraggedColumn] = useState<Column | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<Column | null>(null);

  const draggedTask = useRef<{ id: string; startY: number } | null>(null);
  const draggedSubtask = useRef<{
    taskId: string;
    subtaskId: string;
    startY: number;
  } | null>(null);

  const [addingColumn, setAddingColumn] = useState<{
    isSubtask: boolean;
    columnId: string;
  } | null>(null);

  const toggleExpand = (taskId: string) => {
    setExpanded((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in progress":
      case "working on it":
        return "bg-orange-400 text-white";
      case "completed":
      case "done":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  const addNewColumn = (isSubtask: boolean) => {
    const newColumn: Column = {
      id: `col-${Date.now()}`,
      text: "",
      value: `new-column-${Date.now()}`,
      width: 150,
    };
    setAddingColumn({ isSubtask, columnId: newColumn.id });

    if (isSubtask) {
      setSubtaskColumns([...subtaskColumns, newColumn]);
    } else {
      setParentColumns([...parentColumns, newColumn]);
    }
  };

  const handleColumnTitleEdit = (
    columnId: string,
    newTitle: string,
    isSubtask: boolean
  ) => {
    const setColumns = isSubtask ? setSubtaskColumns : setParentColumns;
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              text: newTitle,
              value: newTitle.toLowerCase().replace(/\s+/g, "-"),
            }
          : col
      )
    );
  };

  const handleCellDoubleClick = (
    taskId: string,
    columnId: string,
    value: string,
    subtaskId?: string
  ) => {
    setEditingCell({ taskId, columnId, subtaskId, value });
  };

  const handleCellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingCell) {
      setEditingCell({ ...editingCell, value: e.target.value });
    }
  };

  const handleCellSave = () => {
    if (!editingCell) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === editingCell.taskId) {
          if (editingCell.subtaskId) {
            return {
              ...task,
              subitems: task.subitems.map((subtask) =>
                subtask.id === editingCell.subtaskId
                  ? { ...subtask, [editingCell.columnId]: editingCell.value }
                  : subtask
              ),
            };
          } else {
            const updatedTask = {
              ...task,
              [editingCell.columnId]: editingCell.value,
            };
            updatedTask.subitems = updatedTask.subitems.map((subtask) => ({
              ...subtask,
              [editingCell.columnId]: subtask[editingCell.columnId] || "",
            }));
            return updatedTask;
          }
        }
        return task;
      })
    );
    setEditingCell(null);
  };

  const handleColumnDragStart = (column: Column) => {
    setDraggedColumn(column);
  };

  const handleColumnDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    column: Column
  ) => {
    e.preventDefault();
    setDragOverColumn(column);
  };

  const handleColumnDrop = (isSubtask: boolean) => {
    if (!draggedColumn || !dragOverColumn) return;

    const columns = isSubtask ? subtaskColumns : parentColumns;
    const setColumns = isSubtask ? setSubtaskColumns : setParentColumns;

    const fromIndex = columns.findIndex((col) => col.id === draggedColumn.id);
    const toIndex = columns.findIndex((col) => col.id === dragOverColumn.id);

    const newColumns = [...columns];
    const [removed] = newColumns.splice(fromIndex, 1);
    newColumns.splice(toIndex, 0, removed);

    setColumns(newColumns);
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const handleTaskDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string
  ) => {
    draggedTask.current = { id: taskId, startY: e.clientY };
  };

  const handleTaskDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleTaskDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetId: string
  ) => {
    if (!draggedTask.current) return;

    const { id: draggedId, startY } = draggedTask.current;
    const endY = e.clientY;

    setTasks((prevTasks) => {
      const draggedIndex = prevTasks.findIndex((task) => task.id === draggedId);
      const targetIndex = prevTasks.findIndex((task) => task.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return prevTasks;

      const newTasks = [...prevTasks];
      const [draggedTask] = newTasks.splice(draggedIndex, 1);

      if (endY < startY) {
        newTasks.splice(targetIndex, 0, draggedTask);
      } else {
        newTasks.splice(targetIndex + 1, 0, draggedTask);
      }

      return newTasks;
    });

    draggedTask.current = null;
  };

  const handleSubtaskDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string,
    subtaskId: string
  ) => {
    draggedSubtask.current = { taskId, subtaskId, startY: e.clientY };
  };

  const handleSubtaskDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetTaskId: string,
    targetSubtaskId: string
  ) => {
    if (!draggedSubtask.current) return;

    const {
      taskId: draggedTaskId,
      subtaskId: draggedSubtaskId,
      startY,
    } = draggedSubtask.current;
    const endY = e.clientY;

    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        if (task.id === draggedTaskId) {
          const draggedIndex = task.subitems.findIndex(
            (subtask) => subtask.id === draggedSubtaskId
          );
          const [draggedSubtask] = task.subitems.splice(draggedIndex, 1);

          if (task.id === targetTaskId) {
            const targetIndex = task.subitems.findIndex(
              (subtask) => subtask.id === targetSubtaskId
            );
            if (endY < startY) {
              task.subitems.splice(targetIndex, 0, draggedSubtask);
            } else {
              task.subitems.splice(targetIndex + 1, 0, draggedSubtask);
            }
          } else {
            const targetTask = prevTasks.find((t) => t.id === targetTaskId);
            if (targetTask) {
              const targetIndex = targetTask.subitems.findIndex(
                (subtask) => subtask.id === targetSubtaskId
              );
              if (endY < startY) {
                targetTask.subitems.splice(targetIndex, 0, draggedSubtask);
              } else {
                targetTask.subitems.splice(targetIndex + 1, 0, draggedSubtask);
              }
            }
          }
        }
        return task;
      });
    });

    draggedSubtask.current = null;
  };

  const addNewTask = () => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      name: "New Task",
      person: "",
      status: "Not Started",
      date: new Date().toLocaleDateString(),
      subitems: [],
    };
    setTasks([...tasks, newTask]);
  };

  const addNewSubtask = (taskId: string) => {
    const newSubtask: SubTask = {
      id: `subtask-${Date.now()}`,
      subitem: "New Subtask",
      owner: "",
      status: "Not Started",
      date: new Date().toLocaleDateString(),
    };
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, subitems: [...task.subitems, newSubtask] }
          : task
      )
    );
  };

  const addNewGroup = () => {
    const newGroup: Task = {
      id: `group-${Date.now()}`,
      name: "New Group",
      person: "",
      status: "Not Started",
      date: new Date().toLocaleDateString(),
      subitems: [],
    };
    setTasks([...tasks, newGroup]);
    setExpanded([...expanded, newGroup.id]);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;

    const lowercasedQuery = searchQuery.toLowerCase();

    return tasks.filter((task) => {
      const taskMatches =
        task.name.toLowerCase().includes(lowercasedQuery) ||
        task.person.toLowerCase().includes(lowercasedQuery) ||
        task.status.toLowerCase().includes(lowercasedQuery);

      const subtaskMatches = task.subitems.some((subtask) =>
        Object.values(subtask).some((value) =>
          value.toLowerCase().includes(lowercasedQuery)
        )
      );

      switch (searchType) {
        case "parentTask":
          return taskMatches;
        case "subTask":
          return subtaskMatches;
        default:
          return taskMatches || subtaskMatches;
      }
    });
  }, [searchQuery, searchType, tasks]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 rounded-xl">
      <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg mb-6 shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={addNewTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            Add New Task
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={addNewGroup}
            className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-600 transition-colors"
          >
            Add New Group
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-4 text-gray-600">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="all">All</option>
            <option value="parentTask">Parent Task</option>
            <option value="subTask">Sub Task</option>
          </select>
          <div className="flex items-center gap-2 bg-white rounded-md px-3 py-1 border">
            <Search className="w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="border-none outline-none bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-8 px-4 py-2"></th>
              {parentColumns.map((column) => (
                <th
                  key={column.id}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                  draggable
                  onDragStart={() => handleColumnDragStart(column)}
                  onDragOver={(e) => handleColumnDragOver(e, column)}
                  onDrop={() => handleColumnDrop(false)}
                >
                  <div className="flex items-center justify-between">
                    {addingColumn?.columnId === column.id ? (
                      <input
                        type="text"
                        autoFocus
                        placeholder="Type column name"
                        value={column.text}
                        onChange={(e) =>
                          handleColumnTitleEdit(
                            column.id,
                            e.target.value,
                            false
                          )
                        }
                        onBlur={() => setAddingColumn(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setAddingColumn(null);
                        }}
                        className="bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                      />
                    ) : (
                      <span>{column.text}</span>
                    )}
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  </div>
                </th>
              ))}
              <th className="w-8 px-4 py-2">
                <button
                  onClick={() => addNewColumn(false)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Plus className="w-4 h-4 text-gray-400" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, index) => (
              <React.Fragment key={task.id}>
                <tr
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 ${
                    expanded.includes(task.id)
                      ? "border-l-4 border-blue-500"
                      : ""
                  }`}
                  draggable
                  onDragStart={(e) => handleTaskDragStart(e, task.id)}
                  onDragOver={handleTaskDragOver}
                  onDrop={(e) => handleTaskDrop(e, task.id)}
                >
                  <td className="px-4 py-2">
                    <button
                      onClick={() => toggleExpand(task.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      {expanded.includes(task.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </td>
                  {parentColumns.map((column) => (
                    <td
                      key={column.id}
                      className="px-4 py-2"
                      onDoubleClick={() =>
                        handleCellDoubleClick(
                          task.id,
                          column.id,
                          (task[column.value] as string) || ""
                        )
                      }
                    >
                      {editingCell?.taskId === task.id &&
                      editingCell?.columnId === column.id &&
                      !editingCell?.subtaskId ? (
                        <input
                          type="text"
                          value={editingCell.value}
                          onChange={handleCellChange}
                          onBlur={handleCellSave}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleCellSave();
                          }}
                          className="w-full px-2 py-1 border rounded"
                          autoFocus
                        />
                      ) : column.id === "status" ? (
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                            (task[column.value] as string) || ""
                          )}`}
                        >
                          {task[column.value] || ""}
                        </span>
                      ) : column.id === "person" ? (
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{task[column.value] || ""}</span>
                        </div>
                      ) : (
                        task[column.value] || ""
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-2">
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
                {expanded.includes(task.id) && (
                  <tr>
                    <td colSpan={parentColumns.length + 2}>
                      <div className="pl-8 pr-4 py-4 bg-gray-100 border-t border-b border-gray-200">
                        <div className="border-l-4 border-blue-500 pl-4">
                          <table className="w-full">
                            <thead>
                              <tr>
                                {subtaskColumns.map((column) => (
                                  <th
                                    key={column.id}
                                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    style={{ width: column.width }}
                                    draggable
                                    onDragStart={() =>
                                      handleColumnDragStart(column)
                                    }
                                    onDragOver={(e) =>
                                      handleColumnDragOver(e, column)
                                    }
                                    onDrop={() => handleColumnDrop(true)}
                                  >
                                    <div className="flex items-center justify-between">
                                      {addingColumn?.columnId === column.id ? (
                                        <input
                                          type="text"
                                          autoFocus
                                          placeholder="Type column name"
                                          value={column.text}
                                          onChange={(e) =>
                                            handleColumnTitleEdit(
                                              column.id,
                                              e.target.value,
                                              true
                                            )
                                          }
                                          onBlur={() => setAddingColumn(null)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                              setAddingColumn(null);
                                          }}
                                          className="bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                                        />
                                      ) : (
                                        <span>{column.text}</span>
                                      )}
                                      <ArrowUpDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                  </th>
                                ))}
                                <th className="w-8 px-4 py-2">
                                  <button
                                    onClick={() => addNewColumn(true)}
                                    className="p-1 hover:bg-gray-200 rounded"
                                  >
                                    <Plus className="w-4 h-4 text-gray-400" />
                                  </button>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {task.subitems.map((subtask, subIndex) => (
                                <tr
                                  key={subtask.id}
                                  className={`${
                                    subIndex % 2 === 0
                                      ? "bg-white"
                                      : "bg-gray-200"
                                  } hover:bg-gray-300`}
                                  draggable
                                  onDragStart={(e) =>
                                    handleSubtaskDragStart(
                                      e,
                                      task.id,
                                      subtask.id
                                    )
                                  }
                                  onDragOver={handleTaskDragOver}
                                  onDrop={(e) =>
                                    handleSubtaskDrop(e, task.id, subtask.id)
                                  }
                                >
                                  {subtaskColumns.map((column) => (
                                    <td
                                      key={column.id}
                                      className="px-4 py-2"
                                      onDoubleClick={() =>
                                        handleCellDoubleClick(
                                          task.id,
                                          column.id,
                                          subtask[column.value] || "",
                                          subtask.id
                                        )
                                      }
                                    >
                                      {editingCell?.taskId === task.id &&
                                      editingCell?.columnId === column.id &&
                                      editingCell?.subtaskId === subtask.id ? (
                                        <input
                                          type="text"
                                          value={editingCell.value}
                                          onChange={handleCellChange}
                                          onBlur={handleCellSave}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                              handleCellSave();
                                          }}
                                          className="w-full px-2 py-1 border rounded"
                                          autoFocus
                                        />
                                      ) : column.id === "status" ? (
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                            subtask[column.value] || ""
                                          )}`}
                                        >
                                          {subtask[column.value] || ""}
                                        </span>
                                      ) : column.id === "owner" ? (
                                        <div className="flex items-center">
                                          <User className="w-4 h-4 mr-2 text-gray-400" />
                                          <span>
                                            {subtask[column.value] || ""}
                                          </span>
                                        </div>
                                      ) : (
                                        subtask[column.value] || ""
                                      )}
                                    </td>
                                  ))}
                                  <td className="px-4 py-2">
                                    <button className="p-1 hover:bg-gray-200 rounded">
                                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <button
                            onClick={() => addNewSubtask(task.id)}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Add Subtask
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskScheduler;
