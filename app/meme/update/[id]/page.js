import React from "react";
import MemeUpdatePage from "../../components/MemeUpdatePage";

export default async function Page({ params }) {
  const { id } = await params; // ✅ await 해서 실제 값 가져오기
  return (
    <div>
      <MemeUpdatePage memeCode={id}></MemeUpdatePage>
    </div>
  );
}
