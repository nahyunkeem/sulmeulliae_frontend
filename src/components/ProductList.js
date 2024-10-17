import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function ProductList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get('/products/')
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error('제품 목록 로드 중 에러 발생:', error);
            });
    }, []);

    return (
        <div>
            <h2>제품 목록</h2>
            {products.length > 0 ? (
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            <Link to={`/products/${product.id}`}>{product.name} - {product.price}원</Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>제품이 없습니다.</p>
            )}
        </div>
    );
}

export default ProductList;
