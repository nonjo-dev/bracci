// =========================
// MOBILMENY
// =========================

// Stylen ligger i CSS (.navbar nav.show). Här hålls bara
// tillståndet i ordning: klassen, aria-attributen och låsningen
// av sidan. Inline-stilar hade slagit ut CSS-reglerna.
//
// Samma bredd som i CSS (900px). Ligger denna fel blir menyn
// "öppen" på en skärm där den inte syns, och aria-expanded
// ljuger.

const mobileNavQuery = window.matchMedia("(max-width: 900px)");

const menuButton = document.querySelector(".menu-button");
const mobileNav = document.querySelector(".navbar nav");

function setMenu(open) {

    if (!mobileNav) return;

    // Menyn är dold i CSS över 900px - går det att "öppna" den
    // där skulle aria-expanded säga ja medan ingen ser något.
    if (open && !mobileNavQuery.matches) return;

    // Ligger fokus i menyn när den stängs hamnar det annars på
    // <body>, eftersom länkarna försvinner ur flödet. Då måste
    // man tabba tillbaka till knappen. Vid ett musklick ska
    // fokus däremot ligga kvar - knappen är redan rätt vald,
    // och en hopplande fokusmarkering efter ett klick ser bara
    // konstig ut.
    const focusWasInside = mobileNav.contains(document.activeElement);

    mobileNav.classList.toggle("show", open);

    // Låser sidan så att innehållet inte kan rullas bakom menyn.
    document.documentElement.classList.toggle("menu-open", open);

    if (menuButton) {

        menuButton.setAttribute("aria-expanded", String(open));

        // Skärmläsaren läser etiketten, så den måste byta
        // tillsammans med ikonen.
        menuButton.setAttribute(
            "aria-label",
            open ? "Stäng meny" : "Öppna meny"
        );

        if (!open && focusWasInside) menuButton.focus();

    }

    // Tangentbord: fokus måste följa in när menyn öppnas, annars
    // fortsätter tabbet genom flödet i sidans bakgrund.
    if (open) {

        const firstLink = mobileNav.querySelector("a");

        if (firstLink) firstLink.focus();

    }

}


// Anropas från inline onclick i HTML.
function toggleMenu() {

    const isOpen =
        mobileNav && mobileNav.classList.contains("show");

    setMenu(!isOpen);

}


if (mobileNav) {

    // Escape stänger menyn, som förväntat av tangentbordet.
    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") return;

        if (!mobileNav.classList.contains("show")) return;

        setMenu(false);

    });


    // Klick utanför menyn stänger den - till exempel loggan
    // bredvid, som också leder vidare. Knappen undantas eftersom
    // dess egen klickhantering kör först.
    document.addEventListener("click", event => {

        if (!mobileNav.classList.contains("show")) return;

        if (mobileNav.contains(event.target)) return;

        if (menuButton && menuButton.contains(event.target)) return;

        setMenu(false);

    });


    // Klick på en länk stänger menyn direkt, även för ankarlänkar
    // som inte byter sida. Koden för sidövergången tar hand om de
    // som faktiskt navigerar, men den kör bara för riktiga
    // sidbyte - annars skulle menyn ligga kvar över sidan.
    mobileNav.addEventListener("click", event => {

        if (event.target.closest("a")) setMenu(false);

    });


    // Håller Tab inuti den öppna menyn. Utan detta kan man tabba
    // förbi den sista länken och vidare in i innehållet bakom.
    document.addEventListener("keydown", event => {

        if (event.key !== "Tab") return;

        if (!mobileNav.classList.contains("show")) return;

        const focusable = [];

        if (menuButton) focusable.push(menuButton);

        mobileNav.querySelectorAll("a").forEach(link => {
            focusable.push(link);
        });

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }

    });

}


// Värm upp sidan eller rotera en telefon, så att menyn inte
// ligger kvar "öppen" när den syns som en vanlig rad igen.
mobileNavQuery.addEventListener("change", event => {

    if (!event.matches) setMenu(false);

});


// =========================
// RÖRELSE
// =========================

// Respekterar inställningen "animationer av" i Windows. Chrome och
// Edge rapporterar då prefers-reduced-motion: reduce, vilket stänger
// av både scroll-reveal och sidövergång.
//
// Lägg till ?motion=1 i adressen för att tvinga fram animationerna
// ändå - användbart när du vill granska dem, eller på en dator där
// animationer är avstänga på systemnivå.
const reduceMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const forceMotion =
    /[?&]motion=(1|on|true)\b/i.test(location.search);

// CSS blockerar allt under prefers-reduced-motion med !important.
// Klasset på <html> låter sidan slippa undan de reglerna, så
// animationerna kan granskas även när Windows stängt av dem.
if (forceMotion) {
    document.documentElement.classList.add("force-motion");
}

const motionOK = forceMotion || !reduceMotion;


// =========================
// SCROLL REVEAL
// =========================

// Klassen läggs på av JS. Om scriptet aldrig kör förblir
// allt innehåll synligt, så texten kan aldrig fastna osynlig.
//
// Listan är per sida: bara de block som är självständiga
// innehållsdelar. Helhero (översta skärmbilden) står medvetet
// inte - den ska synas direkt utan att man scrollat.
const revealTargets = [
    // Frivillig markering i HTML, används redan på en del ställen
    ".reveal",

    // Etiketter och rubrikblock
    ".section-label",
    ".section-heading",

    // Huvudrubriken i en hero. Den ligger direkt under sektionen
    // på t.ex. kontakt, där .section-label annars skulle tona in
    // ensam bredvid en rubrik som står stilla.
    "main > section > h1",

    // INDEX
    ".feature-image",
    ".feature-content",
    ".about-content",
    ".about-number",
    ".contact-info",

    // OM OSS
    ".about-lead",
    ".about-story-text",
    ".about-story-number",

    // Kort tonas in var för sig (föräldern tas bort nedan)
    ".value-card",
    ".product-card",

    ".about-cta",

    // ARMBAND
    ".collection-heading",
    ".signature-text",
    ".signature-slideshow",

    // KONTAKT
    ".contact-box > div",
    ".faq-item",

    // BETALSÄTT
    ".payment-hero",
    ".payment-box"
];


if (motionOK) {

    const matched = Array.from(
        document.querySelectorAll(revealTargets.join(","))
    );

    const matchedSet = new Set(matched);

    // Finns det en förälder som också revealas? Då hoppar vi över
    // det inre elementet. Annars läggs förflyttningen ihop
    // (22px + 22px) och innehållet dyker upp dubbelt så långt ned.
    // Yttre elementet vinner - det är oftast ett helt block.
    function hasRevealAncestor(element) {

        let parent = element.parentElement;

        while (parent) {

            if (matchedSet.has(parent)) {
                return true;
            }

            parent = parent.parentElement;

        }

        return false;

    }


    const revealElements = matched.filter(
        element => !hasRevealAncestor(element)
    );

    const seenParents = new Map();

    revealElements.forEach(element => {

        element.classList.add("reveal-item");

        // Fördröjning per element inom samma förälder, så att
        // kort i en grupp tonas in i följd istället för samtidigt.
        const parent = element.parentElement;
        const order = seenParents.get(parent) || 0;

        seenParents.set(parent, order + 1);

        element.style.transitionDelay =
            Math.min(order * 90, 450) + "ms";

    });


    const revealObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("is-visible");

                revealObserver.unobserve(entry.target);

            }

        });

    },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );


    // Innehåll som redan syns när sidan laddas ska inte vänta
    // på observern, annars hinner den blinka till en osynlig
    // bildruta innan callbacken körs.
    revealElements.forEach(element => {

        if (element.getBoundingClientRect().top < window.innerHeight) {

            element.classList.add("is-visible");

            return;

        }

        revealObserver.observe(element);

    });

}

let currentSlide = 0;

const slides = document.querySelectorAll(".signature-slideshow .slide");
const dots = document.querySelectorAll(".signature-slideshow .dot");

function showSlide(index) {

    if (index >= slides.length) {
        currentSlide = 0;
    }

    if (index < 0) {
        currentSlide = slides.length - 1;
    }

    slides.forEach(function(slide) {
        slide.classList.remove("active");
    });

    dots.forEach(function(dot) {
        dot.classList.remove("active");
    });

    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
}

function changeSlide(direction) {
    currentSlide += direction;
    showSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
}

function openReviewImage(image) {
    const popup = document.getElementById("image-popup");
    const popupImage = document.getElementById("popup-image");

    popupImage.src = image.src;
    popup.classList.add("active");
}

function closeReviewImage() {
    document.getElementById("image-popup").classList.remove("active");
}


// =========================
// SCROLLNING AV RECENSIONER
// =========================

// Dubblar korten så att listan blir exakt två lika långa halvor.
// Då matchar translateX(-50%) i reviewScroll exakt och scrollen blir sömlös.
const reviewsWrapper = document.querySelector(".reviews-wrapper");

if (reviewsWrapper) {

    const reviewCards = reviewsWrapper.querySelectorAll(".review-card");

    reviewCards.forEach(card => {

        const clone = card.cloneNode(true);

        // Klonen är visuellt identisk men ska inte kunna klickas eller läsas upp
        clone.setAttribute("aria-hidden", "true");

        clone.querySelectorAll("img").forEach(image => {
            image.removeAttribute("onclick");
        });

        reviewsWrapper.appendChild(clone);
    });
}


// =========================
// MAGNETISKA KNAPPAR
// =========================

// Knappen följer musen lätt. Sätts på --mx/--my och
// flyttas av CSS med en mjuk easing.

const canHover = window.matchMedia("(hover: hover)").matches;

if (canHover && motionOK) {

    const PULL = 6;      // max förflyttning i px
    const AREA = 0.35;   // hur stor del av avståndet som följs med

    document.querySelectorAll(".magnetic").forEach(button => {

        button.addEventListener("pointermove", event => {

            const box = button.getBoundingClientRect();

            const offsetX = event.clientX - (box.left + box.width / 2);
            const offsetY = event.clientY - (box.top + box.height / 2);

            button.style.setProperty("--mx", offsetX * AREA + "px");
            button.style.setProperty("--my", offsetY * AREA + "px");

        });


        button.addEventListener("pointerleave", () => {

            button.style.setProperty("--mx", "0px");
            button.style.setProperty("--my", "0px");

        });

    });

}


// =========================
// SIDÖVERGÅNG
// =========================

// Intoningen är ren CSS (.pageEnter i style.css) så att
// innehållet aldrig kan fastna osynligt. JS har bara hand om
// uttoningen: lägger .is-leaving på <html>, väntar in
// övergången och navigerar sedan.
//
// Länkar lämnas i fred om de inte är enkla interna klick -
// då ska webbläsaren få göra som den brukar. Annars skulle
// ctrl+click (ny flik), högerklick eller telefonens
// delningsmeny sluta fungera.

const EXIT_MS = 300;   // måste matcha transitionen i CSS

if (motionOK) {

    let leaving = false;

    // Länkar som inte är en vanlig navigering inom sajten
    function isInternalPageLink(link) {

        if (!link) return false;

        // Klickat med ctrl/cmd/shift/alt = ny flik, nytt fönster
        if (link.target && link.target !== "_self") return false;
        if (link.hasAttribute("download")) return false;
        if (link.getAttribute("rel") === "external") return false;

        const href = link.getAttribute("href");

        // tomt, # eller javascript ska aldrig hanteras
        if (!href || href === "#" || href.startsWith("#")) return false;

        // mailto:, tel:, whatsapp: m.fl.
        if (/^(mailto:|tel:|sms:|whatsapp:)/i.test(href)) return false;

        // absoluta URL:er och externa domäner
        if (/^(https?:)?\/\//i.test(href)) return false;

        // Länkar som pekar på samma sida (t.ex. ../index.html
        // när man redan är på den) - laddar om utan mening
        const target = new URL(link.href, location.href);

        if (target.origin !== location.origin) return false;

        const stripHash = url => url.origin + url.pathname + url.search;

        if (stripHash(target) === stripHash(location)) return false;

        return true;

    }


    document.addEventListener("click", event => {

        // Bara vänsterknapp
        if (event.button !== 0) return;

        // Modifier-tangenter: ctrl (ny flik), cmd (ny flik),
        // shift (nytt fönster), alt (nedladdning)
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        // Klickade inte på en länk (t.ex. vald text)
        const link = event.target.closest("a");

        if (!isInternalPageLink(link)) return;

        // Redan på väg bort - ignorera snabba dubbelklick
        if (leaving) return;

        event.preventDefault();

        leaving = true;

        // Stäng mobilmenyn innan vi tonar ut, annars
        // öppnas den igen på den nya sidan. Samma funktion
        // som hamburgaren använder, så att scrollåsningen
        // och aria-attributen hänger med.
        setMenu(false);

        document.documentElement.classList.add("is-leaving");

        // Vänta in uttoningen innan byte sker
        setTimeout(() => {
            location.href = link.href;
        }, EXIT_MS);

    });

}