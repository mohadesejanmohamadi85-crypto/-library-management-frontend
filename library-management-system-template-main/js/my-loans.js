import { protectPage,getAuthHeaders,handleUnauthorized,logout,apiGet,apiPostNoBody } from "./shared.js";
const token=protectPage();
  apiGet("https://haditabatabaei.dev/api/auth/me")
  .then((userData) => {
    const userName = userData.data.user.firstName;
    const userNameElement = document.querySelector("#firstName");
    if (userNameElement) {
      userNameElement.textContent = userName;
    }
  })
  .catch((error) => console.log("خطا:", error.message));
 apiGet("https://haditabatabaei.dev/api/loans/my-loans")
  .then((loansData) => {
    const loans = loansData.data;
    const summarySpan=document.querySelector(".loanSummaryText")
    summarySpan.textContent=`تعداد کل: ${loans.length}`
    let activeCount = 0;
    let returnedCount = 0;
    loans.forEach((loan) => {
      if (loan.status === "active") activeCount += 1;
      else if (loan.status === "returned") returnedCount += 1;
    });
    const activeElement = document.querySelector("#activeLoansCount");
    const returnedElement = document.querySelector("#returnedLoansCount");
    if (activeElement) activeElement.textContent = activeCount;
    if (returnedElement) returnedElement.textContent = returnedCount;
    const tbody = document.querySelector("#tbody");
    if(!tbody) return;
    tbody.innerHTML = "";
    loans.forEach((loan) => {
      const book = loan.book;
      const status = loan.status;
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `<td>
          <strong>${book.title}</strong><br>
          <small style="color: #666; font-size:15px;"> شابک: ${book.isbn}</small>
        </td>
        <td>${book.author}</td>
        <td>${loan.loanDate.split("T")[0]}</td>
        <td><span class="status status-active">${status}</span></td>
        <td>
          ${
            status === "active"
              ? `<button class="btn btn-success btn-sm return-btn" data-id="${loan.id}">بازگرداندن کتاب</button>`
              : `<button class="btn btn-secondary btn-sm" disabled>بازگردانده شده</button>`
          }
        </td>`;
      const returnButton = tableRow.querySelector(".return-btn");
      if (returnButton) {
        returnButton.addEventListener("click", () => returnBook(loan.id));
      }
      tbody.appendChild(tableRow);
    });
  })
  .catch((error) => console.log(error.message));
function returnBook(loanId) {
   apiPostNoBody(`https://haditabatabaei.dev/api/loans/${loanId}/return`)
    .then((data) => {
      alert("کتاب با موفقیت بازگردانده شد");
      location.reload();
    })
    .catch((error) => {
      console.log("خطا:", error.message);
      alert("خطا: " + error.message);
    });
}
let logoutBtn = document.querySelector("#logoutBtn");
if(logoutBtn){
logoutBtn.addEventListener("click", (event) => {
  event.preventDefault();
  logout()
});
}
