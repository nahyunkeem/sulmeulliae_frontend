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
            if (category === '3') {
                navigate('/community/freeboard/');
            } else if (category === '5') {
                navigate('/community/discussion/');
            } else if (category === '6') {
                navigate('/community/drinkmate/');
            } else if (category === '4') {
                navigate('/community/question/');
            }
        })
        .catch(error => {
            console.error('게시글 작성 중 에러 발생:', error);
        });
    };

    return (
        <div>
            <h2>글 작성</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>제목:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>내용:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>이미지:</label>
                    <input
                        type="file"
                        multiple  // 여러 이미지 선택 가능
                        onChange={handleImageChange}
                    />
                </div>

                <div>
                    <label>카테고리:</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <option value="">선택</option>
                        <option value="3">자유 게시판</option>
                        <option value="5">토론 게시판</option>
                        <option value="6">술 메이트 게시판</option>
                        <option value="4">질문 게시판</option>
                    </select>
                </div>

                <button type="submit">작성</button>
            </form>
        </div>
    );
}

export default CreatePost;
