import {
  useEffect,
  useState
} from "react";

import "./mypage.css";


function myPage({
  goMain
}) {

  const [
    activeTab,
    setActiveTab
  ] = useState(
    "reservation"
  );


  const [
    reservations,
    setReservations
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  /* =========================
     로그인 사용자
  ========================= */

  const username =
    localStorage.getItem(
      "username"
    );


  /* =========================
     예매 내역 가져오기
  ========================= */

  useEffect(() => {

    const loadReservations =
      async () => {

        if (!username) {

          setLoading(false);

          return;

        }


        try {

          const response =
            await fetch(
              `http://localhost:8080/reservation/user/${username}`
            );


          if (!response.ok) {

            throw new Error(
              "예매 조회 실패"
            );

          }


          const data =
            await response.json();


          setReservations(
            data
          );

        }

        catch (error) {

          console.error(
            "예매내역 오류:",
            error
          );


          alert(
            "예매 내역을 불러올 수 없습니다."
          );

        }

        finally {

          setLoading(false);

        }

      };


    loadReservations();

  }, [username]);


  return (

    <div className="mypage-page">


      {/* =========================
          HEADER
      ========================= */}

      <header className="mypage-header">

        <h1
          onClick={goMain}
        >
          CINEMA
        </h1>

      </header>



      <main className="mypage-container">


        <h2 className="mypage-title">
          예매/구매 내역
        </h2>



        {/* =========================
            TAB
        ========================= */}

        <div className="mypage-tabs">


          <button
            className={
              activeTab ===
              "reservation"
                ? "mypage-tab active"
                : "mypage-tab"
            }

            onClick={() =>
              setActiveTab(
                "reservation"
              )
            }
          >
            예매
          </button>


          <button
            className={
              activeTab ===
              "purchase"
                ? "mypage-tab active"
                : "mypage-tab"
            }

            onClick={() =>
              setActiveTab(
                "purchase"
              )
            }
          >
            구매
          </button>

        </div>



        {/* =========================
            예매 TAB
        ========================= */}

        {activeTab ===
          "reservation" && (

          <>

            <section className="mypage-search-box">


              <div className="mypage-filter-title">
                구분
              </div>


              <label className="mypage-radio">

                <input
                  type="radio"
                  name="reservationType"
                  defaultChecked
                />

                예매내역

              </label>


              <label className="mypage-radio">

                <input
                  type="radio"
                  name="reservationType"
                />

                지난내역

              </label>


              <select
                className="mypage-select"
                defaultValue="2026-10"
              >

                <option value="2026-10">
                  2026년 10월
                </option>

              </select>


              <button className="mypage-search-button">
                🔍 조회
              </button>

            </section>



            {/* =========================
                예매 내역
            ========================= */}

            <section className="reservation-history">


              {loading && (

                <div className="history-empty">
                  예매 내역을 불러오는 중입니다.
                </div>

              )}


              {!loading &&
                reservations.length ===
                  0 && (

                  <div className="history-empty">
                    예매 내역이 없습니다.
                  </div>

                )}


              {!loading &&
                reservations.length >
                  0 && (

                  <div
                    style={{
                      padding:
                        "20px"
                    }}
                  >

                    {reservations.map(
                      (
                        reservation
                      ) => (

                        <div
                          key={
                            reservation.id
                          }

                          style={{
                            padding:
                              "20px",

                            marginBottom:
                              "15px",

                            border:
                              "1px solid #ddd",

                            background:
                              "#fff",
                          }}
                        >

                          <div
                            style={{
                              display:
                                "flex",

                              justifyContent:
                                "space-between",

                              marginBottom:
                                "15px",
                            }}
                          >

                            <strong
                              style={{
                                fontSize:
                                  "18px",
                              }}
                            >
                              {
                                reservation.movieTitle
                              }
                            </strong>


                            <strong
                              style={{
                                color:
                                  "#54349a",
                              }}
                            >
                              예매완료
                            </strong>

                          </div>


                          <p>
                            극장 :{" "}
                            {
                              reservation.theater
                            }
                          </p>


                          <p>
                            상영시간 :{" "}
                            {
                              reservation.showTime
                            }
                          </p>


                          <p>
                            좌석 :{" "}
                            {
                              reservation.seats
                            }
                          </p>


                          <p>
                            결제금액 :{" "}

                            {
                              reservation.price.toLocaleString()
                            }

                            원
                          </p>

                        </div>

                      )
                    )}

                  </div>

                )}

            </section>



            {/* =========================
                취소 내역
            ========================= */}

            <section className="cancel-section">


              <h3>
                예매취소내역
              </h3>


              <p>
                · 상영일 기준 7일간 취소내역을 확인하실 수 있습니다.
              </p>


              <table>

                <thead>

                  <tr>

                    <th>
                      취소일시
                    </th>

                    <th>
                      영화명
                    </th>

                    <th>
                      극장
                    </th>

                    <th>
                      상영일시
                    </th>

                    <th>
                      취소금액
                    </th>

                  </tr>

                </thead>


                <tbody>

                  <tr>

                    <td
                      colSpan="5"
                      className="empty-table"
                    >
                      취소내역이 없습니다.
                    </td>

                  </tr>

                </tbody>

              </table>

            </section>



            <section className="mypage-guide">

              <button>

                <span>
                  이용안내
                </span>

                <span>
                  ﹀
                </span>

              </button>

            </section>

          </>

        )}



        {/* =========================
            구매
        ========================= */}

        {activeTab ===
          "purchase" && (

          <section className="purchase-empty">

            구매 내역이 없습니다.

          </section>

        )}



        <button
          className="mypage-home-button"
          onClick={goMain}
        >
          메인으로 돌아가기
        </button>


      </main>

    </div>

  );

}


export default myPage;