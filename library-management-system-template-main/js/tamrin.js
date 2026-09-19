
import { redirectIfLoggedIn } from "./shared.js";
redirectIfLoggedIn();
function isValidEmail(email) {
  return email.includes("@") && email.split("@")[1].includes(".");
}
const loginForm = document.querySelector("#loginForm");
loginForm.addEventListener("submit", async (event) => {
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
  try {
    const response = await fetch("https://haditabatabaei.dev/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailValue,
        password: passwordInput.value,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "خطا در ورود");
    }
    const data = await response.json();
    const token = data.token;
    document.cookie = `token=${token}; path=/; max-age=604800`;
    window.location.href = "dashboard.html";
  } catch (error) {
    console.log("خطا:", error.message);
    alertContainer.textContent = "خطا: " + error.message;
    alertContainer.classList.add("alertError");
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "ورود";
  }
});
