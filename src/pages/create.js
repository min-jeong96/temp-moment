import './create.css';

import { useState } from 'react';

import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const InputTextField = styled(TextField)({
  margin: '16px 0 0',
  '& label': {
    color: 'var(--sub-text)'
  },
  '& label.Mui-focused': {
    color: 'var(--primary)',
  },
  '& label.Mui-error': {
    color: '#d32f2f',
  },
  '& .MuiOutlinedInput-root': { 
    color: 'var(--text)',
    '& fieldset': {
      borderColor: 'var(--sub-text)',
    },
  },
});

export function CreatePage(props) {
  const [user, setUser] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordReEntered, setPasswordReEntered] = useState('');

  const [inputError, setInputError] = useState({
    user: {
      status: false,
      text: '영문자, 숫자, _로 이루어져야 합니다.'
    },
    id: {
      status: false,
      text: '영문자, 숫자, _로 이루어져야 합니다.'
    },
    password: {
      status: false,
      text: '6자 이상이어야 합니다.'
    },
    passwordReEntered: {
      status: false,
      text: '입력한 비밀번호와 일치하지 않습니다.'
    }
  });

  return (
    <div className='container'>
      <div className='card'>
        <p className='title'>모멘트를 생성하세요!</p>
        <div className='description'>
          <p>모멘트 생성자의 트위터 ID, 모멘트를 식별할 ID, 로그인 시 사용할 비밀번호를 입력하세요.</p>
          <p>입력하신 정보는 url 생성에 사용되고 모멘트 수정 및 삭제 시 로그인에 필요합니다.</p>
        </div>
        <ul className='warnings'>
          <li>트위터 ID, 모멘트 ID에는 <span>영문자, 숫자, underscore(_)</span>만 입력 가능합니다.</li>
          <li>한 번 설정한 트위터 ID, 모멘트 ID, 비밀번호는 생성 후 <span>변경이 불가능</span>합니다. (삭제만 가능합니다.)</li>
          <li>한 트위터 ID에 동일한 모멘트 ID로 2개 이상 모멘트를 생성할 수 없습니다.</li>
          <li><span>비밀번호 찾기 및 재설정 기능이 없습니다.</span> 비밀번호 분실 시 모멘트 수정 및 삭제가 불가능합니다. 설정 시 유의해 주세요.</li>
        </ul>
        <div className='form'>
          <InputTextField
            id='moment-user'
            label='트위터 ID'
            variant='outlined'
            value={user}
            type='text'
            onChange={(e) => handleTextFieldChange(e, 'user', setUser)}
            error={inputError.user.status}
            helperText={inputError.user.text} />
          <InputTextField
            id='moment-id'
            label='모멘트 ID'
            variant='outlined'
            value={id}
            type='text'
            onChange={(e) => handleTextFieldChange(e, 'id', setId)}
            error={inputError.id.status}
            helperText={inputError.id.text} />
          <InputTextField
            id='moment-password'
            label='비밀번호'
            variant='outlined'
            value={password}
            type='password'
            onChange={(e) => handleTextFieldChange(e, 'password', setPassword)}
            error={inputError.password.status}
            helperText={inputError.password.text} />
          <InputTextField
            id='moment-password-re-enter'
            label='비밀번호 재입력'
            variant='outlined'
            value={passwordReEntered}
            type='password'
            onChange={(e) => handleTextFieldChange(e, 'passwordReEntered', setPasswordReEntered)}
            error={inputError.passwordReEntered.status}
            helperText={inputError.passwordReEntered.text} />
        </div>
      </div>
    </div>
  )

  function handleTextFieldChange(event, state, setter) {
    setter(event.target.value);
    
    let newInputError = {...inputError};
    newInputError[state].status = getErrorStatus(event.target.value, state);

    // 비밀번호 일치 여부
    if (state === 'password') {
      newInputError['passwordReEntered'].status = getErrorStatus(passwordReEntered, 'passwordReEntered', event.target.value);
    }

    setInputError(newInputError);
  }

  function getErrorStatus(txt, state, pw) {
    switch (state) {
      case 'user':
      case 'id':
        return /[a-zA-Z0-9_]*/.exec(txt)[0] !== txt;
      case 'password':
        return txt.length < 6;
      case 'passwordReEntered':
        return pw ? txt !== pw : txt !== password; 
      default:
        return false;
    }
  }
}