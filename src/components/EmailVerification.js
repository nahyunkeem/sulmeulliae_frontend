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
                setMessage('메일이 인증 중 에러가 발생 되었습니다.');
                console.log('메일 인증 에러');
            });
    }, [uidb64, token]);

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
}

export default EmailVerification;
