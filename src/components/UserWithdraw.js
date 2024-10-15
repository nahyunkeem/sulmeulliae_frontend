import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function UserDelete() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleDeleteAccount = () => {
        // 회원탈퇴 API로 DELETE 요청
        api.delete('/accounts/', {
            data: { password: password },
        })
        .then(() => {
            alert('회원탈퇴가 완료되었습니다.');
            // 로컬스토리지의 로그인 정보 삭제
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            // 회원탈퇴 후  메인페이지
            navigate('/');
        })
        .catch((error) => {
            setError('비밀번호가 일치하지 않거나 오류가 발생했습니다.');
        });
    };

    return (
        <div>
            <h2>회원탈퇴</h2>
            <p>비밀번호를 입력하고 회원탈퇴를 진행하세요.</p>
            <input 
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleDeleteAccount}>회원탈퇴</button>
            {error && <p>{error}</p>}
        </div>
    );
}

export default UserDelete;
