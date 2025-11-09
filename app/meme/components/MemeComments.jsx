"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import api from "../../api/api";

const MemeComments = (props) => {
  const serverUrl = process.env.NEXT_PUBLIC_BACK_END_API_URL;
  const router = useRouter();
  const [meme, setMeme] = useState(null);
  const [likeCnt, setLikeCnt] = useState(0);

  const handleNavigateToList = () => router.push("/meme/list");

  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(1);
  const [totalCommentPages, setTotalCommentPages] = useState(1);
  const [newComment, setNewComment] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`${serverUrl}/comment/meme/list`, {
          params: { page: commentPage, meme: props.memeCode },
        });
        setComments(res.data.data);
        setTotalCommentPages(res.data.totalPages);
        setTotalCount(res.data.totalCount);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
    checkLikeButton();
    setLikeCnt(props.likesCount);
  }, [commentPage]);

  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }
      await api.post(`${serverUrl}/comment/meme/post`, { memeCode: props.memeCode, contents: newComment }, { headers: { Authorization: token } });
      setNewComment("");
      setCommentPage(1);
      window.location.reload();
    } catch (err) {
      if (err.response?.status === 401) {
        alert("로그인이 만료되었습니다.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error(err);
        alert("댓글 등록 실패");
      }
    }
  };

  const checkLikeButton = async () => {
    const token = localStorage.getItem("token");
    if (!token || token.length == 0) return; // 토큰이 존재할때만 실행

    await api
      .get(`${serverUrl}/likes/check?orgMemeCode=${props.orgMemeCode}`, { headers: { Authorization: token } })
      .then((res) => {
        if (res.data) {
          setIsLiked(true);
        }
      })
      .catch();
  };
  const handleLikeClick = async () => {
    try {
      if (isLiked) {
        await api.post(`${serverUrl}/likes/rm`, { memeCode: props.memeCode });
        setMeme((prev) => ({ ...prev, likes: false }));
        setLikeCnt((prev) => prev - 1);
        setIsLiked(false);
        alert("꽃 한송이 거두어갑니다.");
      } else {
        await api.post(`${serverUrl}/likes/add`, { memeCode: props.memeCode });
        setMeme((prev) => ({ ...prev, likes: true }));
        setLikeCnt((prev) => prev + 1);
        setIsLiked(true);
        alert("꽃 한송이 놓고갑니다.");
      }
    } catch (err) {
      alert("로그인이 필요합니다");
      router.push("/member/login");
    }
  };
  return (
    <div>
      <section className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4 sm:mt-6">
        <button onClick={handleLikeClick} className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all duration-200 ${isLiked ? "bg-orange-600 hover:bg-orange-500" : "bg-gray-300 hover:bg-gray-400 text-gray-900"}`}>
          <img src="/assets/국화-아이콘.png" alt="꽃" className="w-6 sm:w-7 h-6 sm:h-7 object-contain" />
          <span className="font-GowunBatangBold text-sm sm:text-base">꽃 한송이</span>
        </button>
        <span className="font-GowunBatangBold text-sm sm:text-base">총 {likeCnt} 송이</span>
      </section>

      <div className="flex flex-wrap sm:flex-nowrap justify-end gap-2 sm:gap-3 mt-4">
        <button onClick={() => router.push(`/meme/update/${props.memeCode}`)} className={`px-3 sm:px-4 py-2 rounded ${"bg-green-300 hover:bg-green-400 text-gray-900"}`}>
          밈 수정하기
        </button>
        <button onClick={() => router.push(`/meme/update-history/${props.orgMemeCode}`)} className={`px-3 sm:px-4 py-2 rounded ${"bg-blue-300 hover:bg-blue-400 text-gray-900"}`}>
          수정기록 열람
        </button>
      </div>

      {/* <AdsenseAd></AdsenseAd> */}

      <section className="mt-6 sm:mt-10 mx-2 sm:mx-4 md:mx-14">
        <span>{totalCount}개의 댓글</span>
        <div className="flex flex-col sm:flex-row gap-2 mt-2 mb-4">
          <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="댓글을 입력하세요" className={`flex-1 border rounded px-2 sm:px-3 py-2 ${"bg-gray-200 text-gray-900 placeholder-gray-500"}`} />
          <button onClick={handleAddComment} className={`px-3 sm:px-4 py-2 rounded ${"bg-gray-400 hover:bg-gray-300 text-gray-900"}`}>
            등록
          </button>
        </div>

        <ul className="space-y-2 sm:space-y-3">
          {comments.map((c) => (
            <li key={c.code} className={`border rounded px-3 sm:px-4 py-2 ${"bg-white text-gray-900 border-gray-300"}`}>
              <div className="flex justify-between text-xs sm:text-sm mb-1">
                <span>{c.authorNickName}</span>
                <span>{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm sm:text-base">{c.contents}</p>
            </li>
          ))}
        </ul>

        {/* 페이지네이션 */}
        <div className="flex flex-wrap justify-center mt-3 gap-1 sm:gap-2">
          {Array.from({ length: totalCommentPages }, (_, i) => (
            <button key={i} onClick={() => setCommentPage(i + 1)} className={`px-2 sm:px-3 py-1 rounded text-sm sm:text-base ${i + 1 === commentPage ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
              {i + 1}
            </button>
          ))}
        </div>
      </section>

      <section className="flex justify-end mt-4 sm:mt-6 mx-2 sm:mx-6 md:mx-14">
        <button onClick={handleNavigateToList} className={`px-4 py-2 rounded ${"bg-gray-300 hover:bg-blue-400 text-gray-900"}`}>
          목록
        </button>
      </section>
    </div>
  );
};

export default MemeComments;
