import React, { useState } from 'react';
import Main from './pages/main/main';
import './App.css';
import Modal from './pages/modal/modal';

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