import React, { useState } from 'react';
import styles from './calendar.module.css';
import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';

const CalendarList = () => {
    const [value, setValue] = useState(new Date());

    return (
    <div className={styles.calendar_container}>
        <main className={styles.calendar_content}>
            <Calendar
                onChange={setValue}
                value={value}
                selectRange
                />
        </main>
    </div>);
}

export default CalendarList;