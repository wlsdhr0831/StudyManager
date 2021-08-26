import React, { useEffect, useState } from 'react';
import styles from './peopleList.module.css';
import PeopleListItem from '../peopleListItem/peopleListItem';
import { getFires } from '../../../../api/api';

const PeopleList = ({ changeDate, date, today }) => {
    const [list, setList] = useState({
        accounts: [],
        fires: {}
    });

    useEffect(() => {
        getList();

    }, [date]);

    const getList = async () => {
        const params = date.getFullYear() + "-" 
                        + ("0" + (1 + date.getMonth())).slice(-2) + "-" 
                        + date.getDate();
        const res = await getFires(params)
                    .then(res => res);
    
        setList(res);
    }

    const moveDate = ( dir ) => {
        changeDate(new Date(
                    date.getFullYear(), 
                    date.getMonth(), 
                    date.getDate() + dir));
    }

    return (
        <div className={styles.list}>
            <div className={styles.list_head}>
                <span onClick={() => moveDate(-1)}>👈🏻</span>
                <h2>{date.toDateString()}</h2>
                <span onClick={() => moveDate(1)}>👉🏻</span>
            </div>
            {
                list.accounts.map((account) => (
                    <PeopleListItem 
                        key={account.username} 
                        data={account} 
                        today={today}/>
                ))
            }
        </div>
    )
}

export default PeopleList;