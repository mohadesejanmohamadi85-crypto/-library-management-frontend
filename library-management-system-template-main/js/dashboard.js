import { protectPage,getAuthHeaders,handleUnauthorized,logout,apiGet } from "./shared.js";
const token=protectPage();
const userNameElement = document.querySelector("#userName");
const availableBooksElement = document.querySelector("#availableBooks");
const activeLoansElement = document.querySelector("#activeLoans");
const studentName = document.querySelector("#studentName");
 apiGet("https://haditabatabaei.dev/api/books")
  .then((booksData) => {
    if (booksData && booksData.data) {
      let booksCount = booksData.data.length;
      availableBooksElement.textContent = booksCount;
    }
  })
  .catch((error) => {
    console.log("خطا:", error.message);
  });
 apiGet("https://haditabatabaei.dev/api/loans/my-loans")
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
 apiGet("https://haditabatabaei.dev/api/auth/me")
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
const logoutBtn = document.querySelector("#logoutBtn");
if(logoutBtn){
logoutBtn.addEventListener("click", (event) => {
  event.preventDefault();
  logout()
});
}
