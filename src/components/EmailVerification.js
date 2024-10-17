import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';

function EmailVerification() {
    const { uidb64, token } = useParams(); // URL 파라미터에서 uidb64와 token 가져오기
    const [message, setMessage] = useState('');

    useEffect(() => {
        // 이메일 인증 API 호출
        api.get(`/accounts/verify-email/${uidb64}/${token}/`)
            .then((response) => {
                setMessage('메일이 인증되었습니다.');
            })
            .catch((error) => {
                setMessage('메일 인증 중 에러가 발생했습니다.');
                console.log('메일 인증 에러:', error);
            });
    }, [uidb64, token]);

    // 인라인 스타일 정의
    const styles = {
        container: {
            maxWidth: '600px',
            margin: '100px auto', // 중앙 정렬과 여백
            padding: '20px',
            backgroundColor: '#faf4e1',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            textAlign: 'center', // 텍스트 가운데 정렬
        },
        message: {
            fontSize: '1.5rem',
            color: '#333',
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.message}>{message}</h1>
        </div>
    );
}

export default EmailVerification;
