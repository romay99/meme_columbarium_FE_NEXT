// app/meme/list/page.tsx

// 1️⃣ SSR 강제
export const dynamic = 'force-dynamic';

import MemeData from '../components/MemeData';
import NavBar from '../../nav-bar/NavBar';
import Footer from '../../footer/Footer';
import SearchBar from '../components/SearchBar';

const serverUrl = process.env.NEXT_PUBLIC_BACK_END_API_URL;

// 2️⃣ 서버 컴포넌트로 기본 함수 작성
export default async function Page({ searchParams }) {
  // searchParams는 URL 쿼리 가져오기 가능
  const page = searchParams?.page || 1;
  const sortOption = searchParams?.sort || 'latest';
  const searchQuery = searchParams?.keyWord || '';

  // 3️⃣ 서버에서 데이터 fetch
  const res = await fetch(
    `${serverUrl}/meme/list?page=${page}&sort=${sortOption}&keyWord=${encodeURIComponent(
      searchQuery
    )}`,
    { cache: 'no-store' } // 매 요청마다 새 데이터
  );
  const data = await res.json();

  // 4️⃣ 서버 렌더링 HTML
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <NavBar />

      <section className="flex flex-col justify-center items-center my-4 px-4">
        <img
          src="/assets/logo.png"
          className="w-40 sm:w-52 md:w-64 lg:w-72 max-h-48 object-contain"
          alt="로고"
        />
        <p className="mt-2 sm:mt-3 text-center text-sm sm:text-base md:text-lg">
          한때 우리를 웃게 했던 모든 순간, 이제는 평안히 쉬길…
        </p>
      </section>

      {/* Client Component로 이벤트 처리 */}
      <SearchBar />

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

      <Footer />
    </div>
  );
}
