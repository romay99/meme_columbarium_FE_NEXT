'use client';
import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeContext } from '../dark-mode/ThemeContext';
import api from '../api/api';

function NavBar() {
  const router = useRouter();
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const serverUrl = process.env.NEXT_PUBLIC_BACK_END_API_URL;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menus = [
    { name: '홈', path: '/' },
    { name: '밈 납골당', path: '/meme/list' },
    { name: '자유 게시판', path: '/board/list' },
    { name: '소개', path: '/intro' },
    { name: '마이 페이지', path: '/mypage' },
  ];

  const handleLogout = async () => {
    try {
      await api.post(
        `${serverUrl}/member/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.clear();
      router.refresh(); // 페이지 새로고침
    } catch (err) {
      console.error('로그아웃 실패:', err);
      alert('로그아웃에 실패했습니다.');
    }
  };

  return (
    <nav
      className={`shadow-md transition-colors duration-500 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-2 flex justify-between items-center">
        {/* 좌측 메뉴 (PC) */}
        <div className="hidden md:flex space-x-8 items-center">
          {menus.map((menu, idx) => {
            if (menu.name === '마이 페이지' && !token) return null;
            return (
              <Link
                key={idx}
                href={menu.path}
                className={`font-GowunBatangBold px-4 py-2 font-medium text-lg transition-colors duration-300 ${
                  darkMode
                    ? 'text-white hover:text-gray-300'
                    : 'text-black hover:text-gray-500'
                }`}
              >
                {menu.name}
              </Link>
            );
          })}
        </div>

        {/* 모바일 햄버거 버튼 */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`px-3 py-1 rounded transition-colors duration-300 ${
              darkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-300 text-black hover:bg-gray-400'
            }`}
          >
            ☰
          </button>
        </div>

        {/* 우측 버튼 그룹 */}
        <div className="flex items-center space-x-2">
          {/* 다크모드 버튼 */}
          {/* <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-3 py-1 rounded transition-colors duration-300 ${
              darkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-300 text-black hover:bg-gray-400'
            }`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button> */}

          {/* 로그인/로그아웃 버튼 (PC) */}
          <div className="hidden md:flex items-center space-x-2">
            {!token ? (
              <Link
                href="/member/login"
                className={`font-GowunBatangBold px-4 py-2 rounded-lg transition-colors duration-300 ${
                  darkMode
                    ? 'bg-gray-600 text-white hover:bg-gray-500'
                    : 'bg-gray-600 text-white hover:bg-blue-700'
                }`}
              >
                로그인
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className={`font-GowunBatangBold px-4 py-2 rounded-lg transition-colors duration-300 ${
                  darkMode
                    ? 'bg-gray-600 text-white hover:bg-gray-500'
                    : 'bg-gray-600 text-white hover:bg-green-700'
                }`}
              >
                로그아웃
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 모바일 사이드바 */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300">
          <h2
            className={`font-GowunBatangBold text-lg ${
              darkMode ? 'text-white' : 'text-black'
            }`}
          >
            메뉴
          </h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className={`text-xl ${darkMode ? 'text-white' : 'text-black'}`}
          >
            ×
          </button>
        </div>

        <div className="flex flex-col mt-4 space-y-4 px-6">
          {menus.map((menu, idx) => {
            if (menu.name === '마이 페이지' && !token) return null;
            return (
              <Link
                key={idx}
                href={menu.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`font-GowunBatangBold text-base py-2 transition-colors duration-300 ${
                  darkMode
                    ? 'text-white hover:text-gray-300'
                    : 'text-black hover:text-gray-500'
                }`}
              >
                {menu.name}
              </Link>
            );
          })}

          {/* 로그인/로그아웃 버튼 (모바일) */}
          {!token ? (
            <Link
              href="/login"
              onClick={() => setIsSidebarOpen(false)}
              className={`font-GowunBatangBold mt-4 px-4 py-2 rounded-lg transition-colors duration-300 ${
                darkMode
                  ? 'bg-gray-600 text-white hover:bg-gray-500'
                  : 'bg-gray-600 text-white hover:bg-blue-700'
              }`}
            >
              로그인
            </Link>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setIsSidebarOpen(false);
              }}
              className={`font-GowunBatangBold mt-4 px-4 py-2 rounded-lg transition-colors duration-300 ${
                darkMode
                  ? 'bg-gray-600 text-white hover:bg-gray-500'
                  : 'bg-gray-600 text-white hover:bg-green-700'
              }`}
            >
              로그아웃
            </button>
          )}
        </div>
      </div>

      {/* 모바일 사이드바 배경 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </nav>
  );
}

export default NavBar;
