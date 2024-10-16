import React, { useState } from 'react';
import api from '../services/api';

function CommentForm({ postId }) {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const commentData = {
            content: content,
        };

        // 댓글 작성 API 호출
        api.post(`/community/${postId}/comment/`, commentData)
            .then(() => {
                setSuccess('댓글이 성공적으로 작성되었습니다.');
                setContent('');
                setError('');
                window.location.reload();
            })
            .catch((error) => {
                setError('댓글 작성 중 오류가 발생했습니다.');
                console.error('댓글 작성 오류:', error);
            });
    };

    // 인라인 스타일 정의
    const styles = {
        formContainer: {
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '10px',
            textAlign: 'center',
        },
        textarea: {
            width: '100%',
            height: '100px',
            marginBottom: '10px',
        },
        button: {
            backgroundColor: '#ff1744',
            color: '#fff',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px',
        },
    };

    return (
        <div style={styles.formContainer}>
            <h4>댓글 작성</h4>
            <form onSubmit={handleSubmit}>
                <textarea
                    style={styles.textarea}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <button style={styles.button} type="submit">작성</button>
            </form>
        </div>
    );
}

export default CommentForm;

