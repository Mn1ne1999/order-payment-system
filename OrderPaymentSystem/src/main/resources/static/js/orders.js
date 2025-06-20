document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/orders", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const orders = await response.json();
        const container = document.getElementById("ordersContainer");

        if (orders.length === 0) {
            container.innerHTML = "<p>У вас пока нет заказов.</p>";
            return;
        }

        orders.forEach(order => {
            const orderDiv = document.createElement("div");
            orderDiv.classList.add("product");

            const itemsHtml = order.items.map(item => `
                <li>
                    <strong>${item.product.name}</strong> — ${item.quantity} шт. по ${item.price}₽
                </li>
            `).join("");

            orderDiv.innerHTML = `
                <h3>Заказ №${order.id}</h3>
                <p><strong>Дата:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
                <p><strong>Сумма:</strong> ${order.totalAmount}₽</p>
                <p><strong>Статус:</strong> ${order.status}</p>
                <ul>${itemsHtml}</ul>
                <hr>
            `;

            container.appendChild(orderDiv);
        });

    } catch (error) {
        console.error("Ошибка загрузки заказов:", error);
        document.getElementById("ordersContainer").innerHTML = "<p>Ошибка при загрузке заказов.</p>";
    }
});
