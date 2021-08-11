import React from 'react';
import CalendarList from '../../../components/calendar/calendar';
import Progress from '../../../components/progress/progress';
import styles from './search.module.css';

const Search = () => {
    return (
    <div className={styles.search}>
        <CalendarList/>
        <Progress/>
    </div>);
}

export default Search;