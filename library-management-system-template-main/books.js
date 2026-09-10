const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("token="))
  ?.split("=")[1];
if (!token) {
  window.location.href = "login.html";
}
const cacheKey = "booksData";
const cacheDuration = 5 * 60 * 1000;
const container = document.querySelector(".grid");
let userId = null;
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
    userId = userData.data.user.id;
    console.log("userId:", userId);
  })
  .catch((error) =>
    console.error("خطا در دریافت اطلاعات کاربر:", error.message),
  );
function fetchBooks() {
  fetch("https://haditabatabaei.dev/api/books", {
    headers: { authorization: `Bearer ${token}` },
  })
    .then((response) => {
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
      const statusText = book.availableCopies > 0 ? "Available" : "Unavailable";
      card.innerHTML = `<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
          <h3 style="margin: 0; color: #2c3e50;">${book.title}</h3>
          <span class="status ${statusClass}">${statusText}</span>
        </div>
        <p style="color: #666; margin-bottom: 0.5rem;"><strong>Author:</strong> ${book.author}</p>
        <p style="color: #666; margin-bottom: 0.5rem;"><strong>ISBN:</strong> ${book.isbn}</p>
        <p style="color: #666; margin-bottom: 0.5rem;"><strong>Category:</strong> ${book.category.name}</p>
        <p style="color: #666; margin-bottom: 1rem;"><strong>Available Copies:</strong> ${book.availableCopies}</p>
        <p style="margin-bottom: 1rem; font-size: 0.9rem; color: #555;">${book.description || ""}</p>
        <div style="display: flex; gap: 0.5rem;">
          ${
            book.availableCopies > 0
              ? `<button class="btn btn-primary btn-sm" data-id="${book.id}">Borrow Book</button>`
              : `<button class="btn btn-secondary btn-sm" disabled>Not Available</button>`
          }
          <button class="btn btn-secondary btn-sm">View Details</button>
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
      authorization: `Bearer ${token}`,
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
      if (response.ok) return response.json();
      return response.json().then((err) => {
        throw new Error(err.message || "خطا در امانت گرفتن کتاب");
      });
    })
    .then((data) => {
      console.log("کتاب امانت گرفته شد:", data);
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
