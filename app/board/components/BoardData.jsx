import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
// import { ThemeContext } from "../dark-mode/ThemeContext";

const BoardData = (props) => {
  const router = useRouter();
  // const { darkMode } = useContext(ThemeContext);

  const handleClick = () => {
    router.push(`/board/view/${props.code}`);
  };

  // 공지글 스타일 분기
  const containerClass = props.notice ? "bg-yellow-100 border-l-4 border-yellow-500 text-gray-900" : "bg-white border-black text-gray-900 hover:bg-gray-100";

  return (
    <div onClick={handleClick}>
      <div
        className={`shadow-md rounded-lg p-4 flex justify-between items-center 
                    hover:scale-105 transition-transform duration-200 border-b ${containerClass}`}
      >
        {/* 왼쪽 : 제목 */}
        <div className="font-GowunBatangBold my-1 text-xs">{props.notice ? `[공지] ${props.title}` : props.title}</div>

        {/* 오른쪽 : 닉네임 + 날짜 */}
        <div className={`flex space-x-4 text-xs ${"text-gray-600"}`}>
          <div>{props.authorNickName}</div>
          <div>{props.createdAt}</div>
        </div>
      </div>
    </div>
  );
};

export default BoardData;
