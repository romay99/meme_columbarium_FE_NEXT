'use client';

import { useRouter } from 'next/navigation';

function MainPage() {
  const router = useRouter();

  const handleNavigateToCommunity = () => {
    router.push('/meme/list');
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-100 to-gray-200 -z-10"></div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
        {/* 중앙 로고 */}
        <div className="mb-6">
          <img
            src="/assets/logo.png"
            alt="밈 납골당 로고"
            className="w-80 h-40 mx-auto opacity-90"
          />
        </div>

        {/* 제목 */}
        <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-4 font-GowunBatang">
          밈 납골당
        </h1>

        {/* 부제목 */}
        <p className="text-lg md:text-xl text-gray-600 font-GowunBatang italic mb-6 my-3">
          오늘도 먼저 간 밈들에게 안부를 전합니다
        </p>

        {/* 구분선 */}
        <div className="w-24 h-[2px] bg-gray-300 mb-8 mx-auto rounded"></div>

        {/* 버튼 */}
        <button
          onClick={handleNavigateToCommunity}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-orange-50 rounded-full shadow-md transition-all duration-200"
        >
          {/* 왼쪽 이미지 */}
          <img
            src="/assets/국화-아이콘.png" // 가져온 작은 이미지 경로
            alt="꽃"
            className="w-7 h-7 object-contain"
          />
          {/* 오른쪽 텍스트 */}
          <span className="text-gray-900 font-GowunBatangBold text-sm">
            꽃 한송이 놓으러가기
          </span>
        </button>
        <a
          href="https://www.flaticon.com/kr/free-icons/"
          title="국화 아이콘"
          className="hidden"
        >
          국화 아이콘 제작자: istar_design_bureau - Flaticon
        </a>
        {/* 바닥 문구 */}
        <p className="mt-12 text-sm text-gray-400">
          © 2025 Meme Memorial Service. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default MainPage;
