import React, { useState } from 'react';  // useState를 추가
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import EvaluationList from './components/EvaluationList';
import EvaluationDetail from './components/EvaluationDetail';  // 평가 상세 페이지 컴포넌트
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('accessToken'));
    const [username, setUsername] = useState('');

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
                        <Link to="/">홈</Link>
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
                    <Route path="/evaluations/:id" element={<EvaluationDetail />} />  {/* 평가 상세 페이지 */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
