// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../services/api';

// function DrinkMateBoard() {
//     const [posts, setPosts] = useState([]);

//     useEffect(() => {
//         // 술 메이트 게시판 카테고리로 게시물 요청
//         api.get('/community/')
//             .then((response) => {
//                 setPosts(response.data);
//             })
//             .catch((error) => {
//                 console.error('술 메이트 게시판 로드 중 에러 발생:', error);
//             });
//     }, []);

//     return (
//         <div>
//             <h2>술 메이트 게시판</h2>
//             <Link to="/community/create">
//                 <button>글 작성</button>
//             </Link>
//             {posts.length > 0 ? (
//                 <ul>
//                     {posts
//                         .filter((post) => post.category === 6)
//                         .map((post) => (
//                         <li key={post.id}>
//                             <Link to={`/community/${post.id}`}>{post.author} | {post.title}</Link>
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p>게시물이 없습니다.</p>
//             )}
//         </div>
//     );
// }

// export default DrinkMateBoard;
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

function DrinkMateBoard() {
    const [chatRooms, setChatRooms] = useState([]);

    useEffect(() => {
        api.get('/chat/chatrooms/')
            .then((response) => {
                setChatRooms(response.data);
            })
            .catch((error) => {
                console.error('Error loading chat rooms:', error);
            });
    }, []);

    return (
        <div>
            <h2>채팅방 목록</h2>
            <Link to="/chat/createchat">
                <button>방 만들기</button>
            </Link>
            <ul>
                {chatRooms.map((room) => (
                    <li key={room.id}>
                        <Link to={`/chat/${room.id}`}>{room.name}</Link> {/* roomId로 이동 */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DrinkMateBoard;


