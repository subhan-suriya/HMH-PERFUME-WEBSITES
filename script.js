document.addEventListener("DOMContentLoaded", () => {

    const CART_KEY = "hmhPerfumesCart";

    const menuBtn = document.querySelector(".menu-btn");
    const mobileMenu = document.querySelector("#mobileMenu");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const productCards = document.querySelectorAll(".product-card");

    const modal = document.querySelector("#purchaseModal");
    const closeModalBtn = document.querySelector("#modalClose");
    const modalImage = document.querySelector("#modalProductImage");
    const modalName = document.querySelector("#modalProductName");
    const modalCategory = document.querySelector("#modalProductCategory");
    const modalPrice = document.querySelector("#modalProductPrice");
    const quantityValue = document.querySelector("#quantityValue");
    const modalTotal = document.querySelector("#modalTotal");
    const quantityMinus = document.querySelector("#quantityMinus");
    const quantityPlus = document.querySelector("#quantityPlus");
    const confirmOrderBtn = document.querySelector("#confirmOrder");

    let selectedQuantity = 1;
    let currentProduct = null;

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch (error) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartCount();
    }

    function updateCartCount() {
        const cart = getCart();
        const totalQuantity = cart.reduce((total, item) => total + Number(item.quantity || 1), 0);

        document.querySelectorAll(".cart-count").forEach(element => {
            element.textContent = totalQuantity;
        });
    }

    function formatPrice(value) {
        return `PKR ${Number(value || 0).toLocaleString("en-PK")}`;
    }

    function showAddedMessage(message) {
        let notification = document.querySelector(".shop-cart-notification");

        if (!notification) {
            notification = document.createElement("div");
            notification.className = "shop-cart-notification";
            notification.style.position = "fixed";
            notification.style.right = "24px";
            notification.style.bottom = "90px";
            notification.style.zIndex = "2000";
            notification.style.background = "#fffdf8";
            notification.style.border = "1px solid rgba(157, 121, 56, 0.3)";
            notification.style.boxShadow = "0 18px 35px rgba(30, 24, 18, 0.10)";
            notification.style.color = "#2d261f";
            notification.style.padding = "12px 16px";
            notification.style.fontSize = "11px";
            notification.style.letterSpacing = "1.5px";
            notification.style.textTransform = "uppercase";
            notification.style.opacity = "0";
            notification.style.transition = "opacity 0.25s ease, transform 0.25s ease";
            notification.style.transform = "translateY(8px)";
            document.body.appendChild(notification);
        }

        notification.textContent = message;
        notification.style.opacity = "1";
        notification.style.transform = "translateY(0)";

        clearTimeout(notification._hideTimer);
        notification._hideTimer = setTimeout(() => {
            notification.style.opacity = "0";
            notification.style.transform = "translateY(8px)";
        }, 2200);
    }

    function addToCart(product, quantity = 1) {
        if (!product) return;

        const cart = getCart();

        const existingProduct = cart.find(item => {
            if (product.id) {
                return String(item.id) === String(product.id);
            }
            return item.name === product.name;
        });

        if (existingProduct) {
            existingProduct.quantity = Number(existingProduct.quantity || 1) + Number(quantity || 1);
        } else {
            cart.push({
                id: product.id || `${product.name}-${Date.now()}`,
                name: product.name,
                price: Number(product.price) || 0,
                image: product.image || "",
                category: product.category || "",
                size: product.size || "100ml",
                quantity: Number(quantity || 1)
            });
        }

        saveCart(cart);
        showAddedMessage(`${product.name} added to cart ✓`);
    }

    function updateModalDetails() {
        if (!currentProduct) return;

        modalImage.src = currentProduct.image || "";
        modalImage.alt = currentProduct.name;
        modalName.textContent = currentProduct.name;
        modalCategory.textContent = currentProduct.category.toUpperCase();
        modalPrice.textContent = formatPrice(currentProduct.price);
        quantityValue.textContent = selectedQuantity;
        modalTotal.textContent = formatPrice(currentProduct.price * selectedQuantity);
    }

    function openPurchaseModal(card) {
        const imageElement = card.querySelector("img");

        currentProduct = {
            id: card.dataset.id || card.dataset.name,
            name: card.dataset.name || card.querySelector("h3")?.textContent.trim() || "HMH Perfume",
            category: card.dataset.category || "Unisex",
            price: Number(card.dataset.price || 0),
            image: imageElement ? imageElement.src : "",
            size: card.dataset.size || "100ml"
        };

        selectedQuantity = 1;
        updateModalDetails();

        if (modal) {
            modal.classList.add("open");
            document.body.style.overflow = "hidden";
        }
    }

    function closePurchaseModal() {
        if (modal) {
            modal.classList.remove("open");
        }
        document.body.style.overflow = "";
    }

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("active");
        });

        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
            });
        });
    }

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        const bottle = document.querySelector("#perfumeBottle");
        const title = document.querySelector("#perfumeTitle");
        const description = document.querySelector("#perfumeDescription");
        const meta = document.querySelector("#perfumeMeta");
        const number = document.querySelector("#currentNumber");
        const scrollProgress = document.querySelector(".scroll-line div");

        if (bottle && title && description && meta && number) {
            const perfumes = [
                {
                    name: "9PM AFNAN",
                    description: "A rich and captivating fragrance created for confidence, elegance and unforgettable evenings.",
                    meta: "LONG LASTING · PREMIUM FRAGRANCE",
                    image: "images/eb234a7c-7804-4485-a522-682d16050d8d.png"
                },
                {
                    name: "IMAGINATION",
                    description: "A fresh and modern fragrance with a refined character designed to stand out effortlessly.",
                    meta: "FRESH · MODERN · ELEGANT",
                    image: "images/53cffe72-a68c-437d-a3b4-0e9c0e7a6394.png"
                },
                {
                    name: "TUSCAN LEATHER",
                    description: "A bold and sophisticated fragrance with a deep personality and unmistakable presence.",
                    meta: "BOLD · DEEP · SOPHISTICATED",
                    image: "images/d34f3a82-3964-4421-888d-22a8f9772a6f.png"
                },
                {
                    name: "DAVID BECKHAM",
                    description: "A timeless and refined fragrance created for effortless everyday elegance.",
                    meta: "CLEAN · REFINED · TIMELESS",
                    image: "images/1832019a-c9d7-4a5f-a415-eadae083928e.png"
                }
            ];

            let current = 0;

            function changePerfume(index) {
                const perfume = perfumes[index];

                if (!perfume) return;

                current = index;

                gsap.to([bottle, title, description, meta], {
                    opacity: 0,
                    y: 15,
                    duration: 0.18,
                    onComplete: () => {
                        bottle.src = perfume.image;
                        bottle.alt = perfume.name;

                        title.textContent = perfume.name;
                        description.textContent = perfume.description;
                        meta.textContent = perfume.meta;
                        number.textContent = String(index + 1).padStart(2, "0");

                        gsap.to([bottle, title, description, meta], {
                            opacity: 1,
                            y: 0,
                            duration: 0.35,
                            stagger: 0.04
                        });
                    }
                });
            }

            ScrollTrigger.create({
                trigger: ".perfume-showcase",
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                onUpdate: self => {
                    const index = Math.min(perfumes.length - 1, Math.floor(self.progress * perfumes.length));

                    if (index !== current) {
                        changePerfume(index);
                    }

                    if (scrollProgress) {
                        scrollProgress.style.height = `${Math.max(10, self.progress * 100)}px`;
                    }
                }
            });

            gsap.to("#perfumeBottle", {
                y: -18,
                duration: 2.4,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true
            });
        }
    }

    if (filterButtons.length && productCards.length) {
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                const filter = button.dataset.filter;

                filterButtons.forEach(btn => btn.classList.toggle("active", btn === button));

                productCards.forEach(card => {
                    const category = card.dataset.category;
                    const shouldShow = filter === "all" || category === filter;

                    card.style.display = shouldShow ? "" : "none";
                });
            });
        });
    }

    document.querySelectorAll(".buy-btn").forEach(button => {
        button.addEventListener("click", () => {
            const card = button.closest(".product-card");

            if (card) {
                openPurchaseModal(card);
            }
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closePurchaseModal);
    }

    if (modal) {
        modal.addEventListener("click", event => {
            if (event.target === modal) {
                closePurchaseModal();
            }
        });
    }

    if (quantityPlus) {
        quantityPlus.addEventListener("click", () => {
            selectedQuantity += 1;
            updateModalDetails();
        });
    }

    if (quantityMinus) {
        quantityMinus.addEventListener("click", () => {
            if (selectedQuantity > 1) {
                selectedQuantity -= 1;
                updateModalDetails();
            }
        });
    }

    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener("click", () => {
            if (!currentProduct) return;

            addToCart(currentProduct, selectedQuantity);
            closePurchaseModal();
        });
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            if (modal && modal.classList.contains("open")) {
                closePurchaseModal();
            }

            if (mobileMenu) {
                mobileMenu.classList.remove("active");
            }
        }
    });

    updateCartCount();
});
