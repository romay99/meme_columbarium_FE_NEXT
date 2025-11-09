import React from "react";
import BoardUpdatePage from "../../components/BoardUpdatePage";

export default async function Page({ params }) {
  const { id } = await params;
  return (
    <div>
      <BoardUpdatePage memeCode={id}></BoardUpdatePage>
    </div>
  );
}
