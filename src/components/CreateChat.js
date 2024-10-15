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
                console.log('Chat room created:', response.data);
                setRoomName('');
                navigate(`/chat/${response.data.id}`);  // 채팅방 UUID로 이동
            })
            .catch((error) => {
                console.error('Error creating chat room:', error);
            });
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <label>
                채팅방 이름:
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                />
            </label>
            <button type="submit">채팅방 만들기</button>
        </form>
    );
}

export default CreateChatRoom;
