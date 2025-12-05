'use client';
import React, { useState, useRef, useEffect, useContext } from 'react';
import MDEditor from '@uiw/react-md-editor';
import Navbar from '../../nav-bar/NavBar';
import Footer from '../../footer/Footer';
// import { useNavigate } from "react-router-dom";
// import { ThemeContext } from "../dark-mode/ThemeContext";
import api from '../../api/api';
import { useRouter } from 'next/navigation';

function MemePostPage() {
  const router = useRouter();
  // const { darkMode } = useContext(ThemeContext);
  const serverUrl = process.env.NEXT_PUBLIC_BACK_END_API_URL;
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contents, setContents] = useState('');
  const [category, setCategory] = useState('1');
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const editorRef = useRef(null);

  useEffect(() => setShowModal(true), []);

  useEffect(() => {
    verifyToken(); // 토큰 유효성 검사 한번 호출
    const fetchCategories = async () => {
      try {
        const response = await api.get(`${serverUrl}/meme/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('카테고리 불러오기 실패', error);
      }
    };
    fetchCategories();
  }, [serverUrl]);

  const verifyToken = async () => {
    try {
      await api.post(`${serverUrl}/member/check-verify`);
    } catch (err) {
      console.error('토큰 검증 실패:', err);
    }
  };

  const handleImageUpload = async (file) => {
    // 파일 타입 체크
    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      alert('JPG 또는 PNG 파일만 업로드 가능합니다.');
      return;
    }
    const resizeImage = (
      file,
      maxWidth = 1024,
      maxHeight = 1024,
      quality = 0.7
    ) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
          img.src = e.target.result;
        };

        img.onload = () => {
          let { width, height } = img;

          // 비율 유지
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const resizedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                });
                resolve(resizedFile);
              } else {
                reject(new Error('이미지 리사이징 실패'));
              }
            },
            'image/jpeg',
            quality
          );
        };

        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    };

    try {
      const resizedFile = await resizeImage(file);

      const formData = new FormData();
      formData.append('file', resizedFile);

      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        router.push('/member/login');
        return;
      }

      const response = await api.post(`${serverUrl}/meme/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token,
        },
      });

      const imageUrl = response.data;
      const textarea = editorRef.current?.textarea;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText =
          contents.substring(0, start) +
          `![이미지](${imageUrl})` +
          contents.substring(end);
        setContents(newText);
      } else {
        setContents((prev) => prev + `![이미지](${imageUrl})`);
      }
    } catch (error) {
      console.error('이미지 업로드 실패', error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleImageUpload(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };

  const uploadMeme = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/member/login');
      return;
    }

    // FormData 사용
    const formData = new FormData();
    formData.append('title', title);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('category', category);
    formData.append('contents', contents);

    if (thumbnail) {
      formData.append('thumbnail', thumbnail); // File 객체 추가
    } else {
      alert('썸네일을 선택해주세요.');
      return;
    }

    try {
      await api.post(`${serverUrl}/meme/upload`, formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('업로드 성공!');
      router.push('/meme/list');
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

  const handleSubmit = () => {
    if (
      !title.trim() ||
      !startDate ||
      !endDate ||
      !category ||
      !contents.trim() ||
      !thumbnail
    ) {
      alert('모든 필드를 올바르게 입력해주세요.');
      return;
    }
    // 날짜 유효성 검사
    if (startDate > endDate) {
      alert('시작 날짜는 종료 날짜보다 늦을 수 없습니다.');
      return;
    }
    uploadMeme();
  };

  // 컴포넌트 내부
  const resizeThumbnail = (file, size = 400, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => (img.src = e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // 중앙 크롭으로 정사각형 만들기
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;

        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

        canvas.toBlob(
          (blob) => {
            if (blob)
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            else reject(new Error('썸네일 리사이즈 실패'));
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = reject;
    });
  };

  // 썸네일 선택 핸들러
  const handleThumbnailChange = async (file) => {
    try {
      const resizedFile = await resizeThumbnail(file, 400, 0.8); // 400px 정사각형, 80% 압축
      setThumbnail(resizedFile);
      setThumbnailPreview(URL.createObjectURL(resizedFile));
    } catch (err) {
      console.error(err);
      alert('썸네일 처리에 실패했습니다.');
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
            제목
            <span className="text-red-500"> *</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              밈 제목은 수정이 불가합니다
            </span>
          </label>
          <input
            className={`border rounded p-2 w-full ${'bg-white text-black border-gray-300'}`}
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 썸네일 업로드 */}
        <div className="flex flex-col mt-4 font-semibold">
          <label className="mb-1 font-semibold">
            썸네일<span className="text-red-500"> *</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              썸네일은 수정이 불가합니다 / 썸네일은 1:1 정사각형 사이즈로
              리사이징 됩니다.
            </span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) handleThumbnailChange(file);
            }}
          />
          {thumbnailPreview && (
            <div className="mt-3">
              <p className="text-sm mb-2 text-gray-500">썸네일 미리보기</p>
              <img
                src={thumbnailPreview}
                alt="썸네일 미리보기"
                className="rounded-lg shadow-md max-h-64 object-contain border"
              />
            </div>
          )}
        </div>

        {/* 날짜 */}
        <div className="flex gap-4">
          <div className="flex flex-col w-1/2">
            <label className="mb-1 font-semibold">
              밈 흥한 날짜<span className="text-red-500"> *</span>
            </label>
            <input
              type="month"
              className={`border rounded p-2 w-full ${'bg-white text-black border-gray-300'}`}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-1 font-semibold">
              밈 망한 날짜<span className="text-red-500"> *</span>
            </label>
            <input
              type="month"
              className={`border rounded p-2 w-full ${'bg-white text-black border-gray-300'}`}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* 카테고리 */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">
            카테고리<span className="text-red-500"> *</span>
          </label>
          <select
            className={`border rounded p-2 w-full ${'bg-white text-black border-gray-300'}`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.code} value={cat.code}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 마크다운 에디터 */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border rounded p-2"
          data-color-mode={'light'}
        >
          <MDEditor
            value={contents}
            onChange={setContents}
            height={400}
            textareaProps={{
              ref: editorRef,
              placeholder: '마크다운 작성 (이미지 드래그앤드롭 가능)',
            }}
          />
        </div>

        {/* 미리보기 */}
        <div data-color-mode={'light'}>
          <h3 className="font-semibold mb-2">미리보기</h3>
          <div className={`prose ${''} max-w-none`}>
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

      {/* 정책 확인 모달 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-GowunBatang">
          <div
            className={`p-6 rounded-lg shadow-lg max-w-lg w-full ${'bg-white text-black'}`}
          >
            <h2 className="text-xl font-bold mb-4">업로드 전 확인</h2>
            <p className="mb-4">
              아래 내용을 확인하고 동의해주세요. <br />
              예를 누르면 동의한 것으로 간주됩니다.
            </p>
            <ul className="text-left mb-6 list-disc list-inside space-y-2">
              <li>모든 콘텐츠는 저작권 및 초상권을 준수해야 합니다.</li>
              <li>타인을 비방하거나 혐오, 폭력적, 성적인 내용은 금지됩니다.</li>
              <li>
                업로드한 밈은 삭제 요청이 있어도 즉시 삭제되지 않을 수 있습니다.
              </li>
              <li>
                업로드 후 발생하는 문제에 대한 책임은 작성자에게 있습니다.
              </li>
              <li>
                본 서비스를 통해 공유되는 모든 밈은 커뮤니티 가이드라인을
                따릅니다.
              </li>
            </ul>
            <div className="flex justify-end gap-4">
              <button
                className={`px-4 py-2 rounded transition ${'bg-gray-300 hover:bg-gray-400 text-black'}`}
                onClick={() => router.push('/meme/list')}
              >
                아니오
              </button>
              <button
                className={`px-4 py-2 rounded transition ${'bg-blue-500 hover:bg-blue-400 text-white'}`}
                onClick={() => setShowModal(false)}
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemePostPage;
