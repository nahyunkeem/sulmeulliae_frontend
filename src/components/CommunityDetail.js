import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

function CommunityDetail({ username, userId }) {
    const { id } = useParams();  // URL에서 게시글 ID를 가져옴
    const [post, setPost] = useState(null);
    const [liked, setLiked] = useState(false);  // 좋아요 상태
    const [likeCount, setLikeCount] = useState(0);  // 좋아요 수
    const [isFollowing, setIsFollowing] = useState(false);  // 팔로우 상태
    const [isEditing, setIsEditing] = useState(false);  // 수정 모드 여부
    const [editTitle, setEditTitle] = useState('');  // 수정 중인 제목
    const [editContent, setEditContent] = useState('');  // 수정 중인 내용
    const [editImages, setEditImages] = useState([]);  // 수정 중인 이미지 배열
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            api.get(`/community/${id}/`)
                .then((response) => {
                    setPost(response.data);
                    setEditTitle(response.data.title);  // 수정할 때 사용할 제목 설정
                    setEditContent(response.data.content);  // 수정할 때 사용할 내용 설정
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

    const handleEditSubmit = () => {
        const formData = new FormData();
        formData.append('title', editTitle);  // 수정된 제목 추가
        formData.append('content', editContent);

        // 새로운 이미지가 있으면 이미지를 추가
        if (editImages.length > 0) {
            Array.from(editImages).forEach((image, index) => {
                formData.append('community_image', image);  // 이미지 배열 추가
            });
        } else {
            // 이미지가 없다면 기존 이미지를 유지하도록 처리
            post.community_image.forEach((image, index) => {
                formData.append(`existing_image_${index}`, image.image_url);
            });
        }

        api.put(`/community/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',  // 파일 전송을 위한 헤더 설정
            },
        })
        .then((response) => {
            setIsEditing(false);  // 수정 모드 종료

            // 서버에서 반환된 데이터를 사용하여 게시글 상태를 업데이트
            setPost({
                ...post,
                title: editTitle,
                content: editContent,
                community_image: response.data.community_image  // 서버에서 반환된 이미지를 사용하여 상태 업데이트
            });

            // 이미지가 수정된 경우에만 페이지 새로고침 또는 상태 업데이트
            if (editImages.length > 0) {
                window.location.reload();  // 이미지가 수정된 경우 페이지 새로고침
            }
        })
        .catch((error) => {
            console.error('게시글 수정 중 에러 발생:', error);
        });
    };

    const handleDelete = () => {
        const confirmDelete = window.confirm('정말로 이 게시글을 삭제하시겠습니까?');
        if (confirmDelete) {
            api.delete(`/community/${id}/`)
                .then(() => {
                    alert('게시글이 삭제되었습니다.');
                    navigate('/community/freeboard');  // 삭제 후 자유게시판으로 이동
                })
                .catch((error) => {
                    console.error('게시글 삭제 중 에러 발생:', error);
                });
        }
    };

    const handleImageChange = (e) => {
        setEditImages(e.target.files);  // 이미지 파일 설정
    };

    if (!post) {
        return <p>로그인하셨다면 새로고침해주세요..</p>;
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
        editButton: {
            backgroundColor: '#2196f3',
            color: '#fff',
            borderRadius: '5px',
            padding: '5px 10px',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '10px',
        },
        deleteButton: {
            backgroundColor: '#f44336',
            color: '#fff',
            borderRadius: '5px',
            padding: '5px 10px',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '10px',
        },
        editInput: {
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            marginBottom: '20px',
            fontSize: '1.2rem',
        },
        editTextarea: {
            width: '100%',
            height: '150px',
            marginBottom: '20px',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd',
        },
        buttonsContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
        fileInput: {
            marginBottom: '20px',
        },
    };

    return (
        <div style={styles.container}>
            {isEditing ? (
                <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={styles.editInput}
                />
            ) : (
                <h2 style={styles.title}>{post.title}</h2>
            )}
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
            {isEditing ? (
                <>
                    <textarea
                        style={styles.editTextarea}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                    />
                    <input
                        type="file"
                        multiple  // 여러 이미지 선택 가능
                        onChange={handleImageChange}
                        style={styles.fileInput}
                    />
                </>
            ) : (
                <p style={styles.content}>{post.content}</p>
            )}
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
            {post.author === username && (
                <div style={styles.buttonsContainer}>
                    {isEditing ? (
                        <>
                            <button style={styles.editButton} onClick={handleEditSubmit}>수정 완료</button>
                            <button style={styles.editButton} onClick={() => setIsEditing(false)}>취소</button>
                        </>
                    ) : (
                        <>
                            <button style={styles.editButton} onClick={() => setIsEditing(true)}>수정</button>
                            <button style={styles.deleteButton} onClick={handleDelete}>삭제</button>
                        </>
                    )}
                </div>
            )}
            <CommentList postId={id} username={username} userId={userId} />
            <CommentForm postId={id} />
        </div>
    );
}

export default CommunityDetail;

