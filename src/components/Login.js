import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login({ setLoggedIn, setUsername }) {
    const [usernameInput, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        // 로그인 API 호출
        api.post('/accounts/signin/', { username: usernameInput, password })
            .then((response) => {
                if (response.data.access) {
                    // 토큰을 localStorage에 저장
                    localStorage.setItem('accessToken', response.data.access);
                    localStorage.setItem('refreshToken', response.data.refresh);
                    localStorage.setItem('username', usernameInput);  // 사용자명도 localStorage에 저장
                    localStorage.setItem('userId', response.data.user_id);

                    // 상태 업데이트 및 페이지 이동
                    setUsername(usernameInput);
                    setLoggedIn(true);
                    navigate('/');
                } else {
                    setError('로그인 실패: 잘못된 응답 형식입니다.');
                }
            })
            .catch((error) => {
                setError('로그인 실패: 사용자명 또는 비밀번호를 확인하세요.');
                console.error('로그인 에러:', error);
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
        },
        heading: {
            textAlign: 'center',
            fontSize: '2rem',
            marginBottom: '20px',
            color: '#333',
        },
        formGroup: {
            marginBottom: '20px',
        },
        label: {
            display: 'block',
            fontSize: '1.2rem',
            marginBottom: '10px',
            color: '#333',
        },
        input: {
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '1rem',
        },
        button: {
            width: '100%',
            padding: '10px',
            backgroundColor: '#ffd700',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: '#3c6255',
        },
        buttonHover: {
            backgroundColor: '#e6c200',
        },
        errorMessage: {
            color: 'red',
            marginTop: '10px',
        },
    };

    return (
        <div style={styles.formContainer}>
            <h2 style={styles.heading}>로그인</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>아이디</label>
                    <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                {error && <p style={styles.errorMessage}>{error}</p>}
                <button type="submit" style={styles.button}>로그인</button>
            </form>
        </div>
    );
}

export default Login;

