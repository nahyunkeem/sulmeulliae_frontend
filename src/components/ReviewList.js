import React, { useEffect, useState } from 'react';
import api from '../services/api';

function ReviewList({ evaluationId, username }) {
    const [reviews, setReviews] = useState([]);
    const [editingReviewId, setEditingReviewId] = useState(null);  // 수정 중인 리뷰 ID
    const [editContent, setEditContent] = useState('');  // 수정 중인 리뷰 내용
    const [editRating, setEditRating] = useState(0);  // 수정 중인 리뷰 평점

    useEffect(() => {
        api.get(`/evaluations/${evaluationId}/review/`)
            .then((response) => {
                setReviews(response.data);
            })
            .catch((error) => {
                console.error('리뷰 로드 중 에러 발생:', error);
            });
    }, [evaluationId]);

    const handleEditClick = (review) => {
        setEditingReviewId(review.id);
        setEditContent(review.content);
        setEditRating(review.rating);
    };

    const handleEditSubmit = (reviewId) => {
        const updatedReview = {
            content: editContent,
            rating: editRating,
        };

        // 리뷰 수정 API 호출
        api.put(`/evaluations/review/${reviewId}/`, updatedReview)
            .then((response) => {
                // 리뷰 수정 완료 후 업데이트
                setReviews(reviews.map(review => (review.id === reviewId ? response.data : review)));
                setEditingReviewId(null);  // 수정 모드 종료
            })
            .catch((error) => {
                console.error('리뷰 수정 중 에러 발생:', error);
            });
    };
    
    const handleDelete = (reviewId) => {
        const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
        if (confirmDelete) {
            // 리뷰 삭제 API 호출
            api.delete(`/evaluations/review/${reviewId}/`)
                .then(() => {
                    setReviews(reviews.filter((review) => review.id !== reviewId));  // 삭제된 리뷰를 필터링
                })
                .catch((error) => {
                    console.error('리뷰 삭제 중 에러 발생:', error);
                });
        }
    };

    return (
        <div>
            <h2>리뷰</h2>
            {reviews.length > 0 ? (
                <ul>
                    {reviews.map((review) => (
                        <li key={review.id}>
                            {editingReviewId === review.id ? (
                                // 수정 모드
                                <div>
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        value={editRating}
                                        onChange={(e) => setEditRating(e.target.value)}
                                        min="0"
                                        max="5"
                                    />
                                    <button onClick={() => handleEditSubmit(review.id)}>저장</button>
                                    <button onClick={() => setEditingReviewId(null)}>취소</button>
                                </div>
                            ) : (
                                // 기본 리뷰 보기 모드
                                <div>
                                    <div>{review.author}</div>
                                    <div>{review.content}</div>
                                    <div>{review.rating} / 5</div>
                                    {review.author === username && (
                                        <div>
                                            <button onClick={() => handleEditClick(review)}>수정</button>
                                            <button onClick={() => handleDelete(review.id)}>삭제</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>리뷰가 없습니다.</p>
            )}
        </div>
    );
}

export default ReviewList;

