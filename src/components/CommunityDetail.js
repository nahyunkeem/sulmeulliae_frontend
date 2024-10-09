import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

function CommunityDetail({ username, userId }) {
    const { id } = useParams();  // URL에서 게시글 ID를 가져옴
    const [post, setPost] = useState(null);
    const [liked, setLiked] = useState(true);  // 좋아요 상태
    const [likeCount, setLikeCount] = useState(0);  // 좋아요 수

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

    const toggleLike = () => {
        // 좋아요 상태 토글을 위한 POST 요청
        api.post(`/community/${id}/like/`)
            .then((response) => {
                console.log(response.data);
                if (response.status === 200) {
                    setLiked(true);  // 좋아요 추가
                    setLikeCount(prevLikeCount => prevLikeCount + 1);
                } else if (response.status === 204) {
                    setLiked(false);  // 좋아요 취소
                    setLikeCount(prevLikeCount => prevLikeCount - 1); 
                }
            })
            .catch((error) => {
                console.error('좋아요 상태 변경 중 에러 발생:', error);
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
                            src={`https://api.sulmeulliae.com${imageObj.image_url}`}  // image_url 필드를 사용
                            alt={`community-post-${index}`} 
                            style={{ maxWidth: '100%', margin: '10px 0' }}
                        />
                    ))}
                </div>
            )}
            <p>{post.content}</p>
            <p>{post.author}</p>
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
