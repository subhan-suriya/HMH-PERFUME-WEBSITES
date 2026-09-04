/* =========================================================
   HMH PERFUMES
   MAIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MOBILE MENU
    ===================================================== */

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


    /* =====================================================
       PERFUME DATA
    ===================================================== */

    const perfumes = [

        {
            title: "9PM AFNAN",
            description:
                "A rich and captivating fragrance created for confidence, elegance and unforgettable evenings.",
            meta:
                "LONG LASTING · PREMIUM FRAGRANCE",
            image:
                "images/eb234a7c-7804-4485-a522-682d16050d8d.png"
        },

        {
            title: "IMAGINATION",
            description:
                "A modern fragrance with an elegant and effortless character.",
            meta:
                "MODERN · ELEGANT · SIGNATURE",
            image:
                "images/53cffe72-a68c-437d-a3b4-0e9c0e7a6394.png"
        },

        {
            title: "TUSCAN LEATHER",
            description:
                "Deep, sophisticated and distinctive, designed to leave a lasting impression.",
            meta:
                "DEEP · SOPHISTICATED · DISTINCTIVE",
            image:
                "images/d34f3a82-3964-4421-888d-22a8f9772a6f.png"
        },

        {
            title: "DAVID BECKHAM",
            description:
                "Clean, sophisticated and timeless for everyday confidence.",
            meta:
                "TIMELESS · REFINED · CONFIDENT",
            image:
                "images/1832019a-c9d7-4a5f-a415-eadae083928e.png"
        }

    ];


    /* =====================================================
       PERFUME SCROLL ANIMATION
    ===================================================== */

    const bottle = document.getElementById("perfumeBottle");
    const title = document.getElementById("perfumeTitle");
    const description = document.getElementById("perfumeDescription");
    const meta = document.getElementById("perfumeMeta");
    const currentNumber = document.getElementById("currentNumber");
    const showcase = document.querySelector(".perfume-showcase");

    if (
        bottle &&
        title &&
        description &&
        meta &&
        currentNumber &&
        showcase &&
        typeof gsap !== "undefined" &&
        typeof ScrollTrigger !== "undefined"
    ) {

        gsap.registerPlugin(ScrollTrigger);


        let currentIndex = 0;


        function showPerfume(index) {

            const perfume = perfumes[index];

            if (!perfume) return;

            currentIndex = index;

            currentNumber.textContent =
                String(index + 1).padStart(2, "0");

            title.textContent = perfume.title;

            description.textContent =
                perfume.description;

            meta.textContent =
                perfume.meta;


            gsap.to(
                bottle,
                {
                    opacity: 0,
                    scale: 0.88,
                    rotation: -8,
                    duration: 0.22,
                    ease: "power2.out",
                    onComplete: () => {

                        bottle.src = perfume.image;

                        bottle.alt =
                            `${perfume.title} perfume`;

                        gsap.fromTo(
                            bottle,
                            {
                                opacity: 0,
                                scale: 0.88,
                                rotation: 8
                            },
                            {
                                opacity: 1,
                                scale: 1,
                                rotation: 0,
                                duration: 0.5,
                                ease: "power3.out"
                            }
                        );

                    }
                }
            );


            gsap.fromTo(
                [title, description, meta],
                {
                    opacity: 0,
                    y: 15
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.45,
                    stagger: 0.06,
                    ease: "power2.out"
                }
            );

        }


        ScrollTrigger.create({

            trigger: showcase,

            start: "top top",

            end: "bottom bottom",

            scrub: false,

            onUpdate: self => {

                const progress =
                    self.progress;

                let index =
                    Math.floor(
                        progress * perfumes.length
                    );

                if (index >= perfumes.length) {
                    index = perfumes.length - 1;
                }

                if (index !== currentIndex) {
                    showPerfume(index);
                }

            }

        });


        gsap.fromTo(
            bottle,
            {
                y: 40,
                opacity: 0.7,
                scale: 0.94
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: "power3.out"
            }
        );

    }


    /* =====================================================
       CATEGORY FILTER
    ===================================================== */

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const productCards =
        document.querySelectorAll(".product-card");


    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            const category =
                button.dataset.category;


            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");


            productCards.forEach(card => {

                const cardCategory =
                    card.dataset.category;

                if (
                    category === "all" ||
                    category === cardCategory
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
                    }, 250);

                }

            });

        });

    });


    /* =====================================================
       BUY NOW MODAL
    ===================================================== */

    const modal =
        document.getElementById("buyModal");

    const modalClose =
        document.getElementById("modalClose");

    const modalProduct =
        document.getElementById("modalProduct");

    const modalPrice =
        document.getElementById("modalPrice");

    const modalTotal =
        document.getElementById("modalTotal");

    const quantityValue =
        document.getElementById("quantityValue");

    const summaryQuantity =
        document.getElementById("summaryQuantity");

    const minusBtn =
        document.getElementById("minusBtn");

    const plusBtn =
        document.getElementById("plusBtn");

    const checkoutForm =
        document.getElementById("checkoutForm");


    let selectedProduct = "";
    let selectedPrice = 0;
    let quantity = 1;


    function formatPrice(number) {

        return "PKR " +
            Number(number).toLocaleString("en-PK");

    }


    function updateOrderTotal() {

        const total =
            selectedPrice * quantity;

        quantityValue.textContent =
            quantity;

        summaryQuantity.textContent =
            quantity;

        modalTotal.textContent =
            formatPrice(total);

    }


    function openBuyModal(product, price) {

        selectedProduct = product;

        selectedPrice = Number(price);

        quantity = 1;

        modalProduct.textContent =
            product;

        modalPrice.textContent =
            formatPrice(selectedPrice);

        updateOrderTotal();

        modal.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    function closeBuyModal() {

        modal.classList.remove("active");

        document.body.style.overflow = "";

    }


    document
        .querySelectorAll(".order-btn, .quick-buy")
        .forEach(button => {

            button.addEventListener("click", () => {

                openBuyModal(
                    button.dataset.product,
                    button.dataset.price
                );

            });

        });


    if (minusBtn) {

        minusBtn.addEventListener("click", () => {

            if (quantity > 1) {
                quantity--;
                updateOrderTotal();
            }

        });

    }


    if (plusBtn) {

        plusBtn.addEventListener("click", () => {

            if (quantity < 20) {
                quantity++;
                updateOrderTotal();
            }

        });

    }


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeBuyModal
        );

    }


    const modalOverlay =
        document.querySelector(".buy-modal-overlay");

    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closeBuyModal
        );

    }


    /* =====================================================
       CHECKOUT
    ===================================================== */

    if (checkoutForm) {

        checkoutForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    document
                        .getElementById("customerName")
                        .value
                        .trim();

                const phone =
                    document
                        .getElementById("customerPhone")
                        .value
                        .trim();

                const address =
                    document
                        .getElementById("customerAddress")
                        .value
                        .trim();

                const city =
                    document
                        .getElementById("customerCity")
                        .value
                        .trim();


                if (
                    !name ||
                    !phone ||
                    !address ||
                    !city
                ) {

                    alert(
                        "Please complete all delivery details."
                    );

                    return;

                }


                const total =
                    selectedPrice * quantity;


                const orderData = {

                    product:
                        selectedProduct,

                    quantity:
                        quantity,

                    total:
                        total,

                    customer:
                        name,

                    phone:
                        phone,

                    address:
                        address,

                    city:
                        city

                };


                console.log(
                    "HMH ORDER:",
                    orderData
                );


                alert(
                    `Thank you, ${name}!\n\n` +
                    `Your order for ${quantity} × ${selectedProduct} ` +
                    `has been received.\n\n` +
                    `Total: ${formatPrice(total)}`
                );


                checkoutForm.reset();

                closeBuyModal();

            }
        );

    }


    /* =====================================================
       NEWSLETTER
    ===================================================== */

    const newsletterForm =
        document.querySelector(".newsletter-form");

    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                alert(
                    "Thank you for joining HMH Perfumes."
                );

                newsletterForm.reset();

            }
        );

    }


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal &&
                modal.classList.contains("active")
            ) {

                closeBuyModal();

            }

        }
    );

});