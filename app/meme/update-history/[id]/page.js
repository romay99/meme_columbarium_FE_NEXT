import React from "react";
import MemeUpdateHistoryPage from "../../components/MemeUpdateHistoryPage";

export default async function Page({ params }) {
  const { id } = await params; // ✅ await 해서 실제 값 가져오기
  return (
    <div>
      <MemeUpdateHistoryPage memeCode={id}></MemeUpdateHistoryPage>
    </div>
  );
}
