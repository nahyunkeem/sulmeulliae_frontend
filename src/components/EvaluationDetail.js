import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

function EvaluationDetail({ username, userId }) {
    const { id } = useParams();  // URL에서 평가 ID 가져오기
    const [evaluation, setEvaluation] = useState(null);
    const [liked, setLiked] = useState(true);  // 좋아요 상태
    const [likeCount, setLikeCount] = useState(0);  // 좋아요 수

    useEffect(() => {
        if (userId) {
            api.get(`/evaluations/${id}/`)
                .then((response) => {
                    setEvaluation(response.data);
                    setLikeCount(response.data.like_count);
                    if (response.data.likes.includes(Number(userId))) {
                        setLiked(true);
                    } else {
                        setLiked(false);
                    }
                })
                .catch((error) => {
                    console.error('에러 발생:', error);
                });
        }
    }, [id, userId]);

    const toggleLike = () => {
        // 좋아요 상태 토글을 위한 POST 요청
        api.post(`/evaluations/${id}/like/`)
            .then((response) => {
                if (response.status === 200) {
                    setLiked(true);  // 좋아요 추가
                    setLikeCount(prevLikeCount => prevLikeCount + 1);
                } else if (response.status === 204) {
                    setLiked(false);  // 좋아요 취소
                    setLikeCount(prevLikeCount => prevLikeCount - 1); 
                }
            })
            .catch((error) => {
                console.error('좋아요 상태 변경 중 에러 발생:', error);
            });
    };

    if (!evaluation) {
        return <p>로그인 후 이용해주세요</p>;
    }

    // 스타일 정의
    const styles = {
        container: {
            width: '100%', // 전체 너비
            margin: '50px auto', // 네브바와 간격
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '10px',
            backgroundColor: '#faf4e1', // 일관된 배경색
        },
        title: {
            fontSize: '2rem',
            color: '#333',
            textAlign: 'center',
            marginBottom: '15px',
        },
        imageContainer: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap', // 이미지가 여러 개일 때 줄바꿈
            gap: '10px', // 이미지 간 간격
        },
        image: {
            width: '300px', // 이미지 크기 확대
            height: '300px',
            objectFit: 'contain', // 이미지가 짤리지 않도록 설정
            marginBottom: '15px',
            borderRadius: '10px',
        },
        details: {
            textAlign: 'center', // 가운데 정렬
            marginBottom: '10px',
            color: '#555',
        },
        button: {
            display: 'block',
            width: '150px', // 버튼 크기 조절
            padding: '10px',
            backgroundColor: '#ff1744', // 빨간색으로 변경
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            margin: '15px auto', // 가운데 정렬
        },
        buttonHover: {
            backgroundColor: '#d50000', // Hover 시 조금 더 진한 빨간색
        },
        likeInfo: {
            textAlign: 'center',
            marginBottom: '20px',
        }
    };

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>{evaluation.title}</h3>
            {evaluation.images && evaluation.images.length > 0 && (
                <div style={styles.imageContainer}>
                    {evaluation.images.map((imageObj, index) => (
                        <img 
                            key={index} 
                            src={`https://api.sulmeulliae.com${imageObj.image}`}
                            alt={`evaluation ${index}`} 
                            style={styles.image} 
                        />
                    ))}
                </div>
            )}
            <p style={styles.details}>주종 | {evaluation.category}</p>
            <p style={styles.details}>규격 | {evaluation.size}</p>
            <p style={styles.details}>ABV | {evaluation.ABV}%</p>
            <p style={styles.details}>원산지 | {evaluation.origin}</p>
            <p style={styles.details}>주재료 | {evaluation.ingredient}</p>
            <p style={styles.details}>평점 | {evaluation.avg_rating}</p>
            <p style={styles.details}>{evaluation.content}</p>
            <div style={styles.likeInfo}>
                <p>좋아요 | {likeCount}</p>
                <p>조회수 | {evaluation.viewcounts}</p>
            </div>
            <button style={styles.button} onClick={toggleLike}>
                {liked ? '좋아요 취소' : '좋아요'}
            </button>
            <ReviewList evaluationId={id} username={username} userId={userId}/>
            <ReviewForm evaluationId={id} />
        </div>
    );
}

export default EvaluationDetail;
