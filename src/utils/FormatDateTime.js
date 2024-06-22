import React from 'react';
import moment from 'moment';

export function FormatTime(inputDate) {
  const date = new Date(inputDate);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  let period = "AM"; 
  if (hours >= 12) {
    period = "PM";
    if (hours > 12) {
      hours -= 12;
    }
  }
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes} ${period}`;
}

export function FormatDate(inputDate) {
  const date = new Date(inputDate);
  const day = date.getDate();
  const month = date.getMonth() + 1; 
  const year = date.getFullYear() % 100; 
  const formattedDay = day.toString().padStart(2, "0");
  const formattedMonth = month.toString().padStart(2, "0");
  const formattedYear = year.toString().padStart(2, "0");
  return ` ${formattedDay}/${formattedMonth}/${formattedYear} `;
}

// DateFormatter.js

const DateFormatter = ( date ) => {
  return <>{moment(date).format('DD MMM YYYY')}</>;
};

export default DateFormatter;
