import React, { useState, useEffect } from 'react';  // useState를 추가
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
        setLoggedIn(false);
        setUsername('');
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
                                <span>{username}님</span>
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
                    <Route path="/evaluations/:id" element={<EvaluationDetail username={username} userId={userId}/>} />
                    <Route path="/community/freeboard" element={<FreeBoard />} />
                    <Route path="/community/question" element={<QuestionBoard />} />
                    <Route path="/community/discussion" element={<DiscussionBoard />} />
                    <Route path="/community/drinkmate" element={<DrinkMateBoard />} />
                    <Route path="/community/:id" element={<CommunityDetail username={username} userId={userId}/>} />
                    <Route path="/community/create" element={<CreatePost />} />
                    </Routes>
            </div>
        </Router>
    );
}

export default App;
