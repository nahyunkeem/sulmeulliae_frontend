import React, { useEffect, useState } from 'react';
import api from '../services/api';

function ReviewList({ evaluationId, username, userId }) {
    const [reviews, setReviews] = useState([]);
    const [editingReviewId, setEditingReviewId] = useState(null);  // 수정 중인 리뷰 ID
    const [editContent, setEditContent] = useState('');  // 수정 중인 리뷰 내용
    const [editRating, setEditRating] = useState(0);  // 수정 중인 리뷰 평점

    useEffect(() => {
        api.get(`/evaluations/${evaluationId}/review/`)
            .then((response) => {
                const updatedReviews = response.data.map(review => ({
                    ...review,
                    liked: review.likes.includes(Number(userId))  // likes 배열에 userId가 있는지 확인
                }));
                setReviews(updatedReviews);
            })
            .catch((error) => {
                console.error('리뷰 로드 중 에러 발생:', error);
            });
    }, [evaluationId, userId]);

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

    const toggleReviewLike = (reviewId) => {
        // 리뷰 좋아요 상태 토글을 위한 POST 요청
        api.post(`/evaluations/review/${reviewId}/like/`)
            .then(() => {
                // 좋아요 상태 변경 후 리뷰 데이터를 다시 불러옴
                if (userId) {
                    api.get(`/evaluations/${evaluationId}/review/`)
                        .then((response) => {
                            setReviews(reviews.map((review) => {
                                if (review.id === reviewId) {
                                    return {
                                        ...review,
                                        like_count: review.liked ? review.like_count - 1 : review.like_count + 1,  // 좋아요 수 변경
                                        liked: !review.liked  // 좋아요 상태 토글
                                    };
                                }
                                return review;
                            }));
                        })
                        .catch((error) => {
                            console.error('리뷰 다시 로드 중 에러 발생:', error);
                        });
                    }
            })
            .catch((error) => {
                console.error('좋아요 상태 변경 중 에러 발생:', error);
            });
    };  

    const handleBlindUser = (author) => {
        const confirmBlind = window.confirm(`${author} 님을 블라인드 하시겠습니까?`);
        if (confirmBlind) {
            api.post(`/accounts/${author}/blind/`)  // 블라인드 API 호출
                .then(() => {
                    // 블라인드 성공 후 UI 업데이트
                    setReviews(reviews.filter(review => review.author !== author));  // 해당 리뷰 숨기기
                })
                .catch((error) => {
                    console.error('블라인드 중 에러 발생:', error);
                });
        }
    };

    const toggleFollowUser = (author) => {
        api.post(`/accounts/${author}/`)  // 팔로우 API 호출
            .then(() => {
                setReviews(reviews.map(review => {
                    if (review.author === author) {
                        return {
                            ...review,
                            isFollowing: !review.isFollowing  // 팔로우 상태 토글
                        };
                    }
                    return review;
                }));
            })
            .catch((error) => {
                console.error('팔로우 상태 변경 중 에러 발생:', error);
            });
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
                                    <div>{review.author}{review.author !== username && (  
                                            // 자신이 작성하지 않은 리뷰일 경우에만 블라인드, 팔로우 버튼 표시
                                            <button onClick={() => handleBlindUser(review.author)}>블라인드</button>)}
                                        {review.author !== username && (<button onClick={() => toggleFollowUser(review.author)}>
                                            {review.isFollowing ? '언팔로우' : '팔로우'}
                                        </button>)}
                                        </div>

                                    <div>{review.content}</div>
                                    <div>{review.rating} / 5</div>
                                    <div>좋아요 | {review.like_count}</div>
                                    {review.author === username ? (
                                        <div>
                                            {/* 본인이 작성한 리뷰일 경우 수정 및 삭제 버튼 */}
                                            <button onClick={() => handleEditClick(review)}>수정</button>
                                            <button onClick={() => handleDelete(review.id)}>삭제</button>
                                        </div>
                                    ) : (
                                        <div>
                                            {/* 본인이 작성하지 않은 리뷰일 경우 좋아요 버튼 */}
                                            <button onClick={() => toggleReviewLike(review.id)}>
                                                {review.liked ? '좋아요 취소' : '좋아요'}
                                            </button>
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

