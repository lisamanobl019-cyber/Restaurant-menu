const dishes = [
    {
        id: 1,
        name: "Чизбургер",
        category: "Бургеры",
        price: 180,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: 2,
        name: "Гамбургер",
        category: "Бургеры",
        price: 150,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: 3,
        name: "Пицца Пепперони",
        category: "Пицца",
        price: 350,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: 4,
        name: "Пицца 4 сыра",
        category: "Пицца",
        price: 370,
        image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: 5,
        name: "Картофель фри",
        category: "Закуски",
        price: 100,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: 6,
        name: "Наггетсы",
        category: "Закуски",
        price: 160,
        image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: 7,
        name: "Куриные крылышки",
        category: "Закуски",
        price: 200,
        image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: 8,
        name: "Салат Цезарь",
        category: "Закуски",
        price: 180,
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: 9,
        name: "Кола",
        category: "Напитки",
        price: 70,
        image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: 10,
        name: "Лимонад",
        category: "Напитки",
        price: 70,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: 11,
        name: "Апельсиновый сок",
        category: "Напитки",
        price: 90,
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&auto=format&fit=crop&q=80"
    },
    {
        id: 12,
        name: "Молочный коктейль",
        category: "Напитки",
        price: 120,
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80"
    }
];

// Корзина
let cart = [];

let selectedCategory = "Все";

// Поиск, категории и сортировка
function showMenu() {
    const search = document
        .getElementById("search").value
        .trim().toLowerCase();

    const category = document.getElementById("category").value;
    const sort = document.getElementById("sort").value;

    let result = dishes.filter(dish => {
        const matchesName = dish.name.toLowerCase().includes(search);
        const matchesCategory =
            category === "Все" || dish.category === category;
        const matchesButtonCategory =
            selectedCategory === "Все" ||
            dish.category === selectedCategory;

        return matchesName &&
            matchesCategory &&
            matchesButtonCategory;
    });

    if (sort === "asc") {
        result.sort((a, b) => a.price - b.price);
    }

    if (sort === "desc") {
        result.sort((a, b) => b.price - a.price);
    }

    const menuList = document.getElementById("menuList");

    menuList.innerHTML = result.map(dish => `
        <article class="card">
            <img
                src="${dish.image}"
                alt="${dish.name}"
                loading="lazy"
                onerror="this.onerror=null;this.src='https://placehold.co/500x300/fff0e5/603c2b?text=FastFood'">

            <div class="card-content">
                <span class="tag">${dish.category}</span>
                <h3>${dish.name}</h3>
                <p class="price">${dish.price} сом</p>
                <button class="add-button"
                    onclick="addToCart(${dish.id})">
                    🛒 Добавить в корзину
                </button>
            </div>
        </article>
    `).join("");

    document.getElementById("emptyMessage").textContent =
        result.length === 0 ? "Блюда не найдены." : "";
}

// Переключение категорий
document.querySelectorAll(".category-btn").forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        document.querySelectorAll(".category-btn")
            .forEach(item => item.classList.remove("active"));

        button.classList.add("active");

        // Синхронизируем выпадающий список
        document.getElementById("category").value = "Все";

        showMenu();
    });
});

// Поиск и сортировка
document.getElementById("search").addEventListener("input", showMenu);
document.getElementById("category").addEventListener("change", showMenu);
document.getElementById("sort").addEventListener("change", showMenu);

// Добавить блюдо
function addToCart(id) {
    const dish = dishes.find(item => item.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...dish, quantity: 1 });
    }

    renderCart();
}

// Изменить количество блюда
function changeQuantity(id, amount) {
    const item = cart.find(dish => dish.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(dish => dish.id !== id);
    }

    renderCart();
}

// Удалить одно блюдо
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

// Показать корзину и сумму
function renderCart() {
    const cartItems = document.getElementById("cartItems");

    const count = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    document.getElementById("cartCount").textContent = count;
    document.getElementById("total").textContent =
        `Итого: ${total} сом`;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Корзина пока пустая.</p>";
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-row">
            <div>
                <strong>${item.name}</strong>
                <p>${item.price} сом × ${item.quantity}</p>
            </div>

            <div class="quantity">
                <button onclick="changeQuantity(${item.id}, -1)"
                    aria-label="Уменьшить количество">−</button>

                <span>${item.quantity}</span>

                <button onclick="changeQuantity(${item.id}, 1)"
                    aria-label="Увеличить количество">+</button>
            </div>

            <strong>${item.price * item.quantity} сом</strong>

            <button class="remove-button"
                onclick="removeFromCart(${item.id})">
                Удалить
            </button>
        </div>
    `).join("");
}

// Открыть раздел корзины
document.getElementById("cartButton").addEventListener("click", () => {
    document.getElementById("cart").scrollIntoView({
        behavior: "smooth"
    });
});

// Очистить корзину
document.getElementById("clearCart").addEventListener("click", () => {
    cart = [];
    renderCart();
    document.getElementById("orderMessage").textContent = "";
});

// Оформить заказ
document.getElementById("orderForm").addEventListener("submit", event => {
    event.preventDefault();

    if (cart.length === 0) {
        document.getElementById("orderMessage").textContent =
            "Сначала добавьте блюдо в корзину.";
        return;
    }

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const address = document.getElementById("customerAddress").value.trim();

    if (!name || !phone || !address) {
        document.getElementById("orderMessage").textContent =
            "Заполните все поля.";
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const orderNumber = Date.now().toString().slice(-6);

    document.getElementById("orderMessage").textContent =
        `Заказ №${orderNumber} подготовлен! Сумма: ${total} сом. ` +
        `Спасибо, ${name}!`;

    alert(
        `Ваш заказ №${orderNumber}\n` +
        `Имя: ${name}\n` +
        `Телефон: ${phone}\n` +
        `Адрес: ${address}\n\n` +
        cart.map(item =>
            `${item.name} × ${item.quantity} = ` +
            `${item.price * item.quantity} сом`
        ).join("\n") +
        `\n\nИтого: ${total} сом`
    );
});

showMenu();
renderCart();