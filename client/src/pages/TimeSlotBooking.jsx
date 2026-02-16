// TimeSlotBooking.jsx
import { useState, useEffect, useMemo } from 'react';

const TimeSlotBooking = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  onBlur,
  error,
  required = false,
  bookedSlots = {},   // shape: { 'YYYY-MM-DD': { '08:30': 5, '09:00': 10, ... } }
}) => {
  const maxBookingsPerSlot = 10;
  const contactNumber = '011 403 2369';

  // Generate available weekdays starting from two days in the future
  const [availableDateSet, setAvailableDateSet] = useState(new Set());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start from day after tomorrow
    const start = new Date(today);
    start.setDate(today.getDate() + 2);

    // End date (90 days from start)
    const end = new Date(start);
    end.setDate(start.getDate() + 90);

    setStartDate(start);
    setEndDate(end);

    const dates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        dates.push(`${year}-${month}-${day}`);
      }
    }
    setAvailableDateSet(new Set(dates));
  }, []);

  // Predefined time slots
  const timeSlots = [
    { start: '08:30', end: '09:00', value: '08:30' },
    { start: '09:00', end: '09:30', value: '09:00' },
    { start: '09:30', end: '10:00', value: '09:30' },
    { start: '10:00', end: '10:30', value: '10:00' },
    { start: '10:30', end: '11:00', value: '10:30' },
    { start: '11:00', end: '11:30', value: '11:00' },
    { start: '11:30', end: '12:00', value: '11:30' },
  ];

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const yearStr = date.getFullYear();
      const monthStr = String(date.getMonth() + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const dateString = `${yearStr}-${monthStr}-${dayStr}`;
      const isSelectable = availableDateSet.has(dateString);
      const isSelected = dateString === selectedDate;
      days.push({
        date,
        dateString,
        day: d,
        isSelectable,
        isSelected,
      });
    }

    return days;
  }, [currentMonth, availableDateSet, selectedDate]);

  const handleDateClick = (dateString) => {
    if (availableDateSet.has(dateString)) {
      onDateChange(dateString);
      // Reset time when date changes
      if (selectedTime) onTimeChange('');
    }
  };

  // Check if a slot is fully booked
  const isSlotFull = (slotValue) => {
    if (!selectedDate) return false;
    const dateBookings = bookedSlots[selectedDate] || {};
    return (dateBookings[slotValue] || 0) >= maxBookingsPerSlot;
  };

  const monthYearString = currentMonth.toLocaleDateString('default', {
    month: 'long',
    year: 'numeric',
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4">
      {/* Calendar view for date selection */}
      <div>
        <label className="block font-semibold mb-2">
          Select Interview Date {required && <span className="text-red-500">*</span>}
        </label>

        {/* Calendar header with month navigation */}
        <div className="flex justify-between items-center mb-2">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-medium">{monthYearString}</span>
          <button
            type="button"
            onClick={goToNextMonth}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-1 text-center text-xs font-medium text-gray-600">
          {weekDays.map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div key={index} className="aspect-square">
              {day ? (
                <button
                  type="button"
                  onClick={() => handleDateClick(day.dateString)}
                  disabled={!day.isSelectable}
                  className={`
                    w-full h-full flex items-center justify-center text-sm rounded-lg transition-colors
                    ${day.isSelectable ? 'cursor-pointer hover:bg-blue-100' : 'text-gray-300 cursor-not-allowed'}
                    ${day.isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                  `}
                >
                  {day.day}
                </button>
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-3 mt-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded"></div>
            <span>Unavailable</span>
          </div>
        </div>

        {error && !selectedDate && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      {/* Time slots (only shown if a date is selected) */}
      {selectedDate && (
        <div>
          <label className="block font-semibold mb-2">
            Select Time Slot {required && <span className="text-red-500">*</span>}
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {timeSlots.map((slot) => {
              const full = isSlotFull(slot.value);
              const bookedCount = bookedSlots[selectedDate]?.[slot.value] || 0;
              const available = maxBookingsPerSlot - bookedCount;
              return (
                <label
                  key={slot.value}
                  className={`flex items-center p-2 border rounded-lg cursor-pointer transition-colors ${
                    selectedTime === slot.value
                      ? 'bg-blue-100 border-blue-500'
                      : full
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="timeSlot"
                    value={slot.value}
                    checked={selectedTime === slot.value}
                    onChange={() => onTimeChange(slot.value)}
                    onBlur={onBlur}
                    disabled={full}
                    className="mr-2"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {slot.start} – {slot.end}
                    </div>
                    {!full && (
                      <div className="text-xs text-gray-600">
                        {available} of {maxBookingsPerSlot} left
                      </div>
                    )}
                    {full && (
                      <div className="text-xs text-red-600">Fully booked</div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
          {error && selectedDate && !selectedTime && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>
      )}

      {/* Contact information */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
        <p className="font-semibold">Need help booking?</p>
        <p>Call us at <span className="font-mono">{contactNumber}</span></p>
        <p className="text-xs text-gray-600 mt-1">
          Available weekdays 8:00 AM – 4:30 PM
        </p>
      </div>
    </div>
  );
};

export default TimeSlotBooking;
