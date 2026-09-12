const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("token="))
  ?.split("=")[1];
if (!token) {
  window.location.href = "login.html";
}
fetch("https://haditabatabaei.dev/api/auth/me", {
  headers: { authorization: `Bearer ${token}` },
})
  .then((response) => response.json())
  .then((userData) => {
    const userName = userData.data.user.firstName;
    const userNameElement = document.querySelector("#firstName");
    if (userNameElement) {
      userNameElement.textContent = userName;
    }
  })
  .catch((error) => console.log("خطا:", error.message));
fetch("https://haditabatabaei.dev/api/loans/my-loans", {
  method: "GET",
  headers: { authorization: `Bearer ${token}` },
})
  .then((response) => {
    if (response.ok) return response.json();
    return response.json().then((errorData) => {
      throw new Error(errorData.message || "خطا در دریافت امانت‌ها");
    });
  })
  .then((loansData) => {
    const loans = loansData.data;
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
    tbody.innerHTML = "";
    loans.forEach((loan) => {
      const book = loan.book;
      const status = loan.status;
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `<td>
          <strong>${book.title}</strong><br>
          <small style="color: #666;">ISBN: ${book.isbn}</small>
        </td>
        <td>${book.author}</td>
        <td>${loan.loanDate.split("T")[0]}</td>
        <td><span class="status status-active">${status}</span></td>
        <td>
          ${
            status === "active"
              ? `<button class="btn btn-success btn-sm return-btn" data-id="${loan.id}">Return</button>`
              : `<button class="btn btn-secondary btn-sm" disabled>Returned</button>`
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
  fetch(`https://haditabatabaei.dev/api/loans/${loanId}/return`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (response.ok) return response.json();
      return response.json().then((errorData) => {
        throw new Error(errorData.message || "خطا در بازگرداندن");
      });
    })
    .then((data) => {
      console.log("کتاب برگردانده شد:", data);
      alert("کتاب با موفقیت بازگردانده شد");
      location.reload();
    })
    .catch((error) => {
      console.log("خطا:", error.message);
      alert("خطا: " + error.message);
    });
}
let logoutBtn = document.querySelector("#logoutBtn");
logoutBtn.addEventListener("click", (event) => {
  event.preventDefault();
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "login.html";
});
