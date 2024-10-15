import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function UserProfileEdit() {
    const [userInfo, setUserInfo] = useState({
        fullname: '',
        nickname: '',
        profile_image: null,  // 이미지 초기화
    });

    const [previewImage, setPreviewImage] = useState(null);  // 이미지 미리보기 설정
    const navigate = useNavigate();

    useEffect(() => {
        // 초기 데이터 가져오기 (회원정보 불러오기)
        api.get(`/accounts/${localStorage.getItem('username')}/`)
            .then(response => {
                setUserInfo({
                    fullname: response.data.fullname,
                    nickname: response.data.nickname,
                    profile_image: response.data.profile_image,
                });
                setPreviewImage(response.data.profile_image);  // 프로필 이미지 미리보기
            })
            .catch(error => {
                console.error('Error fetching user information:', error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setUserInfo({
            ...userInfo,
            profile_image: file,
        });
        setPreviewImage(URL.createObjectURL(file));  // 이미지 미리보기
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nickname', userInfo.nickname);  // 이름은 수정 불가
        if (userInfo.profile_image instanceof File) {
            formData.append('profile_image', userInfo.profile_image);  // 새로운 파일이 있는 경우에만 첨부
        }

        // PUT 요청으로 회원정보 수정하기
        api.put('/accounts/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,  // 토큰을 함께 보내기
            },
        })
        .then(response => {
            alert('회원 정보가 성공적으로 수정되었습니다.');
            navigate(`/profile/${localStorage.getItem('username')}`);  // 수정 후 프로필 페이지로 이동
        })
        .catch(error => {
            console.error('Error updating user profile:', error);
            alert('회원 정보 수정 중 오류가 발생했습니다.');
        });
    };

    return (
        <div>
            <h2>회원 정보 수정</h2>
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label>이름: {userInfo.fullname}</label>  {/* 이름은 읽기만 가능 */}
                </div>
                <div>
                    <label>닉네임:</label>
                    <input 
                        type="text" 
                        name="nickname" 
                        value={userInfo.nickname} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
                <div>
                    <label>프로필 이미지:</label>
                    <input 
                        type="file" 
                        name="profile_image" 
                        onChange={handleFileChange} 
                    />
                    {previewImage && <img src={previewImage} alt="미리보기" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />}
                </div>
                <button type="submit">수정하기</button>
            </form>
        </div>
    );
}

export default UserProfileEdit;

