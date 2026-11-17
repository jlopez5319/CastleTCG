function DetalleCarta({ carta, onCerrar }) {
  const nombre = carta.nombre.split(" - ")[0];

  return (
    <div className="pop-fondo" onClick={onCerrar}>
      <div className="pop" onClick={(e) => e.stopPropagation()}>
        <button className="pop-cerrar" onClick={onCerrar}>
          ✕
        </button>

        <div className="pop-imagen">
          <img src={carta.imagenes[0]} alt={nombre} />
        </div>

        <div className="pop-info">
          <p className="pop-etiqueta">{carta.edicion || "Sin edición"}</p>
          <h2 className="pop-titulo">{nombre}</h2>

          <div className="pop-precio">
            <span>Tu precio</span>
            <strong>
              ${carta.precio_publicado_clp.toLocaleString("es-CL")}
            </strong>
          </div>

          <div className="pop-datos">
            <div>
              <span>Número</span>
              <strong>{carta.numero || "-"}</strong>
            </div>
            <div>
              <span>Condición</span>
              <strong>{carta.condicion}</strong>
            </div>
            <div>
              <span>Idioma</span>
              <strong>{carta.idioma}</strong>
            </div>
            <div>
              <span>Variante</span>
              <strong>{carta.variante || "-"}</strong>
            </div>
            <div>
              <span>Stock</span>
              <strong>{carta.stock}</strong>
            </div>
          </div>

          {carta.stock === 1 && <p className="ultima">¡Última unidad!</p>}

          <a
            className="pop-boton"
            href={carta.url_publicacion}
            target="_blank"
            rel="noreferrer"
          >
            Ver en TCGmatch
          </a>
        </div>
      </div>
    </div>
  );
}

export default DetalleCarta;