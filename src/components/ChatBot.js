import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

function ChatBot() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);  // 로딩 상태 추가
    const messagesEndRef = useRef(null);  // 스크롤 끝 지점을 참조할 ref

    // 스크롤을 맨 아래로 이동시키는 함수
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (inputMessage.trim() === '') return;

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            alert('로그인이 필요합니다.');
            window.location.href = '/login';
            return;
        }

        // 사용자 메시지 추가
        const userMessage = { sender: 'user', text: inputMessage };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // 로딩 시작
        setLoading(true);

        // 챗봇 응답 요청
        api.post('/chatbot/', 
            { message: inputMessage }, 
            { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        .then((response) => {
            const botMessage = { sender: 'bot', text: response.data.sulmeulliae_message };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        })
        .catch((error) => {
            const errorMessage = { sender: 'bot', text: '포인트가 부족합니다. 내일 추천해드릴게요.' };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        })
        .finally(() => {
            // 로딩 종료
            setLoading(false);
        });

        // 입력 필드 초기화
        setInputMessage('');
    };

    // 스타일 정의 (채팅방과 동일한 스타일 적용, 네브바와 간격 조정)
    const styles = {
        chatContainer: {
            width: '100%',
            maxWidth: '600px',
            margin: '50px auto',  // 네브바와 간격 조정
            backgroundColor: '#f7f7f7',
            border: '1px solid #ddd',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '600px',
            padding: '20px',
        },
        chatMessages: {
            flexGrow: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: '20px',
        },
        chatMessage: {
            display: 'inline-block',
            maxWidth: '60%',
            wordBreak: 'break-word',
            padding: '10px',
            borderRadius: '10px',
            marginBottom: '10px',
        },
        userMessage: {
            backgroundColor: '#ffe600',
            alignSelf: 'flex-end',
            borderRadius: '10px 10px 0 10px',
        },
        botMessage: {
            backgroundColor: '#e0e0e0',
            alignSelf: 'flex-start',
            borderRadius: '10px 10px 10px 0',
        },
        chatInputForm: {
            display: 'flex',
        },
        chatInput: {
            flexGrow: 1,
            padding: '10px',
            borderRadius: '20px',
            border: '1px solid #ddd',
            marginRight: '10px',
        },
        sendButton: {
            backgroundColor: '#ffd700',
            border: 'none',
            borderRadius: '20px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontWeight: 'bold',
        },
        chatLoading: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px 0',
            fontSize: '1.2rem',
            color: '#888',  // 로딩 텍스트 색상
        },
    };

    return (
        <div style={styles.chatContainer}>
            <div style={styles.chatMessages}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={
                            msg.sender === 'user'
                                ? { ...styles.chatMessage, ...styles.userMessage }
                                : { ...styles.chatMessage, ...styles.botMessage }
                        }
                    >
                        <p>{msg.text}</p>
                    </div>
                ))}

                {/* 로딩 중일 때 "Loading..." 텍스트 표시 */}
                {loading && (
                    <div style={styles.chatLoading}>
                        <p>Loading...</p>
                    </div>
                )}

                {/* 스크롤 끝 부분 */}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} style={styles.chatInputForm}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="추천을 위해 현재의 기분이나 최근에 맛있게 마신술을 입력해주세요...(1포인트필요)"
                    disabled={loading}  // 로딩 중 입력 필드 비활성화
                    style={styles.chatInput}
                />
                <button type="submit" disabled={loading} style={styles.sendButton}>
                    전송
                </button>  {/* 로딩 중 전송 버튼 비활성화 */}
            </form>
        </div>
    );
}

export default ChatBot;
