import React from "react";
import NavBar from "../../nav-bar/NavBar";
import Footer from "../../footer/Footer";

export const MyPage = () => {
  return (
    <div>
      <NavBar></NavBar>
      <section className="flex justify-center">
        <p className="mt-10">마이페이지는 오픈 준비중입니다! 조금만 기다려주세요!</p>
      </section>
      <Footer></Footer>
    </div>
  );
};
