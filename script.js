gsap.registerPlugin(ScrollTrigger);


/* =========================
   PERFUME DATA
========================= */

const perfumes = [

    {
        number: "01",
        title: "9PM AFNAN",
        description:
            "A rich and captivating fragrance designed for confidence, elegance and unforgettable evenings. Smooth, warm and incredibly addictive.",
        meta:
            "WARM · ELEGANT · LONG LASTING",
        image:
            "images/eb234a7c-7804-4485-a522-682d16050d8d.png"
    },

    {
        number: "02",
        title: "IMAGINATION",
        description:
            "A modern and sophisticated scent with a clean character. Crafted for those who prefer understated luxury with a memorable presence.",
        meta:
            "FRESH · MODERN · SOPHISTICATED",
        image:
            "images/53cffe72-a68c-437d-a3b4-0e9c0e7a6394.png"
    },

    {
        number: "03",
        title: "TUSCAN LEATHER",
        description:
            "Bold, deep and powerful. A luxurious leather-inspired fragrance made for a confident presence that stays unforgettable.",
        meta:
            "BOLD · WARM · POWERFUL",
        image:
            "images/d34f3a82-3964-4421-888d-22a8f9772a6f.png"
    },

    {
        number: "04",
        title: "DAVID BECKHAM",
        description:
            "The signature star of HMH Perfumes. Refined, confident and effortlessly elegant — a statement fragrance created for a presence that speaks for itself.",
        meta:
            "SIGNATURE · ELEGANT · STAR FRAGRANCE",
        image:
            "images/1832019a-c9d7-4a5f-a415-eadae083928e.png"
    }

];


/* =========================
   ELEMENTS
========================= */

const bottle = document.getElementById("perfumeBottle");
const title = document.getElementById("perfumeTitle");
const description = document.getElementById("perfumeDescription");
const meta = document.getElementById("perfumeMeta");
const number = document.getElementById("currentNumber");


/* =========================
   CURRENT PERFUME
========================= */

let current = 0;


/* =========================
   CHANGE PERFUME
========================= */

function changePerfume(index) {

    const perfume = perfumes[index];

    gsap.to(
        [bottle, title, description, meta],
        {
            opacity: 0,
            y: 35,
            duration: 0.25,
            stagger: 0.03,
            ease: "power2.in",
            onComplete: () => {

                bottle.src = perfume.image;

                number.textContent = perfume.number;

                title.textContent = perfume.title;

                description.textContent =
                    perfume.description;

                meta.textContent =
                    perfume.meta;


                /* DAVID BECKHAM SPECIAL */

                if (index === 3) {

                    title.style.color = "#d4af37";

                    gsap.set(bottle, {
                        scale: 1.08
                    });

                } else {

                    title.style.color = "#fff";

                    gsap.set(bottle, {
                        scale: 1
                    });
                }


                gsap.to(
                    [bottle, title, description, meta],
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.65,
                        stagger: 0.08,
                        ease: "power3.out"
                    }
                );

            }
        }
    );
}


/* =========================
   INITIAL STATE
========================= */

gsap.set(
    [bottle, title, description, meta],
    {
        opacity: 1
    }
);


/* =========================
   SCROLL ANIMATION
========================= */

ScrollTrigger.create({

    trigger: ".perfume-showcase",

    start: "top top",

    end: "bottom bottom",

    scrub: false,

    onUpdate: self => {

        const progress = self.progress;

        let index =
            Math.min(
                perfumes.length - 1,
                Math.floor(
                    progress * perfumes.length
                )
            );

        if (index !== current) {

            current = index;

            changePerfume(current);

        }

    }

});


/* =========================
   BOTTLE FLOAT
========================= */

gsap.to(bottle, {

    y: -12,

    duration: 2.5,

    repeat: -1,

    yoyo: true,

    ease: "sine.inOut"

});


/* =========================
   MOBILE MENU
========================= */

const menuBtn =
    document.querySelector(".menu-btn");

const navMenu =
    document.querySelector(".nav-menu");

menuBtn.addEventListener("click", () => {

    navMenu.classList.toggle("open");

});


/* CLOSE MOBILE MENU */

document
    .querySelectorAll(".nav-menu a")
    .forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("open");

        });

    });