const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("token="))
  ?.split("=")[1];
if (token) {
  window.location.href = "dashboard.html";
}
function isValidEmail(email) {
  return email.includes("@") && email.split("@")[1].includes(".");
}
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
  const emailValue = emailInput.value.trim();
  if (!emailValue) {
    emailError.textContent = "لطفا ایمیل خود را وارد کنید";
    return;
  }
  if (!isValidEmail(emailValue)) {
    emailError.textContent = "فرمت ایمیل معتبر نیست";
    return;
  }
  if (!passwordInput.value) {
    passwordError.textContent = "لطفا پسورد خود را وارد کنید";
    return;
  }
  loginBtn.disabled = true;
  loginBtn.textContent = "ورود";
  fetch("https://haditabatabaei.dev/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: emailValue,
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
