export interface BloomDate {
  day: number;
  month: number;
  year: number;
};

export interface BloomTime {
  hour: number;
  min: number;
}

export interface DateJumperProps {
  isOpen: boolean;
  curMonth: number;
  curYear: number;
  onCancel: () => void;
  onSave: (month: number, year: number) => void;
}

export interface CalendarState {
  selectedDate: BloomDate | null;
  selectedMonth: number;
  selectedYear: number;
  viewMode: "month" | "year";
}

export interface Task {
  id: string
  task: string | null;
  description: string | null;
  isCompleted: boolean;
  startDate: BloomDate;
  endDate?: BloomDate;
  days?: number[];
  interval?: number;
  time?: BloomTime;
};

export interface AddTaskModalProps {
  onClose: () => void;
  onCancel: () => void;
  onAdd: (task: Task) => void;
  startDate: BloomDate;
  endDate?: BloomDate;
  isEditing?: boolean;
}


export type TodoMode =
  | "default"
  | "viewDate"
  | "viewTask"
  | "addTask"
  | "editTask";

export interface TodoListState {
  mode: TodoMode;
  selectedTaskId?: string;
  selectedDate?: BloomDate;
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
