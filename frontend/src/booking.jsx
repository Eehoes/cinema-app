import { useState } from "react";
import "./booking.css";


function booking({
  movies,
  goMain
}) {

  /* =========================
     단계

     select = 영화/시간 선택
     seat   = 좌석 선택
  ========================= */

  const [step, setStep] =
    useState("select");


  /* =========================
     선택 정보
  ========================= */

  const [
    selectedMovie,
    setSelectedMovie
  ] = useState(null);


  const [
    selectedTime,
    setSelectedTime
  ] = useState("");


  const [
    selectedSeats,
    setSelectedSeats
  ] = useState([]);


  /* =========================
     예매 완료창
  ========================= */

  const [
    completeOpen,
    setCompleteOpen
  ] = useState(false);


  /* =========================
     좌석 데이터
  ========================= */

  const rows = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G"
  ];


  const numbers = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9
  ];


  /*
    현재는 임시 예매 완료 좌석.

    나중에는 DB에서 가져오게 변경할 예정.
  */

  const unavailableSeats = [
    "A4",
    "B7",
    "C2",
    "D5",
    "E3",
    "F8"
  ];


  /* =========================
     영화 선택
  ========================= */

  const selectMovie = (
    movie
  ) => {

    setSelectedMovie(
      movie
    );

    setSelectedTime("");

  };


  /* =========================
     시간 선택
  ========================= */

  const selectTime = (
    time
  ) => {

    if (!selectedMovie) {

      alert(
        "영화를 먼저 선택해주세요."
      );

      return;

    }


    setSelectedTime(
      time
    );


    setSelectedSeats([]);


    setStep(
      "seat"
    );

  };


  /* =========================
     좌석 선택
  ========================= */

  const toggleSeat = (
    seat
  ) => {

    if (
      unavailableSeats.includes(
        seat
      )
    ) {

      return;

    }


    if (
      selectedSeats.includes(
        seat
      )
    ) {

      setSelectedSeats(

        selectedSeats.filter(
          (item) =>
            item !== seat
        )

      );

    }

    else {

      setSelectedSeats([
        ...selectedSeats,
        seat
      ]);

    }

  };


  /* =========================
     예매 완료 + Backend 저장
  ========================= */

  const finishBooking =
    async () => {

      if (
        selectedSeats.length === 0
      ) {

        alert(
          "좌석을 선택해주세요."
        );

        return;

      }


      const username =
        localStorage.getItem(
          "username"
        );


      if (!username) {

        alert(
          "로그인 정보가 없습니다."
        );

        goMain();

        return;

      }


      const price =
        selectedSeats.length *
        14000;


      try {

        const response =
          await fetch(
            "http://localhost:8080/reservation",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                username:
                  username,

                movieTitle:
                  selectedMovie.title,

                theater:
                  "CINEMA 강남",

                showTime:
                  selectedTime,

                seats:
                  selectedSeats.join(
                    ", "
                  ),

                price:
                  price,
              }),
            }
          );


        const result =
          await response.text();


        if (!response.ok) {

          alert(
            "예매 저장 중 오류가 발생했습니다."
          );

          console.error(
            result
          );

          return;

        }


        /* =========================
           저장 성공
        ========================= */

        setCompleteOpen(
          true
        );


        setTimeout(() => {

          setCompleteOpen(
            false
          );

          goMain();

        }, 1500);

      }

      catch (error) {

        console.error(
          "예매 오류:",
          error
        );


        alert(
          "백엔드 서버에 연결할 수 없습니다."
        );

      }

    };


  return (

    <div className="booking-page">


      {/* =========================
          HEADER
      ========================= */}

      <header className="booking-header">

        <h1
          onClick={goMain}
        >
          CINEMA
        </h1>

      </header>



      <main className="booking-container">


        {/* =========================
            영화 / 시간 선택
        ========================= */}

        {step === "select" && (

          <>

            <h2 className="booking-title">
              빠른예매
            </h2>


            {/* 날짜 */}

            <div className="booking-date-bar">

              <button>
                ‹
              </button>


              <div className="booking-date-selected">

                <strong>
                  10
                </strong>

                <span>
                  내일
                </span>

              </div>


              <button>
                ›
              </button>

            </div>



            {/* =====================
                영화 / 극장 / 시간
            ===================== */}

            <div className="booking-select-layout">


              {/* =====================
                  영화
              ===================== */}

              <section className="selection-column movie-column">


                <div className="selection-title">

                  <h3>
                    영화
                  </h3>

                </div>


                <div className="simple-tab">

                  <button className="active">
                    전체
                  </button>

                </div>


                <div className="simple-movie-list">


                  {movies.map(
                    (movie) => (

                      <button
                        key={
                          movie.id
                        }

                        className={
                          selectedMovie?.id ===
                          movie.id
                            ? "simple-movie-item selected"
                            : "simple-movie-item"
                        }

                        onClick={() =>
                          selectMovie(
                            movie
                          )
                        }
                      >

                        <span className="age-box">
                          12
                        </span>


                        <span className="simple-movie-name">

                          {
                            movie.title
                          }

                        </span>


                        <span className="heart">
                          ♡
                        </span>

                      </button>

                    )
                  )}

                </div>

              </section>



              {/* =====================
                  극장
              ===================== */}

              <section className="selection-column theater-column">


                <div className="selection-title">

                  <h3>
                    극장
                  </h3>

                </div>


                <div className="simple-tab">

                  <button className="active">
                    전체
                  </button>

                </div>


                <div className="theater-select-area">


                  <div className="region-list">

                    <div className="region-selected">
                      서울(1)
                    </div>

                  </div>


                  <div className="cinema-list">

                    <button className="cinema-selected">
                      강남
                    </button>

                  </div>

                </div>

              </section>



              {/* =====================
                  시간
              ===================== */}

              <section className="selection-column time-column">


                <div className="selection-title">

                  <h3>
                    시간
                  </h3>

                </div>


                {!selectedMovie && (

                  <div className="time-empty">

                    <div className="time-empty-icon">
                      ▣
                    </div>

                    <p>
                      영화와 극장을 선택하시면
                    </p>

                    <p>
                      상영시간을 확인할 수 있습니다.
                    </p>

                  </div>

                )}


                {selectedMovie && (

                  <div className="time-list">


                    <div className="selected-info">

                      <strong>
                        {
                          selectedMovie.title
                        }
                      </strong>

                      <span>
                        CINEMA 강남
                      </span>

                    </div>


                    {selectedMovie.times.map(
                      (time) => (

                        <button
                          key={
                            time
                          }

                          className="time-item"

                          onClick={() =>
                            selectTime(
                              time
                            )
                          }
                        >

                          <div>

                            <strong>
                              {time}
                            </strong>

                          </div>


                          <div className="time-right">

                            <strong>
                              {
                                selectedMovie.title
                              }
                            </strong>

                            <span>
                              2D
                            </span>

                          </div>

                        </button>

                      )
                    )}

                  </div>

                )}

              </section>

            </div>


            <button
              className="booking-main-button"
              onClick={goMain}
            >
              메인으로 돌아가기
            </button>

          </>

        )}



        {/* =========================
            좌석 선택
        ========================= */}

        {step === "seat" && (

          <>

            <h2 className="booking-title">
              빠른예매
            </h2>


            <div className="seat-layout">


              {/* 좌석 */}

              <section className="seat-main">


                <div className="seat-title">

                  <h3>
                    좌석 선택
                  </h3>

                  <span>
                    원하는 좌석을 선택해주세요.
                  </span>

                </div>


                <div className="screen-area">

                  <div className="screen-line">
                  </div>

                  <strong>
                    SCREEN
                  </strong>

                </div>


                <div className="seat-map">


                  {rows.map(
                    (row) => (

                      <div
                        className="seat-row"
                        key={row}
                      >

                        <span className="seat-row-name">
                          {row}
                        </span>


                        {numbers.map(
                          (number) => {

                            const seat =
                              `${row}${number}`;


                            const unavailable =
                              unavailableSeats.includes(
                                seat
                              );


                            const selected =
                              selectedSeats.includes(
                                seat
                              );


                            return (

                              <button
                                key={
                                  seat
                                }

                                className={
                                  unavailable
                                    ? "seat unavailable"
                                    : selected
                                      ? "seat selected"
                                      : "seat"
                                }

                                disabled={
                                  unavailable
                                }

                                onClick={() =>
                                  toggleSeat(
                                    seat
                                  )
                                }
                              >

                                {
                                  number
                                }

                              </button>

                            );

                          }
                        )}

                      </div>

                    )
                  )}

                </div>

              </section>



              {/* =====================
                  오른쪽 예매 정보
              ===================== */}

              <aside className="seat-summary">


                <div className="summary-top">

                  <span className="summary-age">
                    12
                  </span>


                  <div>

                    <h3>
                      {
                        selectedMovie.title
                      }
                    </h3>

                    <p>
                      2D
                    </p>

                  </div>

                </div>


                <div className="summary-theater">

                  <strong>
                    CINEMA 강남
                  </strong>

                  <span>
                    {
                      selectedTime
                    }
                  </span>

                </div>


                <div className="seat-status">

                  <div>

                    <span className="status-color selected-status">
                    </span>

                    선택좌석

                  </div>


                  <div>

                    <span className="status-color unavailable-status">
                    </span>

                    예매완료

                  </div>


                  <div>

                    <span className="status-color normal-status">
                    </span>

                    선택가능

                  </div>

                </div>


                <div className="selected-seat-info">

                  <span>
                    선택 좌석
                  </span>


                  <strong>

                    {
                      selectedSeats.length ===
                      0
                        ? "-"
                        : selectedSeats.join(
                            ", "
                          )
                    }

                  </strong>

                </div>


                <div className="selected-count">

                  총 좌석

                  <strong>

                    {
                      selectedSeats.length
                    }
                    석

                  </strong>

                </div>


                <div className="final-price">

                  <span>
                    최종결제금액
                  </span>


                  <strong>

                    {
                      (
                        selectedSeats.length *
                        14000
                      ).toLocaleString()
                    }

                    원

                  </strong>

                </div>


                <div className="seat-buttons">

                  <button
                    className="seat-back-button"

                    onClick={() => {

                      setStep(
                        "select"
                      );

                      setSelectedSeats(
                        []
                      );

                    }}
                  >
                    이전
                  </button>


                  <button
                    className="seat-next-button"

                    disabled={
                      selectedSeats.length ===
                      0
                    }

                    onClick={
                      finishBooking
                    }
                  >
                    다음
                  </button>

                </div>

              </aside>

            </div>

          </>

        )}

      </main>



      {/* =========================
          예매 완료
      ========================= */}

      {completeOpen && (

        <div className="booking-complete-background">

          <div className="booking-complete-box">

            예매가 완료되었습니다.

          </div>

        </div>

      )}

    </div>

  );

}


export default booking;