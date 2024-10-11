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
            const errorMessage = { sender: 'bot', text: '문제가 발생했습니다. 다시 시도해 주세요.' };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        })
        .finally(() => {
            // 로딩 종료
            setLoading(false);
        });

        // 입력 필드 초기화
        setInputMessage('');
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender === 'user' ? 'chat-message user' : 'chat-message bot'}>
                        <p>{msg.text}</p>
                    </div>
                ))}

                {/* 로딩 중일 때 스피너 표시 */}
                {loading && (
                    <div className="chat-loading">
                        <div className="spinner"></div> {/* 스피너 애니메이션 */}
                    </div>
                )}

                {/* 스크롤 끝 부분 */}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="chat-input-form">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="추천을 위해 현재의 기분이나 최근에 맛있게 마신술을 입력해주세요..."
                    disabled={loading}  // 로딩 중 입력 필드 비활성화
                />
                <button type="submit" disabled={loading}>전송</button>  {/* 로딩 중 전송 버튼 비활성화 */}
            </form>
        </div>
    );
}

export default ChatBot;

