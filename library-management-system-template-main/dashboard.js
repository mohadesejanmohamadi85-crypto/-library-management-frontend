let userNameElement = document.querySelector("#userName");
let availableBooksElement = document.querySelector("#availableBooks");
let activeLoansElement = document.querySelector("#activeLoans");
let studentName = document.querySelector("#studentName");
let logoutBtn = document.querySelector("#logoutBtn");
const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("token="))
  ?.split("=")[1];
if (!token) {
  window.location.href = "login.html";
}
function getAuthHeaders() {
  return {
    Authorization: `Bearer ${token}`,
  };
}
fetch("https://haditabatabaei.dev/api/books", {
  method: "GET",
  headers: getAuthHeaders(),
})
  .then((response) => {
    if (response.status === 401) {
      document.cookie = "token=; path=/; max-age=0";
      window.location.href = "login.html";
      return;
    }
    if (response.ok) {
      return response.json();
    }
    return response.json().then((errorData) => {
      throw new Error(errorData.message || "خطا در ورود");
    });
  })
  .then((booksData) => {
    if (booksData && booksData.data) {
      let booksCount = booksData.data.length;
      availableBooksElement.textContent = booksCount;
    }
  })
  .catch((error) => {
    console.log("خطا:", error.message);
  });
fetch("https://haditabatabaei.dev/api/loans/my-loans", {
  method: "GET",
  headers:getAuthHeaders(),
})
  .then((response) => {
    if (response.status === 401) {
      document.cookie = "token=; path=/; max-age=0";
      window.location.href = "login.html";
      return;
    }
    if (response.ok) {
      return response.json();
    }
    return response.json().then((errorData) => {
      throw new Error(errorData.message);
    });
  })
  .then((loansData) => {
    if (loansData && loansData.data) {
      let activeLoansCount = loansData.data;
      let activeLoans=activeLoansCount.filter((loan)=> loan.status==="active");
      activeLoansElement.textContent =activeLoans.length;
    }
  })
  .catch((error) => {
    console.log("خطا:", error.message);
  });
fetch("https://haditabatabaei.dev/api/auth/me", {
  method: "GET",
  headers:getAuthHeaders(),
})
  .then((response) => {
    if (response.status === 401) {
      document.cookie = "token=; path=/; max-age=0";
      window.location.href = "login.html";
      return;
    }
    if (response.ok) {
      return response.json();
    }
    return response.json().then((errorData) => {
      throw new Error(errorData.message);
    });
  })
  .then((userData) => {
    if (userData && userData.data && userData.data.user) {
      let userName = userData.data.user.firstName;
      userNameElement.textContent = userName;
      studentName.textContent = userName;
    }
  })
  .catch((error) => {
    console.log("خطا:", error.message);
  });
logoutBtn.addEventListener("click", (event) => {
  event.preventDefault();
  document.cookie = "token=; path=/; max-age=0";
  window.location.href = "login.html";
});
