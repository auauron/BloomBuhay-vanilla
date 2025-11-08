export interface BloomDate {
  day: number;
  month: number;
  year: number;
};

export interface BloomTime {
    hour: number;
    min: number;
}

export interface CalendarProps {
    date: BloomDate;
    onClose: () => void;
    onSave: (date: BloomDate) => void;
}

export interface DateJumperProps {
    isOpen: boolean;
    curMonth: number;
    curYear: number;
    onCancel: () => void;
    onSave: (month: number, year: number) => void;
}

export interface Task {
  task: string | null;
  description: string | null;
  isCompleted: boolean;
  taskType: SingleDate | DateFrame | Repeated | Weekly | Custom | null;
};

export interface SingleDate {
    date: BloomDate;
}

export interface DateFrame {
    startDate: BloomDate;
    endDate: BloomDate;
}

export interface Repeated extends DateFrame{
    interval: number;
}

export interface Weekly extends DateFrame {
    day: string;
}

export interface Custom extends DateFrame{
    interval: number[];
}

export interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Task) => void;
}