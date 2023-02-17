import { useState } from 'react';

import { login } from '../../api/auth.js';

import { InputTextField } from '../../components/InputTextField.js';
import { BasicButton } from '../../components/BasicButton.js';
import { AlertSnackbar } from '../../components/AlertSnackbar.js';

export function MomentLoginPage(props) {
  // alert 출력 상태
  const [alert, setAlert] = useState({
    timestamp: null,
    severity: null, // error | warning | info | success
    message: ''
  });

  if (props.isAuthenticated) {
    return <></>;
  }
  
  return (
    <>
      <div className='card'>
        <p className='title'>모멘트를 수정하세요</p>
        <div className='description'>
          <p>트위터 ID, 모멘트를 식별할 ID와 모멘트 생성시 입력한 비밀번호를 입력하세요.</p>
        </div>
        <div className='highlighted'>
          <p>수정할 모멘트의 URL</p>
          <p><span>https://temp-moment.web.app</span><wbr/>/{props.user}<wbr/>/{props.id}</p>
        </div>
        <div className='form'>
          <InputTextField
            id='moment-user'
            label='트위터 ID'
            variant='outlined'
            value={props.user}
            type='text'
            onChange={(e) => handleTextFieldChange(e, props.setUser)}  />
          <InputTextField
            id='moment-id'
            label='모멘트 ID'
            variant='outlined'
            value={props.id}
            type='text'
            onChange={(e) => handleTextFieldChange(e, props.setId)}  />
          <InputTextField
            id='moment-password'
            label='비밀번호'
            variant='outlined'
            value={props.password}
            type='password'
            onChange={(e) => handleTextFieldChange(e, props.setPassword)} />
        </div>
      </div>
      <div className='button-container full'>
        <BasicButton
          className='button rounded'
          fullWidth
          variant='contained'
          disabled={!props.user || !props.id || !props.password}
          onClick={loginMoment} >
          로그인
        </BasicButton>
      </div>
      <AlertSnackbar alert={alert} />
    </>
  )

  async function loginMoment() {
    console.log('isLoginSucceeded: ', );
    
    try {
      const isLoginSucceeded = await login(props.user, props.id, props.password);
      
      setAlert({
        timestamp: Date.now(),
        severity: 'success',
        message: '모멘트 로그인 성공!'
      });

      setTimeout(() => {
        props.setIsAuthenticated(isLoginSucceeded)
      }, 1000);
    } catch (e) {
      setAlert({
        timestamp: Date.now(),
        severity: 'error',
        message: '아이디와 비밀번호를 확인하세요.'
      });
    }
  }
}

function handleTextFieldChange(event, setter) {
  setter(event.target.value);
}