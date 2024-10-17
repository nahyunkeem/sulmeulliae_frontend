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
    const [isFollowing, setIsFollowing] = useState(false);  // 팔로우 상태

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

    useEffect(() => {
        if (username && post) {
            api.get(`/accounts/${username}/`)
                .then((response) => {
                    const followings = response.data.followings; // 사용자의 팔로잉 목록
                    const followingStatus = followings.includes(post.author);
                    setIsFollowing(followingStatus);
                })
                .catch((error) => {
                    console.error('팔로우 상태 로드 중 에러 발생:', error);
                });
        }
    }, [username, post]);

    const toggleLike = () => {
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

    const handleBlindUser = (author) => {
        const confirmBlind = window.confirm(`${author} 님을 블라인드 하시겠습니까?`);
        if (confirmBlind) {
            api.post(`/accounts/${author}/blind/`)
                .then(() => {
                    if (post.author === author) {
                        setPost(null);  // 블라인드된 작성자가 작성한 글은 숨김
                    }
                })
                .catch((error) => {
                    console.error('블라인드 중 에러 발생:', error);
                });
        }
    };

    const toggleFollowUser = () => {
        api.post(`/accounts/${post.author}/`)  // 팔로우/언팔로우 API 호출
            .then(() => {
                setIsFollowing(!isFollowing);  // 팔로우 상태 토글
            })
            .catch((error) => {
                console.error('팔로우 상태 변경 중 에러 발생:', error);
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
        followButton: {
            backgroundColor: isFollowing ? '#ff1744' : '#4caf50',
            color: '#fff',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '10px',
        },
        blindButton: {
            backgroundColor: '#ffc107',
            color: '#fff',
            borderRadius: '5px',
            padding: '5px 10px',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '10px',
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
            <p style={styles.author}>
                {post.author}
                {post.author !== username && (  
                    <button style={styles.blindButton} onClick={() => handleBlindUser(post.author)}>블라인드</button>
                )}
                {post.author !== username && (
                    <button style={styles.followButton} onClick={toggleFollowUser}>
                        {isFollowing ? '언팔로우' : '팔로우'}
                    </button>
                )}
            </p>
            <p style={styles.info}>조회수 | {post.view_count}</p>
            <p style={styles.info}>좋아요 | {likeCount}</p>
            <button style={styles.likeButton} onClick={toggleLike}>
                {liked ? '좋아요 취소' : '좋아요'}
            </button>
            <CommentList postId={id} username={username} userId={userId} />
            <CommentForm postId={id} />
        </div>
    );
}

export default CommunityDetail;

