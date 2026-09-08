let userNameElement = document.querySelector("#userName");
let availableBooksElement = document.querySelector("#availableBooks");
let activeLoansElement = document.querySelector("#activeLoans");
let logoutBtn = document.querySelector("#logoutBtn");
fetch("https://karyar-library-management-system.liara.run/api/books", {
  method: "GET",
  headers: {
    "authorization": `Bearer ${token}`,
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
    let booksCount = booksData.length;
    availableBooksElement.textContent = booksCount;
  })
  .catch((error) => {
    console.log("خطا:", error.message);
  });

fetch("https://karyar-library-management-system.liara.run/api/loans/my-loans", {
  method: "GET",
  headers: {
    "authorization": `Bearer ${token}`,
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
    let activeLoansCount = loansData.length;
    activeLoansElement.textContent = activeLoansCount;
  })
  .catch((error) => {
    console.log("خطا:", error.message);
  });
fetch("https://karyar-library-management-system.liara.run/api/auth/me", {
  method: "GET",
  headers: {
    "authorization": `Bearer ${token}`,
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
    let userName = userData.name;
    userNameElement.textContent = userName;
  })
  .catch((error) => {
    console.log("خطا:", error.message);
  });
logoutBtn.addEventListener("click", (event) => {
  event.preventDefault();
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "login.html";
});
