import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api'; // axios 인스턴스 불러오기

function ChatRoom() {
    const { roomId } = useParams();  // URL에서 roomId만 가져오기
    const [roomName, setRoomName] = useState('');  // roomName 상태 추가
    const [createdBy, setCreatedBy] = useState(null);  // 채팅방 만든 사람 ID
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const socketRef = useRef(null);
    const navigate = useNavigate();

    const currentUserId = localStorage.getItem('userId');  // 현재 사용자 ID 가져오기
    const currentUsername = localStorage.getItem('username');  // 현재 사용자 이름 가져오기

    useEffect(() => {
        // 채팅방 정보를 API에서 가져오기
        api.get(`/chat/chatrooms/${roomId}/`)
            .then(response => {
                setRoomName(response.data.name);  // roomName 설정
                setCreatedBy(response.data.created_by);  // 채팅방 만든 사람 설정
            })
            .catch(error => {
                console.error('Error fetching room info:', error);
            });

        // WebSocket 연결 시도
        const chatSocket = new WebSocket(`ws://www.api.sulmeulliae.com/ws/chat/${roomId}/`);
        socketRef.current = chatSocket;

        // WebSocket 연결이 성공했을 때
        chatSocket.onopen = () => {
            console.log("WebSocket 연결 완료");
            // 입장 메시지 전송
            chatSocket.send(JSON.stringify({
                'message': `${currentUsername}님이 채팅방에 입장했습니다.`,
                'type': 'system'
            }));
        };

        // WebSocket에서 메시지를 받았을 때
        chatSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type === 'system') {
                setMessages((prevMessages) => [...prevMessages, { message: data.message }]);
            } else {
                setMessages((prevMessages) => [...prevMessages, { message: data.message, username: data.username }]);
            }
        };

        // WebSocket 연결이 종료되었을 때
        chatSocket.onclose = (e) => {
            console.log(`WebSocket 연결 종료. 코드: ${e.code}, 이유: ${e.reason}`);
        };
        // WebSocket 오류 처리
        chatSocket.onerror = (error) => {
            console.error("WebSocket 오류:", error);
        };

        // 컴포넌트 언마운트 시 WebSocket 연결 종료 처리
        return () => {
            if (chatSocket.readyState === WebSocket.OPEN) {
                chatSocket.send(JSON.stringify({
                    'message': `${currentUsername}님이 채팅방을 나갔습니다.`,
                    'type': 'system'
                }));
            }
            chatSocket.close();
        };
    }, [roomId, currentUsername]);

    const sendMessage = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                'message': inputMessage,
                'username': currentUsername  // username 포함
            }));
            setInputMessage('');
        } else {
            console.error("WebSocket 연결 상태가 아닙니다. 메시지를 보낼 수 없습니다.");
        }
    };

    const handleDeleteRoom = () => {
        if (window.confirm('정말 이 채팅방을 삭제하시겠습니까?')) {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                    'message': '이 채팅방이 삭제되었습니다.',
                    'type': 'system'
                }));
            }

            api.delete(`/chat/chatrooms/${roomId}/delete/`)  // roomId를 사용하여 삭제 요청
                .then(() => {
                    alert('채팅방이 삭제되었습니다.');
                    navigate('/community/drinkmate');  // 삭제 후 채팅방 목록으로 이동
                })
                .catch((error) => {
                    console.error('Error deleting chat room:', error);
                });
        }
    };

    const handleLeaveRoom = () => {
        alert('채팅방을 나갑니다.');
        navigate('/community/drinkmate');  // 나가기 버튼을 눌렀을 때 채팅방 목록으로 이동
    };

    return (
        <div className="chatroom-container">
            <h2 className="chatroom-title">{roomName}</h2>  {/* roomName을 표시 */}
            <div className="chatroom-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`chatroom-message ${message.username === currentUsername ? 'self-message' : 'other-message'}`}>
                        {message.username ? <strong>{message.username}:</strong> : null} {message.message}
                    </div>
                ))}
            </div>
            <div className="chatroom-input">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            sendMessage();
                        }
                    }}
                    placeholder="메시지를 입력하세요..."
                />
                <button onClick={sendMessage}>전송</button>
            </div>

            <div className="chatroom-actions">
                <button className="leave-room-button" onClick={handleLeaveRoom}>나가기</button>
                {createdBy === Number(currentUserId) && (
                    <button className="delete-room-button" onClick={handleDeleteRoom}>채팅방 삭제</button>
                )}
            </div>
        </div>
    );
}

export default ChatRoom;

