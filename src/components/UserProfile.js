import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom'; // useParams로 username 받아오기
import UserLikes from './UserLikes';
import UserOrderHistory from './UserOrderHistory';

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

    const handleUnblindUser = (blindUsername) => {
        const confirmUnblind = window.confirm(`${blindUsername} 님의 블라인드를 해제하시겠습니까?`);
        if (confirmUnblind) {
            api.post(`/accounts/${blindUsername}/blind/`) // 블라인드 해제 API 호출
                .then(() => {
                    // 블라인드 해제 후 UI 업데이트
                    setUserProfile(prevProfile => ({
                        ...prevProfile,
                        blind: prevProfile.blind.filter(user => user !== blindUsername), // 블라인드 리스트에서 제거
                    }));
                })
                .catch(error => {
                    console.error('블라인드 해제 중 에러 발생:', error);
                });
        }
    };

    // 인라인 스타일 정의
    const styles = {
        profileContainer: {
            maxWidth: '600px',
            margin: '50px auto',
            padding: '20px',
            backgroundColor: '#faf4e1',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
        },
        profileImage: {
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            marginBottom: '20px',
        },
        profileInfo: {
            fontSize: '1.2rem',
            marginBottom: '10px',
            color: '#333',
        },
        buttonsContainer: {
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '5px',  // 버튼 간격을 5px로 조정하여 더 가깝게 만듦
            flexWrap: 'wrap',  // 버튼이 작은 화면에서도 잘 정렬되도록 함
        },
        button: {
            backgroundColor: '#ffd700',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: '#3c6255',
            flex: 1,  // 버튼이 동일한 크기로 늘어나게 설정
            marginBottom: '10px',  // 버튼 아래 여백 추가 (작은 화면일 때 사용)
        },
        buttonHover: {
            backgroundColor: '#e6c200',
        },
        blindSection: {
            marginTop: '20px',
            textAlign: 'left',
        },
        blindList: {
            listStyleType: 'none',
            padding: 0,
        },
        blindItem: {
            marginBottom: '10px',
        },
        blindButton: {
            backgroundColor: '#ff1744',
            color: '#fff',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer',
        },
        likesSection: {
            marginTop: '30px',
        },
    };

    return (
        <div style={styles.profileContainer}>
            <h2>회원 정보</h2>
            <img
                src={userProfile.profile_image ? `https://api.sulmeulliae.com${userProfile.profile_image}` : 'https://api.sulmeulliae.com/media/profile_images/default_profile.jpeg'}
                alt="프로필 이미지"
                style={styles.profileImage}
            />
            <p style={styles.profileInfo}>이름: {userProfile.fullname}</p>
            <p style={styles.profileInfo}>닉네임: {userProfile.nickname}</p>
            <p style={styles.profileInfo}>이메일: {userProfile.email}</p>
            <p style={styles.profileInfo}>생년월일: {userProfile.birth}</p>
            <p style={styles.profileInfo}>포인트: {userProfile.points}</p>
            <p style={styles.profileInfo}>팔로잉: {userProfile.followings_count}</p>
            <p style={styles.profileInfo}>팔로워: {userProfile.followers_count}</p>

            <div style={styles.blindSection}>
                <h3>블라인드 목록</h3>
                <ul style={styles.blindList}>
                    {userProfile.blind && userProfile.blind.map((blindUser) => (
                        <li key={blindUser} style={styles.blindItem}>
                            {blindUser}
                            <button style={styles.blindButton} onClick={() => handleUnblindUser(blindUser)}>블라인드 해제
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div style={styles.buttonsContainer}>
                <Link to="/accounts/edit">
                    <button style={styles.button}>회원정보 수정</button>
                </Link>
                <Link to="/accounts/password">
                    <button style={styles.button}>비밀번호 변경</button>
                </Link>
                <Link to="/accounts/withdraw">
                    <button style={styles.button}>회원탈퇴</button>
                </Link>
            </div>

            <div style={styles.likesSection}>
                <UserLikes username={username}/>
            </div>
            <div style={styles.orderHistorySection}>
                <UserOrderHistory username={username}/>
            </div>
        </div>
    );
}

export default UserProfile;
