import React, { useEffect, useState } from 'react';
import api from '../services/api';

function UserOrderHistory({ username }) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        api.get('/products/orders/items/')
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error('Error fetching order history:', error);
            });
    }, [username]);

    return (
        <div>
            <h3>구매 이력</h3>
            {orders.length === 0 ? (
                <p>구매 기록이 없습니다.</p>
            ) : (
                <ul>
                    {orders.map(order => (
                        <li key={order.id}>
                            <p>상품: {order.product}</p>
                            <p>수량: {order.quantity}</p>
                            <p>총 가격: {order.total_price}원</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default UserOrderHistory;