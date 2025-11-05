// app/meme/list/page.tsx
import MemeData from '../components/MemeData';
import NavBar from '../../nav-bar/NavBar';
import Footer from '../../footer/Footer';
import SearchBar from '../components/SearchBar';

const serverUrl = process.env.NEXT_PUBLIC_BACK_END_API_URL;

// SSR 강제
export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }) {
  // searchParams: URL 쿼리에서 가져오기
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const sortOption = params?.sort || 'latest';
  const searchQuery = params?.keyWord || '';

  // 서버에서 데이터 fetch
  const res = await fetch(
    `${serverUrl}/meme/list?page=${page}&sort=${sortOption}&keyWord=${encodeURIComponent(
      searchQuery
    )}`,
    { cache: 'no-store' }
  );
  const data = await res.json();

  // 총 페이지 수 계산 (백엔드에서 totalPages 제공한다고 가정)
  const totalPages = data.totalPages || 1;

  // 페이지 번호 배열
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <NavBar />

      <section className="flex flex-col justify-center items-center my-4 px-4">
        <img
          src="/assets/logo.png"
          className="w-40 sm:w-52 md:w-64 lg:w-72 max-h-48 object-contain"
          alt="로고"
        />
        <p className="mt-2 sm:mt-3 text-center text-sm sm:text-base md:text-lg font-GowunBatang">
          한때 우리를 웃게 했던 모든 순간, 이제는 평안히 쉬길…
        </p>
      </section>

      {/* 검색바 (클라이언트 컴포넌트) */}
      <SearchBar />

      {/* 밈 리스트 */}
      <div className="flex-grow px-4 sm:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 p-2 sm:p-6">
          {data.data.length > 0 ? (
            data.data.map((item) => (
              <MemeData
                key={item.code}
                code={item.code}
                title={item.title}
                startDate={item.startDate}
                endDate={item.endDate}
                category={item.category}
              />
            ))
          ) : (
            <p className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-5 text-center text-gray-500">
              데이터가 존재하지 않습니다.
            </p>
          )}
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center flex-wrap mt-4 mb-6 px-4 sm:px-12">
        {pageNumbers.map((num) => (
          <a
            key={num}
            href={`?page=${num}&sort=${sortOption}&keyWord=${encodeURIComponent(
              searchQuery
            )}`}
            className={`mx-1 my-1 px-3 py-1 rounded transition-colors duration-300 ${
              num === page
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black hover:bg-blue-300'
            }`}
          >
            {num}
          </a>
        ))}
      </div>

      {/* 등록 버튼 */}
      <div className="flex justify-end px-4 sm:px-12 mb-6">
        <a
          href="/meme/post"
          className={`font-GowunBatang mx-2 sm:mx-6 my-2 px-5 py-2.5 rounded-lg shadow-md text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 hover:scale-105 active:scale-95 transition-all duration-300`}
        >
          밈 등록하기
        </a>
      </div>

      <Footer />
    </div>
  );
}
