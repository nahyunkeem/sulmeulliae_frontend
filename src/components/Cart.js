import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        api.get('/products/cart/')
            .then((response) => {
                setCartItems(response.data.items);
            })
            .catch((error) => {
                console.error('장바구니 로드 중 에러 발생:', error);
            });
    }, []);

    const handleSelectItem = (itemId) => {
        setSelectedItems((prevSelected) =>
            prevSelected.includes(itemId)
                ? prevSelected.filter((id) => id !== itemId)
                : [...prevSelected, itemId]
        );
    };

    const calculateTotalPrice = () => {
        return cartItems
            .filter((item) => selectedItems.includes(item.id))
            .reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleRemoveSelectedItems = async () => {
        if (selectedItems.length === 0) {
            alert('삭제할 항목을 선택해주세요.');
            return;
        }

        try {
            await Promise.all(
                selectedItems.map((itemId) => api.delete(`/products/cart/${itemId}/`))
            );
            setCartItems(cartItems.filter((item) => !selectedItems.includes(item.id)));
            setSelectedItems([]);
            alert('선택한 상품들이 장바구니에서 제거되었습니다.');
        } catch (error) {
            console.error('상품 삭제 중 에러 발생:', error);
            alert('상품 삭제에 실패했습니다.');
        }
    };

    const handlePayment = async () => {
    const selectedProducts = cartItems.filter((item) =>
        selectedItems.includes(item.id)
    );

    if (selectedProducts.length === 0) {
        alert('결제할 항목을 선택해주세요.');
        return;
    }

    try {
        const response = await api.post('/products/payment/kakaopay-cart/ready/', {
            products: selectedProducts.map((item) => ({
                product_id: item.product.id,
                quantity: item.quantity,
            })),
        });

        const { merchant_uid, amount } = response.data;

        const { IMP } = window;
        IMP.init('imp13787568');

        IMP.request_pay(
            {
                pg: 'kakaopay',
                merchant_uid: merchant_uid,
                name: '장바구니 결제',
                amount: amount,
                buyer_email: 'user@example.com',
                buyer_name: '홍길동',
                buyer_tel: '010-1234-5678',
            },
            async (paymentResponse) => {
                if (paymentResponse.success) {
                    try {
                        await api.post('/products/payment/kakaopay-cart/approve/', {
                            imp_uid: paymentResponse.imp_uid,
                            merchant_uid,
                        });

                        const updatedCart = cartItems.filter(
                            (item) => !selectedItems.includes(item.id)
                        );
                        setCartItems(updatedCart);
                        setSelectedItems([]);

                        alert('결제가 완료되었습니다.');
                    } catch (error) {
                        console.error('결제 승인 오류:', error);
                        alert('결제 승인에 실패했습니다.');
                    }
                } else {
                    alert(`결제 실패: ${paymentResponse.error_msg}`);
                }
            }
        );
    } catch (error) {
        // 서버로부터 받은 에러 메시지를 표시
        if (error.response && error.response.data && error.response.data.error) {
            // 서버에서 반환된 구체적인 오류 메시지를 보여줌
            alert(error.response.data.error);
        } else {
            alert('결제 준비에 실패했습니다.');
        }
    }
};

    return (
        <div>
            <h2>장바구니</h2>
            {cartItems.length > 0 ? (
                <ul>
                    {cartItems.map((item) => (
                        <li key={item.id}>
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => handleSelectItem(item.id)}
                            />
                            <strong>{item.product.name}</strong> - {item.quantity}개 - {item.price}원
                        </li>
                    ))}
                </ul>
            ) : (
                <p>장바구니가 비어 있습니다.</p>
            )}
            {selectedItems.length > 0 && (
                <div>
                    <p>총 결제 금액: {calculateTotalPrice()}원</p>
                    <button onClick={handleRemoveSelectedItems}>선택한 물품 삭제하기</button>
                    <button onClick={handlePayment}>선택한 물품 결제하기</button>
                </div>
            )}
        </div>
    );
}

export default Cart;



