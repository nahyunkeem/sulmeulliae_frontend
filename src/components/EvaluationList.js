import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function EvaluationList() {
    const [evaluations, setEvaluations] = useState([]);
    const [filteredEvaluations, setFilteredEvaluations] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(''); 
    const [sortType, setSortType] = useState('created_at');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가
    const evaluationsPerPage = 20; // 페이지당 항목 수

    useEffect(() => {
        api.get('/evaluations/')
            .then((response) => {
                setEvaluations(response.data);
                setFilteredEvaluations(response.data); 
            })
            .catch((error) => {
                console.error('에러 발생:', error);
            });
    }, []);

    // 카테고리 필터링
    const filterByCategory = (category) => {
        setSelectedCategory(category);
        const filtered = category ? evaluations.filter(evaluation => evaluation.category === category) : evaluations;
        setFilteredEvaluations(filtered);
        sortEvaluations(filtered, sortType); // 필터링 후 정렬 유지
        setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 이동
    };

    // 정렬
    const sortEvaluations = (list, type) => {
        const sortedList = [...list].sort((a, b) => {
            if (type === 'like_count' || type === 'viewcounts' || type === 'avg_rating') {
                if (b[type] === a[type]) {
                    return new Date(b.created_at) - new Date(a.created_at); // 동일하면 최신순 정렬
                }
                return b[type] - a[type]; // 숫자 큰 순서대로 정렬
            }
            return new Date(b.created_at) - new Date(a.created_at); // 기본값: 최신순
        });
        setFilteredEvaluations(sortedList);
        setCurrentPage(1); // 정렬 변경 시 첫 페이지로 이동
    };

    // 정렬 선택
    const handleSortChange = (event) => {
        const type = event.target.value;
        setSortType(type); 
        sortEvaluations(filteredEvaluations, type); 
    };

    // 검색
    const handleSearch = () => {
        const term = searchTerm.toLowerCase();

        const filtered = evaluations.filter(evaluation =>
            evaluation.title.toLowerCase().includes(term) ||
            evaluation.content.toLowerCase().includes(term) ||
            evaluation.category.toLowerCase().includes(term)
        );

        setFilteredEvaluations(filtered);
        sortEvaluations(filtered, sortType); // 검색 후 정렬 유지
        setCurrentPage(1); // 검색 후 첫 페이지로 이동
    };

    // 페이지 변경 핸들러
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 현재 페이지에 맞는 평가 목록 계산
    const indexOfLastEvaluation = currentPage * evaluationsPerPage;
    const indexOfFirstEvaluation = indexOfLastEvaluation - evaluationsPerPage;
    const currentEvaluations = filteredEvaluations.slice(indexOfFirstEvaluation, indexOfLastEvaluation);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredEvaluations.length / evaluationsPerPage); i++) {
        pageNumbers.push(i);
    }

    const styles = {
        largeImageContainer: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '30px',
            marginBottom: '20px',
        },
        largeImage: {
            width: '100%',
            maxWidth: '1200px',
            height: 'auto',
            borderRadius: '10px',
        },
        container: {
            maxWidth: '1200px',
            margin: '50px auto',
            padding: '20px',
            backgroundColor: '#faf4e1',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        },
        categoryButtons: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px',
        },
        button: (category) => ({
            margin: '0 10px',
            padding: '10px 20px',
            backgroundColor: selectedCategory === category ? '#ccc' : '#fff',
            border: '1px solid #ddd',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: '#000',
        }),
        searchSection: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px',
        },
        searchInput: {
            width: '300px', 
            padding: '10px',
            fontSize: '16px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            marginRight: '10px',
        },
        searchButton: {
            padding: '10px 20px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
        },
        sortSelect: {
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            fontSize: '16px',
            marginLeft: '10px',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '20px',
            listStyleType: 'none',
            padding: 0,
        },
        listItem: {
            border: '1px solid #ddd',
            borderRadius: '10px',
            backgroundColor: '#fff',
            transition: 'transform 0.2s',
            textAlign: 'center',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        image: {
            width: '150px',
            height: '150px',
            objectFit: 'contain',
            marginBottom: '10px',
            borderRadius: '10px',
            cursor: 'pointer',
        },
        link: {
            fontSize: '1.2rem',
            color: '#000',
            textDecoration: 'none',
            fontWeight: 'bold',
            marginTop: '10px',
        },
        font: {
            fontSize: '0.8rem',
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
        },
        pageNumber: {
            margin: '0 5px',
            cursor: 'pointer',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            backgroundColor: '#fff',
        },
        activePageNumber: {
            margin: '0 5px',
            cursor: 'pointer',
            padding: '10px',
            border: '1px solid #333',
            borderRadius: '5px',
            backgroundColor: '#333',
            color: '#fff',
        }
    };

    return (
        <div>
            <div style={styles.largeImageContainer}>
                <img
                    src="/images/background_new.png"
                    alt="큰 이미지"
                    style={styles.largeImage}
                />
            </div>
            <div style={styles.container}>
                <div style={styles.searchSection}>
                    <input
                        type="text"
                        placeholder="검색어를 입력하세요 (제목, 내용, 카테고리)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                    <button style={styles.searchButton} onClick={handleSearch}>검색</button>

                    <select value={sortType} onChange={handleSortChange} style={styles.sortSelect}>
                        <option value="created_at">최신순</option>
                        <option value="like_count">좋아요순</option>
                        <option value="viewcounts">조회순</option>
                        <option value="avg_rating">평점순</option>
                    </select>
                </div>

                <div style={styles.categoryButtons}>
                    <button style={styles.button('')} onClick={() => filterByCategory('')}>전체</button>
                    <button style={styles.button('소주')} onClick={() => filterByCategory('소주')}>소주</button>
                    <button style={styles.button('맥주')} onClick={() => filterByCategory('맥주')}>맥주</button>
                    <button style={styles.button('와인')} onClick={() => filterByCategory('와인')}>와인</button>
                    <button style={styles.button('위스키')} onClick={() => filterByCategory('위스키')}>위스키</button>
                </div>

                <ul style={styles.grid}>
                    {currentEvaluations.map((evaluation, index) => (
                        <li key={evaluation.id} style={styles.listItem}>
                            <Link to={`/evaluations/${evaluation.id}`}>
                                {evaluation.images && evaluation.images[0] && (
                                    <img
                                        src={`https://api.sulmeulliae.com${evaluation.images[0].image}`}
                                        alt={`evaluation ${index}`}
                                        style={styles.image}
                                    />
                                )}
                            </Link>
                            <Link to={`/evaluations/${evaluation.id}`} style={styles.link}>
                                <div>{evaluation.title}</div>
                                <div style={styles.font}>{evaluation.category}</div>
                                <div style={styles.font}>{evaluation.origin}</div>
                                <div style={styles.font}>♥ {evaluation.like_count}</div>
                                <div style={styles.font}>{evaluation.avg_rating} / 5</div>
                                <div style={styles.font}>조회수: {evaluation.viewcounts}</div>
                            </Link>
                        </li>
                    ))}
                </ul>

                <div style={styles.pagination}>
                    {pageNumbers.map((number) => (
                        <span
                            key={number}
                            onClick={() => paginate(number)}
                            style={number === currentPage ? styles.activePageNumber : styles.pageNumber}
                        >
                            {number}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EvaluationList;
