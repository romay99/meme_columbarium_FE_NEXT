'use client';
import React, { useState, useRef, useEffect, useContext } from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import Navbar from '../../nav-bar/NavBar';
import Footer from '../../footer/Footer';
import { useNavigate } from 'react-router-dom';
// import { ThemeContext } from "../dark-mode/ThemeContext";
import api from '../../api/api';
import { useRouter } from 'next/navigation';

function BoardPostPage() {
  const router = useRouter();
  // const { darkMode } = useContext(ThemeContext);
  const serverUrl = process.env.NEXT_PUBLIC_BACK_END_API_URL;
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');

  const editorRef = useRef(null);

  useEffect(() => {
    verifyToken(); // 토큰 유효성 검사 한번 호출
  }, []);

  const handleSubmit = async () => {
    const postData = { title, contents };

    // 유효성 검사
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!contents.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    // JWT 토큰 확인
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/member/login');
      return;
    }

    try {
      const response = await api.post(`${serverUrl}/board/post`, postData, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      alert('업로드 성공!');
      router.push('/board/list');
    } catch (error) {
      console.error('업로드 에러:', error);

      if (error.response?.status === 401) {
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('token');
        router.push('/member/login');
      } else if (error.response?.status === 403) {
        alert('권한이 없습니다.');
        router.push('/member/login');
      } else {
        alert('업로드에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const verifyToken = async () => {
    try {
      await api.post(`${serverUrl}/member/check-verify`);
    } catch (err) {
      console.error('토큰 검증 실패:', err);
    }
  };

  return (
    <div
      className={`${'bg-white text-black'} min-h-screen transition-colors duration-500`}
    >
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 flex flex-col space-y-4">
        {/* 제목 */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">
            제목<span className="text-red-500"> *</span>
          </label>
          <input
            className={`border rounded p-2 w-full ${'bg-white text-black border-gray-300'}`}
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 마크다운 에디터 */}
        <div className="border rounded p-2" data-color-mode={'light'}>
          <MDEditor
            value={contents}
            onChange={setContents}
            height={400}
            textareaProps={{
              ref: editorRef,
              placeholder: '마크다운 작성',
            }}
          />
        </div>

        {/* 미리보기 */}
        <div data-color-mode={'light'}>
          <h3 className="font-semibold mb-2">미리보기</h3>
          <div className={`prose ${''} max-w-none markdown-preview`}>
            <MDEditor.Markdown source={contents} />
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <button
            className={`w-35 rounded-lg px-4 py-2 transition ${'bg-gray-500 hover:bg-gray-400 text-white'}`}
            onClick={handleSubmit}
          >
            작성 완료
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BoardPostPage;
