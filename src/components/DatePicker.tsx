import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DatePickerProps {
  onDateChange: (date: Date) => void;
  selectedDate: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange, selectedDate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      onDateChange(newDate);
    }
  };

  return (
    <div className="relative mb-12">
      <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex items-center space-x-3 bg-black/20 backdrop-blur-xl rounded-full px-4 py-2 md:px-6 md:py-3 border border-cyan-500/20 shadow-lg">
          <Calendar className="text-cyan-400" size={18} />
          <Input
            type="date"
            value={formatDateForInput(selectedDate)}
            onChange={handleDateChange}
            className="bg-transparent border-none text-white text-base md:text-lg focus:ring-0 focus:border-none p-0 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200"
          />
        </div>
        <Button
          onClick={() => onDateChange(new Date())}
          variant="outline"
          className="bg-transparent border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-full px-4 py-2 text-base md:px-6 md:py-3 md:text-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Today
        </Button>
      </div>
    </div>
  );
};

export default DatePicker;