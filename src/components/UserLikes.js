import React, { useState, useEffect } from 'react';
import api from '../services/api';
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

    return (
        <div>
            <h3>좋아요한 주류평가</h3>
            <ul>
                {likes.evaluations.map(evaluation => (
                    <li key={evaluation.id}>
                    <Link to={`/evaluations/${evaluation.id}`}>{evaluation.title}</Link>
                    </li>
                ))}
            </ul>

            <h3>좋아요한 주류평가 리뷰</h3>
            <ul>
                {likes.reviews.map(review => (
                    <li key={review.id}>
                        <Link to={`/evaluations/${review.evaluation_id}`}>
                            {review.evaluation} | {review.content} by {review.author}
                        </Link>
                    </li>                ))}
            </ul>

            <h3>좋아요한 커뮤니티 게시물</h3>
            <ul>
                {likes.communities.map(community => (
                    <li key={community.id}>
                    <Link to={`/community/${community.id}`}>{community.title}</Link>
                    </li>
                ))}
            </ul>

            <h3>좋아요한 커뮤니티 댓글</h3>
            <ul>
                {likes.comments.map(comment => (
                    <li key={comment.id}>
                        <Link to={`/community/${comment.community_id}`}>
                        {comment.community} | {comment.content} by {comment.author}
                        </Link>
                    </li>                ))}
            </ul>
        </div>
    );
}

export default UserLikes;
