import React, { useState, useContext, useEffect } from 'react';
import NavBar from '../nav-bar/navBar';
import Footer from '../footer/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../dark-mode/ThemeContext';

const SignUpPage = () => {
  const serverUrl = process.env.REACT_APP_BACK_END_API_URL;
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: '',
    password: '',
    passwordConfirm: '',
    email: '',
    nickname: '',
  });

  const [idAvailable, setIdAvailable] = useState(null);
  const [nicknameAvailable, setNicknameAvailable] = useState(null);

  const [idValid, setIdValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [nicknameValid, setNicknameValid] = useState(false);

  // 입력 변화 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'email') {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValid(regex.test(value));
    }

    if (name === 'id') {
      const idRegex = /^(?=.*[A-Za-z])[A-Za-z0-9]{5,}$/;
      setIdValid(idRegex.test(value));
    }

    if (name === 'password') {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
      setPasswordValid(passwordRegex.test(value));
    }

    if (name === 'nickname') {
      setNicknameValid(value.length >= 3);
    }
  };

  // ID 중복 체크
  const checkId = async () => {
    if (!formData.id) return alert('아이디를 입력해주세요.');
    if (!idValid) return alert('아이디 형식이 올바르지 않습니다.');
    try {
      const response = await axios.get(
        `${serverUrl}/member/check-id/${formData.id}`
      );
      setIdAvailable(response.data.available);
      alert(
        response.data.available
          ? '사용 가능한 아이디입니다!'
          : '이미 사용 중인 아이디입니다.'
      );
    } catch (error) {
      console.error(error);
      alert('ID 중복 확인 실패');
    }
  };

  // 닉네임 중복 체크
  const checkNickname = async () => {
    if (!formData.nickname) return alert('닉네임을 입력해주세요.');
    try {
      const response = await axios.get(
        `${serverUrl}/member/check-nick-name/${formData.nickname}`
      );
      setNicknameAvailable(response.data.available);
      alert(
        response.data.available
          ? '사용 가능한 닉네임입니다!'
          : '이미 사용 중인 닉네임입니다.'
      );
    } catch (error) {
      console.error(error);
      alert('닉네임 중복 확인 실패');
    }
  };

  // 제출 버튼
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idAvailable) return alert('ID 중복 체크를 해주세요.');
    if (!idValid) return alert('아이디 형식이 올바르지 않습니다.');
    if (!nicknameAvailable) return alert('닉네임 중복 체크를 해주세요.');
    if (!nicknameValid) return alert('닉네임은 3자 이상이어야 합니다.');
    if (!emailValid) return alert('올바른 이메일 형식이 아닙니다.');
    if (!passwordValid) return alert('비밀번호 형식이 올바르지 않습니다.');
    if (formData.password !== formData.passwordConfirm)
      return alert('비밀번호가 일치하지 않습니다.');

    try {
      const { id, password, email, nickname } = formData;
      const response = await axios.post(`${serverUrl}/member/signup`, {
        id,
        password,
        email,
        nickname,
      });
      alert(response.data);
      navigate('/login');
    } catch (error) {
      alert(error.response?.data || '회원가입 실패');
    }
  };

  // 조건 표시용 컴포넌트
  const ConditionItem = ({ valid, children }) => (
    <p className={`text-sm ${valid ? 'text-green-500' : 'text-red-500'}`}>
      {valid ? '✅' : '❌'} {children}
    </p>
  );

  // 모든 조건 만족 시 버튼 활성화
  const allValid =
    idValid &&
    passwordValid &&
    emailValid &&
    nicknameValid &&
    idAvailable &&
    nicknameAvailable &&
    formData.password === formData.passwordConfirm;

  return (
    <div
      className={`${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
      } min-h-screen`}
    >
      <NavBar />
      <div className="flex items-center justify-center min-h-screen px-4 my-5">
        <div
          className={`w-full max-w-md p-8 space-y-6 rounded-2xl shadow-lg transition ${
            darkMode
              ? 'bg-gray-800 shadow-gray-700'
              : 'bg-white shadow-gray-300'
          }`}
        >
          <div>
            <h2 className="text-2xl font-bold text-center">회원가입</h2>
            <p
              className={`mt-2 text-sm text-center ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              계정 정보를 입력해주세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 아이디 */}
            <div className="flex flex-col">
              <label
                className={`block text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                아이디
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  required
                  className={`flex-1 w-full rounded-xl shadow-sm p-3 border focus:ring-2 focus:ring-blue-300 transition ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400'
                      : 'bg-gray-50 border-gray-300 text-black focus:border-blue-500'
                  }`}
                  placeholder="아이디를 입력하세요"
                />
                <button
                  type="button"
                  onClick={checkId}
                  className={`px-4 rounded-xl transition ${
                    darkMode
                      ? 'bg-gray-600 hover:bg-gray-500 text-white'
                      : 'bg-gray-300 hover:bg-gray-400 text-black'
                  }`}
                >
                  중복확인
                </button>
              </div>
              <ConditionItem valid={idValid}>
                5자 이상, 알파벳 또는 알파벳+숫자 조합
              </ConditionItem>
            </div>

            {/* 비밀번호 */}
            <div>
              <label
                className={`block text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`mt-1 w-full rounded-xl p-3 border shadow-sm focus:ring-2 transition ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400'
                    : 'bg-gray-50 border-gray-300 text-black focus:border-blue-500 focus:ring-blue-300'
                }`}
                placeholder="비밀번호를 입력하세요"
              />
              <div className="mt-1">
                <ConditionItem valid={formData.password.length >= 8}>
                  8자 이상
                </ConditionItem>
                <ConditionItem valid={/[A-Z]/.test(formData.password)}>
                  대문자 포함
                </ConditionItem>
                <ConditionItem valid={/[a-z]/.test(formData.password)}>
                  소문자 포함
                </ConditionItem>
                <ConditionItem
                  valid={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                    formData.password
                  )}
                >
                  특수문자 1개 이상 포함
                </ConditionItem>
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label
                className={`block text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                비밀번호 확인
              </label>
              <input
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
                className={`mt-1 w-full rounded-xl p-3 border shadow-sm focus:ring-2 transition ${
                  formData.passwordConfirm &&
                  formData.password !== formData.passwordConfirm
                    ? 'border-red-500'
                    : darkMode
                    ? 'border-gray-600'
                    : 'border-gray-300'
                } ${
                  darkMode
                    ? 'bg-gray-700 text-white focus:border-blue-400 focus:ring-blue-400'
                    : 'bg-gray-50 text-black focus:border-blue-500 focus:ring-blue-300'
                }`}
                placeholder="비밀번호를 다시 입력하세요"
              />
              {formData.passwordConfirm &&
                formData.password !== formData.passwordConfirm && (
                  <p className="text-red-500 text-sm mt-1">
                    비밀번호가 일치하지 않습니다.
                  </p>
                )}
            </div>

            {/* 이메일 */}
            <div>
              <label
                className={`block text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`mt-1 w-full rounded-xl p-3 border shadow-sm focus:ring-2 transition ${
                  !emailValid
                    ? 'border-red-500'
                    : darkMode
                    ? 'border-gray-600'
                    : 'border-gray-300'
                } ${
                  darkMode
                    ? 'bg-gray-700 text-white focus:border-blue-400 focus:ring-blue-400'
                    : 'bg-gray-50 text-black focus:border-blue-500 focus:ring-blue-300'
                }`}
                placeholder="이메일을 입력하세요"
              />
              {!emailValid && (
                <p className="text-red-500 text-sm mt-1">
                  올바른 이메일 형식이 아닙니다.
                </p>
              )}
            </div>

            {/* 닉네임 */}
            <div className="flex flex-col">
              <label
                className={`block text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                닉네임
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  required
                  className={`flex-1 w-full rounded-xl shadow-sm p-3 border focus:ring-2 transition ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400'
                      : 'bg-gray-50 border-gray-300 text-black focus:border-blue-500 focus:ring-blue-300'
                  }`}
                  placeholder="닉네임을 입력하세요"
                />
                <button
                  type="button"
                  onClick={checkNickname}
                  className={`px-4 rounded-xl transition ${
                    darkMode
                      ? 'bg-gray-600 hover:bg-gray-500 text-white'
                      : 'bg-gray-300 hover:bg-gray-400 text-black'
                  }`}
                >
                  중복확인
                </button>
              </div>
              <div className="mt-1">
                <ConditionItem valid={nicknameValid}>3자 이상</ConditionItem>
                {nicknameAvailable !== null && (
                  <p
                    className={`text-sm mt-1 ${
                      nicknameAvailable ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {nicknameAvailable
                      ? '✅ 사용 가능한 닉네임입니다.'
                      : '❌ 이미 사용 중인 닉네임입니다.'}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!allValid}
              className={`w-full py-3 rounded-xl font-semibold shadow transition ${
                allValid
                  ? darkMode
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              회원가입
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpPage;
