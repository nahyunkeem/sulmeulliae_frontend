import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [category, setCategory] = useState('');
    const navigate = useNavigate();

    const handleImageChange = (event) => {
        setImages(event.target.files);  // 여러 이미지 선택
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!category) {
            alert('카테고리를 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('category', category);
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);  // 여러 이미지 추가
        }

        api.post('/community/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            console.log('게시글 작성 성공:', response.data);
            // 카테고리에 따라 해당 게시판으로 이동
            if (category === '3') {
                navigate('/community/freeboard/');
            } else if (category === '3') {
                navigate('/community/discussion/');
            } else if (category === '3') {
                navigate('/community/question/');
            }
        })
        .catch(error => {
            console.error('게시글 작성 중 에러 발생:', error);
        });
    };

    // 인라인 스타일 정의 (자유게시판과 일관된 스타일)
    const styles = {
        formContainer: {
            maxWidth: '1200px',  // 컨테이너를 더 넓게 설정
            margin: '50px auto',
            padding: '30px',
            backgroundColor: '#faf4e1',  // 자유게시판과 같은 배경색
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        },
        heading: {
            fontSize: '2.5rem',
            marginBottom: '30px',
            textAlign: 'center',
            color: '#333',
        },
        formGroup: {
            marginBottom: '20px',
        },
        label: {
            display: 'block',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#333',
        },
        input: {
            width: '100%',
            padding: '15px',
            paddingRight: '20px',  // 오른쪽 여백 추가
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            boxSizing: 'border-box',  // 패딩과 테두리가 너비에 포함되도록 설정
        },
        textarea: {
            width: '100%',
            height: '200px',
            padding: '15px',
            paddingRight: '20px',  // 오른쪽 여백 추가
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            resize: 'none',  // 사용자가 크기 조절 불가능하게 설정
            boxSizing: 'border-box',  // 패딩과 테두리가 너비에 포함되도록 설정
        },
        select: {
            width: '100%',
            padding: '15px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '1rem',
        },
        fileInput: {
            width: '100%',
            padding: '10px 0',
        },
        button: {
            display: 'block',
            width: '100%',
            padding: '15px',
            backgroundColor: '#ff1744',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginTop: '30px',
        },
        buttonHover: {
            backgroundColor: '#d50000',
        },
    };

    return (
        <div style={styles.formContainer}>
            <h2 style={styles.heading}>글 작성</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>제목:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>내용:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        style={styles.textarea}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>이미지:</label>
                    <input
                        type="file"
                        multiple  // 여러 이미지 선택 가능
                        onChange={handleImageChange}
                        style={styles.fileInput}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>카테고리:</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} required style={styles.select}>
                        <option value="">선택</option>
                        <option value="3">자유 게시판</option>
                        <option value="5">토론 게시판</option>
                        <option value="4">질문 게시판</option>
                    </select>
                </div>

                <button type="submit" style={styles.button}>작성</button>
            </form>
        </div>
    );
}

export default CreatePost;

