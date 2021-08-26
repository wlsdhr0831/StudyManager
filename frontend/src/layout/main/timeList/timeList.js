import React, { useEffect, useState } from 'react';
import styles from './timeList.module.css';

const TimeListItem = ({ time }) => {
    const [ start, setStart ] = useState('');
    const [ end, setEnd ] = useState('');

    useEffect(() => {
        const startTime = new Date(time.fireTime);
        const endTime = new Date(time.end.fireTime);

        setStart(startTime.toLocaleTimeString());
        setEnd(endTime.toLocaleTimeString());
    }, []);

    return (
        <div className={styles.time_item}>
            {start} - {end}
        </div>
    );
};

const TimeList = ({ timeList }) => {
    const [ total, setTotal ] = useState("0초");

    useEffect(() => {
        const timeDiff = timeList.reduce(calculateTotal, 0);

        let h = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let m = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        let s = Math.floor((timeDiff % (1000 * 60)) / 1000);

        setTotal(h +"시간 "+ m +"분 "+ s +"초");
    }, []);

    const calculateTotal = (acc, time) => {
        const startTime = new Date(time.fireTime);
        const endTime = new Date(time.end.fireTime);
        const timeDiff = endTime - startTime;

        return acc + timeDiff;
    }

    return (
        <div className={styles.time_list}>
            { timeList.length > 0 ? 
                <div>
                    {timeList.map(time => 
                        <TimeListItem 
                            key={time.id}
                            time={time}/>
                    )}
                    <div className={styles.total}>총 :  {total}</div>
                </div>
            :  <div className={styles.total}>결석😥</div> }
        </div>
    );
};

export default TimeList;