import React, { useState, useEffect, useContext } from 'react';
import NavBar from '../nav-bar/navBar';
import Footer from '../footer/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BoardData from './BoardData';
import { ThemeContext } from '../dark-mode/ThemeContext';

export const BoardListPage = () => {
  const serverUrl = process.env.REACT_APP_BACK_END_API_URL;
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext); // 다크모드 적용

  const handleNavigateToPost = () => navigate('/board/post');

  const [res, setRes] = useState({ page: 1, totalPages: 1, data: [] });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // 데이터 fetch
  const fetchList = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/board/list?page=${page}`);
      // 공지글과 일반글을 분리
      const noticeList = response.data.data.filter((item) => item.notice); // notice=true
      const regularList = response.data.data.filter((item) => !item.notice);
      const combinedList = [...noticeList, ...regularList]; // 공지글 먼저
      setRes({ ...response.data, data: combinedList });
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
      className={`flex flex-col min-h-screen transition-colors duration-500 ${
        darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <NavBar />

      {/* 데이터 섹션 */}
      <div className="flex justify-center my-5">
        <div className="w-[70%]">
          {loading ? (
            <p
              className={`text-center py-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              불러오는 중...
            </p>
          ) : res.data.length > 0 ? (
            res.data.map((item) => {
              const formattedDate = new Date(
                item.createdAt
              ).toLocaleDateString();
              return (
                <BoardData
                  key={item.code}
                  code={item.code}
                  title={item.title}
                  authorNickName={item.authorNickName}
                  createdAt={formattedDate}
                  darkMode={darkMode}
                  notice={item.notice} // 공지글이면 BoardData에서 스타일 다르게 적용
                />
              );
            })
          ) : (
            <p
              className={`text-center py-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              } font-GowunBatang`}
            >
              데이터가 존재하지 않습니다.
            </p>
          )}
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-4 mb-6">
        {Array.from({ length: res.totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`mx-1 px-3 py-1 rounded transition-colors duration-300 ${
              currentPage === i + 1
                ? 'bg-blue-500 text-white'
                : darkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* 글쓰기 버튼 */}
      <div className="flex justify-end mx-7">
        <button
          className={`font-GowunBatang mx-6 my-5 px-4 py-2 rounded transition-colors duration-300 ${
            darkMode
              ? 'bg-gray-700 text-white hover:bg-blue-600'
              : 'bg-gray-100 text-black hover:bg-blue-300'
          }`}
          onClick={handleNavigateToPost}
        >
          글 쓰기
        </button>
      </div>

      <Footer />
    </div>
  );
};
