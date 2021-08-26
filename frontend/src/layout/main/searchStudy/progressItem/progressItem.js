import React from 'react';
import ProgressBar from "@ramonak/react-progress-bar";
import styles from './progressItem.module.css';

const ProgressItem = ({ data }) => {
    return (
        <div className={styles.progress_item}>
            <span className={styles.name}>{data.name}</span>
            <ProgressBar 
                bgColor="#004da5"
                baseBgColor="#58b4ff"
                height="40px"
                width="70%"
                labelAlignment="left"
                isLabelVisible={true}
                ariaValuemin={0}
                ariaValuemax={7}
                completed={Math.round((data.success * 100) / 7)} />
        </div>
    )
}

export default ProgressItem;