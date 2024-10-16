import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function UserPasswordChange() {
    const [passwords, setPasswords] = useState({
        old_password: '',
        new_password: '',
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswords({
            ...passwords,
            [name]: value,
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        api.post('/accounts/password_update/', passwords)
        .then(response => {
            alert('비밀번호가 성공적으로 변경되었습니다.');
            navigate(`/profile/${localStorage.getItem('username')}`);
        })
        .catch(error => {
            console.error('Error updating password:', error);
            alert('비밀번호 변경 중 오류가 발생했습니다.');
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
            boxSizing: 'border-box',  // 패딩을 포함한 너비 계산
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
            width: 'calc(100% - 20px)',  // 패딩을 고려한 너비 설정
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            boxSizing: 'border-box',
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
    };

    return (
        <div style={styles.formContainer}>
            <h2 style={styles.heading}>비밀번호 변경</h2>
            <form onSubmit={handleFormSubmit}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>기존 비밀번호:</label>
                    <input 
                        type="password" 
                        name="old_password" 
                        value={passwords.old_password} 
                        onChange={handleInputChange} 
                        required 
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>새 비밀번호:</label>
                    <input 
                        type="password" 
                        name="new_password" 
                        value={passwords.new_password} 
                        onChange={handleInputChange} 
                        required 
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>변경하기</button>
            </form>
        </div>
    );
}

export default UserPasswordChange;
