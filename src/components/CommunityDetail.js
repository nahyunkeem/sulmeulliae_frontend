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
                    if (response.data.likes.includes(Number(userId))) {
                        setLiked(true);
                    } else {
                        setLiked(false);
                    }
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
                    // 작성자가 팔로잉 목록에 있는지 확인
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
                    setLiked(true);
                    setLikeCount(prevLikeCount => prevLikeCount + 1);
                } else if (response.status === 204) {
                    setLiked(false);
                    setLikeCount(prevLikeCount => prevLikeCount - 1);
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
        return <p>로그인 후 이용해주세요</p>;
    }

    return (
        <div>
            <h2>{post.title}</h2>
            {post.community_image && post.community_image.length > 0 && (
                <div>
                    {post.community_image.map((imageObj, index) => (
                        <img 
                            key={index} 
                            src={`http://localhost:8000${imageObj.image_url}`} 
                            alt={`community-post-${index}`} 
                            style={{ maxWidth: '100%', margin: '10px 0' }}
                        />
                    ))}
                </div>
            )}
            <p>{post.content}</p>
            <p>{post.author}
                {post.author !== username && (  
                    <button onClick={() => handleBlindUser(post.author)}>블라인드</button>
                )}
                {post.author !== username && (
                    <button onClick={toggleFollowUser}>
                        {isFollowing ? '언팔로우' : '팔로우'}
                    </button>
                )}
            </p>
            <p>조회수 | {post.view_count}</p>
            <p>좋아요 | {likeCount}</p>
            <button onClick={toggleLike}>
                {liked ? '좋아요 취소' : '좋아요'}
            </button>
            <CommentList postId={id} username={username} userId={userId}/>
            <CommentForm postId={id} />
        </div>
    );
}

export default CommunityDetail;
