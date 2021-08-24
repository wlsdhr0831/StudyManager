import React, { useEffect, useState } from 'react';
import styles from './peopleList.module.css';
import PeopleListItem from '../../../components/peopleListItem/peopleListItem';
import { getFires } from '../../../api/api';

const PeopleList = ({ setDate, date }) => {
    const [list, setList] = useState({
        accounts: [],
        fires: {}
    });

    const [dateDiff, setDateDiff] = useState(0);

    useEffect(() => {
        getList();

    }, [date]);

    const getList = async () => {
        const params = date.getFullYear() + "-" 
                        + ("0" + (1 + date.getMonth())).slice(-2) + "-" 
                        + date.getDate();
        const res = await getFires(params)
                    .then(res => res);
        
        console.log(res);
        setList(res);
    }

    const changeDate = ( dir ) => {
        setDate(new Date(
                    date.getFullYear(), 
                    date.getMonth(), 
                    date.getDate() + dir));
        setDateDiff(dateDiff + dir);
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
                    <PeopleListItem key={account.username} data={account} dateDiff={dateDiff}/>
                ))
            }
        </div>
    )
}

export default PeopleList;