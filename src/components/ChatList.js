import { useNavigate } from 'react-router-dom';

function ChatList({ chatRooms }) {
    const navigate = useNavigate();

    const handleEnterRoom = (roomName) => {
        // 채팅방 입장 시 roomId를 제대로 전달
        navigate(`/chat/${roomName}`);
    };

    return (
        <div>
            <h2>채팅방 목록</h2>
            <ul>
                {chatRooms.map((room) => (
                    <li key={room.id}>
                        <button onClick={() => handleEnterRoom(room.name)}>
                            {room.name} 입장
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChatList;



