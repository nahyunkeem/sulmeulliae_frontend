import React, { useState } from 'react';
import api from '../services/api';

function ReviewForm({ evaluationId }) {
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const reviewData = {
            content: content,
            rating: rating,
        };

        // 리뷰 작성 API 호출
        api.post(`/evaluations/${evaluationId}/review/`, reviewData)
            .then(() => {
                setSuccess('리뷰가 성공적으로 작성되었습니다.');
                setContent('');
                setRating(0);
                setError('');
                window.location.reload();
            })
            .catch((error) => {
                setError('리뷰 작성 중 오류가 발생했습니다.');
                console.error('리뷰 작성 오류:', error);
            });
    };

    return (
        <div>
            <hr></hr>
            <h4>리뷰 작성</h4>
            <form onSubmit={handleSubmit}>
                <div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    <label>평점</label>
                    <input
                        type="number"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        min="0"
                        max="5"
                        required
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    <button type="submit">작성</button>
                </div>
            </form>
        </div>
    );
}

export default ReviewForm;
