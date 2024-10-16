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

    // 인라인 스타일 정의
    const styles = {
        container: {
            padding: '20px',
            backgroundColor: '#faf4e1',
        },
        heading: {
            fontSize: '2rem',
            color: '#3c6255',
            textAlign: 'center',
            marginBottom: '20px',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)', // 한 줄에 다섯 개씩
            gap: '20px',
            listStyleType: 'none',
            padding: 0,
        },
        listItem: {
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '15px',
            backgroundColor: '#fff',
            transition: 'transform 0.2s',
            textAlign: 'center',
        },
        image: {
            width: '150px', // 고정된 이미지 크기
            height: '150px',
            objectFit: 'cover', // 이미지 크기에 맞게 조정
            marginBottom: '10px',
            borderRadius: '10px',
            cursor: 'pointer',
        },
        link: {
            fontSize: '1.2rem',
            color: '#000', // 제목을 검정색으로 변경
            textDecoration: 'none',
            fontWeight: 'bold',
        },
        linkHover: {
            color: '#ffd700',
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>주류평가목록</h1>
            <ul style={styles.grid}>
                {evaluations.map((evaluation, index) => (
                    <li key={evaluation.id} style={styles.listItem}>
                        <Link to={`/evaluations/${evaluation.id}`}>
                            {evaluation.images && evaluation.images[0] && (
                                <img
                                    src={`https://api.sulmeulliae.com${evaluation.images[0].image}`}
                                    alt={`evaluation ${index}`}
                                    style={styles.image}
                                />
                            )}
                        </Link>
                        <Link to={`/evaluations/${evaluation.id}`} style={styles.link}>
                            {evaluation.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default EvaluationList;
