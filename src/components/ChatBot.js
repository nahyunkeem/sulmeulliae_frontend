// import React, { useEffect, useState, useRef } from 'react';
// import api from '../services/api';

// function ChatBot() {
//     const [messages, setMessages] = useState([]);
//     const [inputMessage, setInputMessage] = useState('');
//     const messagesEndRef = useRef(null);  // 스크롤 끝 지점 참조

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (inputMessage.trim() === '') return;

//         // 사용자 메시지 추가
//         const userMessage = { sender: 'user', text: inputMessage };
//         setMessages((prevMessages) => [...prevMessages, userMessage]);

//         // 챗봇 응답 요청
//         api.post('/chatbot/', { message: inputMessage })
//             .then((response) => {
//                 const botMessage = { sender: 'bot', text: response.data.sulmeulliae_message };
//                 setMessages((prevMessages) => [...prevMessages, botMessage]);
//             })
//             .catch((error) => {
//                 const errorMessage = { sender: 'bot', text: '문제가 발생했습니다. 다시 시도해 주세요.' };
//                 setMessages((prevMessages) => [...prevMessages, errorMessage]);
//             });

//         // 입력 필드 초기화
//         setInputMessage('');
//     };

//     // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);

//     return (
//         <div className="chat-container">
//             <div className="chat-messages">
//                 {messages.map((msg, index) => (
//                     <div
//                         key={index}
//                         className={msg.sender === 'user' ? 'chat-message user' : 'chat-message bot'}
//                     >
//                         <p>{msg.text}</p>
//                     </div>
//                 ))}
//                 <div ref={messagesEndRef} /> {/* 스크롤 끝 지점 */}
//             </div>

//             <form onSubmit={handleSubmit} className="chat-input-form">
//                 <input
//                     type="text"
//                     value={inputMessage}
//                     onChange={(e) => setInputMessage(e.target.value)}
//                     placeholder="술추천을 위해 현재의 기분이나 최근에 맛있게 마신술을 말해주세요..."
//                 />
//                 <button type="submit">전송</button>
//             </form>
//         </div>
//     );
// }

// export default ChatBot;

import React, { useState } from 'react';
import api from '../services/api';

function ChatBot() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (inputMessage.trim() === '') return;

        // accessToken 가져오기 (localStorage에서 예시)
        const accessToken = localStorage.getItem('accessToken');

        // 토큰이 없을 경우 로그인 유도
        if (!accessToken) {
            alert('로그인이 필요합니다.');
            // 로그인 페이지로 리다이렉트하거나 다른 처리 로직을 추가
            window.location.href = '/login';  // 로그인 페이지로 리다이렉트 (예시)
            return;  // 요청 중지
        }

        // 사용자 메시지 추가
        const userMessage = { sender: 'user', text: inputMessage };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

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
            console.error('챗봇 요청 중 에러 발생:', error);
            const errorMessage = { sender: 'bot', text: '포인트가 부족합니다! 내일 추천해드릴게요' };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
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
            </div>

            <form onSubmit={handleSubmit} className="chat-input-form">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="추천을 위해 기분이나 최근에 맛있게 마신 술을 말해주세요..."
                />
                <button type="submit">전송</button>
            </form>
        </div>
    );
}

export default ChatBot;
