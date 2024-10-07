import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function EvaluationDetail() {
    const { id } = useParams();  // URL에서 평가 ID 가져오기
    const [evaluation, setEvaluation] = useState(null);

    useEffect(() => {
        // 평가 상세 정보를 가져오는 API 호출
        api.get(`/evaluations/${id}/`)
            .then((response) => {
                setEvaluation(response.data);
            })
            .catch((error) => {
                console.error('에러 발생:', error);
            });
    }, [id]);

    if (!evaluation) {
        return <p>로그인 후 이용해주세요</p>;
    }

    return (
        <div>
            <h1>{evaluation.title}</h1>
            <p>{evaluation.content}</p>
            {/* 평가에 관한 추가 정보 표시 */}
        </div>
    );
}

export default EvaluationDetail;
