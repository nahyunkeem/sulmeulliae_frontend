import React, { useEffect, useState } from 'react';
import api from '../services/api';

function CommentList({ postId, username, userId }) {
    const [comments, setComments] = useState([]);
    const [editingCommentId, setEditingCommentId] = useState(null);  // 수정 중인 댓글 ID
    const [editContent, setEditContent] = useState('');  // 수정 중인 댓글 내용

    useEffect(() => {
        // 댓글 목록을 가져오는 API 호출
        api.get(`/community/${postId}/comment/`)
            .then((response) => {
                const updatedComments = response.data.map(comment => ({
                    ...comment,
                    liked: comment.likes.includes(Number(userId))  // likes 배열에 userId가 있는지 확인
                }));
                setComments(updatedComments);
            })
            .catch((error) => {
                console.error('리뷰 로드 중 에러 발생:', error);
            });
    }, [postId, userId]);

    const handleEditClick = (comment) => {
        setEditingCommentId(comment.id);
        setEditContent(comment.content);
    };

    const handleEditSubmit = (commentId) => {
        const updatedComment = {
            content: editContent,
        };

        // 댓글 수정 API 호출
        api.put(`/community/comment/${commentId}/`, updatedComment)
            .then((response) => {
                // 댓글 수정 완료 후 업데이트
                setComments(comments.map(comment => (comment.id === commentId ? response.data : comment)));
                setEditingCommentId(null);  // 수정 모드 종료
            })
            .catch((error) => {
                console.error('댓글 수정 중 에러 발생:', error);
            });
    };

    const handleDelete = (commentId) => {
        const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
        if (confirmDelete) {
            // 댓글 삭제 API 호출
            api.delete(`/community/comment/${commentId}/`)
                .then(() => {
                    setComments(comments.filter((comment) => comment.id !== commentId)); 
                })
                .catch((error) => {
                    console.error('댓글 삭제 중 에러 발생:', error);
                });
        }
    };

    const toggleCommentLike = (commentId) => {
        // 리뷰 좋아요 상태 토글을 위한 POST 요청
        api.post(`/community/comment/${commentId}/like/`)
            .then(() => {
                // 좋아요 상태 변경 후 리뷰 데이터를 다시 불러옴
                if (userId) {
                    api.get(`/community/${postId}/comment/`)
                        .then((response) => {
                            setComments(comments.map((comment) => {
                                if (comment.id === commentId) {
                                    return {
                                        ...comment,
                                        like_count: comment.liked ? comment.like_count - 1 : comment.like_count + 1,  // 좋아요 수 변경
                                        liked: !comment.liked  // 좋아요 상태 토글
                                    };
                                }
                                return comment;
                            }));
                        })
                        .catch((error) => {
                            console.error('댓글 다시 로드 중 에러 발생:', error);
                        });
                    }
            })
            .catch((error) => {
                console.error('좋아요 상태 변경 중 에러 발생:', error);
            });
    };  

    return (
        <div>
            <h2>댓글</h2>
            {comments.length > 0 ? (
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id}>
                            {editingCommentId === comment.id ? (
                                // 수정 모드: 해당 댓글만 수정 폼을 표시
                                <div>
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                    />
                                    <button onClick={() => handleEditSubmit(comment.id)}>저장</button>
                                    <button onClick={() => setEditingCommentId(null)}>취소</button>
                                </div>
                            ) : (
                                // 기본 댓글 보기 모드
                                <div>
                                    <div>{comment.author} | {comment.content}</div>
                                    <div>좋아요 | {comment.like_count}</div>
                                    {comment.author === username ? (
                                        <div>
                                            {/* 본인이 작성한 댓글일 경우 수정 및 삭제 버튼 */}
                                            <button onClick={() => handleEditClick(comment)}>수정</button>
                                            <button onClick={() => handleDelete(comment.id)}>삭제</button>
                                        </div>
                                    ) :(
                                        <div>
                                            {/* 본인이 작성하지 않은 리뷰일 경우 좋아요 버튼 */}
                                            <button onClick={() => toggleCommentLike(comment.id)}>
                                                {comment.liked ? '좋아요 취소' : '좋아요'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>댓글이 없습니다.</p>
            )}
        </div>
    );
}

export default CommentList;

