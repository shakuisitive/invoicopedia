"use client";
import { useEffect, useMemo, useRef } from "react";
import * as React from "react";
import { ArrowUpDown, Plus, Search } from "lucide-react";
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import { useState } from "react";

// Add new type definitions
type ColumnType = "status" | "text" | "people" | "number" | "date";

interface Column {
  id: string;
  text: string;
  value: string;
  width: number;
  type: ColumnType; // Add type field
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

// Add predefined options
const STATUS_OPTIONS = [
  { label: "Done", value: "done", color: "bg-emerald-500" },
  { label: "Working on it", value: "working", color: "bg-amber-400" },
  { label: "Stuck", value: "stuck", color: "bg-red-500" },
];

const PEOPLE_OPTIONS = [
  { label: "John Doe", value: "john" },
  { label: "Jane Smith", value: "jane" },
  { label: "Bob Johnson", value: "bob" },
];

// Add column type menu component with improved styling
const ColumnTypeMenu: React.FC<{
  onSelect: (type: ColumnType) => void;
  onClose: () => void;
  position: { x: number; y: number };
  isSubtask: boolean;
  taskId?: string;
}> = ({ onSelect, onClose, position, isSubtask, taskId }) => {
  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-xl border w-[280px]"
      style={{
        top: `${position.y}px`,
        left: `${position.x - 280}px`, // Subtract menu width to position it to the left
      }}
    >
      <div className="p-2">
        <div className="px-3 py-2 text-sm font-medium text-gray-600">
          Add Column
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-1.5 mb-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="text-xs font-medium text-gray-500 px-3 py-1.5">
          Essentials
        </div>
        <div className="space-y-1">
          <button
            onClick={() => onSelect("status")}
            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-3 group"
          >
            <div className="w-6 h-6 bg-emerald-100 rounded flex items-center justify-center group-hover:bg-emerald-200">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <span className="text-sm text-gray-700">Status</span>
          </button>

          <button
            onClick={() => onSelect("text")}
            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-3 group"
          >
            <div className="w-6 h-6 bg-amber-100 rounded flex items-center justify-center group-hover:bg-amber-200">
              <div className="w-3 h-3 text-amber-500">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 5h16v2H4zm0 6h16v2H4zm0 6h10v2H4z" />
                </svg>
              </div>
            </div>
            <span className="text-sm text-gray-700">Text</span>
          </button>

          <button
            onClick={() => onSelect("people")}
            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-3 group"
          >
            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center group-hover:bg-blue-200">
              <div className="w-3 h-3 text-blue-500">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>
            <span className="text-sm text-gray-700">People</span>
          </button>

          <button
            onClick={() => onSelect("number")}
            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-3 group"
          >
            <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center group-hover:bg-purple-200">
              <div className="w-3 h-3 text-purple-500">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 8c0 1.11-.9 2-2 2h-2v2h4v2H9v-4c0-1.11.9-2 2-2h2V9H9V7h4c1.1 0 2 .89 2 2v2z" />
                </svg>
              </div>
            </div>
            <span className="text-sm text-gray-700">Numbers</span>
          </button>

          <button
            onClick={() => onSelect("date")}
            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-3 group"
          >
            <div className="w-6 h-6 bg-rose-100 rounded flex items-center justify-center group-hover:bg-rose-200">
              <div className="w-3 h-3 text-rose-500">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
              </div>
            </div>
            <span className="text-sm text-gray-700">Date</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const EditableText: React.FC<{
  text: string;
  onSave: (newText: string) => void;
  className?: string;
}> = ({ text, onSave, className = "" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(value);
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setValue(text);
  }, [text]);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSave();
          }
        }}
        className={`w-full px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:outline-none ${className}`}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <div className="group relative cursor-text">
      <div
        className="group-hover:bg-gray-100 rounded px-2 py-1 -mx-2"
        onClick={handleClick}
      >
        <span className={`${className}`}>{text}</span>
      </div>
    </div>
  );
};

// Add these new components and functions before the TaskScheduler component

const StatusDropdown = ({ status, onSelect, onClose }) => {
  const statusOptions = [
    { label: "Done", value: "done", color: "bg-emerald-500" },
    { label: "Working", value: "working", color: "bg-yellow-500" },
    { label: "Stuck", value: "stuck", color: "bg-red-500" },
  ];

  return (
    <div className="absolute z-50 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div
        className="py-1"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      >
        {statusOptions.map((option) => (
          <button
            key={option.value}
            className={`${option.color} text-white group flex rounded-md items-center w-full px-2 py-2 text-sm`}
            onClick={() => {
              onSelect(option.value);
              onClose();
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const StatusCell = ({ status, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "done":
        return "bg-emerald-500";
      case "working":
        return "bg-yellow-500";
      case "stuck":
        return "bg-red-500";
      default:
        return "bg-gray-200";
    }
  };

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    onStatusChange(newStatus);
    setIsOpen(false);
  };

  return (
    <div className="relative -m-2">
      <button
        className={`w-full h-full px-4 py-2 text-xs text-white ${getStatusColor(
          currentStatus
        )}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentStatus}
      </button>
      {isOpen && (
        <StatusDropdown
          status={currentStatus}
          onSelect={handleStatusChange}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// Modify the TaskScheduler component
const TaskScheduler = () => {
  // ... (keep existing state and functions)
  const [expanded, setExpanded] = useState<string[]>([]);
  const [parentColumns, setParentColumns] = useState<Column[]>([
    { id: "checkbox", text: "", value: "checkbox", width: 40, type: "text" },
    { id: "name", text: "Item", value: "name", width: 300, type: "text" },
    {
      id: "person",
      text: "Person",
      value: "person",
      width: 150,
      type: "people",
    },
    {
      id: "status",
      text: "Status",
      value: "status",
      width: 150,
      type: "status",
    },
    { id: "date", text: "Date", value: "date", width: 100, type: "date" },
  ]);
  const [subtaskColumns, setSubtaskColumns] = useState<Column[]>([
    { id: "checkbox", text: "", value: "checkbox", width: 40, type: "text" },
    {
      id: "subitem",
      text: "Subitem",
      value: "subitem",
      width: 300,
      type: "text",
    },
    { id: "owner", text: "Owner", value: "owner", width: 150, type: "people" },
    {
      id: "status",
      text: "Status",
      value: "status",
      width: 150,
      type: "status",
    },
    { id: "date", text: "Date", value: "date", width: 100, type: "date" },
  ]);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      name: "Project kickoff meeting",
      person: "John Doe",
      status: "done",
      date: "Feb 15",
      subitems: [
        {
          id: "1-1",
          subitem: "Prepare agenda",
          owner: "Sarah",
          status: "done",
          date: "Feb 14",
        },
        {
          id: "1-2",
          subitem: "Send invitations",
          owner: "John",
          status: "done",
          date: "Feb 13",
        },
      ],
    },
    {
      id: "2",
      name: "Design system update",
      person: "Emily Chen",
      status: "working",
      date: "Mar 1",
      subitems: [],
    },
    {
      id: "3",
      name: "Client presentation",
      person: "Alex Johnson",
      status: "stuck",
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

  // Update the editingColumn state to include taskId
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

  const [newTaskInput, setNewTaskInput] = useState<string | null>(null);

  // Update the showColumnTypeMenu state
  const [showColumnTypeMenu, setShowColumnTypeMenu] = useState<{
    isSubtask: boolean;
    taskId?: string;
    position: { x: number; y: number };
  } | null>(null);

  const [openDropdown, setOpenDropdown] = useState(null);

  const [newSubtask, setNewSubtask] = useState<{
    taskId: string;
    subtask: SubTask;
  } | null>(null);

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

  // Update the addNewColumn function
  const addNewColumn = (
    type: ColumnType,
    isSubtask: boolean,
    taskId?: string
  ) => {
    const newColumn: Column = {
      id: `col-${Date.now()}`,
      text: "",
      value: `new-column-${Date.now()}`,
      width: 150,
      type: type,
    };

    if (isSubtask) {
      setSubtaskColumns((prev) => [...prev, newColumn]);
      setTasks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          subitems: task.subitems.map((subtask) => ({
            ...subtask,
            [newColumn.value]: type === "status" ? "working" : "",
          })),
        }))
      );
    } else {
      setParentColumns((prev) => [...prev, newColumn]);
      setTasks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          [newColumn.value]: type === "status" ? "working" : "",
        }))
      );
    }

    setEditingColumn({ columnId: newColumn.id, isSubtask, taskId });
    setShowColumnTypeMenu(null);
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
              id: subtask.id,
              subitem: subtask.subitem,
              owner: subtask.owner,
              status: subtask.status,
              date: subtask.date,
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
            id: task.id,
            name: task.name,
            person: task.person,
            status: task.status,
            date: task.date,
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
    setNewTaskInput("");
    // Scroll to the bottom of the table
    setTimeout(() => {
      const tableBody = document.querySelector("tbody");
      if (tableBody) {
        tableBody.scrollTop = tableBody.scrollHeight;
      }
    }, 0);
  };

  const addNewSubtask = (taskId: string) => {
    const newSubtask: SubTask = {
      id: `new-subtask-${Date.now()}`,
      subitem: "",
      owner: "",
      status: "Not Started",
      date: new Date().toLocaleDateString(),
    };
    setNewSubtask({ taskId, subtask: newSubtask });
    setExpanded((prev) => (prev.includes(taskId) ? prev : [...prev, taskId]));

    // Focus on the new input field after a short delay
    setTimeout(() => {
      const newSubtaskInput = document.getElementById(
        `new-subtask-input-${taskId}`
      );
      if (newSubtaskInput) {
        newSubtaskInput.focus();
      }
    }, 0);
  };

  const handleNewSubtaskChange = (columnId: string, value: string) => {
    if (newSubtask) {
      setNewSubtask({
        ...newSubtask,
        subtask: {
          ...newSubtask.subtask,
          [subtaskColumns.find((col) => col.id === columnId)?.value || ""]:
            value,
        },
      });
    }
  };

  const saveNewSubtask = () => {
    if (newSubtask && newSubtask.subtask.subitem.trim() !== "") {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === newSubtask.taskId) {
            return {
              ...task,
              subitems: [...task.subitems, newSubtask.subtask],
            };
          }
          return task;
        })
      );
    }
    setNewSubtask(null);
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

  // Modify the handleColumnDoubleClick function
  const handleColumnDoubleClick = (
    columnId: string,
    isSubtask: boolean,
    taskId?: string
  ) => {
    setEditingCell(null);
    setEditingColumn({ columnId, isSubtask, taskId });
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

  // Update the handleColumnNameSave function
  const handleColumnNameSave = (
    columnId: string,
    isSubtask: boolean,
    taskId?: string
  ) => {
    const columns = isSubtask ? subtaskColumns : parentColumns;
    const column = columns.find((col) => col.id === columnId);
    if (column) {
      handleColumnTitleEdit(columnId, column.text || "New Column", isSubtask);
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

  const handleSaveNewTask = () => {
    if (newTaskInput && newTaskInput.trim() !== "") {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        name: newTaskInput.trim(),
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
    }
    setNewTaskInput(null);
  };

  const handleStatusChange = (taskId, newStatus, subtaskId = null) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          if (subtaskId) {
            return {
              ...task,
              subitems: task.subitems.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, status: newStatus }
                  : subtask
              ),
            };
          }
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const handleCellSave = (
    taskId: string,
    columnId: string,
    value: string,
    subtaskId?: string
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          if (subtaskId) {
            return {
              ...task,
              subitems: task.subitems
                .map((subtask) =>
                  subtask.id === subtaskId
                    ? {
                        ...subtask,
                        [subtaskColumns.find((col) => col.id === columnId)
                          ?.value || ""]: value,
                      }
                    : subtask
                )
                .filter((subtask) => subtask.subitem.trim() !== ""), // Remove empty subtasks
            };
          } else {
            return {
              ...task,
              [parentColumns.find((col) => col.id === columnId)?.value || ""]:
                value,
            };
          }
        }
        return task;
      })
    );
    setEditingCell(null);
  };

  // Add cell renderer function
  const renderCell = (column, value, onSave, taskId, subtaskId = null) => {
    switch (column.type) {
      case "status":
        return (
          <StatusCell
            status={value}
            onStatusChange={(newStatus) =>
              handleStatusChange(taskId, newStatus, subtaskId)
            }
          />
        );

      case "people":
        return (
          <select
            value={value}
            onChange={(e) => onSave(e.target.value)}
            className="px-2 py-1 rounded border border-gray-200"
          >
            <option value="">Select person...</option>
            {PEOPLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => {
              if (!isNaN(Number(e.target.value))) {
                onSave(e.target.value);
              }
            }}
            className="w-full px-2 py-1 border-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => onSave(e.target.value)}
            className="w-full px-2 py-1 border-none focus:ring-2 focus:ring-blue-500"
          />
        );

      default:
        return (
          <EditableText
            text={value || (column.text ? "" : "Click to edit")}
            onSave={onSave}
            className={column.text ? "" : "italic text-gray-400"}
          />
        );
    }
  };

  // Modify the column add button click handler
  const handleAddColumnClick = (
    e: React.MouseEvent,
    isSubtask: boolean,
    taskId?: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setShowColumnTypeMenu({
      isSubtask,
      taskId,
      position: {
        x: rect.left,
        y: rect.bottom,
      },
    });
  };

  // Modify the table rows in the return statement
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
                              handleColumnNameSave(e.id, false);
                          }}
                          className="w-full rounded border-none bg-transparent px-1 text-xs font-medium uppercase text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter column name"
                          autoFocus
                        />
                      ) : (
                        <>
                          <span
                            className="text-xs font-medium uppercase text-gray-500"
                            onDoubleClick={() =>
                              handleColumnDoubleClick(column.id, false)
                            }
                          >
                            {column.text || "Click to edit"}
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
                    onClick={(e) => handleAddColumnClick(e, false)}
                    className="p-1 hover:bg-gray-100 rounded flex items-center gap-1"
                    title="Add new column"
                  >
                    <Plus className="w-4 h-4 text-gray-400" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTasks.map((task, index) => (
                <React.Fragment key={task.id}>
                  <tr
                    className={`group ${
                      index % 2 === 0
                        ? "bg-white hover:bg-gray-100"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => setOpenDropdown(null)}
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
                                className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              >
                                <Plus className="w-4 h-4 text-gray-500" />
                              </button>
                            )}
                            {renderCell(
                              column,
                              String(task[column.value] || ""),
                              (newValue) =>
                                handleCellSave(task.id, column.id, newValue),
                              task.id
                            )}
                          </div>
                        ) : column.id === "status" ? (
                          <StatusCell
                            status={String(task[column.value] || "")}
                            onStatusChange={(newStatus) =>
                              handleStatusChange(task.id, newStatus)
                            }
                          />
                        ) : (
                          renderCell(
                            column,
                            String(task[column.value] || ""),
                            (newValue) =>
                              handleCellSave(task.id, column.id, newValue),
                            task.id
                          )
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
                      {/* children */}
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
                                        handleColumnDoubleClick(
                                          column.id,
                                          true,
                                          task.id
                                        )
                                      }
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        {editingColumn?.columnId ===
                                          column.id &&
                                        editingColumn.isSubtask &&
                                        editingColumn.taskId === task.id ? (
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
                                                true,
                                                task.id
                                              )
                                            }
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter")
                                                handleColumnNameSave(
                                                  e.id,
                                                  true,
                                                  task.id
                                                );
                                            }}
                                            className="w-full rounded border-none bg-transparent px-1 text-xs font-medium uppercase text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter column name"
                                            autoFocus
                                          />
                                        ) : (
                                          <>
                                            <span className="text-xs font-medium uppercase text-gray-500">
                                              {column.text || "Click to edit"}
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
                                      onClick={(e) =>
                                        handleAddColumnClick(e, true, task.id)
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
                                    onClick={() => setOpenDropdown(null)}
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
                                      >
                                        {renderCell(
                                          column,
                                          String(subtask[column.value] || ""),
                                          (newValue) =>
                                            handleCellSave(
                                              task.id,
                                              column.id,
                                              newValue,
                                              subtask.id
                                            ),
                                          task.id,
                                          subtask.id
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
                                {newSubtask &&
                                  newSubtask.taskId === task.id && (
                                    <tr className="bg-white hover:bg-gray-100/50">
                                      <td className="px-4 py-2 border border-gray-200">
                                        <input
                                          type="checkbox"
                                          disabled
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
                                        >
                                          {column.value === "subitem" ? (
                                            <input
                                              id={`new-subtask-input-${task.id}`}
                                              type="text"
                                              value={newSubtask.subtask.subitem}
                                              onChange={(e) =>
                                                handleNewSubtaskChange(
                                                  column.id,
                                                  e.target.value
                                                )
                                              }
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                  saveNewSubtask();
                                                }
                                              }}
                                              className="w-full px-2 py-1 border-none focus:ring-2 focus:ring-blue-500"
                                              placeholder="Enter new subtask name"
                                            />
                                          ) : (
                                            renderCell(
                                              column,
                                              newSubtask.subtask[
                                                column.value
                                              ] || "",
                                              (newValue) =>
                                                handleNewSubtaskChange(
                                                  column.id,
                                                  newValue
                                                ),
                                              task.id,
                                              newSubtask.subtask.id
                                            )
                                          )}
                                        </td>
                                      ))}
                                      <td className="px-4 py-2 border border-gray-200"></td>
                                    </tr>
                                  )}
                                <tr>
                                  <td
                                    colSpan={subtaskColumns.length + 2}
                                    className="border border-gray-200"
                                  >
                                    <button
                                      onClick={() => addNewSubtask(task.id)}
                                      className="w-full px-4 py-2 text-left text-gray-500 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <Plus className="w-4 h-4" /> Add subitem
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
              {newTaskInput === null ? (
                <tr>
                  <td colSpan={parentColumns.length + 2}>
                    <button
                      onClick={addNewTask}
                      className="w-full px-4 py-2 text-left text-gray-500 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add task
                    </button>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td className="w-[40px] px-4 py-2 border border-gray-200">
                    <input
                      type="checkbox"
                      disabled
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                  </td>
                  {parentColumns.slice(1).map((column) => (
                    <td
                      key={column.id}
                      className="px-4 py-2 border border-gray-200"
                      style={{ width: column.width }}
                    >
                      {column.value === "name" ? (
                        <input
                          autoFocus
                          value={newTaskInput}
                          onChange={(e) => setNewTaskInput(e.target.value)}
                          onBlur={handleSaveNewTask}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveNewTask();
                            }
                          }}
                          className="w-full px-2 py-1 border-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter new task name"
                        />
                      ) : null}
                    </td>
                  ))}
                  <td className="w-[40px] px-4 py-2 border border-gray-200"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showColumnTypeMenu && (
        <>
          <div
            className="fixed inset-0"
            onClick={() => setShowColumnTypeMenu(null)}
          />
          <ColumnTypeMenu
            onSelect={(type) =>
              addNewColumn(
                type,
                showColumnTypeMenu.isSubtask,
                showColumnTypeMenu.taskId
              )
            }
            onClose={() => setShowColumnTypeMenu(null)}
            position={showColumnTypeMenu.position}
            isSubtask={showColumnTypeMenu.isSubtask}
            taskId={showColumnTypeMenu.taskId}
          />
        </>
      )}
    </div>
  );
};

export default TaskScheduler;
