import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function FreeBoard() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // 자유 게시판 카테고리로 게시물 요청
        api.get('/community/')
            .then((response) => {
                setPosts(response.data);
            })
            .catch((error) => {
                console.error('자유 게시판 로드 중 에러 발생:', error);
            });
    }, []);

    return (
        <div>
            <h2>자유 게시판</h2>
            <Link to="/community/create">
                <button>글 작성</button>
            </Link>
            {posts.length > 0 ? (
                <ul>
                    {posts
                        .filter((post) => post.category === 3)
                        .map((post) => (
                        <li key={post.id}>
                            <Link to={`/community/${post.id}`}>{post.author} | {post.title}</Link>
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
