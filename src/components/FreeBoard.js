import React, { useEffect, useState } from 'react';
import api from '../services/api';

function FreeBoard() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // 자유 게시판 카테고리로 게시물 요청
        api.get('/community/')  // 쿼리 파라미터로 카테고리 전달
            .then((response) => {
                setPosts(response.data.results);
            })
            .catch((error) => {
                console.error('자유 게시판 로드 중 에러 발생:', error);
            });
    }, []);

    return (
        <div>
            <h2>자유 게시판</h2>
            {posts.length > 0 ? (
                <ul>
                    {posts
                        .filter((post) => post.category === 9)
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

export default FreeBoard;
