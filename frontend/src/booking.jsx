import { useEffect, useState } from "react";
import "./booking.css";
import "./queue.css";

function booking({
  movies,
  goMain
}) {

  const [step, setStep] = useState("select");

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [unavailableSeats, setUnavailableSeats] = useState([]);

  const [queuePosition, setQueuePosition] = useState(null);
  const [queueWaitingCount, setQueueWaitingCount] = useState(0);
  const [queueAdmitted, setQueueAdmitted] = useState(false);

  const [completeOpen, setCompleteOpen] = useState(false);

  /* =========================
     좌석
     A ~ J / 1 ~ 12
     총 120석
  ========================= */

  const rows = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J"
  ];

  const numbers = [
    1, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11, 12
  ];

  const getUsername = () => {
    return localStorage.getItem("username");
  };

  /* =========================
     Queue 응답 적용
  ========================= */

  const applyQueueResponse = (data) => {

    setQueueWaitingCount(
      data.waitingCount ?? 0
    );

    /*
     * 입장 가능
     */
    if (data.allowed) {

      setQueueAdmitted(true);
      setQueuePosition(0);

      /*
       * Queue 화면에서 ACTIVE가 되면
       * 아주 잠깐 후 자동으로 예매 화면 이동
       */
      setTimeout(() => {
        setStep("select");
      }, 300);

      return true;
    }

    /*
     * 아직 대기 중
     */
    setQueueAdmitted(false);

    setQueuePosition(
      data.position ?? null
    );

    setStep("queue");

    return false;
  };

  /* =========================
     Queue 참가
  ========================= */

  const joinQueue = async () => {

    const username = getUsername();

    if (!username) {

      alert("로그인이 필요합니다.");
      goMain();

      return false;
    }

    /*
     * 서버 응답 기다리는 동안에도
     * 바로 Queue 화면 표시
     */
    setStep("queue");

    try {

      const response = await fetch(
        `/api/queue/join?userId=${encodeURIComponent(username)}`,
        {
          method: "POST"
        }
      );

      if (!response.ok) {
        throw new Error("대기열 참가 실패");
      }

      const data = await response.json();

      return applyQueueResponse(data);

    } catch (error) {

      console.error(
        "대기열 참가 오류:",
        error
      );

      alert(
        "대기열 서버에 연결할 수 없습니다."
      );

      setStep("select");

      return false;
    }
  };

  /* =========================
     Queue 상태 조회
  ========================= */

  const checkQueueStatus = async () => {

    const username = getUsername();

    if (!username) {
      return;
    }

    try {

      const response = await fetch(
        `/api/queue/status?userId=${encodeURIComponent(username)}`
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      applyQueueResponse(data);

    } catch (error) {

      console.error(
        "대기열 상태 조회 오류:",
        error
      );
    }
  };

  /* =========================
     Heartbeat
  ========================= */

  const sendHeartbeat = async () => {

    const username = getUsername();

    if (!username) {
      return;
    }

    try {

      await fetch(
        `/api/queue/heartbeat?userId=${encodeURIComponent(username)}`,
        {
          method: "POST"
        }
      );

    } catch (error) {

      console.error(
        "heartbeat 오류:",
        error
      );
    }
  };

  /* =========================
     Queue 퇴장
  ========================= */

  const leaveQueue = async () => {

    const username = getUsername();

    if (!username) {
      return;
    }

    try {

      await fetch(
        `/api/queue/leave?userId=${encodeURIComponent(username)}`,
        {
          method: "DELETE"
        }
      );

    } catch (error) {

      console.error(
        "Queue leave 오류:",
        error
      );
    }

    setQueueAdmitted(false);
    setQueuePosition(null);
    setQueueWaitingCount(0);
  };

  /* =========================
     WAITING Polling

     기존 5초
     → 1초
  ========================= */

  useEffect(() => {

    if (step !== "queue") {
      return;
    }

    /*
     * Queue 화면 진입하자마자
     * 한 번 즉시 확인
     */
    checkQueueStatus();

    const interval = setInterval(() => {

      checkQueueStatus();

    }, 1000);

    return () => {

      clearInterval(interval);

    };

  }, [step]);

  /* =========================
     ACTIVE Heartbeat
  ========================= */

  useEffect(() => {

    if (!queueAdmitted) {
      return;
    }

    sendHeartbeat();

    const interval = setInterval(() => {

      sendHeartbeat();

    }, 10000);

    return () => {

      clearInterval(interval);

    };

  }, [queueAdmitted]);

  /* =========================
     예약 완료 좌석 조회
  ========================= */

  const loadOccupiedSeats = async (
    movieTitle,
    showTime
  ) => {

    if (!movieTitle || !showTime) {

      setUnavailableSeats([]);

      return;
    }

    try {

      const params = new URLSearchParams({
        movieTitle,
        theater: "CINEMA 강남",
        showTime
      });

      const response = await fetch(
        `/api/reservation/occupied?${params.toString()}`
      );

      if (!response.ok) {

        console.error(
          "예약 좌석 조회 실패:",
          response.status
        );

        return;
      }

      const result = await response.json();

      setUnavailableSeats(
        Array.isArray(result)
          ? result
          : []
      );

    } catch (error) {

      console.error(
        "예약 좌석 조회 오류:",
        error
      );
    }
  };

  /* =========================
     Seat 화면 진입
  ========================= */

  useEffect(() => {

    if (
      step === "seat" &&
      selectedMovie &&
      selectedTime
    ) {

      loadOccupiedSeats(
        selectedMovie.title,
        selectedTime
      );
    }

  }, [
    step,
    selectedMovie,
    selectedTime
  ]);

  /* =========================
     영화 선택

     영화 클릭
     → 바로 Queue
  ========================= */

  const selectMovie = async (movie) => {

    setSelectedMovie(movie);
    setSelectedTime("");
    setSelectedSeats([]);
    setUnavailableSeats([]);

    /*
     * 이미 입장 권한을 받은 사용자는
     * Queue 재진입 필요 없음
     */
    if (queueAdmitted) {
      return;
    }

    /*
     * 바로 대기화면으로 이동
     */
    setStep("queue");

    await joinQueue();
  };

  /* =========================
     시간 선택
  ========================= */

  const selectTime = async (time) => {

    if (!selectedMovie) {
      return;
    }

    /*
     * 입장 권한이 없다면
     * alert를 띄우지 않고
     * 바로 Queue 화면으로 이동
     */
    if (!queueAdmitted) {

      setStep("queue");

      await joinQueue();

      return;
    }

    setSelectedTime(time);
    setSelectedSeats([]);

    setStep("seat");
  };

  /* =========================
     좌석 선택
  ========================= */

  const toggleSeat = (seat) => {

    if (
      unavailableSeats.includes(seat)
    ) {
      return;
    }

    if (
      selectedSeats.includes(seat)
    ) {

      setSelectedSeats(
        selectedSeats.filter(
          (item) => item !== seat
        )
      );

    } else {

      setSelectedSeats([
        ...selectedSeats,
        seat
      ]);
    }
  };

  /* =========================
     예약 완료
  ========================= */

  const finishBooking = async () => {

    if (
      selectedSeats.length === 0
    ) {

      alert(
        "좌석을 선택해주세요."
      );

      return;
    }

    const username = getUsername();

    if (!username) {

      await leaveQueue();

      goMain();

      return;
    }

    const price =
      selectedSeats.length * 14000;

    try {

      const response = await fetch(
        "/api/reservation",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            username,
            movieTitle:
              selectedMovie.title,

            theater:
              "CINEMA 강남",

            showTime:
              selectedTime,

            seats:
              selectedSeats.join(", "),

            price
          })
        }
      );

      const result =
        await response.text();

      /*
       * 이미 예약된 좌석
       */
      if (
        response.status === 409
      ) {

        alert(
          result ||
          "이미 예약된 좌석이 포함되어 있습니다."
        );

        await loadOccupiedSeats(
          selectedMovie.title,
          selectedTime
        );

        setSelectedSeats([]);

        return;
      }

      if (!response.ok) {

        alert(
          result ||
          "예매 저장 중 오류가 발생했습니다."
        );

        return;
      }

      await loadOccupiedSeats(
        selectedMovie.title,
        selectedTime
      );

      setSelectedSeats([]);

      /*
       * 예약 완료
       * → Queue ACTIVE 슬롯 반환
       */
      await leaveQueue();

      setCompleteOpen(true);

      setTimeout(() => {

        setCompleteOpen(false);

        goMain();

      }, 1200);

    } catch (error) {

      console.error(
        "예매 오류:",
        error
      );

      alert(
        "백엔드 서버에 연결할 수 없습니다."
      );
    }
  };

  /* =========================
     예매 종료
  ========================= */

  const exitBooking = async () => {

    await leaveQueue();

    goMain();
  };

  return (

    <div className="booking-page">

      <header className="booking-header">

        <h1 onClick={exitBooking}>
          CINEMA
        </h1>

      </header>

      <main className="booking-container">

        {/* =====================
            QUEUE
        ===================== */}

        {step === "queue" && (

          <div className="queue-page">

            <div className="queue-card">

              <div className="queue-spinner">
              </div>

              <h2>
                예매 접속 대기 중
              </h2>

              <p className="queue-description">
                현재 접속자가 많아
                순차적으로 입장하고 있습니다.
              </p>

              <div className="queue-position-box">

                <span>
                  현재 대기 순번
                </span>

                <strong>
                  {queuePosition ?? "-"}
                </strong>

                <small>
                  번째
                </small>

              </div>

              <p className="queue-ahead">

                대기열 앞에{" "}

                <strong>
                  {
                    queuePosition
                      ? Math.max(
                          queuePosition - 1,
                          0
                        )
                      : 0
                  }
                </strong>

                명이 있습니다.

              </p>

              <div className="queue-info">

                <span>
                  전체 대기 인원
                </span>

                <strong>
                  {queueWaitingCount}명
                </strong>

              </div>

              <p className="queue-auto-text">
                순서가 되면 자동으로 입장합니다.
              </p>

              <button
                className="queue-cancel-button"
                onClick={exitBooking}
              >
                대기 취소
              </button>

            </div>

          </div>

        )}

        {/* =====================
            영화 선택
        ===================== */}

        {step === "select" && (

          <>

            <h2 className="booking-title">
              빠른예매
            </h2>

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

            <div className="booking-select-layout">

              <section className="selection-column movie-column">

                <div className="selection-title">
                  <h3>영화</h3>
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
                        key={movie.id}

                        className={
                          selectedMovie?.id === movie.id
                            ? "simple-movie-item selected"
                            : "simple-movie-item"
                        }

                        onClick={() =>
                          selectMovie(movie)
                        }
                      >

                        <span className="age-box">
                          12
                        </span>

                        <span className="simple-movie-name">
                          {movie.title}
                        </span>

                        <span className="heart">
                          ♡
                        </span>

                      </button>

                    )
                  )}

                </div>

              </section>

              <section className="selection-column theater-column">

                <div className="selection-title">
                  <h3>극장</h3>
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

              <section className="selection-column time-column">

                <div className="selection-title">
                  <h3>시간</h3>
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
                        {selectedMovie.title}
                      </strong>

                      <span>
                        CINEMA 강남
                      </span>

                    </div>

                    {selectedMovie.times.map(
                      (time) => (

                        <button
                          key={time}

                          className="time-item"

                          onClick={() =>
                            selectTime(time)
                          }
                        >

                          <div>
                            <strong>
                              {time}
                            </strong>
                          </div>

                          <div className="time-right">

                            <strong>
                              {selectedMovie.title}
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
              onClick={exitBooking}
            >
              메인으로 돌아가기
            </button>

          </>

        )}

        {/* =====================
            좌석
        ===================== */}

        {step === "seat" && (

          <>

            <h2 className="booking-title">
              빠른예매
            </h2>

            <div className="seat-layout">

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
                                key={seat}

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
                                  toggleSeat(seat)
                                }
                              >
                                {number}
                              </button>

                            );

                          }
                        )}

                      </div>

                    )
                  )}

                </div>

              </section>

              <aside className="seat-summary">

                <div className="summary-top">

                  <span className="summary-age">
                    12
                  </span>

                  <div>

                    <h3>
                      {selectedMovie.title}
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
                    {selectedTime}
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
                      selectedSeats.length === 0
                        ? "-"
                        : selectedSeats.join(", ")
                    }

                  </strong>

                </div>

                <div className="selected-count">

                  총 좌석

                  <strong>
                    {selectedSeats.length}석
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

                      setStep("select");
                      setSelectedSeats([]);

                    }}
                  >
                    이전
                  </button>

                  <button
                    className="seat-next-button"

                    disabled={
                      selectedSeats.length === 0
                    }

                    onClick={finishBooking}
                  >
                    다음
                  </button>

                </div>

              </aside>

            </div>

          </>

        )}

      </main>

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