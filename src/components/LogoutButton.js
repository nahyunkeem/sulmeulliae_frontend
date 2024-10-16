import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton({ handleLogout }) {
    const navigate = useNavigate();

    const onLogoutClick = () => {
        handleLogout(); // 로그아웃 처리
        navigate('/');  // 홈으로 이동
    };

    return (
        <button onClick={onLogoutClick} style={{
            backgroundColor: '#ffd700',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: '#3c6255',
            marginLeft: '10px',
        }}>
            로그아웃
        </button>
    );
}

export default LogoutButton;
