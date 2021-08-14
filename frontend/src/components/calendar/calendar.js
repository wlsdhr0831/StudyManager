import React, { useState } from 'react';
import styles from './calendar.module.css';
import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';

const CalendarList = ({ date, changeDate }) => {
    return (
    <div className={styles.calendar_container}>
        <main className={styles.calendar_content}>
            <Calendar
                value={date}
                onChange={changeDate}
                />
        </main>
    </div>);
}

export default CalendarList;