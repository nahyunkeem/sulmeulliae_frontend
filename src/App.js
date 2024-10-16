import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EvaluationList from './components/EvaluationList';
import EvaluationDetail from './components/EvaluationDetail';
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
import './App.css';  // CSS 파일을 별도로 분리

function App() {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('accessToken'));
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedUserId = localStorage.getItem('userId');
        if (storedUsername) {
            setUsername(storedUsername);
        }
        if (storedUserId) {
            setUserId(storedUserId);  
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
            <div className="app">
                <header>
                    <nav className="nav">
                        <Link to="/" className="link">홈 |</Link>
                        <Link to="/community/freeboard" className="link">자유 게시판 |</Link>
                        <Link to="/community/question" className="link">질문 게시판 |</Link>
                        <Link to="/community/discussion" className="link">토론 게시판 |</Link>
                        <Link to="/community/drinkmate" className="link">술 메이트 게시판 |</Link>
                        {loggedIn ? (
                            <>
                                <Link to="/chatbot" className="link">술추천챗봇 |</Link>
                                <Link to={`/profile/${username}`} className="link">
                                    <span className="username">{username}님</span>
                                </Link>
                                <button className="logout-button" onClick={handleLogout}>로그아웃</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="link">로그인</Link>
                                <Link to="/signup" className="link">회원가입</Link>
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

                <footer className="footer">
                    <p>© 2024 Sulmeulliae. All rights reserved.</p>
                    <p>
                        <Link to="/privacy-policy" className="footer-link">개인정보 처리방침</Link> |{' '}
                        <Link to="/terms-of-service" className="footer-link">이용약관</Link>
                    </p>
                </footer>
            </div>
        </Router>
    );
}

export default App;

