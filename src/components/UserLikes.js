import React, { useState, useEffect } from 'react';
import api from '../services.api';
import { Link } from 'react-router-dom';

function UserLikes({ username }) {
    const [likes, setLikes] = useState({
        evaluations: [],
        reviews: [],
        communities: [],
        comments: [],
    });

    useEffect(() => {
        api.get(`/accounts/${username}/likes_all/`)
            .then(response => {
                setLikes({
                    evaluations: response.data.liked_evaluations,
                    reviews: response.data.liked_reviews,
                    communities: response.data.liked_communities,
                    comments: response.data.liked_comments,
                });
            })
            .catch(error => {
                console.error('좋아요한 항목을 불러오는 중 오류 발생:', error);
            });
    }, [username]);

    // 스타일 정의
    const styles = {
        likesContainer: {
            marginTop: '30px',
        },
        sectionTitle: {
            fontSize: '1.5rem',
            marginBottom: '10px',
            color: '#333',
        },
        likesList: {
            listStyleType: 'none',
            padding: 0,
            marginBottom: '20px',
        },
        likeItem: {
            padding: '10px',
            backgroundColor: '#fff',
            borderRadius: '5px',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
            marginBottom: '10px',
        },
        likeLink: {
            textDecoration: 'none',
            color: '#333',
            fontWeight: 'bold',
        },
        likeLinkHover: {
            color: '#ff1744',
        },
    };

    return (
        <div style={styles.likesContainer}>
            <h3 style={styles.sectionTitle}>좋아요한 주류평가</h3>
            <ul style={styles.likesList}>
                {likes.evaluations.map(evaluation => (
                    <li key={evaluation.id} style={styles.likeItem}>
                        <Link to={`/evaluations/${evaluation.id}`} style={styles.likeLink}>
                            {evaluation.title}
                        </Link>
                    </li>
                ))}
            </ul>

            <h3 style={styles.sectionTitle}>좋아요한 주류평가 리뷰</h3>
            <ul style={styles.likesList}>
                {likes.reviews.map(review => (
                    <li key={review.id} style={styles.likeItem}>
                        <Link to={`/evaluations/${review.evaluation_id}`} style={styles.likeLink}>
                            {review.evaluation} | {review.content} by {review.author}
                        </Link>
                    </li>
                ))}
            </ul>

            <h3 style={styles.sectionTitle}>좋아요한 커뮤니티 게시물</h3>
            <ul style={styles.likesList}>
                {likes.communities.map(community => (
                    <li key={community.id} style={styles.likeItem}>
                        <Link to={`/community/${community.id}`} style={styles.likeLink}>
                            {community.title}
                        </Link>
                    </li>
                ))}
            </ul>

            <h3 style={styles.sectionTitle}>좋아요한 커뮤니티 댓글</h3>
            <ul style={styles.likesList}>
                {likes.comments.map(comment => (
                    <li key={comment.id} style={styles.likeItem}>
                        <Link to={`/community/${comment.community_id}`} style={styles.likeLink}>
                            {comment.community} | {comment.content} by {comment.author}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserLikes;
