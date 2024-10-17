import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';  // api.js에 정의된 axios 인스턴스

function CreateChatRoom({ onRoomCreated }) {
    const [roomName, setRoomName] = useState('');
    const navigate = useNavigate();  // 페이지 이동을 위한 useNavigate 훅

    const handleSubmit = (e) => {
        e.preventDefault();
    
        api.post('/chat/createchat/', { name: roomName })
            .then((response) => {
                setRoomName('');
                navigate(`/chat/${response.data.id}`);  // 채팅방 UUID로 이동
            })
            .catch((error) => {
                console.error('Error creating chat room:', error);
            });
    };

    // 스타일 정의 (DrinkMateBoard 및 ChatRoom과 일관된 스타일)
    const styles = {
        formContainer: {
            maxWidth: '600px',
            margin: '50px auto',
            padding: '20px',
            backgroundColor: '#faf4e1',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        label: {
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#333',
        },
        input: {
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            marginBottom: '20px',
            fontSize: '1rem',
        },
        button: {
            backgroundColor: '#ffd700',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: '#3c6255',
            width: '100%',
        },
        buttonHover: {
            backgroundColor: '#e6c200',
        },
    };

    return (
        <form onSubmit={handleSubmit} style={styles.formContainer}>
            <label style={styles.label}>
                채팅방 이름:
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                    style={styles.input}
                />
            </label>
            <button type="submit" style={styles.button}>채팅방 만들기</button>
        </form>
    );
}

export default CreateChatRoom;

