import React, { useEffect, useState } from 'react';
import styles from './peopleList.module.css';
import PeopleListItem from '../../../components/peopleListItem/peopleListItem';
import { getFires } from '../../../api/api';

const PeopleList = ({ setDate, date }) => {
    const [list, setList] = useState([]);

    useEffect(() => {
        const params = date.getFullYear() + "-" 
                        + ("0" + (1 + date.getMonth())).slice(-2) + "-" 
                        + date.getDate();
        const res = getFires(params)
                    .then(res => res);
        
        console.log(res);
        //setList(res);
    }, [date]);

    const changeDate = ( dir ) => {
        setDate(new Date(
                    date.getFullYear(), 
                    date.getMonth(), 
                    date.getDate() + dir));
    }

    return (
        <div className={styles.list}>
            <div className={styles.list_head}>
                <span onClick={() => changeDate(-1)}>👈🏻</span>
                <h2>{date.toDateString()}</h2>
                <span onClick={() => changeDate(1)}>👉🏻</span>
            </div>
            {
                list.accounts.map((account) => (
                    <PeopleListItem key={account.name} data={account}/>
                ))
            }
        </div>
    )
}

export default PeopleList;