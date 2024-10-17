import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EvaluationList from './components/EvaluationList';
import EvaluationDetail from './components/EvaluationDetail'; 
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
import LogoutButton from './components/LogoutButton';
import EmailVerification from './components/EmailVerification';
import Cart from './components/Cart';
import ProductDetail from './components/ProductDetail';
import ProductList from "./components/ProductList";
import './App.css';

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
        },
        nav: {
            backgroundColor: '#3c6255',
            padding: '15px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', // 좌우 정렬
        },
        logoContainer: {
            display: 'flex',
            alignItems: 'center', // 로고와 텍스트를 상하 중앙 정렬
        },
        logo: {
            height: '60px', // 로고 이미지 크기
            marginRight: '10px', // 로고와 텍스트 사이 여백
        },
        logoText: {
            color: '#f0e5d1',
            fontSize: '24px', // 텍스트 크기
            fontWeight: 'bold', // 텍스트 굵기
            display: 'flex',
            alignItems: 'center', // 텍스트 상하 중앙 정렬
        },
        link: {
            margin: '0 10px',
            color: '#f0e5d1',
            textDecoration: 'none',
            fontWeight: 'bold',
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
        footer: {
            backgroundColor: '#3c6255',
            color: '#f0e5d1',
            textAlign: 'center',
            padding: '15px',
            marginTop: 'auto',
            borderTop: '1px solid #ffd700',
        },
        footerLink: {
            color: '#ffd700',
            textDecoration: 'none',
        },
        body: {
            paddingTop: '20px',
        }
    };

    return (
        <Router>
            <div style={styles.body}>
                <header>
                    <nav style={styles.nav}>
                        {/* 로고 이미지 추가 */}
                        <div style={styles.logoContainer}>
                            <Link to="/">
                                <img src="/images/logo.png" alt="Sulmeulliae Logo" style={styles.logo} />
                            </Link>
                            <span style={styles.logoText}>Sulmeulliae</span> {/* 로고 옆에 텍스트 */}
                        </div>
                        <div>
                            <Link to="/" style={styles.link}>홈 |</Link>
                            <Link to="/community/freeboard" style={styles.link}>자유 게시판 |</Link>
                            <Link to="/community/question" style={styles.link}>질문 게시판 |</Link>
                            <Link to="/community/discussion" style={styles.link}>토론 게시판 |</Link>
                            <Link to="/community/drinkmate" style={styles.link}>술 메이트 게시판 |</Link>
                            <Link to="/products/cart">장바구니 |</Link>
                            <Link to="/products">제품 목록 |</Link>
                            {loggedIn ? (
                                <>
                                    <Link to="/chatbot" style={styles.link}>술추천챗봇 |</Link>
                                    <Link to={`/profile/${username}`} style={styles.link}>
                                        <span style={styles.span}>{username}님</span>
                                    </Link>
                                    <LogoutButton handleLogout={handleLogout} />
                                </>
                            ) : (
                                <>
                                    <Link to="/login" style={styles.link}>로그인</Link>
                                    <Link to="/signup" style={styles.link}>회원가입</Link>
                                </>
                            )}
                        </div>
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
                    <Route path="/accounts/verify-email/:uidb64/:token" element={<EmailVerification />} />
                    <Route path="products/cart" element={<Cart />} />
                    <Route path="/products/:product_id" element={<ProductDetail />} />
                    <Route path="/products" element={<ProductList />} />
                </Routes>

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

