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
  selectedDay: string | null;
  setSelectedDay: React.Dispatch<React.SetStateAction<string | null>>;
  month: number;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
  year: number;
  setYear: React.Dispatch<React.SetStateAction<number>>;
  showPicker: boolean;
  setShowPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ToDoListState {
  selectedDate: BloomDate | null;
  isSelecting: boolean;
  onSelectDate: React.Dispatch<React.SetStateAction<boolean>>;

}

export interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  startDate: BloomDate;
  endDate: BloomDate | null;
  days: number[];
  interval: number;
  time: BloomTime | null;
  dateCreated?: string | null;
  updatedAt: string;
};

export interface AddTaskModalProps {
  onClose: () => void;
  onAdd: (task: Task) => void;
  selectDate: BloomDate | null;
  isSelecting: boolean;
  onSelectDate: () => void;
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
