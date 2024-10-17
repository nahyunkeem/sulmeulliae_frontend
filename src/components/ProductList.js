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

    // 스타일 정의
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
        productList: {
            listStyleType: 'none',
            padding: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',  // 한 줄에 3개씩 배치
            gap: '20px',  // 각 항목 간의 간격
        },
        productItem: {
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
        },
        productLink: {
            textDecoration: 'none',
            color: '#3c6255',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            display: 'block',
            marginBottom: '10px',
        },
        productImage: {
            width: '250px',  // 이미지 너비 고정
            height: '250px',  // 이미지 높이 고정
            objectFit: 'contain',  // 이미지가 잘리지 않도록 설정
            borderRadius: '10px',
            marginBottom: '15px',
            backgroundColor: '#f0f0f0',  // 이미지가 없는 부분에 배경색 추가
        },
        price: {
            fontSize: '1.2rem',
            color: '#333',
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>이달의 술</h2>
            {products.length > 0 ? (
                <ul style={styles.productList}>
                    {products.map((product) => (
                        <li key={product.id} style={styles.productItem}>
                            <Link to={`/products/${product.id}`} style={styles.productLink}>
                                {product.name}
                            {product.image && (
                                <img
                                src={`https://api.sulmeulliae.com${product.image}`}
                                alt={product.name}
                                style={styles.productImage}
                                />
                            )}
                            <div style={styles.price}>{Math.floor(product.price)}원</div> {/* 소수점 제거 */}
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>로그인하셨다면 새로고침해주세요..</p>
            )}
        </div>
    );
}

export default ProductList;

