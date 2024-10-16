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
            maxWidth: '1200px',
            margin: '50px auto',
            padding: '20px',
            backgroundColor: '#faf4e1',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
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
            backgroundColor: '#fff',
            transition: 'transform 0.2s',
            textAlign: 'center',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column', // 이미지와 제목을 세로로 배치
            alignItems: 'center', // 수평 가운데 정렬
        },
        image: {
            width: '150px', // 고정된 이미지 크기
            height: '150px',
            objectFit: 'contain', // 이미지가 잘리지 않고 전체가 보이도록 설정
            marginBottom: '10px',
            borderRadius: '10px',
            cursor: 'pointer',
        },
        link: {
            fontSize: '1.2rem',
            color: '#000', // 제목을 검정색으로 변경
            textDecoration: 'none',
            fontWeight: 'bold',
            marginTop: '10px', // 제목을 이미지 아래에 배치
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

