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
            .then((response) => {
                setSuccess('리뷰가 성공적으로 작성되었습니다.');
                setContent('');
                setRating(0);
                setError('');
                window.location.reload();
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    setError(`리뷰 작성 중 오류가 발생했습니다: ${JSON.stringify(error.response.data)}`);
                    console.error('서버 오류:', error.response.data);
                } else {
                    setError('리뷰 작성 중 오류가 발생했습니다.');
                    console.error('리뷰 작성 오류:', error);
                }
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
        label: {
            display: 'block',
            fontWeight: 'bold',
            marginBottom: '5px',
        },
        input: {
            width: '80px',
            marginBottom: '10px',
            padding: '8px',
            textAlign: 'center',
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
        buttonContainer: {
            textAlign: 'center',
        },
    };

    return (
        <div style={styles.formContainer}>
            <h4>리뷰 작성</h4>
            <form onSubmit={handleSubmit}>
                <textarea
                    style={styles.textarea}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <label style={styles.label}>평점</label>
                <input
                    style={styles.input}
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    min="0"
                    max="5"
                    required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <div style={styles.buttonContainer}>
                    <button style={styles.button} type="submit">작성</button>
                </div>
            </form>
        </div>
    );
}

export default ReviewForm;
