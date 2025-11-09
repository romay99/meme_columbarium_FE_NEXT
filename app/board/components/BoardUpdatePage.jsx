"use client";
import React, { useState, useRef, useEffect, useContext } from "react";
import MDEditor from "@uiw/react-md-editor";
import Navbar from "../../nav-bar/NavBar";
import Footer from "../../footer/Footer";
import { useParams, useNavigate } from "react-router-dom";
// import { ThemeContext } from "../dark-mode/ThemeContext";
import api from "../../api/api";
import { useRouter } from "next/navigation";

function BoardUpdatePage(props) {
  const router = useRouter();
  const serverUrl = process.env.NEXT_PUBLIC_BACK_END_API_URL;
  const code = props.memeCode;
  // const { darkMode } = useContext(ThemeContext);

  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const editorRef = useRef(null);
  const [board, setBoard] = useState("");
  const [loading, setLoading] = useState(true);

  // 이미지 업로드 및 커서 위치 삽입
  // const handleImageUpload = async (file) => {
  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     const response = await api.post(`${serverUrl}/board/image`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     const imageUrl = response.data;

  //     const textarea = editorRef.current?.textarea;
  //     if (textarea) {
  //       const start = textarea.selectionStart;
  //       const end = textarea.selectionEnd;
  //       const newText = contents.substring(0, start) + `![이미지](${imageUrl})` + contents.substring(end);
  //       setContents(newText);
  //     } else {
  //       setContents((prev) => prev + `![이미지](${imageUrl})`);
  //     }
  //   } catch (error) {
  //     console.error("이미지 업로드 실패", error);
  //   }
  // };

  // // 드래그앤드롭 이벤트
  // const handleDrop = (event) => {
  //   event.preventDefault();
  //   if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
  //     handleImageUpload(event.dataTransfer.files[0]);
  //     event.dataTransfer.clearData();
  //   }
  // };

  const handleSubmit = async () => {
    const postData = { code, title, contents };

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!contents.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/member/login");
      return;
    }

    try {
      await api.post(`${serverUrl}/board/update`, postData, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      alert("수정 성공!");
      router.push("/board/list");
    } catch (error) {
      console.error("수정 중 에러:", error);

      if (error.response?.status === 401) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("token");
        router.push("/member/login");
      } else if (error.response?.status === 403) {
        alert("권한이 없습니다.");
        router.push("/member/login");
      } else {
        alert("업로드에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 게시판 상세 데이터 불러오기
  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        const response = await api.get(`${serverUrl}/board/info?code=${code}`);

        if (response.data.authorNickName !== localStorage.getItem("nickname")) {
          alert("비 정상적인 접근입니다.");
          router.push("/board/list");
        }

        setBoard(response.data);
        setTitle(response.data.title);
        setContents(response.data.contents);
      } catch (error) {
        console.error("상세 데이터 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardDetail();
  }, []);

  return (
    <div className={"bg-white text-black min-h-screen"}>
      <Navbar />

      <div className="max-w-4xl mx-auto p-6 flex flex-col space-y-4">
        {/* 제목 */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">제목</label>
          <input className={"border rounded p-2 w-full bg-white text-black"} placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        {/* 마크다운 에디터 */}
        {/* <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} data-color-mode={darkMode ? "dark" : "light"}> */}
        <div data-color-mode={"light"}>
          <MDEditor
            value={contents}
            onChange={setContents}
            height={400}
            textareaProps={{
              ref: editorRef,
              placeholder: "마크다운 작성 (이미지 드래그앤드롭 가능)",
            }}
          />
        </div>

        {/* 실시간 미리보기 */}
        {/* 미리보기 */}
        <div data-color-mode={"light"}>
          <h3 className="font-semibold mb-2">미리보기</h3>
          <div className={`prose ${""} max-w-none`}>
            <MDEditor.Markdown source={contents} />
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <button className="w-35 bg-gray-500 rounded-lg text-white px-4 py-2 hover:bg-gray-400 transition" onClick={handleSubmit}>
            수정 완료
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BoardUpdatePage;
