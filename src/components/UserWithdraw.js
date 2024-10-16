import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function UserDelete() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleDeleteAccount = () => {
        api.delete('/accounts/', {
            data: { password: password },
        })
        .then(() => {
            alert('회원탈퇴가 완료되었습니다.');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            navigate('/');
        })
        .catch((error) => {
            setError('비밀번호가 일치하지 않거나 오류가 발생했습니다.');
        });
    };

    // 스타일 정의
    const styles = {
        formContainer: {
            maxWidth: '600px',
            margin: '50px auto',
            padding: '20px',
            backgroundColor: '#faf4e1',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            boxSizing: 'border-box',  // 패딩 포함하여 컨테이너 설정
        },
        heading: {
            textAlign: 'center',
            fontSize: '2rem',
            marginBottom: '20px',
            color: '#333',
        },
        input: {
            width: 'calc(100% - 20px)',  // 패딩을 고려하여 너비 설정
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            marginBottom: '20px',
            boxSizing: 'border-box',
        },
        button: {
            width: '100%',
            padding: '10px',
            backgroundColor: '#ff1744',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: '#fff',
        },
        buttonHover: {
            backgroundColor: '#d50000',
        },
        errorMessage: {
            color: 'red',
            marginTop: '10px',
        },
    };

    return (
        <div style={styles.formContainer}>
            <h2 style={styles.heading}>회원탈퇴</h2>
            <p>비밀번호를 입력하고 회원탈퇴를 진행하세요.</p>
            <input 
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleDeleteAccount} style={styles.button}>회원탈퇴</button>
            {error && <p style={styles.errorMessage}>{error}</p>}
        </div>
    );
}

export default UserDelete;
