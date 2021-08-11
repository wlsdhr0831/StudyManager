import React from 'react';
import styles from './list.module.css';
import ListItem from '../../../components/listItem/listItem';

const List = () => {
    const data = [
        {'name': '김용욱', 'fire': true},
        {'name': '노휘종', 'fire': false},
        {'name': '성진옥', 'fire': false},
        {'name': '정인균', 'fire': false},
        {'name': '조희진', 'fire': false},
        {'name': '허인', 'fire': false},
    ];

    return (
        <div className={styles.list}>{
            data.map((item) => (
                <ListItem key={item.name} data={item}/>
            ))
        }
        </div>
    )
}

export default List;