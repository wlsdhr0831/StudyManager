import React, { useState } from 'react';
import Main from './pages/main/main';
import './App.css';
import Sign from './pages/sign/sign';
import Setting from './pages/setting/setting';

const Modal = ({ closeModal, component }) => {
  return (
  <div className="modal-wrapper" sytle="display: none;">
    <div className="modal">
      { component === 'sign' && <Sign/> }
      { component === 'setting' && <Setting/> }
      <div className="close-wrapper">
        <button onClick={() => closeModal()}>닫기</button>
      </div>
    </div>
  </div>)
}

const App = () => {
  const [modal, setModal] = useState(false);
  const [component, setComponent] = useState('');

  const openModal = (name) => {
    setModal(true);
    setComponent(name);
  }

  const closeModal = () => {
    setModal(false);
    setComponent('');
  }

  return (
  <div>
    <button onClick={() => openModal('sign')}>SIGN IN</button>
    <button onClick={() => openModal('setting')}>설정</button>
    { modal 
      && <Modal 
            closeModal={closeModal} 
            component={component}/>
    }
    <Main/>
  </div>
  );
};

export default App;