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
                console.log(response.data);
                const updatedComments = response.data.map(comment => ({
                    ...comment,
                    liked: comment.likes.includes(Number(userId))  // likes 배열에 userId가 있는지 확인
                }));
                setComments(updatedComments);
            })
            .catch((error) => {
                console.error('댓글 로드 중 에러 발생:', error);
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
        // 댓글 좋아요 상태 토글을 위한 POST 요청
        api.post(`/community/comment/${commentId}/like/`)
            .then(() => {
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

    const handleBlindUser = (author) => {
        const confirmBlind = window.confirm(`${author} 님을 블라인드 하시겠습니까?`);
        if (confirmBlind) {
            api.post(`/accounts/${author}/blind/`)  // 블라인드 API 호출
                .then(() => {
                    setComments(comments.filter(comment => comment.author !== author));  // 해당 리뷰 숨기기
                })
                .catch((error) => {
                    console.error('블라인드 중 에러 발생:', error);
                });
        }
    };

    // 인라인 스타일 정의
    const styles = {
        commentContainer: {
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '10px',
            textAlign: 'left',
        },
        commentList: {
            listStyleType: 'none',
            padding: 0,
        },
        commentItem: {
            padding: '15px',
            borderBottom: '1px solid #ddd',
            marginBottom: '10px',
        },
        author: {
            fontWeight: 'bold',
            marginBottom: '5px',
        },
        content: {
            marginBottom: '10px',
            fontSize: '16px',
            lineHeight: '1.5',
        },
        likeCount: {
            fontWeight: 'bold',
            color: '#ff9800',
            marginBottom: '5px',
        },
        buttons: {
            marginTop: '10px',
        },
        button: {
            marginRight: '10px',
            backgroundColor: '#ff1744',
            color: '#fff',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
        },
        blindButton: {
            backgroundColor: '#ffc107',
            color: '#fff',
            borderRadius: '5px',
            padding: '5px 10px',
            border: 'none',
            cursor: 'pointer',
        },
    };

    return (
        <div style={styles.commentContainer}>
            <h2>댓글</h2>
            {comments.length > 0 ? (
                <ul style={styles.commentList}>
                    {comments.map((comment) => (
                        <li key={comment.id} style={styles.commentItem}>
                            {editingCommentId === comment.id ? (
                                <div>
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        style={{ width: '100%', height: '100px' }}
                                    />
                                    <button style={styles.button} onClick={() => handleEditSubmit(comment.id)}>저장</button>
                                    <button style={styles.button} onClick={() => setEditingCommentId(null)}>취소</button>
                                </div>
                            ) : (
                                <div>
                                    <div style={styles.author}>
                                        {comment.author}
                                        {comment.author !== username && (
                                            <button style={styles.blindButton} onClick={() => handleBlindUser(comment.author)}>블라인드</button>
                                        )}
                                        | {comment.content}
                                    </div>
                                    <div style={styles.likeCount}>좋아요 | {comment.like_count}</div>
                                    {comment.author === username ? (
                                        <div style={styles.buttons}>
                                            <button style={styles.button} onClick={() => handleEditClick(comment)}>수정</button>
                                            <button style={styles.button} onClick={() => handleDelete(comment.id)}>삭제</button>
                                        </div>
                                    ) : (
                                        <button style={styles.button} onClick={() => toggleCommentLike(comment.id)}>
                                            {comment.liked ? '좋아요 취소' : '좋아요'}
                                        </button>
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

