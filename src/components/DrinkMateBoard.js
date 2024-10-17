import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

function DrinkMateBoard() {
    const [chatRooms, setChatRooms] = useState([]);

    useEffect(() => {
        api.get('/chat/chatrooms/')
            .then((response) => {
                setChatRooms(response.data);
            })
            .catch((error) => {
                console.error('Error loading chat rooms:', error);
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
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.heading}>채팅방 목록</h2>
                <Link to="/chat/createchat">
                    <button style={styles.button}>방 만들기</button>
                </Link>
            </div>
            <ul style={styles.postList}>
                {chatRooms.length > 0 ? (
                    chatRooms.map((room) => (
                        <li key={room.id} style={styles.postItem}>
                            <Link to={`/chat/${room.id}`} style={styles.postLink}>{room.name}</Link>
                        </li>
                    ))
                ) : (
                    <p>로그인하셨다면 새로고침해주세요..</p>
                )}
            </ul>
        </div>
    );
}

export default DrinkMateBoard;
