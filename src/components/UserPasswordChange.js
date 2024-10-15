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

    return (
        <div>
            <h2>비밀번호 변경</h2>
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label>기존 비밀번호:</label>
                    <input 
                        type="password" 
                        name="old_password" 
                        value={passwords.old_password} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
                <div>
                    <label>새 비밀번호:</label>
                    <input 
                        type="password" 
                        name="new_password" 
                        value={passwords.new_password} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
                <button type="submit">변경하기</button>
            </form>
        </div>
    );
}

export default UserPasswordChange;
