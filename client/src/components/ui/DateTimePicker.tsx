import React from "react";
import { Calendar, Clock } from "lucide-react";

interface DateTimePickerProps {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  dateLabel?: string;
  timeLabel?: string;
  className?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  date,
  time,
  onDateChange,
  onTimeChange,
  dateLabel = "Date",
  timeLabel = "Time",
  className = ""
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-2 gap-3">
        {/* Date Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {dateLabel}
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bloomPink focus:border-transparent"
            />
          </div>
        </div>

        {/* Time Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {timeLabel}
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="time"
              value={time}
              onChange={(e) => onTimeChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bloomPink focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;