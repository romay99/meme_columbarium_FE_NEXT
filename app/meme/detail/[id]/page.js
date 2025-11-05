// app/meme/[code]/page.js
import Header from '../../../nav-bar/NavBar';
import Footer from '../../../footer/Footer';
import MemeMarkdown from '../../components/MemeMarkdown';
import dynamic from 'next/dynamic';
import MemeCommentsWrapper from '../../components/MemeCommentsWrapper';

const serverUrl = process.env.NEXT_PUBLIC_BACK_END_API_URL;

// CSR로 처리할 댓글 컴포넌트
// const MemeComments = dynamic(
//   () => import('../../components/MemeComments'),
//   { ssr: false } // CSR로만 렌더링
// );

export default async function Page({ params }) {
  const { id } = await params; // ✅ await 해서 실제 값 가져오기
  // 만약 Promise로 들어온다면
  // const { id } = await params;

  // SSR fetch
  const res = await fetch(`${serverUrl}/meme/info?code=${id}`, {
    cache: 'no-store', // 항상 최신 데이터 가져오기
  });
  const meme = await res.json();

  return (
    <div className="flex flex-col min-h-screen font-GowunBatang bg-white text-gray-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-10">
        <h1 className="font-GowunBatangBold text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 tracking-wide">
          {meme.title}
        </h1>

        <div className="border-t my-4 sm:my-6 w-3/4 sm:w-1/2 mx-auto border-gray-300 dark:border-gray-700" />

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm mb-4 sm:mb-6">
          <span>📂 {meme.category}</span>
          <span>👤 작성자: {meme.authorNickName}</span>
          <span>
            🕒 등록일: {new Date(meme.createdAt).toLocaleDateString()}
          </span>
          {meme.updatedAt && (
            <span>
              🔄 수정일: {new Date(meme.updatedAt).toLocaleDateString()}
            </span>
          )}
          <span>
            📌 {meme.startDate} ~ {meme.endDate}
          </span>
        </div>

        <div className="flex justify-center mb-4 sm:mb-6">
          <img
            src={meme.thumbnail}
            alt="밈 썸네일"
            className="w-40 sm:w-52 md:w-64 h-40 sm:h-52 md:h-64 rounded-lg shadow-md object-cover"
          />
        </div>

        <div
          className="mx-2 sm:mx-6 md:mx-16 p-4 sm:p-6 rounded-xl"
          data-color-mode="light"
        >
          <MemeMarkdown contents={meme.contents} />
        </div>

        {/* 댓글/좋아요는 CSR로 처리 */}
        <MemeCommentsWrapper
          memeCode={meme.code}
          likesCount={meme.likesCount}
        />
      </main>

      <Footer />
    </div>
  );
}
