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
        alert('🔞연령 확인\n청소년보호법 제 28조에 따라,\nSulmeulliae을 방문하거나 상품을 구매하기 위해선,\n법적 성인(만 19세 이상)이어야 합니다.');

    }, []);
    
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
            backgroundColor: '#150a0d',
            padding: '15px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        logoContainer: {
            display: 'flex',
            alignItems: 'center',
        },
        logo: {
            height: '60px',
            marginRight: '10px',
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
            backgroundColor: '#150a0d',
            color: '#f0e5d1',
            textAlign: 'center',
            padding: '15px',
            marginTop: 'auto',
        },
        footerLink: {
            color: '#ffd700',
            textDecoration: 'none',
        },
        body: {
            paddingTop: '20px',
        },
        // 새로 추가된 페이지들에 대한 스타일 정의
        productListContainer: {
            maxWidth: '1200px',
            margin: '50px auto',
            padding: '20px',
            backgroundColor: '#faf4e1',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        },
        productItem: {
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '10px',
            marginBottom: '20px',
        },
        productTitle: {
            fontSize: '1.5rem',
            color: '#333',
            marginBottom: '10px',
        },
        productPrice: {
            fontSize: '1.2rem',
            color: '#777',
        },
        productImage: {
            width: '100%',
            height: 'auto',
            borderRadius: '10px',
            marginBottom: '15px',
        },
        cartContainer: {
            maxWidth: '1200px',
            margin: '50px auto',
            padding: '20px',
            backgroundColor: '#faf4e1',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        },
        cartItem: {
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '10px',
            marginBottom: '20px',
        },
        cartTitle: {
            fontSize: '1.5rem',
            color: '#333',
            marginBottom: '10px',
        },
        cartTotal: {
            fontSize: '1.5rem',
            color: '#333',
            marginTop: '20px',
        },
        cartButton: {
            backgroundColor: '#ff1744',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'block',
            marginTop: '10px',
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
                                <img src="/images/sulmeulliae.png" alt="Sulmeulliae Logo" style={styles.logo} />
                            </Link>
                        </div>
                        <div>
                            <Link to="/" style={styles.link}>홈 |</Link>
                            <Link to="/products" style={styles.link}>이달의 술 Shop |</Link>
                            <Link to="/community/freeboard" style={styles.link}>자유 게시판 |</Link>
                            <Link to="/community/question" style={styles.link}>질문 게시판 |</Link>
                            <Link to="/community/discussion" style={styles.link}>토론 게시판 |</Link>
                            <Link to="/community/drinkmate" style={styles.link}>술친구 채팅방 |</Link>
                            {loggedIn ? (
                                <>
                                    <Link to="/chatbot" style={styles.link}>술추천챗봇 |</Link>
                                    <Link to={`/profile/${username}`} style={styles.link}>
                                        <span style={styles.span}>{username}님</span>
                                    </Link>
                                    <Link to="/products/cart" style={styles.link}>장바구니</Link>
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
                    <Route path="/products/cart" element={<Cart />} />
                    <Route path="/products/:product_id" element={<ProductDetail />} />
                    <Route path="/products" element={<ProductList />} />
                </Routes>

                <footer style={styles.footer}>
                    <p>© 2024 Sulmeulliae. All rights reserved.</p>
                    <p>
                        <span to="/privacy-policy" style={styles.footerLink}>개인정보 처리방침</span> {' '}
                        <span to="/terms-of-service" style={styles.footerLink}>이용약관</span>
                    </p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
