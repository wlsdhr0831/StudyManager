import React, { useState } from 'react';
import styles from './peopleListItem.module.css';
import Switch from "react-switch";
import TimeList from '../timeList/timeList';

const PeopleListItem = ({ data, dateDiff }) => {
    const [fire, setFire] = useState(false);

    const handleChange = (checked) => {
        setFire( checked );
    }

    return (
        <div className={styles.list_item}>
            <span className={styles.name}>{data.username}</span>
            { dateDiff === 0 &&
                <Switch
                // disabled={data.username === '' ? true : false}
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
            <div className={styles.time_list}>
                <TimeList/>
            </div>
            <hr/>
        </div>
    );
}

export default PeopleListItem;