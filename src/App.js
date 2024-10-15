import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import EvaluationList from './components/EvaluationList';
import EvaluationDetail from './components/EvaluationDetail';  // 평가 상세 페이지 컴포넌트
import Login from './components/Login';
import Signup from './components/Signup';
import FreeBoard from './components/FreeBoard';
import QuestionBoard from './components/QuestionBoard';
import DiscussionBoard from './components/DiscussionBoard';
import DrinkMateBoard from './components/DrinkMateBoard';
import CommunityDetail from './components/CommunityDetail'; 
import CreatePost from './components/CreatePost';
import ChatBot from './components/ChatBot';
import ChatRoom from './components/ChatRoom';
import CreateChat from './components/CreateChat';
import UserProfile from './components/UserProfile'; 
import UserProfileEdit from './components/UserProfileEdit';
import UserPasswordChange from './components/UserPasswordChange';
import UserWithdraw from './components/UserWithdraw';

function App() {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('accessToken'));
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // localStorage에서 사용자명 불러오기
        const storedUsername = localStorage.getItem('username');
        const storedUserId = localStorage.getItem('userId');
        if (storedUsername) {
            setUsername(storedUsername);
        }
        if (storedUserId) {
            setUserId(storedUserId);  // userId 상태 설정
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        setLoggedIn(false);
        setUsername('');
        setUserId(null);
    };

    return (
        <Router>
            <div className="App">
                <header>
                    <nav>
                        <Link to="/">홈 |</Link>
                        <Link to="/community/freeboard">자유 게시판 |</Link>
                        <Link to="/community/question">질문 게시판 |</Link>
                        <Link to="/community/discussion">토론 게시판 |</Link>
                        <Link to="/community/drinkmate">술 메이트 게시판 |</Link>
                        {loggedIn ? (
                            <>
                                <Link to="/chatbot">술추천챗봇 |</Link>
                                <Link to={`/profile/${username}`}>
                                    <span>{username}님</span>
                                </Link>
                                <button onClick={handleLogout}>로그아웃</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">로그인</Link>
                                <Link to="/signup">회원가입</Link>
                            </>
                        )}
                    </nav>
                </header>

                <Routes>
                    <Route path="/" element={<EvaluationList />} />
                    <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setUsername={setUsername} />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/evaluations/:id" element={<EvaluationDetail username={username} userId={userId} />} />
                    <Route path="/community/freeboard" element={<FreeBoard />} />
                    <Route path="/community/question" element={<QuestionBoard />} />
                    <Route path="/community/discussion" element={<DiscussionBoard />} />
                    <Route path="/community/drinkmate" element={<DrinkMateBoard />} />
                    <Route path="/community/:id" element={<CommunityDetail username={username} userId={userId} />} />
                    <Route path="/community/create" element={<CreatePost />} />
                    <Route path="/chatbot" element={<ChatBot />} />
                    <Route path="/chat/:roomId" element={<ChatRoom username={username} userId={userId} />} /> 
                    <Route path="/chat/createchat" element={<CreateChat />} />
                    <Route path="/profile/:username" element={<UserProfile username={username} />} />
                    <Route path="/accounts/edit" element={<UserProfileEdit />} />
                    <Route path="/accounts/password" element={<UserPasswordChange />} />
                    <Route path="/accounts/withdraw" element={<UserWithdraw />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
