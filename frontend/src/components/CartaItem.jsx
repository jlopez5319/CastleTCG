function CartaItem({ carta, onClick }) {
  return (
    <div className="carta" onClick={onClick}>
      <img src={carta.imagenes[0]} alt={carta.nombre} />
      <div className="fila">
        <h3>{carta.nombre}</h3>
        <span className="precio">
          ${carta.precio_publicado_clp.toLocaleString("es-CL")}
        </span>
      </div>
      <p className="edicion">{carta.edicion}</p>
      <p className="stock">Stock: {carta.stock}</p>
      {carta.stock === 1 && <p className="ultima">¡Última unidad!</p>}
    </div>
  );
}

export default CartaItem;