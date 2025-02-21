"use client";

import { useEffect } from "react";

import { useMemo } from "react";

import { useRef } from "react";

import { useState } from "react";

import * as React from "react";
import { ArrowUpDown, Plus, Search } from "lucide-react";
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";

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
    { id: "checkbox", text: "", value: "checkbox", width: 40 },
    { id: "name", text: "Item", value: "name", width: 300 },
    { id: "person", text: "Person", value: "person", width: 150 },
    { id: "status", text: "Status", value: "status", width: 150 },
    { id: "date", text: "Date", value: "date", width: 100 },
  ]);
  const [subtaskColumns, setSubtaskColumns] = useState<Column[]>([
    { id: "checkbox", text: "", value: "checkbox", width: 40 },
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
      subitems: [],
    },
    {
      id: "3",
      name: "Client presentation",
      person: "Alex Johnson",
      status: "Not Started",
      date: "Mar 10",
      subitems: [],
    },
  ]);

  const [editingCell, setEditingCell] = useState<{
    taskId: string;
    columnId: string;
    subtaskId?: string;
    value: string;
  } | null>(null);

  const [editingColumn, setEditingColumn] = useState<{
    columnId: string;
    isSubtask: boolean;
    taskId?: string;
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

  const [resizingColumn, setResizingColumn] = useState(false);

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedSubtasks, setSelectedSubtasks] = useState<{
    [taskId: string]: string[];
  }>({});

  const [hoveringColumn, setHoveringColumn] = useState<string | null>(null);

  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  const [newChildTaskId, setNewChildTaskId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [draggedSubtaskId, setDraggedSubtaskId] = useState<string | null>(null);

  const handleColumnMouseEnter = (columnId: string) => {
    setHoveringColumn(columnId);
  };

  const handleColumnMouseLeave = () => {
    setHoveringColumn(null);
  };

  const handleColumnResizeStart = (
    e: React.MouseEvent,
    column: Column,
    isSubtask: boolean
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingColumn(true);

    const startX = e.pageX;
    const startWidth = column.width;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.pageX - startX;
      const newWidth = Math.max(startWidth + diff, 60);

      const setColumns = isSubtask ? setSubtaskColumns : setParentColumns;

      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          col.id === column.id ? { ...col, width: newWidth } : col
        )
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      setResizingColumn(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const toggleExpand = (taskId: string) => {
    setExpanded((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const addNewColumn = (isSubtask: boolean, taskId?: string) => {
    // Clear any existing editing states
    setEditingCell(null);
    setEditingColumn(null);

    const newColumn: Column = {
      id: `col-${Date.now()}`,
      text: "",
      value: `new-column-${Date.now()}`,
      width: 150,
    };

    if (isSubtask) {
      setSubtaskColumns((prev) => [...prev, newColumn]);
      setTasks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          subitems: task.subitems.map((subtask) => ({
            ...subtask,
            [newColumn.value]: "",
          })),
        }))
      );
    } else {
      setParentColumns((prev) => [...prev, newColumn]);
      setTasks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          [newColumn.value]: "",
        }))
      );
    }

    // Set editing state immediately
    setEditingColumn({ columnId: newColumn.id, isSubtask, taskId });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "working on it":
        return "bg-amber-400 text-white";
      case "stuck":
        return "bg-red-500 text-white";
      case "done":
        return "bg-emerald-500 text-white";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  const getTaskRowClass = (isExpanded: boolean, index: number) => {
    return `group relative ${
      index % 2 === 0 ? "bg-white" : "bg-gray-50"
    } hover:bg-gray-100 transition-colors ${
      isExpanded ? "border-l-[3px] border-blue-500" : ""
    }`;
  };

  const getSubtaskRowClass = (index: number) => {
    return `group relative ${
      index % 2 === 0 ? "bg-white/50" : "bg-gray-50/50"
    } hover:bg-gray-100/50 transition-colors`;
  };

  const handleColumnTitleEdit = (
    columnId: string,
    newTitle: string,
    isSubtask: boolean
  ) => {
    const setColumns = isSubtask ? setSubtaskColumns : setParentColumns;
    const columns = isSubtask ? subtaskColumns : parentColumns;
    const newValue = newTitle.toLowerCase().replace(/\s+/g, "-");

    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              text: newTitle,
              value: newValue,
            }
          : col
      )
    );

    if (isSubtask) {
      setTasks(
        tasks.map((task) => ({
          ...task,
          subitems: task.subitems.map((subtask) => {
            const {
              [columns.find((col) => col.id === columnId)?.value || ""]:
                oldValue,
              ...rest
            } = subtask;
            return {
              ...rest,
              [newValue]: oldValue || "",
            };
          }),
        }))
      );
    } else {
      setTasks(
        tasks.map((task) => {
          const {
            [columns.find((col) => col.id === columnId)?.value || ""]: oldValue,
            ...rest
          } = task;
          return {
            ...rest,
            [newValue]: oldValue || "",
            subitems: task.subitems,
          };
        })
      );
    }
  };

  const handleCellDoubleClick = (
    taskId: string,
    columnId: string,
    value: string,
    subtaskId?: string
  ) => {
    // Clear any existing column editing state
    setEditingColumn(null);
    setEditingCell({ taskId, columnId, subtaskId, value: value || "" });
  };

  const handleCellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingCell) {
      setEditingCell({ ...editingCell, value: e.target.value });
    }
  };

  const handleCellSave = () => {
    if (!editingCell) return;

    const { taskId, columnId, subtaskId, value } = editingCell;
    const column = subtaskId
      ? subtaskColumns.find((col) => col.id === columnId)
      : parentColumns.find((col) => col.id === columnId);

    if (!column) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          if (subtaskId) {
            return {
              ...task,
              subitems: task.subitems.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, [column.value]: value }
                  : subtask
              ),
            };
          } else {
            return {
              ...task,
              [column.value]: value,
            };
          }
        }
        return task;
      })
    );

    setEditingCell(null);
    setNewChildTaskId(null);
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
    setDraggedTaskId(taskId);
    draggedTask.current = { id: taskId, startY: e.clientY };
    e.currentTarget.classList.add("opacity-50");
  };

  const handleTaskDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const tr = e.currentTarget as HTMLTableRowElement;
    tr.classList.add("bg-gray-100");
  };

  const handleTaskDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetId: string
  ) => {
    if (!draggedTask.current) return;

    e.preventDefault();
    e.stopPropagation();

    const { id: draggedId } = draggedTask.current;

    // Remove drag styling
    document
      .querySelectorAll("tr")
      .forEach((row) => row.classList.remove("opacity-50"));
    setDraggedTaskId(null);

    setTasks((prevTasks) => {
      const draggedIndex = prevTasks.findIndex((task) => task.id === draggedId);
      const targetIndex = prevTasks.findIndex((task) => task.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return prevTasks;

      const newTasks = [...prevTasks];
      const [draggedTask] = newTasks.splice(draggedIndex, 1);
      newTasks.splice(targetIndex, 0, draggedTask);

      return newTasks;
    });

    draggedTask.current = null;
  };

  const handleSubtaskDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string,
    subtaskId: string
  ) => {
    setDraggedSubtaskId(subtaskId);
    draggedSubtask.current = { taskId, subtaskId, startY: e.clientY };
    e.currentTarget.classList.add("opacity-50");
  };

  const handleSubtaskDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetTaskId: string,
    targetSubtaskId: string
  ) => {
    if (!draggedSubtask.current) return;

    e.preventDefault();
    e.stopPropagation();

    // Remove drag styling
    document
      .querySelectorAll("tr")
      .forEach((row) => row.classList.remove("opacity-50"));
    setDraggedSubtaskId(null);

    const { taskId: draggedTaskId, subtaskId: draggedSubtaskId } =
      draggedSubtask.current;

    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        // If this is the source task, remove the dragged subtask
        if (task.id === draggedTaskId) {
          const draggedIndex = task.subitems.findIndex(
            (subtask) => subtask.id === draggedSubtaskId
          );
          const draggedSubtask = task.subitems[draggedIndex];

          // If moving within the same task
          if (task.id === targetTaskId) {
            const targetIndex = task.subitems.findIndex(
              (subtask) => subtask.id === targetSubtaskId
            );
            const newSubitems = [...task.subitems];
            newSubitems.splice(draggedIndex, 1);
            newSubitems.splice(targetIndex, 0, draggedSubtask);
            return { ...task, subitems: newSubitems };
          }

          // If moving to a different task, remove from current task
          return {
            ...task,
            subitems: task.subitems.filter(
              (subtask) => subtask.id !== draggedSubtaskId
            ),
          };
        }

        // If this is the target task, add the dragged subtask
        if (task.id === targetTaskId && draggedTaskId !== targetTaskId) {
          const targetIndex = task.subitems.findIndex(
            (subtask) => subtask.id === targetSubtaskId
          );
          const draggedSubtask = prevTasks
            .find((t) => t.id === draggedTaskId)
            ?.subitems.find((s) => s.id === draggedSubtaskId);

          if (draggedSubtask) {
            const newSubitems = [...task.subitems];
            newSubitems.splice(targetIndex, 0, draggedSubtask);
            return { ...task, subitems: newSubitems };
          }
        }

        return task;
      });
    });

    draggedSubtask.current = null;
  };

  const handleTaskDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    const tr = e.currentTarget as HTMLTableRowElement;
    tr.classList.remove("bg-gray-100");
  };

  const addNewTask = () => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      name: "",
      person: "",
      status: "Not Started",
      date: new Date().toLocaleDateString(),
      subitems: [],
    };

    parentColumns.forEach((column) => {
      if (!["name", "person", "status", "date"].includes(column.value)) {
        newTask[column.value] = "";
      }
    });

    setTasks([...tasks, newTask]);

    // Set editing state immediately
    setTimeout(() => {
      setEditingCell({
        taskId: newTask.id,
        columnId: "name",
        value: "",
      });
    }, 50);
  };

  const addNewSubtask = (taskId: string) => {
    const newSubtask: SubTask = {
      id: `subtask-${Date.now()}`,
      subitem: "",
      owner: "",
      status: "Not Started",
      date: new Date().toLocaleDateString(),
    };

    subtaskColumns.forEach((column) => {
      if (!["subitem", "owner", "status", "date"].includes(column.value)) {
        newSubtask[column.value] = "";
      }
    });

    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, subitems: [...task.subitems, newSubtask] };
        }
        return task;
      })
    );

    setExpanded((prev) => [...prev, taskId]);
    setNewChildTaskId(newSubtask.id);
    setEditingCell({
      taskId,
      columnId: "subitem",
      subtaskId: newSubtask.id,
      value: "",
    });
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

    parentColumns.forEach((column) => {
      if (!["name", "person", "status", "date"].includes(column.value)) {
        newGroup[column.value] = "";
      }
    });

    setTasks([...tasks, newGroup]);
    setExpanded([...expanded, newGroup.id]);
  };

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

  const handleColumnDoubleClick = (columnId: string, isSubtask: boolean) => {
    setEditingCell(null);
    setEditingColumn({ columnId, isSubtask });
  };

  const handleColumnNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    columnId: string,
    isSubtask: boolean
  ) => {
    const setColumns = isSubtask ? setSubtaskColumns : setParentColumns;
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId ? { ...col, text: e.target.value } : col
      )
    );
  };

  const handleColumnNameSave = (columnId: string, isSubtask: boolean) => {
    const columns = isSubtask ? subtaskColumns : parentColumns;
    const column = columns.find((col) => col.id === columnId);
    if (column) {
      handleColumnTitleEdit(columnId, column.text, isSubtask);
    }
    setEditingColumn(null);
    // Ensure focus is removed from the input
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const toggleSubtaskSelection = (taskId: string, subtaskId: string) => {
    setSelectedSubtasks((prev) => {
      const taskSubtasks = prev[taskId] || [];
      const updatedTaskSubtasks = taskSubtasks.includes(subtaskId)
        ? taskSubtasks.filter((id) => id !== subtaskId)
        : [...taskSubtasks, subtaskId];

      return {
        ...prev,
        [taskId]: updatedTaskSubtasks,
      };
    });
  };

  const toggleAllTasks = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
      setSelectedSubtasks({});
    } else {
      setSelectedTasks(tasks.map((task) => task.id));
      const allSubtasks = tasks.reduce((acc, task) => {
        acc[task.id] = task.subitems.map((subtask) => subtask.id);
        return acc;
      }, {} as { [taskId: string]: string[] });
      setSelectedSubtasks(allSubtasks);
    }
  };

  useEffect(() => {
    if (editingColumn) {
      const input = document.getElementById(
        `column-input-${editingColumn.columnId}${
          editingColumn.taskId ? `-${editingColumn.taskId}` : ""
        }`
      );
      if (input) {
        setTimeout(() => {
          (input as HTMLInputElement).focus();
        }, 0);
      }
    }
  }, [editingColumn]);

  useEffect(() => {
    if (newChildTaskId) {
      const input = document.getElementById(`cell-input-${newChildTaskId}`);
      if (input) {
        (input as HTMLInputElement).focus();
      }
    }
  }, [newChildTaskId]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Top toolbar remains the same */}
      <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg mb-6 shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={addNewTask}
            className="px-3 py-1.5 hover:bg-gray-100 rounded flex items-center gap-2 text-gray-600 border border-dashed"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
          <button
            onClick={addNewGroup}
            className="px-3 py-1.5 hover:bg-gray-100 rounded flex items-center gap-2 text-gray-600 border border-dashed"
          >
            <Plus className="w-4 h-4" />
            New Group
          </button>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="border border-gray-200 rounded px-2 py-1.5 text-sm bg-transparent"
          >
            <option value="all">All</option>
            <option value="parentTask">Parent Tasks</option>
            <option value="subTask">Subtasks</option>
          </select>
          <div className="flex items-center gap-2 bg-white rounded px-3 py-1.5 border border-gray-200">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="border-none outline-none bg-transparent text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-[40px] px-4 py-2 border border-gray-200 bg-gray-50/50">
                  <input
                    type="checkbox"
                    checked={selectedTasks.length === tasks.length}
                    onChange={toggleAllTasks}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                </th>
                {parentColumns.slice(1).map((column) => (
                  <th
                    key={column.id}
                    className="group relative border border-gray-200 bg-gray-50/50"
                    style={{ width: column.width }}
                    onMouseEnter={() => handleColumnMouseEnter(column.id)}
                    onMouseLeave={handleColumnMouseLeave}
                    draggable={!resizingColumn}
                    onDragStart={() =>
                      !resizingColumn && handleColumnDragStart(column)
                    }
                    onDragOver={(e) =>
                      !resizingColumn && handleColumnDragOver(e, column)
                    }
                    onDrop={() => !resizingColumn && handleColumnDrop(false)}
                    onDoubleClick={() =>
                      handleColumnDoubleClick(column.id, false)
                    }
                  >
                    <div className="flex items-center justify-between px-4 py-2">
                      {editingColumn?.columnId === column.id &&
                      !editingColumn.isSubtask ? (
                        <input
                          id={`column-input-${column.id}`}
                          type="text"
                          value={column.text}
                          onChange={(e) =>
                            handleColumnNameChange(e, column.id, false)
                          }
                          onBlur={() => handleColumnNameSave(column.id, false)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleColumnNameSave(column.id, false);
                          }}
                          className="w-full rounded border-none bg-transparent px-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <>
                          <span className="text-xs font-medium uppercase text-gray-500">
                            {column.text}
                          </span>
                          <ArrowUpDown className="h-3 w-3 text-gray-400" />
                        </>
                      )}
                    </div>
                    {hoveringColumn === column.id && (
                      <div
                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize bg-gray-300 hover:bg-gray-400"
                        onMouseDown={(e) =>
                          handleColumnResizeStart(e, column, false)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </th>
                ))}
                <th className="w-[40px] px-4 py-2 border border-gray-200 bg-gray-50/50">
                  <button
                    onClick={() => addNewColumn(false)}
                    className="h-6 w-6 p-1 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 h-4 text-gray-400" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTasks.map((task, index) => (
                <React.Fragment key={task.id}>
                  <tr
                    className={
                      index % 2 === 0
                        ? "bg-white hover:bg-gray-100"
                        : "bg-gray-50 hover:bg-gray-100"
                    }
                    draggable
                    onDragStart={(e) => handleTaskDragStart(e, task.id)}
                    onDragOver={handleTaskDragOver}
                    onDrop={(e) => handleTaskDrop(e, task.id)}
                    onDragLeave={handleTaskDragLeave}
                  >
                    <td className="px-4 py-2 border border-gray-200">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => toggleTaskSelection(task.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                      />
                    </td>
                    {parentColumns.slice(1).map((column) => (
                      <td
                        key={column.id}
                        className="px-4 py-2 border border-gray-200"
                        style={{ width: column.width }}
                        onDoubleClick={() =>
                          handleCellDoubleClick(
                            task.id,
                            column.id,
                            task[column.value] || ""
                          )
                        }
                      >
                        {column.id === "name" ? (
                          <div className="flex items-center gap-2">
                            {task.subitems.length > 0 ? (
                              <button
                                onClick={() => toggleExpand(task.id)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                {expanded.includes(task.id) ? (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => addNewSubtask(task.id)}
                                className="p-1 hover:bg-gray-100 rounded opacity-50 hover:opacity-100"
                              >
                                <Plus className="w-4 h-4 text-gray-500" />
                              </button>
                            )}
                            {editingCell?.taskId === task.id &&
                            editingCell?.columnId === column.id ? (
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
                            ) : (
                              <div className="flex items-center gap-2">
                                <span>{task[column.value] || ""}</span>
                                {task.subitems.length > 0 && (
                                  <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                                    {task.subitems.length}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ) : column.id === "status" ? (
                          <span
                            className={`px-2 py-1 rounded text-xs ${getStatusColor(
                              task[column.value] || ""
                            )}`}
                          >
                            {task[column.value] || ""}
                          </span>
                        ) : editingCell?.taskId === task.id &&
                          editingCell?.columnId === column.id ? (
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
                        ) : (
                          task[column.value] || ""
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-2 border border-gray-200">
                      <button className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>

                  {expanded.includes(task.id) && (
                    <tr>
                      <td colSpan={parentColumns.length + 2}>
                        <div className="pl-8 pr-4 py-2 bg-gray-50/50">
                          <div className="border-l-2 border-blue-500 pl-4">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr>
                                  <th className="w-8 px-4 py-2 border border-gray-200">
                                    <input
                                      type="checkbox"
                                      checked={
                                        selectedSubtasks[task.id]?.length ===
                                        task.subitems.length
                                      }
                                      onChange={() => {
                                        if (
                                          selectedSubtasks[task.id]?.length ===
                                          task.subitems.length
                                        ) {
                                          setSelectedSubtasks((prev) => ({
                                            ...prev,
                                            [task.id]: [],
                                          }));
                                        } else {
                                          setSelectedSubtasks((prev) => ({
                                            ...prev,
                                            [task.id]: task.subitems.map(
                                              (subtask) => subtask.id
                                            ),
                                          }));
                                        }
                                      }}
                                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                                    />
                                  </th>
                                  {subtaskColumns.slice(1).map((column) => (
                                    <th
                                      key={column.id}
                                      className="group relative px-4 py-2 text-left border border-gray-200"
                                      style={{
                                        width: column.width,
                                        minWidth: column.width,
                                        maxWidth: column.width,
                                      }}
                                      onMouseEnter={() =>
                                        handleColumnMouseEnter(column.id)
                                      }
                                      onMouseLeave={handleColumnMouseLeave}
                                      draggable={!resizingColumn}
                                      onDragStart={() =>
                                        !resizingColumn &&
                                        handleColumnDragStart(column)
                                      }
                                      onDragOver={(e) =>
                                        !resizingColumn &&
                                        handleColumnDragOver(e, column)
                                      }
                                      onDrop={() =>
                                        !resizingColumn &&
                                        handleColumnDrop(true)
                                      }
                                      onDoubleClick={() =>
                                        handleColumnDoubleClick(column.id, true)
                                      }
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        {editingColumn?.columnId ===
                                          column.id &&
                                        editingColumn.isSubtask ? (
                                          <input
                                            id={`column-input-${column.id}-${task.id}`}
                                            type="text"
                                            value={column.text}
                                            onChange={(e) =>
                                              handleColumnNameChange(
                                                e,
                                                column.id,
                                                true
                                              )
                                            }
                                            onBlur={() =>
                                              handleColumnNameSave(
                                                column.id,
                                                true
                                              )
                                            }
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter")
                                                handleColumnNameSave(
                                                  column.id,
                                                  true
                                                );
                                            }}
                                            className="w-full rounded border-none bg-transparent px-1 text-xs font-medium uppercase text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          />
                                        ) : (
                                          <>
                                            <span className="text-xs font-medium uppercase text-gray-500">
                                              {column.text}
                                            </span>
                                            <ArrowUpDown className="h-3 w-3 text-gray-400" />
                                          </>
                                        )}
                                      </div>
                                      {hoveringColumn === column.id && (
                                        <div
                                          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize bg-gray-300 hover:bg-gray-400"
                                          onMouseDown={(e) =>
                                            handleColumnResizeStart(
                                              e,
                                              column,
                                              true
                                            )
                                          }
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                      )}
                                    </th>
                                  ))}
                                  <th className="w-8 px-4 py-2 border border-gray-200">
                                    <button
                                      onClick={() =>
                                        addNewColumn(true, task.id)
                                      }
                                      className="p-1 hover:bg-gray-100 rounded flex items-center gap-1"
                                      title="Add new column"
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
                                        : "bg-gray-50/50"
                                    } hover:bg-gray-100/50`}
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
                                    onDragLeave={handleTaskDragLeave}
                                  >
                                    <td className="px-4 py-2 border border-gray-200">
                                      <input
                                        type="checkbox"
                                        checked={selectedSubtasks[
                                          task.id
                                        ]?.includes(subtask.id)}
                                        onChange={() =>
                                          toggleSubtaskSelection(
                                            task.id,
                                            subtask.id
                                          )
                                        }
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                                      />
                                    </td>
                                    {subtaskColumns.slice(1).map((column) => (
                                      <td
                                        key={column.id}
                                        className="px-4 py-2 border border-gray-200"
                                        style={{
                                          width: column.width,
                                          minWidth: column.width,
                                          maxWidth: column.width,
                                        }}
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
                                        editingCell?.subtaskId ===
                                          subtask.id ? (
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
                                            className={`px-2 py-1 rounded text-xs ${getStatusColor(
                                              subtask[column.value] || ""
                                            )}`}
                                          >
                                            {subtask[column.value] || ""}
                                          </span>
                                        ) : (
                                          subtask[column.value] || ""
                                        )}
                                      </td>
                                    ))}
                                    <td className="px-4 py-2 border border-gray-200">
                                      <button className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100">
                                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                                <tr>
                                  <td
                                    colSpan={subtaskColumns.length + 1}
                                    className="border border-gray-200"
                                  >
                                    <button
                                      onClick={() => addNewSubtask(task.id)}
                                      className="w-full px-4 py-2 text-left text-gray-500 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <Plus className="w-4 h-4" />+ Add subitem
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              <tr>
                <td colSpan={parentColumns.length + 2}>
                  <button
                    onClick={addNewTask}
                    className="w-full px-4 py-2 text-left text-gray-500 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />+ Add task
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskScheduler;
