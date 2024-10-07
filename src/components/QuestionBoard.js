import React, { useEffect, useState } from 'react';
import api from '../services/api';

function QuestionBoard() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // 질문 게시판 카테고리로 필터링
        api.get('/community/')
            .then((response) => {
                setPosts(response.data.results);
            })
            .catch((error) => {
                console.error('질문 게시판 로드 중 에러 발생:', error);
            });
    }, []);

    return (
        <div>
            <h2>질문 게시판</h2>
            {posts.length > 0 ? (
                <ul>
                    {posts
                        .filter((post) => post.category === 6)
                        .map((post) => (
                        <li key={post.id}>
                            <h3>{post.author} | {post.title}</h3>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>게시물이 없습니다.</p>
            )}
        </div>
    );
}

export default QuestionBoard;
