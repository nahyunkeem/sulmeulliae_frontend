import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

function CommunityDetail({ username, userId }) {
    const { id } = useParams();  // URL에서 게시글 ID를 가져옴
    const [post, setPost] = useState(null);
    const [liked, setLiked] = useState(false);  // 좋아요 상태
    const [likeCount, setLikeCount] = useState(0);  // 좋아요 수

    useEffect(() => {
        if (userId) {
            api.get(`/community/${id}/`)
                .then((response) => {
                    setPost(response.data);
                    setLikeCount(response.data.like_count); 
                    setLiked(response.data.likes.includes(Number(userId)));
                })
                .catch((error) => {
                    console.error('게시글 로드 중 에러 발생:', error);
                });
        }
    }, [id, userId]);

    const toggleLike = () => {
        // 좋아요 상태 토글을 위한 POST 요청
        api.post(`/community/${id}/like/`)
            .then((response) => {
                if (response.status === 200) {
                    setLiked(true);  // 좋아요 추가
                    setLikeCount((prevLikeCount) => prevLikeCount + 1);
                } else if (response.status === 204) {
                    setLiked(false);  // 좋아요 취소
                    setLikeCount((prevLikeCount) => prevLikeCount - 1);
                }
            })
            .catch((error) => {
                console.error('좋아요 상태 변경 중 에러 발생:', error);
            });
    };

    if (!post) {
        return <p></p>;
    }

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
        title: {
            fontSize: '2.5rem',
            color: '#333',
            marginBottom: '20px',
            textAlign: 'center',
        },
        author: {
            fontSize: '1.2rem',
            color: '#666',
            marginBottom: '15px',
            textAlign: 'right',
        },
        content: {
            fontSize: '1.1rem',
            lineHeight: '1.6',
            marginBottom: '20px',
        },
        imageContainer: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '20px',
        },
        image: {
            width: '100%',
            maxWidth: '500px',
            borderRadius: '10px',
            objectFit: 'contain',
            marginBottom: '15px',
        },
        info: {
            marginBottom: '15px',
            fontSize: '1rem',
            color: '#777',
        },
        likeButton: {
            backgroundColor: liked ? '#ff1744' : '#4caf50',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginBottom: '20px',
            display: 'block',
            marginLeft: 'auto',
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>{post.title}</h2>
            {post.community_image && post.community_image.length > 0 && (
                <div style={styles.imageContainer}>
                    {post.community_image.map((imageObj, index) => (
                        <img 
                            key={index} 
                            src={`https://api.sulmeulliae.com${imageObj.image_url}`}  // image_url 필드를 사용
                            alt={`community-post-${index}`} 
                            style={styles.image}
                        />
                    ))}
                </div>
            )}
            <p style={styles.content}>{post.content}</p>
            <p style={styles.author}>{post.author}</p>
            <p style={styles.info}>조회수: {post.view_count} | 좋아요: {likeCount}</p>
            <button style={styles.likeButton} onClick={toggleLike}>
                {liked ? '좋아요 취소' : '좋아요'}
            </button>
            <CommentList postId={id} username={username} userId={userId} />
            <CommentForm postId={id} />
        </div>
    );
}

export default CommunityDetail;

