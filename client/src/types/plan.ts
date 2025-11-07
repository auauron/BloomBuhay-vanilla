export interface BloomDate {
  day: number;
  month: number;
  year: number;
};

export interface CalendarProps {
    date: BloomDate;
    onClose: () => void;
    onSave: (date: BloomDate) => void
}

export interface CustomDateProps {
    isOpen: boolean
    onClose: () => void;
    onSave: (month: number, year: number) => void
}

export interface Task {
  task: string | null;
  description: string | null;
  isCompleted: boolean;
  taskType: SingleDate | DateFrame | Repeated | Weekly | Custom
};

export interface SingleDate {
    date: BloomDate
}

export interface DateFrame {
    startDate: BloomDate;
    endDate: BloomDate
}

export interface Repeated extends DateFrame{
    interval: number
}

export interface Weekly extends Repeated {
    delay: number
}

export interface Custom extends DateFrame{
    interval: number[]
}

export interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onAdd: (task: Task) => void
}

