import React from 'react';
import styles from './sign.module.css';

const Sign = () => {
    return (
        <div className={styles.sign}>
            <input placeholder="NAME"/>
            <input placeholder="PW"/>
            <button>SIGN IN</button>
        </div>
    )
}

export default Sign;