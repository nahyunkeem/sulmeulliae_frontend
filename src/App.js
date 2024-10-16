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

    const styles = {
        app: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
            minHeight: 'calc(100vh - 60px)',  // 전체 화면에서 footer를 제외한 영역
            display: 'flex',
            flexDirection: 'column',
        },
        nav: {
            backgroundColor: '#3c6255',
            padding: '15px',
            textAlign: 'center',
        },
        link: {
            margin: '0 10px',
            color: '#f0e5d1',
            textDecoration: 'none',
            fontWeight: 'bold',
        },
        linkHover: {
            color: '#ffd700',
        },
        span: {
            color: '#f0e5d1',
            marginRight: '10px',
        },
        button: {
            backgroundColor: '#ffd700',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: '#3c6255',
            marginLeft: '10px',
        },
        buttonHover: {
            backgroundColor: '#e6c200',
        },
        footer: {
            backgroundColor: '#3c6255',
            color: '#f0e5d1',
            textAlign: 'center',
            padding: '15px',
            marginTop: 'auto',  // flex 컨테이너에서 footer를 하단에 위치
        },
        footerLink: {
            color: '#f0e5d1',
            textDecoration: 'none',
        },
    };

    return (
        <Router>
            <div style={styles.app}>
                <header>
                    <nav style={styles.nav}>
                        <Link to="/" style={styles.link}>홈 |</Link>
                        <Link to="/community/freeboard" style={styles.link}>자유 게시판 |</Link>
                        <Link to="/community/question" style={styles.link}>질문 게시판 |</Link>
                        <Link to="/community/discussion" style={styles.link}>토론 게시판 |</Link>
                        <Link to="/community/drinkmate" style={styles.link}>술 메이트 게시판 |</Link>
                        {loggedIn ? (
                            <>
                                <Link to="/chatbot" style={styles.link}>술추천챗봇 |</Link>
                                <Link to={`/profile/${username}`} style={styles.link}>
                                    <span style={styles.span}>{username}님</span>
                                </Link>
                                <button style={styles.button} onClick={handleLogout}>로그아웃</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={styles.link}>로그인</Link>
                                <Link to="/signup" style={styles.link}>회원가입</Link>
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

                {/* Footer 추가 */}
                <footer style={styles.footer}>
                    <p>© 2024 Sulmeulliae. All rights reserved.</p>
                    <p>
                        <Link to="/privacy-policy" style={styles.footerLink}>개인정보 처리방침</Link> |{' '}
                        <Link to="/terms-of-service" style={styles.footerLink}>이용약관</Link>
                    </p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
