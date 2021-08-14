import React from 'react';
import styles from './peopleList.module.css';
import PeopleListItem from '../../../components/peopleListItem/peopleListItem';

const PeopleList = ({ setDate, date }) => {
    const data = [
        {'name': '김용욱', 'fire': true},
        {'name': '노휘종', 'fire': false},
        {'name': '성진옥', 'fire': false},
        {'name': '정인균', 'fire': false},
        {'name': '조희진', 'fire': false},
        {'name': '허인', 'fire': false},
    ];

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
                data.map((item) => (
                    <PeopleListItem key={item.name} data={item}/>
                ))
            }
        </div>
    )
}

export default PeopleList;