import React from 'react';
import Sign from '../../pages/sign/sign';
import Setting from '../../pages/setting/setting';
import styles from './modal.module.css';

const Modal = ({ closeModal, component }) => {
    return (
    <div className={styles.modal_wrapper} sytle="display: none;">
      <div className={styles.modal}>
        { component === 'sign' && <Sign/> }
        { component === 'setting' && <Setting/> }
        <div className={styles.close_wrapper}>
          <button className={styles.modal_btn} onClick={() => closeModal()}>✖</button>
        </div>
      </div>
    </div>)
}

export default Modal;