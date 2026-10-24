const WHATSAPP  = "+51 920607857";   // ← número comercial con código de país, sin espacios ni símbolos (ej: 51987654321)
const INSTAGRAM = "https://www.instagram.com/equilibrio_postres";
const TIKTOK = "https://www.tiktok.com/@equilibrio_tiramisu";
const FACEBOOK = "https://www.facebook.com/profile.php?id=61578489465648";
const CANAL     = "https://whatsapp.com/channel/0029VbDB7OaEKyZ8sQQu5m2q";              // ← enlace del canal Club Equilibrio (si lo dejas vacío, el botón no aparece)
const UBICACION = "Mercado N.º 2 de Surquillo – Local 202, Lima";
const FOTO_PORTADA = "fotos/portada.jpg";

// Una línea por producto. Las fotos están en la carpeta "fotos".
// "descripcion" déjala vacía si no tienes datos confirmados (no se muestra nada).
// "ancho: true" hace que la tarjeta ocupe dos columnas (para fotos horizontales).
const PRODUCTOS = [
  { nombre: "Tiramisú clásico",          categoria: "Tiramisú clásico",    foto: "fotos/clasico.jpg",     descripcion: "" },
  { nombre: "Tiramisú de fresa",         categoria: "Tiramisú de sabores", foto: "fotos/fresa.jpg",       descripcion: "" },
  { nombre: "Tiramisú de limón",         categoria: "Tiramisú de sabores", foto: "fotos/limon.jpg",       descripcion: "" },
  { nombre: "Tiramisú de lúcuma",        categoria: "Tiramisú de sabores", foto: "fotos/lucuma.jpg",      descripcion: "" },
  { nombre: "Tiramisú de maracumango",   categoria: "Tiramisú de sabores", foto: "fotos/maracumango.jpg", descripcion: "" },
  { nombre: "Tiramisú de Oreo",          categoria: "Tiramisú de sabores", foto: "fotos/oreo.jpg",        descripcion: "" },
  { nombre: "Torta clásica",             categoria: "Tortas",              foto: "fotos/torta-clasica.jpg", descripcion: "" },
  { nombre: "Torta de limón",            categoria: "Tortas",              foto: "fotos/torta-limon.jpg",   descripcion: "" },
  { nombre: "Tortas de fresa y maracumango", categoria: "Tortas",          foto: "fotos/tortas-fresa-maracumango.jpg", descripcion: "", ancho: true },
  { nombre: "Cookies de tiramisú",       categoria: "Cookies",             foto: "fotos/cookies.jpg",     descripcion: "" }
];

// Horarios de atención (tomados de tu imagen "horario de atencion")
const HORARIOS = [
  ["Lunes", "11 AM – 6 PM"], ["Martes", "Descanso"], ["Miércoles", "11 AM – 7:30 PM"], ["Jueves", "11 AM – 6 PM"],
  ["Viernes", "11 AM – 7:30 PM"], ["Sábado", "10 AM – 7:30 PM"], ["Domingo", "9:30 AM – 5 PM"]
];
/* ================================================ */

const MENSAJES = {
  general: "Hola, Equilibrio. Vi su catálogo y quisiera hacer una consulta. ¿Me pueden ayudar?",
  especial: "Hola, Equilibrio. Quisiera consultar por un pedido especial. ¿Podrían ayudarme con las opciones disponibles?"
};
const wa = txt => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(txt)}`;
const msgProducto = n => `Hola, Equilibrio. Vi su catálogo y quisiera consultar por ${n}. ¿Me brindan información y disponibilidad?`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
if (WHATSAPP.includes("X")) console.warn("Falta poner el número de WhatsApp en la constante WHATSAPP.");

function foto(src, alt) {
  const ph = '<div class="ph"><b>E</b><small>Foto pendiente</small></div>';
  const d = document.createElement("div"); d.className = "foto";
  d.innerHTML = ph;
  const img = new Image(); img.alt = alt;
  img.onload = () => { d.innerHTML = ""; d.appendChild(img); };
  img.src = src;
  return d;
}

document.getElementById("cinta").innerHTML = "TIRAMISÚ ✳ PIDE POR WHATSAPP ✳ ".repeat(8);
document.getElementById("heroFoto").replaceWith(Object.assign(foto(FOTO_PORTADA, "Postres de Equilibrio Tiramisú"), {id: "heroFoto"}));
document.getElementById("ig").href = INSTAGRAM;
const elTt = document.getElementById("tiktok");
if (elTt && TIKTOK) { elTt.href = TIKTOK; elTt.hidden = false; }

const elFb = document.getElementById("facebook");
if (elFb && FACEBOOK) { elFb.href = FACEBOOK; elFb.hidden = false; }

if (CANAL) { const c = document.getElementById("canal"); c.href = CANAL; c.hidden = false; }
document.getElementById("hor").innerHTML = HORARIOS.map(h => `<li><b>${h[0]}</b>${h[1]}</li>`).join("");
document.getElementById("ubic").textContent = UBICACION ? "📍 " + UBICACION : "";

document.querySelectorAll("[data-wa]").forEach(a => {
  a.href = wa(MENSAJES[a.dataset.wa]); a.target = "_blank"; a.rel = "noopener";
});

const grid = document.getElementById("grid"), chips = document.getElementById("chips");
const cats = ["Todo", ...new Set(PRODUCTOS.map(p => p.categoria))];
function pintar(cat) {
  grid.innerHTML = "";
  PRODUCTOS.filter(p => cat === "Todo" || p.categoria === cat).forEach(p => {
    const c = document.createElement("article"); c.className = "card rev" + (p.ancho ? " wide" : "");
    c.appendChild(foto(p.foto, p.nombre));
    const i = document.createElement("div"); i.className = "info";
    i.innerHTML = `<span class="cat">${esc(p.categoria)}</span><h3>${esc(p.nombre)}</h3>` +
      (p.descripcion ? `<p>${esc(p.descripcion)}</p>` : "") +
      `<a class="btn neg" target="_blank" rel="noopener" href="${wa(msgProducto(p.nombre))}">Pedir por WhatsApp</a>`;
    c.appendChild(i); grid.appendChild(c); obs.observe(c);
  });
}
const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("v"); obs.unobserve(e.target); } }), {threshold: .12});
document.querySelectorAll(".rev").forEach(el => obs.observe(el));
if (cats.length > 2) cats.forEach((c, k) => {
  const b = document.createElement("button"); b.className = "chip" + (k ? "" : " on"); b.textContent = c;
  b.onclick = () => { chips.querySelectorAll(".chip").forEach(x => x.classList.remove("on")); b.classList.add("on"); pintar(c); };
  chips.appendChild(b);
});
pintar("Todo");
