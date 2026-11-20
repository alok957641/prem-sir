"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const events = [
  { date: "THURSDAY · 03 DECEMBER 2026", title: "Satyanarayan Puja", sub: "& Mandap Puja", detail: "A day of prayers, blessings and getting the mandap ready for the wedding.", side: "left", image: "/images/ceremony-vivah.webp" },
  { date: "THURSDAY · 03 DECEMBER 2026", title: "Haldi", sub: "& Mehendi", detail: "Turmeric, mehendi, music and all the happy family chaos. Wear something you don’t mind getting colourful.", side: "right", image: "/images/ceremony-haldi.webp" },
  { date: "FRIDAY · 04 DECEMBER 2026", title: "Baraat", sub: "& Wedding Ceremony", detail: "The baraat departs at 6:00 PM by private vehicles from the groom’s residence in Sonela, Sahaja, Katihar, for Harnath Chak, Post Office Singhiya Makandpur, Bhagalpur.", side: "left", image: "/images/mandap.webp" },
  { date: "SUNDAY · 06 DECEMBER 2026", title: "Wedding", sub: "Reception", detail: "Join both families for an evening of blessings, food and celebration from 6:00 PM onwards.", side: "right", image: "/images/ceremony-reception.webp" },
];

const randomBetween = (min, max) => Math.random() * (max - min) + min;

export default function WeddingInvitation() {
  const [entered, setEntered] = useState(false);
  const [opening, setOpening] = useState(false);
  const [petals, setPetals] = useState([]);
  const [toast, setToast] = useState("");
  const [musicOn, setMusicOn] = useState(false);
  const coverRef = useRef(null);
  const leftCurtainRef = useRef(null);
  const rightCurtainRef = useRef(null);
  const invitationRef = useRef(null);
  const audioRef = useRef(null);
  const toastTimer = useRef(null);
  const reducedMotion = useReducedMotion();

  // Try autoplay on load; browsers that block sound will start it from the cover button.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.55;
    audio.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
  }, []);

  const showToast = useCallback((message) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  }, []);

  const shareInvitation = useCallback(async () => {
    const shareUrl = window.location.href.split("#")[0];
    const shareData = {
      title: "Prem & Nisha Wedding Invitation",
      text: "Join us to celebrate Prem and Nisha's wedding.",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        showToast("Invitation link copied. Share it with your family and friends!");
        return;
      }

      const input = document.createElement("textarea");
      input.value = shareUrl;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      const copied = document.execCommand("copy");
      input.remove();
      showToast(copied ? "Invitation link copied. Share it with your family and friends!" : `Share this invitation: ${shareUrl}`);
    } catch (error) {
      if (error?.name !== "AbortError") showToast(`Share this invitation: ${shareUrl}`);
    }
  }, [showToast]);

  const showerAt = useCallback((x, y, amount = 28) => {
    if (reducedMotion) return;
    const batch = Array.from({ length: amount }, (_, i) => ({
      id: `${Date.now()}-${Math.random()}-${i}`, x: x + randomBetween(-window.innerWidth * 0.38, window.innerWidth * 0.38), y: y + randomBetween(-38, 38),
      endY: window.innerHeight + 100, drift: randomBetween(-220, 220), spin: randomBetween(-900, 1100),
      size: randomBetween(15, 29), duration: randomBetween(2.2, 4.2), glyph: ["✿", "❀", "✽", "❋", "♥"][Math.floor(Math.random() * 5)],
      color: ["#d64c3f", "#e5a72e", "#fff0d6", "#bd6473", "#f4d58c"][Math.floor(Math.random() * 5)],
    }));
    setPetals((current) => [...current.slice(-100), ...batch]);
    window.setTimeout(() => { const ids = new Set(batch.map((petal) => petal.id)); setPetals((current) => current.filter((petal) => !ids.has(petal.id))); }, 4700);
  }, [reducedMotion]);

  // Continuous flower rain, tuned down slightly on phones to keep scrolling smooth.
  useEffect(() => {
    if (reducedMotion) return undefined;
    const rain = window.setInterval(() => {
      const count = window.innerWidth <= 600 ? 2 : 4;
      const batch = Array.from({ length: count }, (_, i) => ({
        id: `rain-${Date.now()}-${Math.random()}-${i}`, x: randomBetween(-10, window.innerWidth), y: -32 - randomBetween(0, 180),
        endY: window.innerHeight + 90, drift: randomBetween(-150, 150), spin: randomBetween(-480, 780),
        size: randomBetween(14, 25), duration: randomBetween(6.5, 10), glyph: ["✿", "❀", "✽", "❋", "♥"][Math.floor(Math.random() * 5)],
        color: ["#c99a5e", "#d64c3f", "#fff0d6", "#e5a72e", "#bd6473"][Math.floor(Math.random() * 5)],
      }));
      setPetals((current) => [...current.slice(-92), ...batch]);
      window.setTimeout(() => { const ids = new Set(batch.map((petal) => petal.id)); setPetals((current) => current.filter((petal) => !ids.has(petal.id))); }, 10500);
    }, 520);
    return () => window.clearInterval(rain);
  }, [reducedMotion]);


  useGSAP(() => {
    if (reducedMotion || !entered || !invitationRef.current) return;
    gsap.utils.toArray("[data-scroll-reveal]").forEach((element) => gsap.fromTo(element, { autoAlpha: 0, y: 28 }, {
      autoAlpha: 1, y: 0, duration: 0.72, ease: "power2.out", scrollTrigger: { trigger: element, start: "top 88%", once: true },
    }));
    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, { scope: invitationRef, dependencies: [entered, reducedMotion], revertOnUpdate: true });

  const enterInvitation = () => {
    if (opening || entered) return;
    setOpening(true);

    // Start music directly from the cover button gesture so mobile browsers allow playback.
    const audio = audioRef.current;
    if (audio && audio.paused) {
      audio.volume = 0.55;
      audio.play()
        .then(() => setMusicOn(true))
        .catch(() => setMusicOn(false));
    }

    showerAt(window.innerWidth / 2, window.innerHeight * 0.44, 90);
    const finish = () => {
      setEntered(true); setOpening(false);
      window.setTimeout(() => { window.scrollTo({ top: 0, behavior: "auto" }); document.getElementById("home")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }); }, 150);
    };
    if (reducedMotion) { finish(); return; }
    gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: finish })
      .to(leftCurtainRef.current, { xPercent: -115, duration: 0.95 }, 0)
      .to(rightCurtainRef.current, { xPercent: 115, duration: 0.95 }, 0)
      .to(".cover-copy", { y: -16, autoAlpha: 0, duration: 0.42 }, 0.28)
      .to(coverRef.current, { autoAlpha: 0, duration: 0.3 }, 0.78);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) { try { await audio.play(); setMusicOn(true); } catch { showToast("Song yahan rakho: public/audio/wedding-song.mp3"); } }
    else { audio.pause(); setMusicOn(false); }
  };
  const handlePageClick = (event) => { if (entered && !event.target.closest("button, a, input")) showerAt(event.clientX, event.clientY, 18); };

  return <div className="wedding-app min-h-screen overflow-x-hidden" ref={invitationRef} onPointerDown={handlePageClick}>
    <PetalLayer petals={petals} />
    <AnimatePresence>
      {!entered && <motion.section className="opening-cover fixed inset-0 z-[100] grid min-h-[100svh] place-items-center overflow-hidden" ref={coverRef}
        initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.35 } }} aria-label="Prem and Nisha wedding invitation cover">
        <div className="cover-image" aria-hidden="true" />
        <div className="cover-wash" aria-hidden="true" />
        <div className="cover-toran" aria-hidden="true"><span>✿　❀　✿　❀　✿　❀　✿　❀　✿　❀　✿</span></div>
        <CurtainSide side="left" curtainRef={leftCurtainRef} />
        <CurtainSide side="right" curtainRef={rightCurtainRef} />
        <div className="cover-copy relative z-20 mx-auto flex max-w-3xl flex-col items-center px-5 text-center">
         <motion.img
              className="cover-om-logo"
              src="/images/ganesha.webp"
              alt="Shri Ganesha"
              animate={reducedMotion ? {} : { y: [0, -5, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
          <p className="cover-invocation">Om Shri Ganeshaya Namah</p>
          <h1 className="cover-names">
            <span className="cover-name">Prem Ranjan</span>
            <span className="cover-amp">&amp;</span>
            <span className="cover-name">Nisha Kumari</span>
          </h1>
          <p className="cover-tagline">With the blessings of our families</p>
          <p className="cover-date">FRIDAY <b>04</b> DECEMBER 2026</p>
          <motion.button className="enter-button" onClick={enterInvitation} whileHover={reducedMotion ? {} : { y: -3, scale: 1.025 }} whileTap={{ scale: .97 }} disabled={opening}>
            {opening ? "Opening the invitation…" : "Explore our wedding"}<span aria-hidden="true">✦</span>
          </motion.button>
          <span className="cover-footnote">Click to open the parda. Phoolon ki baarish free hai.</span>
        </div>
        <div className="cover-bell bell-left" aria-hidden="true">♢</div><div className="cover-bell bell-right" aria-hidden="true">♢</div>
        <div className="cover-diya diya-left" aria-hidden="true"><span>✦</span></div><div className="cover-diya diya-right" aria-hidden="true"><span>✦</span></div>
      </motion.section>}
    </AnimatePresence>

    {entered && <div className="fixed-toran-wrap" aria-hidden="true">
      <img className="landing-hero-toran" src="/images/toran-transparent.png" alt="" />
    </div>}

    {entered && <motion.div className="site-content" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: .65 } }}>
      <main>
        <div className="hero-cover-stage">
        <section className="landing-hero" id="home" aria-label="Prem and Nisha wedding invitation">
          <div className="landing-hero-background" aria-hidden="true" />
          <div className="landing-hero-shade" aria-hidden="true" />
          <div className="landing-hero-inner">
            <div className="landing-hero-copy">
              <img
                className="landing-ganesha"
                src="/images/ganesha.webp"
                alt="Shri Ganesh"
              />
              <p className="landing-invocation">Om Shri Ganeshaya Namah</p>
              <p className="landing-overline">WITH THE BLESSINGS OF OUR FAMILIES</p>
              <h1>Prem Ranjan <span>&amp;</span> Nisha Kumari</h1>
              <p className="landing-tagline">Two hearts, one destiny, and a lifetime of togetherness.</p>
              <p className="landing-invite-copy">Together with our families, we joyfully invite you to celebrate our wedding.</p>
              <p className="landing-date">FRIDAY <b>04</b> DECEMBER 2026</p>
              <a className="landing-scroll-cue" href="#couple">SCROLL TO MEET THE COUPLE <span aria-hidden="true">↓</span></a>
            </div>
          </div>
        </section>
        <section className="couple-section section-pad" id="couple">
          <SectionHeading eyebrow="WITH JOY, WE INTRODUCE" title={<>Meet the <em>couple</em></>} copy="Two families come together to celebrate Prem and Nisha." />
          <div className="couple-grid mx-auto grid max-w-5xl items-center gap-6 md:grid-cols-[1fr_70px_1fr]">
            <PersonCard side="groom" label="THE GROOM" name="Er. Prem Ranjan" role="Founder & CEO, Clickkart Digital & Nexova X" parents={<>Son of Mrs. Indu Devi<br />and Mr. Jay Prakash</>} grandparent="Grandson of Mr. Krityanand Mandal" address={<>Village Sonela, Post Office Sahaja<br />Police Station Mansahi, District Katihar, Bihar</>} />
            <div className="couple-ampersand hidden md:flex" aria-hidden="true"><span>✧</span><b>&</b><span>✧</span></div>
            <PersonCard side="bride" label="THE BRIDE" name="Nisha Kumari" role="" parents={<>Daughter of Mrs. Sunayana Singh<br />and Mr. Ram Swarup Prasad Singh</>} grandparent="Granddaughter of the late Mr. Ayodhya Prasad Singh" address={<>Village Harnath Chak, Post Office Singhiya Makandpur<br />District Bhagalpur, Bihar</>} />
          </div>
        </section>
        </div>
        <section className="date-band" data-scroll-reveal><p className="eyebrow">SAVE THE DATE</p><h2>Friday, 4 December 2026</h2><p>Baraat departure · 6:00 PM</p><span className="date-flower" aria-hidden="true">✿</span></section>
        <section className="celebrations section-pad" id="celebrations">
          <SectionHeading eyebrow="THURSDAY · 03 DECEMBER 2026" title={<>The <em>celebrations</em></>} copy="Join us for the rituals, laughter and little moments that make a wedding." />
          <div className="events-list">{events.map((item) => <EventCard key={item.title + item.sub} moment={item} />)}</div>
        </section>
        <section className="venue-band" id="venue" data-scroll-reveal>
          <div className="venue-photo image-slot"><img src="/images/venue-reception.webp" alt="Warmly lit wedding reception venue" loading="lazy" /></div>
          <div className="venue-copy"><p className="eyebrow">WEDDING RECEPTION · SUNDAY, 06 DECEMBER · 6:00 PM ONWARDS</p><h2>The celebration<br /><em>continues</em></h2><p>Join both families at the wedding reception and visit the family homes.</p><address>Village Sonela, Post Office Sahaja<br />Police Station Mansahi, District Katihar, Bihar</address><div className="location-links"><a className="gold-button" href="https://maps.app.goo.gl/SumCSrh2LeW8cXLx8" target="_blank" rel="noreferrer">in-laws location <span>↗</span></a><a className="gold-button" href="https://maps.app.goo.gl/jptcVhD1Jg6GJoyw5" target="_blank" rel="noreferrer">Home location <span>↗</span></a></div></div>
        </section>
        <section className="reception-section section-pad" data-scroll-reveal>
          <div className="reception-art image-slot"><img src="/images/rsvp-reception.webp" alt="Floral sofa and mandap decoration for the reception" loading="lazy" /></div>
          <p className="eyebrow">WITH LOVE FROM BOTH FAMILIES</p><h2>Please join us<br />for the <em>reception</em></h2><p className="reception-date">Sunday, 6 December 2026<br />6:00 PM onwards</p><address>The groom’s family residence<br />Village Sonela, Post Office Sahaja<br />Police Station Mansahi, District Katihar, Bihar</address>
        </section>
        <section className="family-note" data-scroll-reveal>
          <div className="family-photo-stack" aria-label="Wedding preparation photographs"><div className="family-photo-placeholder placeholder-one"><img src="/images/setup-haldi.webp" alt="Haldi ceremony preparation" loading="lazy" /></div><div className="family-photo-placeholder placeholder-two"><img src="/images/setup-reception.webp" alt="Reception venue preparation" loading="lazy" /></div><div className="family-photo-placeholder placeholder-three"><img src="/images/setup-mehendi.webp" alt="Mehendi ceremony preparation" loading="lazy" /></div></div>
          <div className="family-note-copy"><p className="eyebrow">A WARM WELCOME FROM THE LITTLE ONES</p><h2>Our brother is getting married!</h2><p>“With haldi, sandalwood and the joy of family, we welcome you to our brother’s wedding!”</p><span>Aditi Anand · Ansh · Paridhi · Golu</span><button className="family-blessing" onClick={(event) => { showerAt(event.clientX, event.clientY, 65); showToast("A little blessing is on its way to Prem and Nisha ♡"); }}>Send a little blessing <b>✿</b></button></div>
        </section>
        <section className="gallery-game section-pad" data-scroll-reveal>
          <div className="gallery-head"><div><p className="eyebrow">LITTLE MOMENTS, BIG MEMORIES</p><h2>Share the moments<br /><em>you capture</em></h2><p>Add your favourite wedding photos here after the celebrations.</p></div>
            <div className="gallery-photos" aria-label="Wedding celebration photographs"><div className="gallery-photo gallery-photo-one"><img src="/images/setup-reception.webp" alt="Reception decor before the celebration" loading="lazy" /></div><div className="gallery-photo gallery-photo-two"><img src="/images/setup-mehendi.webp" alt="Mehendi setup with floral details" loading="lazy" /></div><div className="gallery-photo gallery-photo-three"><img src="/images/ceremony-mehendi.webp" alt="Mehendi ceremony details" loading="lazy" /></div></div></div>
          <BlessingsGuestbook />
        </section>
        <section className="rsvp-section section-pad" id="rsvp" data-scroll-reveal><p className="eyebrow">WITH WARM REGARDS</p><p className="closing-message">Please join us in celebrating this special occasion and bless Prem and Nisha as they begin their life together.</p><h2>Prem Ranjan <span>&</span> Nisha Kumari</h2><p className="closing-family">Mr. Krityanand Mandal and the entire family</p><div className="rsvp-actions"><a className="rsvp-button" href="https://wa.me/919097878230?text=Namaste%2C%20I%20am%20confirming%20for%20Prem%20and%20Nisha%27s%20wedding.%20Please%20share%20the%20details." target="_blank" rel="noreferrer">RSVP · 90978 78230 <span>↗</span></a><p className="rsvp-contact">Mr. Jay Prakash · Sub-Inspector, Police Centre, Katihar</p></div></section>
        <section className="footer-mandap image-slot" data-scroll-reveal aria-label="Wedding mandap"><img src="/images/mandap.webp" alt="Wedding mandap decorated with flowers and lights" loading="lazy" /><div><p className="eyebrow">THE WEDDING CELEBRATION</p><h2>One mandap.<br />Two families.<br /><em>A lifetime of stories.</em></h2></div></section>
      </main>
      <footer className="site-footer"><a className="brand-mark" href="#couple">P<span>&</span>N</a><p>Made with love, mithai & a little baraat energy.</p><small>04 · 12 · 2026</small></footer>
      <button
        className={`music-fab ${musicOn ? "is-playing" : ""}`}
        onClick={toggleMusic}
        aria-label={musicOn ? "Pause wedding music" : "Play wedding music"}
        aria-pressed={musicOn}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {musicOn ? (
            <>
              <path d="M9 5v14M15 5v14" />
            </>
          ) : (
            <>
              <path d="M4 10v4h4l5 4V6l-5 4H4Z" />
              <path d="M17 9a5 5 0 0 1 0 6M19 6a9 9 0 0 1 0 12" />
            </>
          )}
        </svg>
      </button>
    </motion.div>}
    <button className="share-fab" type="button" onClick={shareInvitation} aria-label="Share wedding invitation" title="Share wedding invitation">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.7 10.7 6.6-3.4M8.7 13.3l6.6 3.4" />
      </svg>
    </button>
    <AnimatePresence>{toast && <motion.div className="toast-message" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} role="status">{toast}</motion.div>}</AnimatePresence>
    <audio ref={audioRef} src="/audio/wedding-song.mp3" loop preload="none" onEnded={() => setMusicOn(false)} />
  </div>;
}

function PetalLayer({ petals }) {
  return <div className="petal-layer" aria-hidden="true">{petals.map((petal) => <motion.span key={petal.id} className="flying-petal" initial={{ x: petal.x, y: petal.y, opacity: 0, scale: .5, rotate: 0 }} animate={{ x: petal.x + petal.drift, y: petal.endY, opacity: [0, .9, .82, 0], scale: 1, rotate: petal.spin }} transition={{ duration: petal.duration, ease: "linear" }} style={{ color: petal.color, fontSize: petal.size }}>{petal.glyph}</motion.span>)}</div>;
}
function CurtainSide({ side, curtainRef }) { return <div ref={curtainRef} className={`curtain curtain-${side}`} aria-hidden="true"><div className="curtain-fold" /><div className="curtain-fringe">✿　❀　✿　❀</div></div>; }
function SectionHeading({ eyebrow, title, copy }) { return <div className="section-heading" data-scroll-reveal><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{copy}</p></div>; }
function PersonCard({ side, label, name, role, parents, grandparent, address }) {
  const portrait = side === "groom" ? "/images/prem-portrait-transparent.png" : "/images/nisha-portrait-transparent.png";
  return <motion.article className="person-card" data-scroll-reveal whileHover={{ y: -4 }} transition={{ duration: .3 }}><div className={`portrait portrait-${side} image-slot`}><img src={portrait} alt={name} loading="lazy" /></div><p className="person-label">{label}</p><h3>{name}</h3>{role && <p className="person-role">{role}</p>}<div className="thin-rule" /><p>{parents}</p><p>{grandparent}</p><address>{address}</address></motion.article>;
}
function EventCard({ moment }) {
  return <article className={`event-row ${moment.side === "right" ? "event-row-reverse" : "event-row-normal"}`} data-scroll-reveal><div className="event-photo image-slot"><img src={moment.image} alt={`${moment.title} wedding celebration`} loading="lazy" /></div><div className="event-copy"><p className="eyebrow">{moment.date}</p><h3>{moment.title}<br /><em>{moment.sub}</em></h3><p>{moment.detail}</p></div></article>;
}


function BlessingsGuestbook() {
  const sendWish = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("guestName") || "").trim();
    const wish = String(formData.get("guestWish") || "").trim();
    if (!name || !wish) return;

    const message = `Namaste Prem and Nisha!\n\nMy name is ${name}.\n\nMy heartfelt wishes for you both: ${wish}`;
    const whatsappUrl = `https://wa.me/917976023404?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return <div className="blessings-panel">
    <div className="blessings-copy">
      <p className="eyebrow">A LITTLE NOTE FOR THE COUPLE</p>
      <h3>Send your <em>blessings</em></h3>
      <p>Share a warm wish for Prem and Nisha’s new journey together.</p>
    </div>
    <form className="blessings-form" onSubmit={sendWish}>
      <label className="blessings-message-label" htmlFor="guest-wish">Your heartfelt wish</label>
      <textarea id="guest-wish" name="guestWish" placeholder="Wishing you both a lifetime of love, laughter and happiness…" rows="3" maxLength={500} required />
      <div className="blessings-form-footer">
        <label className="blessings-name-field" htmlFor="guest-name">
          <span aria-hidden="true">♡</span>
          <input id="guest-name" name="guestName" type="text" placeholder="Your name" autoComplete="name" maxLength={80} required />
        </label>
        <button className="blessings-send" type="submit">Send on WhatsApp <span aria-hidden="true">↗</span></button>
      </div>
    </form>
  </div>;
}
