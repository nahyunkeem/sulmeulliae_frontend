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
        const total = cartItems
            .filter((item) => selectedItems.includes(item.id))
            .reduce((total, item) => total + (item.price * item.quantity) / item.quantity, 0);  // 개당 가격에 수량 곱하기
    
        return total.toLocaleString('ko-KR');  // 천 단위 구분이 있는 한국 원화 형식으로 변환
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
            if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error);
            } else {
                alert('결제 준비에 실패했습니다.');
            }
        }
    };

    // 인라인 스타일 정의
    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '50px auto',
            padding: '20px',
            backgroundColor: '#faf4e1',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        },
        heading: {
            fontSize: '2.5rem',
            marginBottom: '30px',
            textAlign: 'center',
            color: '#333',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '30px',
        },
        th: {
            padding: '10px',
            backgroundColor: '#f0e5d1',
            borderBottom: '2px solid #ddd',
            textAlign: 'left',
        },
        td: {
            padding: '10px',
            borderBottom: '1px solid #ddd',
            textAlign: 'left',
        },
        totalPrice: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'right',
            marginTop: '30px',
        },
        buttonsContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '20px',
        },
        button: {
            padding: '10px 20px',
            backgroundColor: '#ff1744',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            marginLeft: '10px',
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>장바구니</h2>
            {cartItems.length > 0 ? (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>선택</th>
                            <th style={styles.th}>제품명</th>
                            <th style={styles.th}>수량</th>
                            <th style={styles.th}>가격</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.id}>
                                <td style={styles.td}>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        onChange={() => handleSelectItem(item.id)}
                                    />
                                </td>
                                <td style={styles.td}>{item.product.name}</td>
                                <td style={styles.td}>{item.quantity}개</td>
                                <td style={styles.td}>{Math.floor(item.price)}원</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>장바구니가 비어 있습니다.</p>
            )}
            {selectedItems.length > 0 && (
                <div>
                    <p style={styles.totalPrice}>총 결제 금액: {calculateTotalPrice()}원</p>
                    <div style={styles.buttonsContainer}>
                        <button style={styles.button} onClick={handleRemoveSelectedItems}>선택한 물품 삭제</button>
                        <button style={styles.button} onClick={handlePayment}>선택한 물품 결제</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
