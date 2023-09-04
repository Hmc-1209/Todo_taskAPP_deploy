import React, { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../Layout";

import { days_in_Month } from "../functions/date";
import { setDue } from "../functions/localStorageCRUD";

const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TaskDatePicker = () => {
  let {
    due,
    reRender,
    selectedRepo,
    setReRender,
    editingItem,
    setEditingItem,
    setEditingType,
    setEditing,
    setFocusing,
  } = useContext(AppContext);
  const [year, setYear] = useState(due[0]);
  const [month, setMonth] = useState(due[1]);

  // Check if the day is selected
  const checkDayClass = (year, month, day) => {
    return year === due[0] && month === due[1] && day === due[2]
      ? "days daysSelected"
      : "days";
  };

  const closeDatePicker = () => {
    setEditingItem(null);
    setEditingType(null);
    setEditing(0);
    setFocusing(0);
    setReRender(reRender + 1);
  };

  const prevMonth = () => {
    const newMonth = month - 1 < 1 ? 12 : month - 1;
    if (newMonth === 12) setYear(year - 1);
    setMonth(newMonth);
  };

  const nextMonth = () => {
    const newMonth = month + 1 > 12 ? 1 : month + 1;
    if (newMonth === 1) setYear(year + 1);
    setMonth(newMonth);
  };

  const selectDate = (day) => {
    console.log(year + "/" + month + "/" + day);
    setDue(selectedRepo, editingItem, year, month, day);
    closeDatePicker();
  };

  return (
    <div className="datePickerBase" onClick={() => setFocusing(1)}>
      <div className="datePickerYear">{year}</div>
      <button className="closeDatePicker" onClick={() => closeDatePicker()}>
        X
      </button>

      {/* Month and change buttons */}
      <div style={{ textAlign: "center", display: "flex" }}>
        {/* Prev month button */}
        <button
          className="monthPNbutton"
          style={{ width: "33.3%" }}
          onClick={() => prevMonth()}
        >
          &#x3c;
        </button>
        {/* Month */}
        <div className="datePickerMonth" style={{ width: "33.3%" }}>
          - {month} -
        </div>
        {/* Next month button */}
        <button
          className="monthPNbutton"
          style={{ width: "33.3%" }}
          onClick={() => nextMonth()}
        >
          &#x3e;
        </button>
      </div>

      {/* Days name */}
      <div style={{ display: "flex", textAlign: "center" }}>
        {daysInWeek.map((day) => (
          <div className="daysInWeek" key={day}>
            {day}
          </div>
        ))}
      </div>
      {/* Days elements */}
      {days_in_Month(month - 1, year).map((day) =>
        day > 0 ? (
          <button
            className={checkDayClass(year, month, day)}
            key={day}
            onClick={() => selectDate(day)}
          >
            {day}
          </button>
        ) : (
          <div className="daysN" key={day}></div>
        )
      )}
    </div>
  );
};

export default TaskDatePicker;
