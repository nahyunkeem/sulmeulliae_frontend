import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom'; // useParams로 username 받아오기
import UserLikes from './UserLikes';

function UserProfile() {
    const { username } = useParams(); // URL에서 username 받아오기
    const [userProfile, setUserProfile] = useState({});

    useEffect(() => {
        api.get(`/accounts/${username}/`) // username을 포함한 API 요청
            .then(response => {
                setUserProfile(response.data);
            })
            .catch(error => {
                console.error('Error fetching user information:', error);
            });
    }, [username]); // username이 바뀔 때마다 API 요청
    
    // profile_image가 있는지 확인하여 이미지 URL 설정
    const profileImageSrc = userProfile.profile_image
        ? `https://api.sulmeulliae.com${userProfile.profile_image}`
        : 'https://api.sulmeulliae.com/media/profile_images/default_profile.jpeg';

    return (
        <div>
            <h2>회원 정보</h2>
            <img
                src={profileImageSrc} // 미리 정의한 profileImageSrc 사용
                alt="프로필 이미지"
                style={{ width: '150px', height: '150px', borderRadius: '50%' }}
            />
            <p>이름: {userProfile.fullname}</p>
            <p>닉네임: {userProfile.nickname}</p>
            <p>이메일: {userProfile.email}</p>
            <p>생년월일: {userProfile.birth}</p>
            <p>포인트: {userProfile.points}</p>
            <Link to="/accounts/edit"><button>회원정보 수정</button></Link>
            <Link to="/accounts/password"><button>비밀번호 변경</button></Link>
            <Link to="/accounts/withdraw"><button>회원탈퇴</button></Link>
            <div>
                <UserLikes username={username} />
            </div>
        </div>
    );
}

export default UserProfile;
