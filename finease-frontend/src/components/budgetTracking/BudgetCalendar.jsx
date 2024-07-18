import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const BudgetCalendar = ({ bills }) => {
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });

  const events = bills.map(bill => ({
    id: bill.id,
    title: `${bill.name}: $${bill.amount}`,
    start: new Date(bill.dueDate),
    end: new Date(bill.dueDate),
    allDay: true,
  }));

  const handleRangeSelect = ({ start, end }) => {
    setSelectedRange({ start, end });
  };

  const filteredBills = bills.filter(bill => {
    const dueDate = moment(bill.dueDate);
    return (
      (!selectedRange.start || dueDate.isSameOrAfter(selectedRange.start, 'day')) &&
      (!selectedRange.end || dueDate.isSameOrBefore(selectedRange.end, 'day'))
    );
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 400 }}
        selectable
        onSelectSlot={handleRangeSelect}
      />
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Bills Due {selectedRange.start ? `(${moment(selectedRange.start).format('MMM D')} - ${moment(selectedRange.end).format('MMM D')})` : ''}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredBills.map((bill) => (
            <div key={bill.id} className="bg-blue-100 p-2 rounded">
              <p className="text-sm">{bill.name}</p>
              <p className="font-semibold">Rs {bill.amount}</p>
              <p className="text-xs text-gray-600">{moment(bill.dueDate).format('MMM D, YYYY')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetCalendar;