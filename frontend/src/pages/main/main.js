import React, { useState } from 'react';
import PeopleList from '../../layout/main/peopleList/peopleList';
import Search from '../../layout/main/search/search';

const Main = () => {
    const [ date, setDate ] = useState(new Date());

    const changeDate = (e) => {
        setDate(e);
    }

    return (
        <div>
            <Search date={date} changeDate={changeDate}/>
            <PeopleList date={date} setDate={setDate}/>
        </div>
    )
}

export default Main;