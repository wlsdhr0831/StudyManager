import React, { useState } from 'react';
import styles from './sign.module.css';
import { sign } from '../../api/api';

const Sign = () => {
    const [ userInfo, setUserInfo ] = useState({
        username: '',
        userPw: '',
    });

    const onKeyDown = (e) => {
        if(e.keyCode === "13") submitSign();
    };

    const submitSign = () => {
        console.log("로그인 요청", userInfo);
        // sign(userInfo);
    };

    const onChange = (e) => {
        const { name, value } = e.target;

        setUserInfo({
            ...userInfo,
            [name]: value,
        });
    };

    return (
        <div className={styles.sign}>
            <input 
                name="username" 
                value={userInfo.username} 
                onChange={onChange} 
                onKeyDown={onKeyDown} 
                placeholder="NAME"/>
            <input 
                name="userPw" 
                value={userInfo.userPw} 
                onChange={onChange} 
                onKeyDown={onKeyDown} 
                placeholder="PW"/>
            <button onClick={submitSign}>SIGN IN</button>
        </div>
    )
}

export default Sign;