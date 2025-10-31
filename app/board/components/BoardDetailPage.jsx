import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../nav-bar/navBar';
import Footer from '../footer/Footer';
import MDEditor from '@uiw/react-md-editor';
import { ThemeContext } from '../dark-mode/ThemeContext';
import api from '../api/api';

const BoardDetailPage = () => {
  const serverUrl = process.env.REACT_APP_BACK_END_API_URL;
  const { code } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const [board, setBoard] = useState('');
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(1);
  const [totalCommentPages, setTotalCommentPages] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const handleNavigateToList = () => navigate('/board');

  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        const response = await api.get(`${serverUrl}/board/info?code=${code}`);
        setBoard(response.data);
      } catch (error) {
        console.error('상세 데이터 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBoardDetail();
  }, [code]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`${serverUrl}/comment/board/list`, {
          params: { page: commentPage, board: code },
        });
        setComments(response.data.data);
        setTotalCommentPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
      } catch (err) {
        console.error('댓글 불러오기 실패:', err);
      }
    };
    fetchComments();
  }, [commentPage, code]);

  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }
      const headers = { Authorization: token };
      await api.post(
        `${serverUrl}/comment/board/post`,
        { boardCode: board.code, contents: newComment },
        { headers }
      );
      alert('댓글이 등록되었습니다.');
      setNewComment('');
      setCommentPage(1);
      window.location.reload();
    } catch (err) {
      if (err.response?.status === 401) {
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        alert('댓글 등록에 실패했습니다.');
      }
    }
  };

  const boardDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }
      const headers = { Authorization: token };
      await api.delete(`${serverUrl}/board/delete`, {
        params: { boardCode: board.code },
        headers,
      });
      alert('게시글이 삭제되었습니다.');
      navigate('/board');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div
      className={`${
        darkMode
          ? 'bg-[rgb(13,17,23)] text-gray-100'
          : 'bg-white-50 text-gray-900'
      } min-h-screen flex flex-col`}
    >
      <NavBar />

      <main className="flex-grow container mx-auto px-6 py-10">
        {/* 게시글 제목 */}
        <div
          className={`mx-5 text-4xl font-bold mb-6 tracking-wide ${
            darkMode ? 'text-gray-100' : 'text-black'
          }`}
        >
          {board.title}
        </div>

        {/* 작성자 + 작성일 + 수정/삭제 */}
        <div className="mx-5 flex justify-between items-center mb-6">
          <span
            className={`text-sm font-GowunBatang ${
              darkMode ? 'text-gray-400' : 'text-black'
            }`}
          >
            작성자 : {board.authorNickName}
          </span>
          <span
            className={`text-sm font-GowunBatang ${
              darkMode ? 'text-gray-400' : 'text-black'
            }`}
          >
            작성일 : {new Date(board.createdAt).toLocaleString()}
          </span>

          {localStorage.getItem('nickname') === board.authorNickName && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/board/update/${board.code}`)}
                className="px-3 py-1 text-sm bg-blue-400 hover:bg-yellow-500 text-white rounded"
              >
                수정
              </button>
              <button
                onClick={() => {
                  if (window.confirm('정말 삭제하시겠습니까?')) boardDelete();
                }}
                className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {/* 게시글 내용 */}
        <div
          className={`mx-16 min-h-[200px] rounded-xl ${
            darkMode ? 'bg-black-900 ' : 'bg-white-50 '
          }`}
          data-color-mode={darkMode ? 'dark' : 'light'}
        >
          <MDEditor.Markdown
            source={board.contents}
            className={`prose ${darkMode ? 'prose-invert' : ''} max-w-none`}
          />
        </div>

        <div
          className={`border-t my-6 w-1/2 mx-auto ${
            darkMode ? 'border-gray-700' : 'border-gray-600'
          }`}
        ></div>

        {/* 댓글 섹션 */}
        <section className="mt-10 mx-14">
          <span>{totalCount}개의 댓글</span>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요"
              className={`flex-1 border rounded px-3 py-2 ${
                darkMode
                  ? 'bg-gray-800 text-gray-100 border-gray-700'
                  : 'bg-white text-gray-900 border-gray-300'
              }`}
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white transition-colors"
            >
              등록
            </button>
          </div>

          <ul className="space-y-3">
            {comments.map((c) => (
              <li
                key={c.code}
                className={`border rounded px-4 py-2 ${
                  darkMode
                    ? 'border-gray-700 bg-gray-800'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <div
                  className="flex justify-between text-sm mb-1"
                  className={darkMode ? 'text-gray-400' : 'text-gray-600'}
                >
                  <span>{c.authorNickName}</span>
                  <span>{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p>{c.contents}</p>
              </li>
            ))}
          </ul>

          <div className="flex justify-center mt-4 gap-2">
            {(() => {
              const pageLimit = 10;
              const startPage =
                Math.floor((commentPage - 1) / pageLimit) * pageLimit + 1;
              const endPage = Math.min(
                startPage + pageLimit - 1,
                totalCommentPages
              );
              const pages = [];

              pages.push(
                <button
                  key="prev-block"
                  disabled={startPage === 1}
                  onClick={() => setCommentPage(startPage - 1)}
                  className={`px-3 py-1 rounded ${
                    darkMode
                      ? 'bg-gray-700 text-gray-100 disabled:opacity-50'
                      : 'bg-gray-200 disabled:opacity-50'
                  }`}
                >
                  &lt;
                </button>
              );

              for (let page = startPage; page <= endPage; page++) {
                pages.push(
                  <button
                    key={page}
                    onClick={() => setCommentPage(page)}
                    className={`px-3 py-1 rounded ${
                      page === commentPage
                        ? 'bg-blue-500 text-white'
                        : darkMode
                        ? 'bg-gray-700 text-gray-100'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {page}
                  </button>
                );
              }

              pages.push(
                <button
                  key="next-block"
                  disabled={endPage === totalCommentPages}
                  onClick={() => setCommentPage(endPage + 1)}
                  className={`px-3 py-1 rounded ${
                    darkMode
                      ? 'bg-gray-700 text-gray-100 disabled:opacity-50'
                      : 'bg-gray-200 disabled:opacity-50'
                  }`}
                >
                  &gt;
                </button>
              );

              return pages;
            })()}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BoardDetailPage;
