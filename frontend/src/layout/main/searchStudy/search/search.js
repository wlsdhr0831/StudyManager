import React from 'react';
import CalendarList from '../calendar/calendar';
import Progress from '../progress/progress';
import styles from './search.module.css';

const Search = ({ date, changeDate }) => {
    return (
    <div className={styles.search}>
        <CalendarList date={date} changeDate={changeDate}/>
        <Progress/>
    </div>);
}

export default Search;