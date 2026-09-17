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
const cacheKey = "booksData";
const cacheDuration = 5 * 60 * 1000;
const container = document.querySelector(".grid");
let userId = null;
function handleUnauthorized(response) {
  if (response.status === 401) {
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "login.html";
    return true;
  }
  return false;
}
fetch("https://haditabatabaei.dev/api/auth/me", {
  headers: getAuthHeaders(),
})
  .then((response) => response.json())
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
  fetch("https://haditabatabaei.dev/api/books", {
    headers: getAuthHeaders(),
  })
    .then((response) => {
      if (handleUnauthorized(response)) {
        return;
      }
      if (response.ok) return response.json();
      return response.json().then((err) => {
        throw new Error(err.message || "خطا در دریافت کتاب‌ها");
      });
    })
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
  fetch("https://haditabatabaei.dev/api/loans", {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bookId: bookId,
      userId: userId,
      loanPeriod: 14,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    }),
  })
    .then((response) => {
      if (handleUnauthorized(response)) {
        return;
      }
      if (response.ok) return response.json();
      return response.json().then((err) => {
        throw new Error(err.message || "خطا در امانت گرفتن کتاب");
      });
    })
    .then((data) => {
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
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "login.html";
  });
}
