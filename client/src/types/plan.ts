export interface BloomDate {
  day: number;
  date: number
  month: number;
  year: number;
};

export interface BloomTime {
  hour: number;
  min: number;
  sec: number;
}

export interface DateJumperProps {
  isOpen: boolean;
  onCancel: () => void;
  onSave: (month: number, year: number) => void;
}

export interface CalendarState {
  selectedDate: (date: string | null) => void;
  selectMode: boolean;
}

export interface ToDoListState {
  selectedMode: () => void;
  selectedDate: string | null
}

export interface Task {
  id: string
  task: string | null;
  description?: string | null;
  isCompleted: boolean;
  startDate: BloomDate;
  endDate?: BloomDate;
  days?: number[];
  interval?: number;
  time?: BloomTime;
  dateCreated?: string;
};

export interface AddTaskModalProps {
  onClose: () => void;
  onCancel: () => void;
  onAdd: (task: Task) => void;
  selectDate: string | null;
  selectMode: () => void;
}


export type TodoMode =
  | "default"
  | "viewDate"
  | "viewTask"
  | "addTask"
  | "editTask";

export interface TodoListProcess {
  mode: TodoMode;
  selectedTaskId?: string;
  selectedDate?: string;
  tasks: Task[];
}

export class Stack<T> {
  private items: T[] = [];

  push(item: T) {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  clear() {
    this.items = [];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  toArray(): T[] {
    return [...this.items];
  }
}
