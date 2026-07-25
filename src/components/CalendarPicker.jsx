import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Ban } from 'lucide-react';

export default function CalendarPicker({ selectedDate, onSelectDate, blockedDates = [] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const formattedDay = String(d).padStart(2, '0');
    const formattedMonth = String(month + 1).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    days.push({ day: d, dateStr });
  }

  return (
    <div className="bg-white p-5 rounded-3xl border border-luxury-nude shadow-sm max-w-md mx-auto">
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-serif font-bold text-luxury-black flex items-center gap-2 text-base">
          <CalendarIcon size={18} className="text-luxury-gold" />
          {monthNames[month]} {year}
        </h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-luxury-cream hover:bg-luxury-nude text-luxury-black transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-luxury-cream hover:bg-luxury-nude text-luxury-black transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
        {days.map((item, idx) => {
          if (!item) return <div key={`empty-${idx}`} className="p-2"></div>;

          const isPast = item.dateStr < todayStr;
          const isSelected = selectedDate === item.dateStr;
          const isBlocked = blockedDates.includes(item.dateStr);

          return (
            <button
              key={item.dateStr}
              type="button"
              disabled={isPast}
              onClick={() => onSelectDate(item.dateStr)}
              className={`p-2.5 rounded-2xl font-bold transition-all flex flex-col items-center justify-center relative ${
                isPast
                  ? 'text-gray-300 cursor-not-allowed'
                  : isSelected
                  ? 'bg-luxury-black text-luxury-gold shadow-md scale-105 ring-2 ring-luxury-gold'
                  : isBlocked
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-luxury-cream hover:bg-luxury-nude text-luxury-black border border-transparent'
              }`}
            >
              <span>{item.day}</span>
              {isBlocked && !isPast && (
                <span className="text-[8px] text-red-500 font-normal leading-none mt-0.5 flex items-center gap-0.5">
                  <Ban size={8} /> Blocked
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}