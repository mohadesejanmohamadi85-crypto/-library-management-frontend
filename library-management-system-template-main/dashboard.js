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
console.log("توکن:", token);
fetch("https://haditabatabaei.dev/api/books", {
  method: "GET",
  headers: {
    authorization: `Bearer ${token}`,
  },
})
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    return response.json().then((errorData) => {
      throw new Error(errorData.message);
    });
  })
  .then((booksData) => {
    console.log(booksData);
    if (booksData && booksData.data) {
      let booksCount = booksData.data.length;
      console.log(booksCount);
      availableBooksElement.textContent = booksCount;
    }
  })
  .catch((error) => {
    console.log("خطا:", error.message);
  });

fetch("https://haditabatabaei.dev/api/loans/my-loans", {
  method: "GET",
  headers: {
    authorization: `Bearer ${token}`,
  },
})
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    return response.json().then((errorData) => {
      throw new Error(errorData.message);
    });
  })
  .then((loansData) => {
    console.log(loansData);
    if (loansData && loansData.data) {
      let activeLoansCount = loansData.data.length;
      activeLoansElement.textContent = activeLoansCount;
    }
  })
  .catch((error) => {
    console.log("خطا:", error.message);
  });
fetch("https://haditabatabaei.dev/api/auth/me", {
  method: "GET",
  headers: {
    authorization: `Bearer ${token}`,
  },
})
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    return response.json().then((errorData) => {
      throw new Error(errorData.message);
    });
  })
  .then((userData) => {
    console.log(userData);
    if (userData && userData.data && userData.data.user) {
      let userName = userData.data.user.firstName;
      console.log(userName);
      userNameElement.textContent = userName;
      studentName.textContent = userName;
    }
  })
  .catch((error) => {
    console.log("خطا:", error.message);
  });
logoutBtn.addEventListener("click", (event) => {
  event.preventDefault();
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "login.html";
});
