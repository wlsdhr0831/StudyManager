import React, { useState } from 'react';
import styles from './listItem.module.css';
import Switch from "react-switch";

const ListItem = ({ data }) => {
    const [fire, setFire] = useState(false);

    return (
        <div className={styles.list_item}>
            {data.name}
            {data.fire ? 'ON' : 'OFF'}
            <Switch 
                disabled={!data.fire}
                checked={fire}
                onChange={setFire}/> 
            <div className={styles.time_list}>
                시간 리스트
            </div>
        </div>
    );
}

export default ListItem;