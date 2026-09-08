const loginForm = document.querySelector("#loginForm");
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");
  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");
  const alertContainer = document.querySelector("#alert-container");
  const loginBtn = document.querySelector(".btn-primary");
  emailError.textContent = "";
  passwordError.textContent = "";
  alertContainer.textContent = "";
  alertContainer.classList.remove("alertError");
  if (!emailInput.value) {
    emailError.textContent = "لطفا ایمیل خود را وارد کنید";
    return;
  }
  if (!passwordInput.value) {
    passwordError.textContent = "لطفا پسورد خود را وارد کنید";
    return;
  }
  loginBtn.disabled = true;
  loginBtn.textContent = "در حال ورود... ";
  console.log(emailInput.value,passwordInput.value)
  fetch("https://haditabatabaei.dev/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: emailInput.value,
      password: passwordInput.value,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response.json().then((errorData) => {
        throw new Error(errorData.message || "خطا در ورود");
      });
    })
    .then((data) => {
      console.log(data);
      const token = data.token;
      document.cookie = `token=${token}; path=/; max-age=604800`;
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.log("خطا:", error.message);
      alertContainer.textContent = "خطا: " + error.message;
      alertContainer.classList.add("alertError");
    })
    .finally(() => {
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
    });
});
