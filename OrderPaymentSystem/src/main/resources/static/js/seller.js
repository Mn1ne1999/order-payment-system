const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", () => {
  checkRole();
  loadCategories();
  loadMyProducts();

  document.getElementById("sellerProductForm").addEventListener("submit", saveProduct);
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

function checkRole() {
  const role = JSON.parse(atob(token.split('.')[1])).role;
  if (role !== "SELLER") {
    alert("❌ Доступ только для SELLER!");
    window.location.href = "index.html";
  }
}

async function loadCategories() {
  const res = await fetch("http://localhost:8080/api/categories", {
    headers: { "Authorization": "Bearer " + token }
  });
  const categories = await res.json();

  const select = document.getElementById("categoryId");
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.name;
    select.appendChild(opt);
  });
}

async function loadMyProducts() {
  const res = await fetch("http://localhost:8080/api/products/my", {
    headers: { "Authorization": "Bearer " + token }
  });
  const products = await res.json();

  const tbody = document.getElementById("sellerProductTableBody");
  tbody.innerHTML = "";
  products.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.category?.name || "—"}</td>
      <td>${p.price} ₽</td>
      <td>
        <button onclick="editProduct(${p.id})">✏️</button>
        <button onclick="deleteProduct(${p.id})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function saveProduct(e) {
  e.preventDefault();

  const product = {
    id: document.getElementById("productId").value || null,
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    price: parseFloat(document.getElementById("price").value),
    stock: parseInt(document.getElementById("stock").value),
    imageUrl: document.getElementById("imageUrl").value,
    available: document.getElementById("available").checked,
    categoryId: parseInt(document.getElementById("categoryId").value)
  };

  const method = product.id ? "PUT" : "POST";
  const url = product.id
    ? `http://localhost:8080/api/products/${product.id}`
    : `http://localhost:8080/api/products`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization
