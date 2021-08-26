import React, { useState } from 'react';
import PeopleList from '../../layout/main/people/peopleList/peopleList';
import Search from '../../layout/main/searchStudy/search/search';

const Main = () => {
    const [ date, setDate ] = useState(new Date());
    const [ today, setToday ] = useState(true);

    const changeDate = (e) => {
        setDate(e);

        if(!sameDate(e, new Date())){
            setToday(false);
        }else{
            setToday(true);
        }
    }

    const sameDate = (a, b) => {
        return a.getFullYear() === b.getFullYear()
            && a.getMonth() === b.getMonth()
            && a.getDate() === b.getDate();
    }

    return (
        <div>
            <Search date={date} changeDate={changeDate}/>
            <PeopleList date={date} changeDate={changeDate} today={today}/>
        </div>
    )
}

export default Main;