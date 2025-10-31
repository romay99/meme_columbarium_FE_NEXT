import React, { useEffect, useState, useContext } from 'react';
import NavBar from '../nav-bar/navBar';
import Footer from '../footer/Footer';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ThemeContext } from '../dark-mode/ThemeContext';
import api from '../api/api';

const MemeUpdateHistory = () => {
  const serverUrl = process.env.REACT_APP_BACK_END_API_URL;
  const { code } = useParams();
  const [res, setRes] = useState({ page: 1, totalPages: 1, data: [] });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext); // 다크모드 적용

  // 데이터 fetch
  const fetchList = async (page) => {
    setLoading(true);
    try {
      const response = await api.get(
        `${serverUrl}/meme/history?page=${page}&code=${code}`
      );
      setRes(response.data);
    } catch (error) {
      console.error('데이터 불러오기 실패', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ${
        darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <NavBar />

      <main className="flex-1 py-6">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <h1 className="text-2xl font-bold mb-6 text-center font-GowunBatang">
            수정 기록
          </h1>

          {loading ? (
            <p
              className={`text-center py-10 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              불러오는 중...
            </p>
          ) : res.data.length === 0 ? (
            <p
              className={`text-center py-10 ${
                darkMode ? 'text-gray-500' : 'text-gray-600'
              }`}
            >
              데이터가 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-4">
              {res.data.map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl shadow p-3 border w-[300px] h-48 flex flex-col justify-between mx-auto transition-colors duration-300 ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-100'
                  }`}
                >
                  <h2 className="text-base font-semibold mb-1 truncate">
                    {item.title}
                  </h2>

                  <div
                    className={`text-xs space-y-1 flex-1 overflow-hidden ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    <p className="truncate">
                      <span className="font-medium">카테고리:</span>{' '}
                      {item.category} ({item.categoryCode})
                    </p>
                    <p className="truncate">
                      <span className="font-medium">작성자:</span>{' '}
                      {item.modifier}
                    </p>
                    <p className="truncate">
                      <span className="font-medium">버전:</span> v{item.version}
                    </p>
                    <p className="truncate">
                      <span className="font-medium">기간:</span>{' '}
                      {item.startDate} ~ {item.endDate}
                    </p>
                    <p className="truncate">
                      <span className="font-medium">수정일:</span>{' '}
                      {item.updateAt || '—'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: res.totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded-md border transition-colors duration-300 ${
                  currentPage === i + 1
                    ? 'bg-blue-500 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MemeUpdateHistory;
