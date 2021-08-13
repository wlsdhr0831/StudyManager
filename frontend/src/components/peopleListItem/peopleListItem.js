import React, { useState } from 'react';
import styles from './peopleListItem.module.css';
import Switch from "react-switch";
import TimeList from '../timeList/timeList';

const PeopleListItem = ({ data }) => {
    const [fire, setFire] = useState(false);

    const handleChange = (checked) => {
        setFire( checked );
    }

    return (
        <div className={styles.list_item}>
            {data.name}
            <Switch
                disabled={!data.fire}
                checked={fire}
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
            <div className={styles.time_list}>
                <TimeList/>
            </div>
        </div>
    );
}

export default PeopleListItem;