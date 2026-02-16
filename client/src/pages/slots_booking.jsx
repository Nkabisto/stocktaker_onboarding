// TimeSlotBooking.jsx
import { useState, useEffect } from 'react';

const TimeSlotBooking = ({ 
  selectedDate, 
  onDateChange, 
  selectedTime, 
  onTimeChange,
  onBlur,
  error,
  required = false,
  bookedSlots = [] // Pass pre-booked slots from parent/API
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Generate time slots from 8 AM to 12 PM in 30-min intervals
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 12; // 12 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      // Add :00 slot
      slots.push({
        value: `${hour.toString().padStart(2, '0')}:00`,
        label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
        time: `${hour.toString().padStart(2, '0')}:00`
      });
      
      // Add :30 slot
      slots.push({
        value: `${hour.toString().padStart(2, '0')}:30`,
        label: `${hour > 12 ? hour - 12 : hour}:30 ${hour >= 12 ? 'PM' : 'AM'}`,
        time: `${hour.toString().padStart(2, '0')}:30`
      });
    }
    
    return slots;
  };

  // Generate calendar days for current month
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const monthLength = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let d = 1; d <= monthLength; d++) {
      const date = new Date(year, month, d);
      const dateString = date.toISOString().split('T')[0];
      const isWeekend = date.getDay() === 0 || date.getDay() === 6; // 0 = Sunday, 6 = Saturday
      
      days.push({
        date,
        dateString,
        day: d,
        isWeekend,
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0)),
        isToday: dateString === new Date().toISOString().split('T')[0]
      });
    }
    
    setCalendarDays(days);
  }, [currentMonth]);

  // Generate time slots when date changes
  useEffect(() => {
    const allSlots = generateTimeSlots();
    
    // Filter out booked slots for selected date
    if (selectedDate && bookedSlots[selectedDate]) {
      const filteredSlots = allSlots.filter(
        slot => !bookedSlots[selectedDate].includes(slot.time)
      );
      setAvailableTimeSlots(filteredSlots);
    } else {
      setAvailableTimeSlots(allSlots);
    }
  }, [selectedDate, bookedSlots]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateSelect = (day) => {
    if (day && !day.isPast) {
      onDateChange(day.dateString);
      onTimeChange(''); // Reset time when date changes
    }
  };

  const monthYearString = currentMonth.toLocaleDateString('default', { 
    month: 'long', 
    year: 'numeric' 
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Date Selection Calendar */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Select Date</h3>
        
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <span className="font-medium">{monthYearString}</span>
          
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div key={index} className="aspect-square">
              {day ? (
                <button
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  disabled={day.isPast}
                  className={`
                    w-full h-full flex items-center justify-center text-sm rounded-lg
                    transition-colors duration-200
                    ${day.isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-100'}
                    ${day.dateString === selectedDate 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : day.isToday && !day.isPast 
                        ? 'border-2 border-blue-300' 
                        : ''
                    }
                    ${!day.isPast && !day.isWeekend ? 'cursor-pointer' : ''}
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
        <div className="flex gap-4 mt-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border-2 border-blue-300 rounded"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>

      {/* Time Slot Selection */}
      {selectedDate && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">
            Select Time Slot (8 AM - 12 PM)
          </h3>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {availableTimeSlots.map((slot) => (
              <button
                key={slot.value}
                type="button"
                onClick={() => onTimeChange(slot.value)}
                className={`
                  p-2 text-sm rounded-lg border transition-colors duration-200
                  ${selectedTime === slot.value
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }
                `}
              >
                {slot.label}
              </button>
            ))}
          </div>

          {availableTimeSlots.length === 0 && (
            <p className="text-red-500 text-sm">
              No available time slots for this date. Please select another date.
            </p>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      {/* Required Field Indicator */}
      {required && !selectedDate && !selectedTime && (
        <p className="text-sm text-gray-500">
          Please select a date and time slot to continue
        </p>
      )}
    </div>
  );
};

export default TimeSlotBooking;