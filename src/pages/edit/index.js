import './index.css';

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { logout } from '../../api/auth.js';

import { MomentLoginPage } from './login.js';
import { MomentEditorPage } from './editor.js';

export function EditIndexPage(props) {
  const params = useParams();

  useEffect(() => {
    return async () => {
      await logout();
    }
  }, []);

  // 모멘트 수정 로그인 여부
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 모멘트 수정 로그인에 필요한 정보
  const [user, setUser] = useState(params.user ? params.user : '');
  const [id, setId] = useState(params.id ? params.id : '');
  const [password, setPassword] = useState('');

  return (
    <div className={`edit-container ${isAuthenticated ? 'moment': 'login'}`}>
      <MomentLoginPage
        isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}
        user={user} setUser={setUser}
        id={id} setId={setId}
        password={password} setPassword={setPassword} />
      <MomentEditorPage
        isAuthenticated={isAuthenticated}
        user={user} setUser={setUser}
        id={id} setId={setId} />
    </div>
  )
}