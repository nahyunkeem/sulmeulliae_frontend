import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function EvaluationList() {
    const [evaluations, setEvaluations] = useState([]);

    useEffect(() => {
        // 평가 리스트 API 호출
        api.get('/evaluations/')
            .then((response) => {
                setEvaluations(response.data);
            })
            .catch((error) => {
                console.error('에러 발생:', error);
            });
    }, []);

    return (
        <div>
            <h1>주류평가목록</h1>
            <ul>
                {evaluations.map((evaluation) => (
                    <li key={evaluation.id}>
                        <Link to={`/evaluations/${evaluation.id}`}>{evaluation.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default EvaluationList;
