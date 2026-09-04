/* =========================================================
   HMH PERFUMES
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ================= MOBILE MENU ================= */

    const menuBtn = document.querySelector(".menu-btn");
    const navMenu = document.querySelector(".nav-menu");

    if (menuBtn && navMenu) {

        menuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("open");
        });

        navMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("open");
            });
        });

    }


    /* ================= GSAP ================= */

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {

        gsap.registerPlugin(ScrollTrigger);

        const bottle = document.querySelector("#perfumeBottle");
        const title = document.querySelector("#perfumeTitle");
        const description = document.querySelector("#perfumeDescription");
        const meta = document.querySelector("#perfumeMeta");
        const number = document.querySelector("#currentNumber");
        const scrollProgress = document.querySelector(".scroll-line div");

        const perfumes = [

            {
                name: "9PM AFNAN",
                description:
                    "A rich and captivating fragrance created for confidence, elegance and unforgettable evenings.",
                meta:
                    "LONG LASTING · PREMIUM FRAGRANCE",
                image:
                    "images/eb234a7c-7804-4485-a522-682d16050d8d.png"
            },

            {
                name: "IMAGINATION",
                description:
                    "A fresh and modern fragrance with a refined character designed to stand out effortlessly.",
                meta:
                    "FRESH · MODERN · ELEGANT",
                image:
                    "images/53cffe72-a68c-437d-a3b4-0e9c0e7a6394.png"
            },

            {
                name: "TUSCAN LEATHER",
                description:
                    "A bold and sophisticated fragrance with a deep personality and unmistakable presence.",
                meta:
                    "BOLD · DEEP · SOPHISTICATED",
                image:
                    "images/d34f3a82-3964-4421-888d-22a8f9772a6f.png"
            },

            {
                name: "DAVID BECKHAM",
                description:
                    "A timeless and refined fragrance created for effortless everyday elegance.",
                meta:
                    "CLEAN · REFINED · TIMELESS",
                image:
                    "images/1832019a-c9d7-4a5f-a415-eadae083928e.png"
            }

        ];


        let current = 0;


        function changePerfume(index) {

            const perfume = perfumes[index];

            if (!perfume) return;

            current = index;

            gsap.to(
                [bottle, title, description, meta],
                {
                    opacity: 0,
                    y: 15,
                    duration: 0.18,
                    onComplete: () => {

                        bottle.src = perfume.image;
                        bottle.alt = perfume.name;

                        title.textContent = perfume.name;
                        description.textContent = perfume.description;
                        meta.textContent = perfume.meta;

                        number.textContent =
                            String(index + 1).padStart(2, "0");

                        gsap.to(
                            [bottle, title, description, meta],
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.35,
                                stagger: 0.04
                            }
                        );

                    }
                }
            );

        }


        ScrollTrigger.create({

            trigger: ".perfume-showcase",

            start: "top top",

            end: "bottom bottom",

            scrub: true,

            onUpdate: self => {

                const index = Math.min(
                    perfumes.length - 1,
                    Math.floor(self.progress * perfumes.length)
                );

                if (index !== current) {
                    changePerfume(index);
                }

                if (scrollProgress) {
                    scrollProgress.style.height =
                        `${Math.max(10, self.progress * 100)}px`;
                }

            }

        });


        /* Bottle subtle movement */

        gsap.to("#perfumeBottle", {

            y: -18,

            duration: 2.4,

            ease: "sine.inOut",

            repeat: -1,

            yoyo: true

        });

    }


    /* ================= CATEGORY FILTER ================= */

    const categoryButtons =
        document.querySelectorAll(".category-btn");

    const productCards =
        document.querySelectorAll(".product-card");


    categoryButtons.forEach(button => {

        button.addEventListener("click", () => {

            const filter = button.dataset.filter;

            categoryButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");


            productCards.forEach(card => {

                const category = card.dataset.category;

                if (
                    filter === "all" ||
                    category === filter
                ) {

                    card.style.display = "";

                    requestAnimationFrame(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    });

                } else {

                    card.style.opacity = "0";
                    card.style.transform = "translateY(10px)";

                    setTimeout(() => {
                        card.style.display = "none";
                    }, 200);

                }

            });

        });

    });


    /* ================= PURCHASE MODAL ================= */

    const modal =
        document.querySelector("#purchaseModal");

    const closeModal =
        document.querySelector("#closeModal");

    const modalImage =
        document.querySelector("#modalProductImage");

    const modalName =
        document.querySelector("#modalProductName");

    const modalCategory =
        document.querySelector("#modalCategory");

    const modalPrice =
        document.querySelector("#modalProductPrice");

    const quantityDisplay =
        document.querySelector("#quantity");

    const totalPrice =
        document.querySelector("#totalPrice");

    const minusBtn =
        document.querySelector("#minusBtn");

    const plusBtn =
        document.querySelector("#plusBtn");

    let selectedPrice = 0;
    let quantity = 1;


    function formatPrice(price) {

        return "PKR " +
            Number(price).toLocaleString("en-PK");

    }


    function updateTotal() {

        totalPrice.textContent =
            formatPrice(selectedPrice * quantity);

        quantityDisplay.textContent =
            quantity;

    }


    document.querySelectorAll(".buy-btn").forEach(button => {

        button.addEventListener("click", () => {

            const card =
                button.closest(".product-card");

            selectedPrice =
                Number(card.dataset.price);

            quantity = 1;

            modalImage.src =
                card.dataset.image;

            modalImage.alt =
                card.dataset.name;

            modalName.textContent =
                card.dataset.name;

            modalCategory.textContent =
                card.dataset.category.toUpperCase();

            modalPrice.textContent =
                formatPrice(selectedPrice);

            updateTotal();

            modal.classList.add("open");

            document.body.style.overflow = "hidden";

        });

    });


    function closePurchaseModal() {

        modal.classList.remove("open");

        document.body.style.overflow = "";

    }


    if (closeModal) {
        closeModal.addEventListener(
            "click",
            closePurchaseModal
        );
    }


    if (modal) {

        modal.addEventListener("click", event => {

            if (event.target === modal) {
                closePurchaseModal();
            }

        });

    }


    if (plusBtn) {

        plusBtn.addEventListener("click", () => {

            quantity++;

            updateTotal();

        });

    }


    if (minusBtn) {

        minusBtn.addEventListener("click", () => {

            if (quantity > 1) {

                quantity--;

                updateTotal();

            }

        });

    }


    /* ================= ESCAPE ================= */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            if (
                modal &&
                modal.classList.contains("open")
            ) {
                closePurchaseModal();
            }

            if (navMenu) {
                navMenu.classList.remove("open");
            }

        }

    });

});