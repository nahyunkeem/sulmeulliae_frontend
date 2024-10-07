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
        // 평가 상세 정보를 가져오는 API 호출
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

    return (
        <div>
            <h3>{evaluation.title}</h3>
            {evaluation.images && evaluation.images.length > 0 && (
                <div>
                    {evaluation.images.map((imageObj, index) => (
                        <img 
                            key={index} 
                            src={`http://localhost:8000${imageObj.image}`}
                            alt={`evaluation ${index}`} 
                            style={{ maxWidth: '100%', margin: '10px 0' }} 
                        />
                    ))}
                </div>
            )}
            <p>주종 | {evaluation.category}</p>
            <p>규격 | {evaluation.size}</p>
            <p>ABV | {evaluation.ABV}%</p>
            <p>원산지 | {evaluation.origin}</p>
            <p>주재료 | {evaluation.ingredient}</p>
            <p>평점 | {evaluation.avg_rating}</p>
            <p>{evaluation.content}</p>
            <p>좋아요 | {likeCount}</p>
            <p>조회수 | {evaluation.viewcounts}</p>
            <button onClick={toggleLike}>
                {liked ? '좋아요 취소' : '좋아요'}
            </button>
            <ReviewList evaluationId={id} username={username} userId={userId}/>
            <ReviewForm evaluationId={id} />
        </div>
    );
}

export default EvaluationDetail;
