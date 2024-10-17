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

    return (
        <div>
            <h2>{product.name}</h2>
            <p>가격: {product.price}원</p>
            <p>{product.description}</p>
            {product.image && (
                <img
                    src={`http://localhost:8000${product.image}`}
                    alt={product.name}
                    style={{ maxWidth: '70%', height: 'auto' }}
                />
            )}

            <div>
                <label>수량: </label>
                <input
                    type="number"
                    value={quantity}
                    min="1"
                    onChange={handleQuantityChange}
                />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button onClick={addToCart}>장바구니에 담기</button>
        </div>
    );
}

export default ProductDetail;







