# 📊 Feastify Database Pagination & Search Guide
*A simple guide explaining how Feastify handles large amounts of bookings, users, and complaints without slowing down.*

---

## 🐢 The Problem: Client-Side Pagination (What we had before)
Imagine a library with **100,000 books**. 

If a customer asks to see 5 books at a time, **Client-Side Pagination** does this:
1. The librarian carries **all 100,000 books** from the warehouse to the front counter.
2. The customer reviews 5 books.
3. When the customer clicks **"Next"**, the librarian swaps those 5 books with another 5 from the massive pile already on the counter.

* **Why this is bad**: The counter collapses under the weight of the books, and the customer has to wait a very long time for the first 5 books to load.

---

## ⚡ The Solution: Server-Side Pagination (What we just built!)
Feastify now uses **Server-Side Pagination**. 

When a user clicks "Next" or searches for a name:
1. The frontend (counter) asks the backend (librarian): *"Give me Page 2 (books 6 to 10)."*
2. The backend looks in the database (warehouse), picks exactly those 5 books, and carries only them to the front desk.
3. The frontend displays them instantly.

* **Why this is good**: The frontend remains fast, uses almost zero memory, and the app will never crash even if we have millions of bookings!

---

## 🔍 Smart Debounced Search
When you type in the search bar, the app doesn't search immediately on every single letter you type. If you type "John", it doesn't query the database for "J", then "Jo", then "Joh", and finally "John".

Instead, it uses a **Debouncer**:
* It waits until you **stop typing for 0.3 seconds**.
* Once you stop, it makes **one single search query** directly to the database.
* This reduces the load on your server by up to 90% when admins are typing quickly.

---

## 🛠️ Files involved in this feature:
* **Backend logic**: [adminController.js](file:///c:/Users/ACER/Desktop/fsd/final%20project/Catering-App/Backend/src/controllers/adminController.js) (Filters the database & returns custom limits).
* **API Actions**: [adminActions.js](file:///c:/Users/ACER/Desktop/fsd/final%20project/Catering-App/frontend/src/api/admin/adminActions.js) (Transfers the active page and search text in the web requests).
* **Shared Table UI**: [Table.jsx](file:///c:/Users/ACER/Desktop/fsd/final%20project/Catering-App/frontend/src/common%20ui/Table.jsx) (Displays the records and calculates the offsets).
