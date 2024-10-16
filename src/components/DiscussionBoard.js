import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function DiscussionBoard() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // 토론 게시판 카테고리로 게시물 요청
        api.get('/community/')
            .then((response) => {
                setPosts(response.data);
            })
            .catch((error) => {
                console.error('토론 게시판 로드 중 에러 발생:', error);
            });
    }, []);

    // 인라인 스타일 정의
    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '50px auto',
            padding: '20px',
            backgroundColor: '#faf4e1',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
        },
        heading: {
            fontSize: '2rem',
            color: '#3c6255',
            textAlign: 'left',
        },
        button: {
            backgroundColor: '#ff1744',
            color: '#fff',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
        },
        postList: {
            listStyleType: 'none',
            padding: 0,
        },
        postItem: {
            backgroundColor: '#fff',
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '10px',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
        },
        postLink: {
            textDecoration: 'none',
            color: '#333',
            fontSize: '1.2rem',
            fontWeight: 'bold',
        },
        postAuthor: {
            fontSize: '1rem',
            color: '#666',
            marginRight: '10px',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.heading}>토론 게시판</h2>
                <Link to="/community/create">
                    <button style={styles.button}>글 작성</button>
                </Link>
            </div>
            {posts.length > 0 ? (
                <ul style={styles.postList}>
                    {posts
                        .filter((post) => post.category === 5) // 카테고리 5는 토론 게시판
                        .map((post) => (
                            <li key={post.id} style={styles.postItem}>
                                <Link to={`/community/${post.id}`} style={styles.postLink}>
                                    <span style={styles.postAuthor}>{post.author}</span> | {post.title}
                                </Link>
                            </li>
                        ))}
                </ul>
            ) : (
                <p>게시물이 없습니다.</p>
            )}
        </div>
    );
}

export default DiscussionBoard;
