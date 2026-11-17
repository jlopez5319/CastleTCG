import { useState, useEffect } from "react";
import CartaItem from "./components/CartaItem";
import DetalleCarta from "./components/Detallecarta";
import "./App.css";

function App() {
  const [cartas, setCartas] = useState([]);
  const [info, setInfo] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [edicion, setEdicion] = useState("todas");
  const [orden, setOrden] = useState("normal");
  const [seleccionada, setSeleccionada] = useState(null);
  const [vistaActiva, setVistaActiva] = useState("catalogo");
  const [scrolled, setScrolled] = useState(false);

  // PAGINACIÓN
  const [paginaActual, setPaginaActual] = useState(1);
  const cartasPorPagina = 20;

  useEffect(() => {
    fetch("http://localhost:3000/api/datos")
      .then((res) => res.json())
      .then((datos) => setCartas(datos));

    fetch("http://localhost:3000/api/info")
      .then((res) => res.json())
      .then((datos) => setInfo(datos));
  }, []);

  // DETECTAR SCROLL
  useEffect(() => {
    const alScrollear = () => setScrolled(window.scrollY > 200);
    window.addEventListener("scroll", alScrollear);
    return () => window.removeEventListener("scroll", alScrollear);
  }, []);

  // EDICIONES DISPONIBLES
  const ediciones = [
    ...new Set(cartas.filter((c) => c.disponible).map((c) => c.edicion)),
  ].filter((e) => e);

  // FILTRAR CARTAS
  const filtradas = cartas.filter(
    (carta) =>
      carta.disponible &&
      (edicion === "todas" || carta.edicion === edicion) &&
      carta.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // CARTAS AGOTADAS
  const agotadas = cartas.filter((c) => c.stock === 0);

  // CALCULAR VALORES
  const totalUnidades = filtradas.reduce((suma, c) => suma + c.stock, 0);

  const valorTotal = filtradas.reduce(
    (suma, c) => suma + c.stock * c.precio_publicado_clp,
    0
  );

  // CARTA MÁS VALIOSA
  const cartasEnStock = cartas.filter((c) => c.disponible && c.stock > 0);
  const topCarta = cartasEnStock.reduce((masCara, actual) => {
    if (
      !masCara ||
      actual.precio_publicado_clp > masCara.precio_publicado_clp
    ) {
      return actual;
    }
    return masCara;
  }, null);

  // ORDENAR CARTAS
  const ordenadas = [...filtradas];

  if (orden === "caro") {
    ordenadas.sort((a, b) => b.precio_publicado_clp - a.precio_publicado_clp);
  }

  if (orden === "barato") {
    ordenadas.sort((a, b) => a.precio_publicado_clp - b.precio_publicado_clp);
  }

  // CALCULAR PAGINACIÓN
  const totalPaginas = Math.ceil(ordenadas.length / cartasPorPagina);
  const indiceInicial = (paginaActual - 1) * cartasPorPagina;
  const indiceFinal = indiceInicial + cartasPorPagina;
  const cartasVisibles = ordenadas.slice(indiceInicial, indiceFinal);

  // VOLVER A LA PRIMERA PÁGINA AL CAMBIAR FILTROS
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, edicion, orden]);

  // CAMBIAR PÁGINA Y VOLVER ARRIBA
  const cambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // ANIMAR CARTAS AL ENTRAR EN PANTALLA
    useEffect(() => {
      const observador = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
              entrada.target.classList.add("revelada");
              observador.unobserve(entrada.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      document
        .querySelectorAll(".carta")
        .forEach((carta) => observador.observe(carta));

      return () => observador.disconnect();
    }, [cartas, vistaActiva, paginaActual, busqueda, edicion, orden]);

  // VOLVER AL INICIO
  const irAlInicio = () => {
    setVistaActiva("catalogo");
    setBusqueda("");
    setEdicion("todas");
    setOrden("normal");
    setPaginaActual(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-layout">
      <div className="fondo">
        <span className="bola b1"></span>
        <span className="bola b2"></span>
        <span className="bola b3"></span>
      </div>

      {/* MENÚ LATERAL */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={irAlInicio}>
          <svg viewBox="0 0 24 24">
            <path d="M3 10L12 3L21 10" />
            <path d="M5 9V20H19V9" />
            <path d="M10 20V14H14V20" />
          </svg>
        </div>

        <nav className="sidebar-nav">
          {/* CATÁLOGO */}
          <button
            className={
              vistaActiva === "catalogo" ? "nav-btn activo" : "nav-btn"
            }
            data-label="Catálogo"
            onClick={() => setVistaActiva("catalogo")}
          >
            <svg viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>

          {/* ESTADÍSTICAS */}
          <button
            className={
              vistaActiva === "dashboard" ? "nav-btn activo" : "nav-btn"
            }
            data-label="Estadísticas"
            onClick={() => setVistaActiva("dashboard")}
          >
            <svg viewBox="0 0 24 24">
              <path d="M5 21v-9" />
              <path d="M12 21V4" />
              <path d="M19 21v-6" />
            </svg>
          </button>

          {/* SIN STOCK */}
          <button
            className={
              vistaActiva === "agotados" ? "nav-btn activo" : "nav-btn"
            }
            data-label={`Sin stock (${agotadas.length})`}
            onClick={() => setVistaActiva("agotados")}
          >
            <svg viewBox="0 0 24 24">
              <path d="M10.3 4 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>

            {agotadas.length > 0 && (
              <span className="badge">{agotadas.length}</span>
            )}
          </button>
        </nav>

        {/* INSTAGRAM */}
        <a
          href="https://www.instagram.com/castletcg.cl/"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-btn instagram-btn"
          data-label="Instagram"
          aria-label="Instagram de la tienda"
        >
          <svg viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" />
          </svg>
        </a>
      </aside>

      {/* BARRA FIJA AL HACER SCROLL */}
      <div className={scrolled ? "barra-fija visible" : "barra-fija"}>
        <span className="barra-titulo" onClick={irAlInicio}>
          CastleTCG
        </span>
        <span className="barra-valor">
          ${valorTotal.toLocaleString("es-CL")}
        </span>
      </div>

      {/* BOTÓN VOLVER ARRIBA */}
      <button
        className={scrolled ? "subir visible" : "subir"}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Volver arriba"
      >
        <svg viewBox="0 0 24 24">
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      </button>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <header className="encabezado">
          <div className="enc-izq">
            <p className="enc-etiqueta">Inventario de la tienda</p>
            <h1 className="titulo-inicio" onClick={irAlInicio}>
              CastleTCG
            </h1>

            {info && (
              <p className="enc-fecha">
                Actualizado el{" "}
                {new Date(info.consultado_en).toLocaleDateString("es-CL")}
              </p>
            )}
          </div>

          <div className="enc-der">
            <p className="enc-etiqueta">Valor del inventario</p>
            <strong className="enc-valor">
              ${valorTotal.toLocaleString("es-CL")}
            </strong>
            <p className="enc-sub">
              {totalUnidades} unidades · {filtradas.length} publicaciones
            </p>
          </div>
        </header>

        {/* VISTA 1: CATÁLOGO */}
        {vistaActiva === "catalogo" && (
          <>
            <input
              className="buscador"
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar carta por nombre..."
            />

            <div className="filtros">
              <select
                value={edicion}
                onChange={(e) => setEdicion(e.target.value)}
              >
                <option value="todas">Todas las ediciones</option>

                {ediciones.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>

              <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                <option value="normal">Orden normal</option>
                <option value="caro">Más caras primero</option>
                <option value="barato">Más baratas primero</option>
              </select>
            </div>

            {/* LISTA DE CARTAS */}
            <div className="lista">
              {cartasVisibles.map((carta) => (
                <CartaItem
                  key={carta.publicacion_id}
                  carta={carta}
                  onClick={() => setSeleccionada(carta)}
                />
              ))}
            </div>

            {/* PAGINACIÓN */}
            {totalPaginas > 0 && (
              <div className="paginacion">
                <button
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                >
                  Anterior
                </button>

                <span>
                  Página {paginaActual} de {totalPaginas}
                </span>

                <button
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                >
                  Siguiente
                </button>
              </div>
            )}

            {ordenadas.length === 0 && <p>No se encontraron cartas.</p>}
          </>
        )}

        {/* VISTA 2: ESTADÍSTICAS */}
        {vistaActiva === "dashboard" && (
          <section className="vista">
            <h2>Panel de estadísticas</h2>
            <p className="vista-sub">
              Métricas globales de la tienda basadas en TCG Match.
            </p>

            <div className="stats">
              <div className="stat">
                <span>Total catálogo</span>
                <strong>{cartas.length} ítems</strong>
              </div>

              <div className="stat">
                <span>Valorización potencial</span>
                <strong>${valorTotal.toLocaleString("es-CL")}</strong>
              </div>
            </div>

            {topCarta && (
              <div className="top" onClick={() => setSeleccionada(topCarta)}>
                <div className="top-img">
                  <img src={topCarta.imagenes[0]} alt={topCarta.nombre} />
                </div>

                <div className="top-info">
                  <p className="top-etiqueta">
                    Carta más valiosa del inventario
                  </p>
                  <h3 className="top-nombre">
                    {topCarta.nombre.split(" - ")[0]}
                  </h3>
                  <p className="top-edicion">
                    {topCarta.edicion || "Sin edición"}
                  </p>

                  <strong className="top-precio">
                    ${topCarta.precio_publicado_clp.toLocaleString("es-CL")}
                  </strong>

                  <p className="top-stock">Stock: {topCarta.stock}</p>
                  <span className="top-ver">Ver detalle →</span>
                </div>
              </div>
            )}
          </section>
        )}

        {/* VISTA 3: SIN STOCK */}
        {vistaActiva === "agotados" && (
          <section className="vista">
            <h2>Cartas sin stock en TCG Match</h2>
            <p className="vista-sub">
              Estas publicaciones están agotadas y requieren reposición.
            </p>

            <div className="sinStocklista">
              {agotadas.map((carta) => (
                <CartaItem
                  key={carta.publicacion_id}
                  carta={carta}
                  onClick={() => setSeleccionada(carta)}
                />
              ))}
            </div>
          </section>
        )}

        {/* DETALLE DE CARTA */}
        {seleccionada && (
          <DetalleCarta
            carta={seleccionada}
            onCerrar={() => setSeleccionada(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;