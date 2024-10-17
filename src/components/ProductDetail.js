import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';

function ProductDetail() {
    const { product_id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1); // 수량 상태
    const [error, setError] = useState(''); // 에러 메시지 상태 추가

    // 제품 정보 로드
    useEffect(() => {
        api.get(`/products/${product_id}/`)
            .then((response) => {
                setProduct(response.data);
            })
            .catch((error) => {
                console.error('제품 상세 정보 로드 중 에러 발생:', error);
                setError('제품 정보를 불러오지 못했습니다.');
            });

        const script = document.createElement('script');
        script.src = "https://cdn.iamport.kr/v1/iamport.js";
        document.body.appendChild(script);
    }, [product_id]);


    const addToCart = () => {
        if (quantity < 1) {
            alert('수량은 1개 이상이어야 합니다.');
            return;
        }

        api.post('/products/cart/', {
            product_id: product.id,
            quantity: quantity,
        })
        .then(() => {
            alert('장바구니에 추가되었습니다.');
            setError('');
        })
        .catch((error) => {
            const errorMsg = error.response?.data?.error || '장바구니 추가에 실패했습니다.';
            console.error('장바구니 추가 중 에러 발생:', errorMsg);
            alert(errorMsg);
        });
    };

    // 수량 변경 핸들러
    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 1) {
            setQuantity(value);
        } else {
            alert('수량은 1개 이상이어야 합니다.');
        }
    };

    if (!product) return <div>Loading...</div>;

    // 인라인 스타일 정의
    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '50px auto',
            padding: '20px',
            backgroundColor: '#faf4e1',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',  // 중앙 정렬
        },
        heading: {
            fontSize: '2.5rem',
            marginBottom: '30px',
            color: '#333',
        },
        price: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#ff1744',
        },
        description: {
            fontSize: '1.1rem',
            marginBottom: '30px',
            lineHeight: '1.6',
            color: '#666',
        },
        image: {
            width: '250px', // 이미지 크기를 고정하여 통일감 부여
            height: '250px',
            objectFit: 'contain',
            marginBottom: '20px',
        },
        quantityContainer: {
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        quantityLabel: {
            fontSize: '1.1rem',
            marginRight: '10px',
        },
        quantityInput: {
            width: '80px',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            textAlign: 'center',
        },
        button: {
            padding: '10px 20px',
            backgroundColor: '#ff1744',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.2rem',
            fontWeight: 'bold',
        },
        error: {
            color: 'red',
            marginBottom: '20px',
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>{product.name}</h2>
            {product.image && (
                <img
                src={`https://api.sulmeulliae.com${product.image}`}
                alt={product.name}
                style={styles.image}
                />
            )}
            <p style={styles.description}>{product.description}</p>
            <p style={styles.price}>가격: {Math.floor(product.price)}원</p>

            <div style={styles.quantityContainer}>
                <label style={styles.quantityLabel}>수량:</label>
                <input
                    type="number"
                    value={quantity}
                    min="1"
                    onChange={handleQuantityChange}
                    style={styles.quantityInput}
                />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button style={styles.button} onClick={addToCart}>장바구니에 담기</button>
        </div>
    );
}

export default ProductDetail;





