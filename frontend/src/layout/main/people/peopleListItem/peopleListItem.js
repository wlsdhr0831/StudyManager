import React, { useEffect, useState } from 'react';
import styles from './peopleListItem.module.css';
import Switch from "react-switch";
import TimeList from '../../timeList/timeList';

const PeopleListItem = ({ data, today, changeFire, timeList = [] }) => {
    const currUser = '성진옥';
    const [ hover, setHover ] = useState(false);

    const handleChange = () => {
        changeFire( data.username, data.fireState );
    }

    const onMouseEnter = () => {
        setHover(true);
    }

    const onMouseLeave = () => {
        setHover(false);
    }

    return (
        <div className={styles.list_item}>
            <span 
                className={styles.name}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}>
                    {data.username}</span>
            { today &&
                <Switch
                disabled={data.username === currUser ? false : true}
                checked={data.fireState === 'START' ? true : false}
                onChange={handleChange}
                onColor="#58b4ff"
                onHandleColor="#004da5"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                height={20}
                width={48}
                />
            }
            { hover && <TimeList timeList={timeList}/> }
        </div>
    );
}

export default PeopleListItem;