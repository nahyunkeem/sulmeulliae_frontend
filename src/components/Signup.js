import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [formData, setFormData] = useState({
        fullname: '',
        nickname: '',
        birth: '',
        username: '',
        password: '',
        email: '',  // 이메일 필드 추가
        profile_image: null,
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        setFormData({
            ...formData,
            profile_image: e.target.files[0],  // 파일 선택 시 처리
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // FormData 생성
        const formDataToSend = new FormData();
        formDataToSend.append('fullname', formData.fullname);
        formDataToSend.append('nickname', formData.nickname);
        formDataToSend.append('birth', formData.birth);
        formDataToSend.append('username', formData.username);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('email', formData.email);
        if (formData.profile_image) {
            formDataToSend.append('profile_image', formData.profile_image);  // 파일이 있을 때만 추가
        }

        // 회원가입 API 호출
        api.post('/accounts/', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',  // FormData로 전송할 때 multipart 설정
            },
        })
        .then(() => {
            alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
            navigate('/login');
        })
        .catch((error) => {
            setError('회원가입 실패: 입력 정보를 확인하세요.');
            console.error('에러 발생:', error);
        });
    };

    return (
        <div>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>이름</label>
                    <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>닉네임</label>
                    <input
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>생년월일 (YYYY-MM-DD)</label>
                    <input
                        type="date"
                        name="birth"
                        value={formData.birth}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>아이디</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>이메일</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>프로필 이미지</label>
                    <input
                        type="file"
                        name="profile_image"
                        onChange={handleImageChange}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
}

export default Signup;
