import React from 'react';
import styles from './progress.module.css';
import ProgressItem from '../progressItem/progressItem';

const Progress = () => {
    
    const data = [
        {'name': '김용욱', 'success': 1},
        {'name': '노휘종', 'success': 2},
        {'name': '성진옥', 'success': 3},
        {'name': '정인균', 'success': 4},
        {'name': '조희진', 'success': 5},
        {'name': '허인', 'success': 6},
    ]


    return (
    <div className={styles.progress}>
        <h2>이번 주 진행상황</h2>
        {
            data.map((item) => (
                <ProgressItem data={item} key={item.name}/>
            ))
        }
    </div>);
}

export default Progress;