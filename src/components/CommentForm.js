import React, { useState } from 'react';
import api from '../services/api';

function ReviewForm({ postId }) {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const commentData = {
            content: content,
        };

        // 리뷰 작성 API 호출
        api.post(`/community/${postId}/comment/`, commentData)
            .then(() => {
                setSuccess('댓글이 성공적으로 작성되었습니다.');
                setContent('');
                setError('');
                window.location.reload();
            })
            .catch((error) => {
                setError('댓글 작성 중 오류가 발생했습니다.');
                console.error('리뷰 작성 오류:', error);
            });
    };

    return (
        <div>
            <hr></hr>
            <h4>댓글 작성</h4>
            <form onSubmit={handleSubmit}>
                <div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
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
