import './create.css';

import { useState } from 'react';

import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { isExistedMoment, createMoment } from '../api/firestore.js';
import { AlertSnackbar } from '../components/AlertSnackbar.js';

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

  // 모멘트 생성에 필요한 정보
  const [user, setUser] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordReEntered, setPasswordReEntered] = useState('');

  // alert 출력 상태
  const [alert, setAlert] = useState({
    timestamp: null,
    severity: null, // error | warning | info | success
    message: ''
  });

  const [inputError, setInputError] = useState({
    user: {
      status: false,
      text: ''
    },
    id: {
      status: false,
      text: ''
    },
    password: {
      status: false,
      text: ''
    },
    passwordReEntered: {
      status: false,
      text: ''
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
        <div className='url'>
          <p>생성될 모멘트의 URL</p>
          <p><span>https://temp-moment.web.app</span><wbr/>/{user}<wbr/>/{id}</p>
        </div>
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
      <div className='button-container'>
        <Button
          className='button'
          fullWidth
          variant='contained'
          sx={{ // disabled 다크모드 스타일링 지원
            '&.Mui-disabled': {
              background: 'var(--sub-text)',
              color: 'var(--background)'
            }
          }}
          disabled={disabledCreateButton()}
          onClick={() => create()} >
            모멘트 생성
        </Button>
      </div>
      <AlertSnackbar alert={alert} />
    </div>
  )

  /**
   * 모멘트 생성 버튼 disabled 로직
   * @returns {boolean} disabled
   */
  function disabledCreateButton() {
    let hasInputError = Object.values(inputError).includes(error => error.status);
    let hasEmptyInput = [user, id, password, passwordReEntered].includes('');

    return hasInputError || hasEmptyInput; 
  }

  /**
   * input 텍스트 수정 시 state 처리, text error field 핸들링
   */
  function handleTextFieldChange(event, state, setter) {
    setter(event.target.value);
    
    let newInputError = {...inputError};
    newInputError[state].status = getErrorStatus(event.target.value, state);
    newInputError[state].text = getErrorText(event.target.value, state);

    // 비밀번호 일치 여부
    if (state === 'password') {
      newInputError['passwordReEntered'].status = getErrorStatus(passwordReEntered, 'passwordReEntered', event.target.value);
      newInputError['passwordReEntered'].text = getErrorText(passwordReEntered, 'passwordReEntered', event.target.value);
    }

    setInputError(newInputError);
  }

  /**
   * 특정 텍스트 필드의 에러 발생 여부 반환
   * @returns {boolean} isError
   */
  function getErrorStatus(txt, state, pw) {
    switch (state) {
      case 'user':
      case 'id':
        return /[a-zA-Z0-9_]*/.exec(txt)[0] !== txt;
      case 'password':
        return txt.length < 6;
      case 'passwordReEntered':
        return pw ? txt !== '' && txt !== pw :  txt !== password; 
      default:
        return false;
    }
  }

  /**
   * 특정 텍스트 필드의 에러 발생 시 안내 텍스트 반환
   * @returns {string} helperText
   */
  function getErrorText(txt, state, pw) {
    switch (state) {
      case 'user':
      case 'id':
        return getErrorStatus(txt, state, pw) ? '영문자, 숫자, _로 이루어져야 합니다.' : '';
      case 'password':
        return getErrorStatus(txt, state, pw) ? '6자 이상이어야 합니다.' : '';
      case 'passwordReEntered':
        return getErrorStatus(txt, state, pw) ? '입력한 비밀번호와 일치하지 않습니다.' : '';
      default:
        return '';
    }
  }

  /**
   * 모멘트 생성 로직
   */
  async function create() {
    try {
      // 존재하는 경로일 경우 핸들링
      const isMomentExisted = await isExistedMoment(user, id);
      if (isMomentExisted) {
        setAlert({
          timestamp: Date.now(),
          severity: 'error',
          message: `이미 모멘트가 생성된 경로입니다.`
        });
        return;
      }

      // 모멘트 페이지 생성
      await createMoment(user, id, password);

      setAlert({
        timestamp: Date.now(),
        severity: 'success',
        message: '모멘트 생성! 편집 페이지로 이동합니다...'
      });
      setTimeout(() => {
        window.location.replace('/edit');
      }, 2000);
    } catch (error) {
      console.error(error);
      setAlert({
        timestamp: Date.now(),
        severity: 'error',
        message: '내부적인 오류로 생성 불가'
      });
    }
  }
}