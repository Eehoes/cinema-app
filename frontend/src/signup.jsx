import { useState } from "react";
import "./signup.css";

function signup({ goMain }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");


  /* =========================
     비밀번호 확인
  ========================= */

  const passwordMismatch =
    passwordCheck !== "" &&
    password !== passwordCheck;


  const passwordMatch =
    passwordCheck !== "" &&
    password === passwordCheck;


  /* =========================
     회원가입
  ========================= */

  const handleSubmit = async (event) => {

    event.preventDefault();


    /* 입력값 확인 */

    if (
      username.trim() === "" ||
      password.trim() === "" ||
      passwordCheck.trim() === "" ||
      email.trim() === "" ||
      name.trim() === ""
    ) {

      alert("모든 정보를 입력해주세요.");

      return;
    }


    /* 비밀번호 확인 */

    if (password !== passwordCheck) {

      alert("비밀번호가 일치하지 않습니다.");

      return;
    }


    /* =========================
       Spring Boot로 회원정보 전송
    ========================= */

    try {

      const response = await fetch(
        "http://localhost:8080/user",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: username,
            password: password,
            email: email,
            name: name,
          }),
        }
      );


      const result =
        await response.text();


      /* 서버 오류 */

      if (!response.ok) {

        alert(
          "회원가입 중 오류가 발생했습니다."
        );

        console.log(result);

        return;
      }


      /* 성공 */

      alert(result);


      /* 입력칸 초기화 */

      setUsername("");
      setPassword("");
      setPasswordCheck("");
      setEmail("");
      setName("");


      /* 메인으로 이동 */

      goMain();

    }

    catch (error) {

      console.error(
        "회원가입 오류:",
        error
      );


      alert(
        "백엔드 서버에 연결할 수 없습니다."
      );

    }

  };


  return (

    <div className="signup-page">


      {/* =========================
          상단 CINEMA
      ========================= */}

      <header className="signup-header">

        <h1 onClick={goMain}>
          CINEMA
        </h1>

      </header>



      {/* =========================
          회원가입 본문
      ========================= */}

      <main className="signup-container">


        <div className="signup-box">


          <h2>
            회원가입
          </h2>


          <p className="signup-description">
            회원정보를 입력해주세요.
          </p>



          <form onSubmit={handleSubmit}>


            {/* 아이디 */}

            <div className="signup-form-group">

              <label htmlFor="username">
                아이디
              </label>


              <input
                id="username"
                type="text"
                placeholder="아이디를 입력해주세요"
                value={username}

                onChange={(event) =>
                  setUsername(
                    event.target.value
                  )
                }
              />

            </div>



            {/* 비밀번호 */}

            <div className="signup-form-group">

              <label htmlFor="password">
                비밀번호
              </label>


              <input
                id="password"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={password}

                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
              />

            </div>



            {/* 비밀번호 확인 */}

            <div className="signup-form-group">

              <label htmlFor="passwordCheck">
                비밀번호 확인
              </label>


              <input
                id="passwordCheck"
                type="password"
                placeholder="비밀번호를 다시 입력해주세요"
                value={passwordCheck}

                className={
                  passwordMismatch
                    ? "signup-input-error"
                    : ""
                }

                onChange={(event) =>
                  setPasswordCheck(
                    event.target.value
                  )
                }
              />


              {passwordMismatch && (

                <p className="password-error">
                  비밀번호가 일치하지 않습니다.
                </p>

              )}


              {passwordMatch && (

                <p className="password-success">
                  비밀번호가 일치합니다.
                </p>

              )}

            </div>



            {/* 이메일 */}

            <div className="signup-form-group">

              <label htmlFor="email">
                이메일
              </label>


              <input
                id="email"
                type="email"
                placeholder="이메일을 입력해주세요"
                value={email}

                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
              />

            </div>



            {/* 이름 */}

            <div className="signup-form-group">

              <label htmlFor="name">
                이름
              </label>


              <input
                id="name"
                type="text"
                placeholder="이름을 입력해주세요"
                value={name}

                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
              />

            </div>



            {/* 회원가입 버튼 */}

            <button
              className="signup-button"
              type="submit"
            >
              회원가입하기
            </button>


          </form>



          <p className="already-member">
            이미 회원이신가요?
          </p>



          <button
            className="signup-back-button"
            type="button"
            onClick={goMain}
          >
            메인으로 돌아가기
          </button>


        </div>

      </main>

    </div>

  );

}


export default signup;