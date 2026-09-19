import { protectPage,getAuthHeaders,handleUnauthorized,logout,apiGet,apiPost } from "./shared.js";
const token=protectPage();
const cacheKey = "booksData";
const cacheDuration = 5 * 60 * 1000;
const container = document.querySelector(".grid");
let userId = null;
  apiGet("https://haditabatabaei.dev/api/auth/me")
  .then((userData) => {
    const userName = userData.data.user.firstName;
    const userNameElement = document.querySelector("#firstName");
    if (userNameElement) {
      userNameElement.textContent = userName;
    }
    userId = userData.data.user.id;
  })
  .catch((error) =>
    console.error("خطا در دریافت اطلاعات کاربر:", error.message),
  );
function fetchBooks() {
  apiGet("https://haditabatabaei.dev/api/books")
    .then((data) => {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data: data,
          timestamp: Date.now(),
        }),
      );
      displayBooks(data);
    })
    .catch((error) => console.error("خطا:", error.message));
}
function displayBooks(data) {
  container.innerHTML = "";
  if (data && data.data && data.data.length > 0) {
    data.data.forEach((book) => {
      const card = document.createElement("div");
      card.className = "card";
      const statusClass =
        book.availableCopies > 0 ? "status-available" : "status-unavailable";
      const statusText = book.availableCopies > 0 ? "موجود" : "ناموجود";
      card.innerHTML = `<div  class="book-header">
        <h3 class="book-title">${book.title}</h3>
        <span class="status ${statusClass}">${statusText}</span>
        </div>
        <p class="book-info"><strong>نویسنده:</strong> ${book.author}</p>
        <p class="book-info"><strong> شابک: </strong>${book.isbn}</p>
        <p class="book-info"><strong>دسته بندی:</strong> ${book.category?.name || "نامشخص"}</p>
        <p style=" margin-bottom: 1rem;" class="book-info"><strong>نسخه های موجود:</strong> ${book.availableCopies}</p>
        <p style="margin-bottom: 1rem; font-size: 1rem; color: #555;">${book.description || ""}</p>
        <div style="display: flex; gap: 0.5rem;">
          ${
            book.availableCopies > 0
              ? `<button class="btn btn-primary btn-sm" data-id="${book.id}">امانت گرفتن</button>`
              : `<button class="btn btn-secondary btn-sm" disabled>موجود نیست</button>`
          }
        </div>`;
      const borrowButton = card.querySelector(".btn-primary");
      if (borrowButton) {
        borrowButton.addEventListener("click", () => borrowBook(book.id));
      }
      container.appendChild(card);
    });
  } else {
    container.textContent = "هیچ کتابی یافت نشد";
  }
}
function borrowBook(bookId) {
  if (!userId) {
    alert("لطفاً چند لحظه صبر کن و دوباره امتحان کن");
    return;
  }
  apiPost("https://haditabatabaei.dev/api/loans", {
    bookId: bookId,
    userId: userId,
  })
    .then((data) => {
      alert("کتاب با موفقیت امانت گرفته شد");
      localStorage.removeItem(cacheKey);
      location.reload();
    })
    .catch((error) => {
      console.error("خطا:", error.message);
      alert("خطا: " + error.message);
    });
}
const cached = localStorage.getItem(cacheKey);
if (cached) {
  const parsedData = JSON.parse(cached);
  const data = parsedData.data;
  const timestamp = parsedData.timestamp;
  if (Date.now() - timestamp < cacheDuration) {
    displayBooks(data);
  } else {
    fetchBooks();
  }
} else {
  fetchBooks();
}
let logoutBtn = document.querySelector("#logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", (event) => {
    event.preventDefault();
    logout()
  });
}
