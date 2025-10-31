import React, { useContext, useState } from 'react';
import axios from 'axios';
import NavBar from '../nav-bar/navBar';
import Footer from '../footer/Footer';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../dark-mode/ThemeContext'; // ✅ 다크모드 context 가져오기

const LoginPage = () => {
  const serverUrl = process.env.REACT_APP_BACK_END_API_URL;
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext); // ✅ 다크모드 상태 가져오기

  const [formData, setFormData] = useState({
    id: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUpPage = () => {
    navigate('/signup');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ withCredentials 추가: 브라우저가 쿠키(리프레시 토큰) 저장하도록
      const response = await axios.post(serverUrl + '/member/login', formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, // 중요!
      });

      const { token, type, nickname } = response.data;

      // 액세스 토큰만 로컬스토리지에 저장
      localStorage.setItem('token', `${type} ${token}`);
      localStorage.setItem('nickname', nickname);

      alert(`${nickname}님, 환영합니다!`);
      window.location.href = '/meme';
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div
      className={darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}
    >
      <NavBar />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className={`w-full max-w-md p-8 space-y-6 rounded-2xl shadow-lg transition 
          ${
            darkMode
              ? 'bg-gray-800 shadow-gray-700'
              : 'bg-white shadow-gray-300'
          }`}
        >
          {/* 헤더 */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-1">로그인</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              계정 정보를 입력해주세요
            </p>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="space-y-5 font-GowunBatang">
            <div>
              <label className="block text-sm font-medium mb-1">아이디</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                required
                className={`w-full rounded-xl p-3 border focus:ring-2 transition 
                ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 focus:ring-blue-400'
                    : 'bg-gray-50 border-gray-300 focus:ring-blue-300'
                }`}
                placeholder="아이디를 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">비밀번호</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full rounded-xl p-3 border focus:ring-2 transition 
                ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 focus:ring-blue-400'
                    : 'bg-gray-50 border-gray-300 focus:ring-blue-300'
                }`}
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition duration-300"
            >
              로그인
            </button>
          </form>

          {/* 하단 메뉴 */}
          <div className="flex justify-between text-sm mt-4 font-GowunBatang">
            <button
              className="hover:text-blue-500 transition"
              onClick={handleSignUpPage}
            >
              회원가입
            </button>
            <button className="hover:text-blue-500 transition">
              비밀번호 찾기
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
