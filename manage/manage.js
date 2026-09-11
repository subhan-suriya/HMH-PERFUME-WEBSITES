const STORAGE_KEYS = {
    PRODUCTS: "hmhProducts",
    ORDERS: "hmhOrders",
    CART: "hmhPerfumesCart"
};

const DEMO_PRODUCTS = [
    {
        id: "prod-1",
        name: "9PM Afnan",
        price: 1200,
        category: "Men",
        size: "100ml",
        description: "Warm, sophisticated and unforgettable. A rich evening fragrance designed for confidence and presence.",
        image: "../images/eb234a7c-7804-4485-a522-682d16050d8d.png",
        status: "Available"
    },
    {
        id: "prod-2",
        name: "Imagination",
        price: 1500,
        category: "Women",
        size: "100ml",
        description: "A refined floral fragrance with a modern twist and a graceful, lasting finish.",
        image: "../images/53cffe72-a68c-437d-a3b4-0e9c0e7a6394.png",
        status: "Available"
    },
    {
        id: "prod-3",
        name: "Tuscan Leather",
        price: 1800,
        category: "Unisex",
        size: "100ml",
        description: "Deep, polished and confident with a warm leather character that feels premium and expressive.",
        image: "../images/d34f3a82-3964-4421-888d-22a8f9772a6f.png",
        status: "Out of Stock"
    }
];

const DEMO_ORDERS = [
    {
        id: "ORD-1001",
        customerName: "Ali Hassan",
        phone: "03001234567",
        whatsapp: "03001234567",
        products: [
            { name: "9PM Afnan", quantity: 1, price: 1200 }
        ],
        total: 1200,
        date: "2026-09-10",
        status: "Pending"
    },
    {
        id: "ORD-1002",
        customerName: "Sara Khan",
        phone: "03112233445",
        whatsapp: "03112233445",
        products: [
            { name: "Imagination", quantity: 2, price: 1500 }
        ],
        total: 3000,
        date: "2026-09-11",
        status: "Delivered"
    },
    {
        id: "ORD-1003",
        customerName: "Usman Raza",
        phone: "03445566778",
        whatsapp: "03445566778",
        products: [
            { name: "Tuscan Leather", quantity: 1, price: 1800 }
        ],
        total: 1800,
        date: "2026-09-12",
        status: "Processing"
    }
];

let currentEditingId = null;

const state = {
    products: [],
    orders: []
};

document.addEventListener("DOMContentLoaded", () => {
    initializeDefaults();
    bindUI();
    renderDashboard();
    renderProducts();
    renderOrders();
});

function initializeDefaults() {
    const storedProducts = getStoredData(STORAGE_KEYS.PRODUCTS);
    if (!storedProducts || storedProducts.length === 0) {
        setStoredData(STORAGE_KEYS.PRODUCTS, DEMO_PRODUCTS);
    }

    const storedOrders = getStoredData(STORAGE_KEYS.ORDERS);
    if (!storedOrders || storedOrders.length === 0) {
        setStoredData(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
    }

    state.products = getStoredData(STORAGE_KEYS.PRODUCTS) || [];
    state.orders = getStoredData(STORAGE_KEYS.ORDERS) || [];
}

function bindUI() {
    document.querySelectorAll(".nav-btn").forEach(button => {
        button.addEventListener("click", () => {
            const target = button.dataset.target;
            showPanel(target);
            document.getElementById("currentPageTitle").textContent = button.textContent.trim();
        });
    });

    document.querySelector("[data-target='addProductPanel']")?.addEventListener("click", () => {
        showPanel("addProductPanel");
        document.getElementById("currentPageTitle").textContent = "Add Product";
    });

    document.getElementById("productSearch").addEventListener("input", renderProducts);
    document.getElementById("productFilter").addEventListener("change", renderProducts);
    document.getElementById("orderSearch").addEventListener("input", renderOrders);
    document.getElementById("orderFilter").addEventListener("change", renderOrders);
    document.getElementById("orderSort").addEventListener("change", renderOrders);

    document.getElementById("productForm").addEventListener("submit", handleProductSubmit);
    document.getElementById("cancelProductEdit").addEventListener("click", resetProductForm);
    document.getElementById("productImage").addEventListener("change", handleImagePreview);
    document.getElementById("resetProductsBtn").addEventListener("click", resetDemoProducts);
    document.getElementById("clearAllDataBtn").addEventListener("click", clearAllData);
}

function showPanel(id) {
    document.querySelectorAll(".panel").forEach(panel => {
        panel.classList.toggle("active", panel.id === id);
    });

    document.querySelectorAll(".nav-btn").forEach(button => {
        button.classList.toggle("active", button.dataset.target === id);
    });
}

function renderDashboard() {
    const stats = getStats();
    const statsGrid = document.getElementById("statsGrid");
    const statConfigs = [
        { label: "Total Products", value: stats.totalProducts, icon: "✦" },
        { label: "Total Orders", value: stats.totalOrders, icon: "◌" },
        { label: "Pending Orders", value: stats.pendingOrders, icon: "•" },
        { label: "Delivered Orders", value: stats.deliveredOrders, icon: "✓" },
        { label: "Returned Orders", value: stats.returnedOrders, icon: "↺" },
        { label: "Total Sales", value: formatPrice(stats.totalSales), icon: "₨" }
    ];

    statsGrid.innerHTML = statConfigs.map(stat => `
        <div class="stat-card">
            <div class="stat-icon">${stat.icon}</div>
            <div class="stat-label">${stat.label}</div>
            <div class="stat-value">${stat.value}</div>
        </div>
    `).join("");

    renderRecentOrders();
    renderRecentProducts();
    renderSalesSummary(stats);
    renderStatusSummary(stats);
}

function renderRecentOrders() {
    const tbody = document.getElementById("recentOrdersBody");
    const recentOrders = [...state.orders]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4);

    if (!recentOrders.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-message">No orders available.</td></tr>';
        return;
    }

    tbody.innerHTML = recentOrders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customerName}</td>
            <td>${formatPrice(order.total)}</td>
            <td><span class="badge">${order.status}</span></td>
            <td>${formatDate(order.date)}</td>
        </tr>
    `).join("");
}

function renderRecentProducts() {
    const tbody = document.getElementById("recentProductsBody");
    const recentProducts = [...state.products]
        .slice(0, 4);

    if (!recentProducts.length) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-message">No products available.</td></tr>';
        return;
    }

    tbody.innerHTML = recentProducts.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${formatPrice(product.price)}</td>
            <td><span class="badge">${product.status}</span></td>
        </tr>
    `).join("");
}

function renderSalesSummary(stats) {
    const salesSummary = document.getElementById("salesSummary");
    const completedOrders = state.orders.filter(order => ["Confirmed", "Processing", "Delivered"].includes(order.status));
    const completedTotal = completedOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);

    salesSummary.innerHTML = `
        <div class="mini-list-item"><span>Gross Sales</span><span>${formatPrice(stats.totalSales)}</span></div>
        <div class="mini-list-item"><span>Completed Orders</span><span>${completedOrders.length}</span></div>
        <div class="mini-list-item"><span>Completed Value</span><span>${formatPrice(completedTotal)}</span></div>
    `;
}

function renderStatusSummary(stats) {
    const statusSummary = document.getElementById("statusSummary");
    const statusNames = ["Pending", "Confirmed", "Processing", "Delivered", "Returned", "Cancelled"];

    statusSummary.innerHTML = statusNames.map(status => `
        <div class="mini-list-item">
            <span>${status}</span>
            <span>${stats[status.toLowerCase() + "Orders"] || 0}</span>
        </div>
    `).join("");
}

function renderProducts() {
    const search = document.getElementById("productSearch").value.toLowerCase().trim();
    const filter = document.getElementById("productFilter").value;

    let filteredProducts = [...state.products];

    if (filter !== "all") {
        filteredProducts = filteredProducts.filter(product => product.category === filter);
    }

    if (search) {
        filteredProducts = filteredProducts.filter(product =>
            [product.name, product.category, product.size, product.status]
                .join(" ")
                .toLowerCase()
                .includes(search)
        );
    }

    const tbody = document.getElementById("productsTableBody");

    if (!filteredProducts.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-message">No products found.</td></tr>';
        return;
    }

    tbody.innerHTML = filteredProducts.map(product => `
        <tr>
            <td>
                <div class="product-thumb">
                    <img src="${product.image || '../images/placeholder.jpg'}" alt="${product.name}">
                </div>
            </td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${formatPrice(product.price)}</td>
            <td>${product.size}</td>
            <td><span class="badge">${product.status}</span></td>
            <td>
                <div class="action-group">
                    <button class="action-btn edit" data-action="edit" data-id="${product.id}">Edit</button>
                    <button class="action-btn delete" data-action="delete" data-id="${product.id}">Delete</button>
                </div>
            </td>
        </tr>
    `).join("");

    bindProductTableActions();
}

function bindProductTableActions() {
    document.querySelectorAll("[data-action='edit']").forEach(button => {
        button.addEventListener("click", () => {
            editProduct(button.dataset.id);
        });
    });

    document.querySelectorAll("[data-action='delete']").forEach(button => {
        button.addEventListener("click", () => {
            deleteProduct(button.dataset.id);
        });
    });
}

function renderOrders() {
    const search = document.getElementById("orderSearch").value.toLowerCase().trim();
    const filter = document.getElementById("orderFilter").value;
    const sort = document.getElementById("orderSort").value;

    let filteredOrders = [...state.orders];

    if (filter !== "all") {
        filteredOrders = filteredOrders.filter(order => order.status === filter);
    }

    if (search) {
        filteredOrders = filteredOrders.filter(order =>
            [order.id, order.customerName, order.phone, order.whatsapp, order.status]
                .join(" ")
                .toLowerCase()
                .includes(search)
        );
    }

    filteredOrders.sort((a, b) => {
        if (sort === "date-asc") return new Date(a.date) - new Date(b.date);
        if (sort === "date-desc") return new Date(b.date) - new Date(a.date);
        if (sort === "total-asc") return Number(a.total) - Number(b.total);
        if (sort === "total-desc") return Number(b.total) - Number(a.total);
        return 0;
    });

    const tbody = document.getElementById("ordersTableBody");

    if (!filteredOrders.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-message">No orders found.</td></tr>';
        return;
    }

    tbody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.whatsapp}</td>
            <td>${order.products.map(item => `${item.name} x${item.quantity}`).join('<br>')}</td>
            <td>${formatPrice(order.total)}</td>
            <td><span class="badge">${order.status}</span></td>
            <td>${formatDate(order.date)}</td>
            <td>
                <div class="action-group">
                    <select data-order-status="${order.id}">
                        <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="Confirmed" ${order.status === "Confirmed" ? "selected" : ""}>Confirmed</option>
                        <option value="Processing" ${order.status === "Processing" ? "selected" : ""}>Processing</option>
                        <option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
                        <option value="Returned" ${order.status === "Returned" ? "selected" : ""}>Returned</option>
                        <option value="Cancelled" ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
                    </select>
                </div>
            </td>
        </tr>
    `).join("");

    document.querySelectorAll("[data-order-status]").forEach(select => {
        select.addEventListener("change", event => {
            updateOrderStatus(event.target.dataset.orderStatus, event.target.value);
        });
    });
}

async function handleProductSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const productName = (formData.get("productName") || "").toString().trim();
    const productCategory = (formData.get("productCategory") || "").toString().trim();
    const productSize = (formData.get("productSize") || "").toString().trim();
    const productPrice = Number(formData.get("productPrice") || 0);
    const productDescription = (formData.get("productDescription") || "").toString().trim();
    const productStatus = (formData.get("productStatus") || "Available").toString().trim();

    const imageInput = document.getElementById("productImage");

    let valid = true;

    clearFieldErrors();

    if (!productName) {
        showFieldError("productName", "Product name is required.");
        valid = false;
    }

    if (!productCategory) {
        showFieldError("productCategory", "Please choose a category.");
        valid = false;
    }

    if (!productSize) {
        showFieldError("productSize", "Size is required.");
        valid = false;
    }

    if (!productPrice || productPrice <= 0) {
        showFieldError("productPrice", "Price must be greater than zero.");
        valid = false;
    }

    if (!productDescription) {
        showFieldError("productDescription", "Description is required.");
        valid = false;
    }

    if (!valid) {
        showFormMessage("Please complete the required fields.", true);
        return;
    }

    const file = imageInput.files && imageInput.files[0];
    let imageValue = currentEditingId
        ? state.products.find(item => item.id === currentEditingId)?.image || ""
        : "";

    if (file) {
        imageValue = await readFileAsDataURL(file);
    }

    const productPayload = {
        id: currentEditingId || generateId("prod"),
        name: productName,
        price: productPrice,
        category: productCategory,
        size: productSize,
        description: productDescription,
        image: imageValue,
        status: productStatus
    };

    if (currentEditingId) {
        const index = state.products.findIndex(item => item.id === currentEditingId);
        if (index >= 0) {
            state.products[index] = { ...state.products[index], ...productPayload };
        }
    } else {
        state.products.push(productPayload);
    }

    setStoredData(STORAGE_KEYS.PRODUCTS, state.products);
    renderProducts();
    renderDashboard();
    resetProductForm();
    showFormMessage("Product saved successfully.", false);
    showPanel("productsPanel");
    document.getElementById("currentPageTitle").textContent = "Products";
}

function editProduct(id) {
    const product = state.products.find(item => item.id === id);
    if (!product) return;

    currentEditingId = id;
    document.getElementById("productFormTitle").textContent = "Edit Product";

    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productSize").value = product.size;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productDescription").value = product.description;
    document.getElementById("productStatus").value = product.status;

    const preview = document.getElementById("productImagePreview");
    if (product.image) {
        preview.src = product.image;
        preview.classList.add("visible");
    } else {
        preview.src = "";
        preview.classList.remove("visible");
    }

    document.getElementById("productImage").value = "";
    showPanel("addProductPanel");
    document.getElementById("currentPageTitle").textContent = "Edit Product";
}

function deleteProduct(id) {
    const product = state.products.find(item => item.id === id);
    if (!product) return;

    const confirmed = window.confirm(`Are you sure you want to delete ${product.name}?`);
    if (!confirmed) return;

    state.products = state.products.filter(item => item.id !== id);
    setStoredData(STORAGE_KEYS.PRODUCTS, state.products);

    if (currentEditingId === id) {
        resetProductForm();
    }

    renderProducts();
    renderDashboard();
}

function resetProductForm() {
    currentEditingId = null;
    document.getElementById("productFormTitle").textContent = "Add Product";
    document.getElementById("productForm").reset();

    const preview = document.getElementById("productImagePreview");
    preview.src = "";
    preview.classList.remove("visible");

    clearFieldErrors();
    hideFormMessage();
}

function handleImagePreview(event) {
    const file = event.target.files && event.target.files[0];
    const preview = document.getElementById("productImagePreview");

    if (!file) {
        preview.classList.remove("visible");
        preview.src = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = function (loadEvent) {
        preview.src = loadEvent.target.result;
        preview.classList.add("visible");
    };

    reader.readAsDataURL(file);
}

function showFieldError(fieldName, message) {
    const errorElement = document.querySelector(`[data-error-for="${fieldName}"]`);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearFieldErrors() {
    document.querySelectorAll(".error-text").forEach(element => {
        element.textContent = "";
    });
}

function showFormMessage(message, isError) {
    const formMessage = document.getElementById("formMessage");
    formMessage.textContent = message;
    formMessage.classList.add("visible");
    formMessage.style.borderColor = isError ? "rgba(164, 67, 56, 0.35)" : "rgba(79, 127, 77, 0.35)";
    formMessage.style.background = isError ? "rgba(164, 67, 56, 0.06)" : "rgba(79, 127, 77, 0.07)";
    formMessage.style.color = isError ? "var(--danger)" : "var(--success)";
}

function hideFormMessage() {
    const formMessage = document.getElementById("formMessage");
    formMessage.textContent = "";
    formMessage.classList.remove("visible");
}

function updateOrderStatus(orderId, newStatus) {
    state.orders = state.orders.map(order => {
        if (order.id === orderId) {
            return { ...order, status: newStatus };
        }
        return order;
    });

    setStoredData(STORAGE_KEYS.ORDERS, state.orders);
    renderDashboard();
    renderOrders();
}

function getStats() {
    const totalProducts = state.products.length;
    const totalOrders = state.orders.length;
    const pendingOrders = state.orders.filter(order => order.status === "Pending").length;
    const confirmedOrders = state.orders.filter(order => order.status === "Confirmed").length;
    const processingOrders = state.orders.filter(order => order.status === "Processing").length;
    const deliveredOrders = state.orders.filter(order => order.status === "Delivered").length;
    const returnedOrders = state.orders.filter(order => order.status === "Returned").length;
    const cancelledOrders = state.orders.filter(order => order.status === "Cancelled").length;
    const totalSales = state.orders.reduce((sum, order) => {
        const shouldCount = ["Delivered", "Confirmed", "Processing"].includes(order.status);
        return sum + (shouldCount ? Number(order.total || 0) : 0);
    }, 0);

    return {
        totalProducts,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        processingOrders,
        deliveredOrders,
        returnedOrders,
        cancelledOrders,
        totalSales
    };
}

function resetDemoProducts() {
    state.products = [...DEMO_PRODUCTS];
    state.orders = [...DEMO_ORDERS];
    setStoredData(STORAGE_KEYS.PRODUCTS, state.products);
    setStoredData(STORAGE_KEYS.ORDERS, state.orders);
    resetProductForm();
    renderDashboard();
    renderProducts();
    renderOrders();
}

function clearAllData() {
    const confirmed = window.confirm("This will clear stored products and orders from localStorage. Continue?");
    if (!confirmed) return;

    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CART);

    state.products = [];
    state.orders = [];

    resetProductForm();
    renderDashboard();
    renderProducts();
    renderOrders();
}

function generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Unable to read selected image."));
        reader.readAsDataURL(file);
    });
}

function setStoredData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getStoredData(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        return null;
    }
}

function formatPrice(value) {
    return `PKR ${Number(value || 0).toLocaleString("en-PK")}`;
}

function formatDate(dateValue) {
    if (!dateValue) return "—";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return dateValue;
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
