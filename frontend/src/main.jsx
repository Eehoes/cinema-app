import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import "./main.css";

import Signup from "./signup.jsx";
import Booking from "./booking.jsx";
import MyPage from "./mypage.jsx";

import movie1 from "./assets/movie1.jpg";
import movie2 from "./assets/movie2.jpg";
import movie3 from "./assets/movie3.jpg";
import movie4 from "./assets/movie4.jpg";

import loginImage from "./assets/login.jpg";


function main() {

  /* =========================
     영화 데이터
  ========================= */

  const movies = [
    {
      id: 1,
      title: "A영화",
      poster: movie1,
      likes: "5.6k",
      rating: "9.1",
      description:
        "어느 날 평화롭던 일상에 예상하지 못한 사건이 찾아오면서 펼쳐지는 이야기입니다.",
      times: [
        "13:30",
        "16:10",
        "19:40"
      ],
    },

    {
      id: 2,
      title: "B영화",
      poster: movie2,
      likes: "1.9k",
      rating: "8.8",
      description:
        "서로 다른 두 사람이 우연히 만나 특별한 시간을 보내게 되는 이야기입니다.",
      times: [
        "12:20",
        "15:50",
        "20:30"
      ],
    },

    {
      id: 3,
      title: "C영화",
      poster: movie3,
      likes: "1k",
      rating: "9.0",
      description:
        "사건의 진실을 추적하는 사람들의 긴장감 넘치는 이야기를 담았습니다.",
      times: [
        "14:00",
        "17:20",
        "21:10"
      ],
    },

    {
      id: 4,
      title: "D영화",
      poster: movie4,
      likes: "366",
      rating: "8.7",
      description:
        "서로의 목적을 숨긴 인물들이 만나면서 예상하지 못한 사건이 시작됩니다.",
      times: [
        "11:40",
        "18:00",
        "22:10"
      ],
    },
  ];


  /* =========================
     상태
  ========================= */

  const [loginOpen, setLoginOpen] =
    useState(false);


  const [loginUsername, setLoginUsername] =
    useState("");


  const [loginPassword, setLoginPassword] =
    useState("");


  const [isLoggedIn, setIsLoggedIn] =
    useState(() => {

      return (
        localStorage.getItem(
          "isLoggedIn"
        ) === "true"
      );

    });


  const [page, setPage] =
    useState(() => {

      return (
        localStorage.getItem(
          "currentPage"
        ) || "main"
      );

    });


  /* =========================
     회원가입 이동
  ========================= */

  const goSignup = () => {

    setLoginOpen(false);

    localStorage.setItem(
      "currentPage",
      "signup"
    );

    setPage("signup");
  };


  /* =========================
     메인 이동
  ========================= */

  const goMain = () => {

    setLoginOpen(false);

    localStorage.setItem(
      "currentPage",
      "main"
    );

    setPage("main");
  };


  /* =========================
     예매 이동
  ========================= */

  const goBooking = () => {

    if (!isLoggedIn) {

      alert(
        "로그인이 필요한 서비스입니다."
      );

      setLoginOpen(true);

      return;
    }


    setLoginOpen(false);

    localStorage.setItem(
      "currentPage",
      "booking"
    );

    setPage("booking");
  };


  /* =========================
     마이페이지 이동
  ========================= */

  const goMyPage = () => {

    if (!isLoggedIn) {

      alert(
        "로그인이 필요한 서비스입니다."
      );

      setLoginOpen(true);

      return;
    }


    setLoginOpen(false);

    localStorage.setItem(
      "currentPage",
      "mypage"
    );

    setPage("mypage");
  };


  /* =========================
     로그인
  ========================= */

  const handleLogin = async (
    event
  ) => {

    event.preventDefault();


    if (
      loginUsername.trim() === "" ||
      loginPassword.trim() === ""
    ) {

      alert(
        "아이디와 비밀번호를 입력해주세요."
      );

      return;
    }


    try {

      const response =
        await fetch(
          "http://localhost:8080/user/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              username:
                loginUsername,

              password:
                loginPassword,
            }),
          }
        );


      const result =
        await response.text();


      if (!response.ok) {

        alert(result);

        return;
      }


      /* 로그인 성공 */

      alert(
        "로그인되었습니다."
      );


      setIsLoggedIn(true);


      localStorage.setItem(
        "isLoggedIn",
        "true"
      );


      localStorage.setItem(
        "username",
        loginUsername
      );


      setLoginOpen(false);


      setLoginUsername("");

      setLoginPassword("");

    }

    catch (error) {

      console.error(
        "로그인 오류:",
        error
      );


      alert(
        "백엔드 서버에 연결할 수 없습니다."
      );

    }

  };


  /* =========================
     로그아웃
  ========================= */

  const handleLogout = () => {

    localStorage.removeItem(
      "isLoggedIn"
    );

    localStorage.removeItem(
      "username"
    );


    setIsLoggedIn(false);


    alert(
      "로그아웃되었습니다."
    );


    goMain();

  };


  /* =========================
     페이지 분기
  ========================= */

  if (page === "signup") {

    return (
      <Signup
        goMain={goMain}
      />
    );

  }


  if (page === "booking") {

    return (
      <Booking
        movies={movies}
        goMain={goMain}
      />
    );

  }


  if (page === "mypage") {

    return (
      <MyPage
        goMain={goMain}
      />
    );

  }


  /* =========================
     MAIN
  ========================= */

  return (

    <div className="main-page">


      {/* =========================
          HEADER
      ========================= */}

      <header className="header">

        <div className="top-menu">

          <div>

            <span>
              VIP LOUNGE
            </span>

            <span>
              멤버십
            </span>

            <span>
              고객센터
            </span>

          </div>


          <div>

            {!isLoggedIn && (

              <>

                <span
                  onClick={() =>
                    setLoginOpen(true)
                  }
                >
                  로그인
                </span>


                <span
                  onClick={goSignup}
                >
                  회원가입
                </span>

              </>

            )}


            {isLoggedIn && (

              <>

                <span>
                  {
                    localStorage.getItem(
                      "username"
                    )
                  }
                  님
                </span>


                <span
                  onClick={
                    handleLogout
                  }
                >
                  로그아웃
                </span>

              </>

            )}

          </div>

        </div>


        <nav className="nav">

          <div className="nav-left">

            <span>
              ☰
            </span>

            <span>
              ⌕
            </span>

          </div>


          <div className="nav-menu">

            <span>
              영화
            </span>

            <span
              onClick={goBooking}
            >
              예매
            </span>

            <span>
              극장
            </span>

          </div>


          <h1
            className="logo"
            onClick={goMain}
            style={{
              cursor: "pointer"
            }}
          >
            CINEMA
          </h1>


          <div className="nav-menu">

            <span>
              이벤트
            </span>

            <span>
              스토어
            </span>

            <span>
              혜택
            </span>

          </div>


          <div className="nav-right">

            <span>
              ▦
            </span>


            <span
              onClick={goMyPage}
              style={{
                cursor: "pointer"
              }}
            >
              ♙
            </span>

          </div>

        </nav>

      </header>



      {/* =========================
          BOX OFFICE
      ========================= */}

      <section className="movie-section">

        <div className="movie-header">

          <h2>
            박스오피스
          </h2>

          <span>
            더 많은 영화보기 +
          </span>

        </div>


        <div className="movie-list">

          {movies.map(
            (movie, index) => (

              <div
                className="movie-card"
                key={movie.id}
              >

                <div className="poster-wrapper">

                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="poster"
                  />


                  <span className="rank">
                    {index + 1}
                  </span>


                  <div className="poster-overlay">

                    <div className="movie-description">

                      <h3>
                        {movie.title}
                      </h3>

                      <p>
                        {movie.description}
                      </p>

                    </div>


                    <div className="movie-overlay-bottom">

                      <button className="detail-button">
                        영화상세 보기
                      </button>


                      <div className="movie-rating">

                        <span>
                          관람평
                        </span>

                        <strong>
                          {movie.rating}
                        </strong>

                      </div>

                    </div>

                  </div>

                </div>


                <div className="movie-actions">

                  <button className="like-button">

                    ♡ {movie.likes}

                  </button>


                  <button
                    className="reserve-button"
                    onClick={goBooking}
                  >
                    예매
                  </button>

                </div>

              </div>

            )
          )}

        </div>



        {/* =========================
            QUICK MENU
        ========================= */}

        <div className="quick-menu">

          <div className="search-box">

            <input
              type="text"
              placeholder="영화명을 입력해 주세요"
            />

            <span>
              ⌕
            </span>

          </div>


          <div className="quick-item">

            <span className="quick-icon">
              ▣
            </span>

            상영시간표

          </div>


          <div className="quick-item">

            <span className="quick-icon">
              ▤
            </span>

            박스오피스

          </div>


          <div
            className="quick-item"
            onClick={goBooking}
          >

            <span className="quick-icon">
              🎟
            </span>

            빠른예매

          </div>

        </div>

      </section>



      {/* =========================
          영화 예매
      ========================= */}

      <section className="info-section">

        <h2>
          영화 예매
        </h2>


        <div className="info-boxes">


          <div
            className="info-box"
            onClick={goBooking}
          >

            <h3>
              영화 선택
            </h3>

            <p>
              현재 상영 중인 영화를 선택하세요.
            </p>

            <span className="info-arrow">
              →
            </span>

          </div>


          <div
            className="info-box"
            onClick={goBooking}
          >

            <h3>
              좌석 선택
            </h3>

            <p>
              원하는 시간과 좌석을 선택하세요.
            </p>

            <span className="info-arrow">
              →
            </span>

          </div>


          <div
            className="info-box"
            onClick={goBooking}
          >

            <h3>
              예매 완료
            </h3>

            <p>
              선택한 좌석을 확인하고 예매를 완료하세요.
            </p>

            <span className="info-arrow">
              →
            </span>

          </div>

        </div>

      </section>



      {/* =========================
          BOTTOM
      ========================= */}

      <section className="bottom-menu">

        <div>
          <div className="bottom-icon">
            ◇
          </div>

          <p>
            VIP LOUNGE
          </p>
        </div>


        <div>
          <div className="bottom-icon">
            ♙
          </div>

          <p>
            멤버십
          </p>
        </div>


        <div>
          <div className="bottom-icon">
            ▣
          </div>

          <p>
            예매안내
          </p>
        </div>


        <div>
          <div className="bottom-icon">
            🎁
          </div>

          <p>
            이벤트
          </p>
        </div>


        <div>
          <div className="bottom-icon">
            ♨
          </div>

          <p>
            스토어
          </p>
        </div>

      </section>



      {/* =========================
          LOGIN MODAL
      ========================= */}

      {loginOpen && (

        <div
          className="modal-background"

          onClick={() =>
            setLoginOpen(false)
          }
        >

          <div
            className="login-modal"

            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="login-title">

              <h2>
                로그인
              </h2>


              <button
                className="close-button"

                onClick={() =>
                  setLoginOpen(false)
                }
              >
                ×
              </button>

            </div>


            <div className="login-content">


              <div className="login-form-area">


                <form
                  onSubmit={
                    handleLogin
                  }
                >

                  <input
                    className="login-input"
                    type="text"
                    placeholder="아이디"

                    value={
                      loginUsername
                    }

                    onChange={(
                      event
                    ) =>
                      setLoginUsername(
                        event.target.value
                      )
                    }
                  />


                  <input
                    className="login-input"
                    type="password"
                    placeholder="비밀번호"

                    value={
                      loginPassword
                    }

                    onChange={(
                      event
                    ) =>
                      setLoginPassword(
                        event.target.value
                      )
                    }
                  />


                  <div className="login-options">

                    <label>

                      <input
                        type="checkbox"
                      />

                      아이디 저장

                    </label>


                    <span>
                      휴대폰간편로그인
                    </span>

                  </div>


                  <button
                    className="login-button"
                    type="submit"
                  >
                    로그인
                  </button>

                </form>


                <div className="login-links">

                  <span>
                    ID/PW 찾기
                  </span>

                  <span>
                    |
                  </span>

                  <span
                    onClick={
                      goSignup
                    }
                  >
                    회원가입
                  </span>

                  <span>
                    |
                  </span>

                  <span>
                    비회원 예매확인
                  </span>

                </div>


                <div className="social-login">

                  <button className="naver-button">
                    N
                  </button>

                  <button className="kakao-button">
                    ●
                  </button>

                </div>

              </div>


              <div className="login-image-area">

                <img
                  src={loginImage}
                  alt="로그인 이미지"
                />

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );

}


const Main = main;


createRoot(
  document.getElementById("root")
).render(

  <StrictMode>
    <Main />
  </StrictMode>

);


export default main;