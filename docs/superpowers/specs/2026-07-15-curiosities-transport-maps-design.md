# Curiosidades por parada, resumen de transporte y ruta en Google Maps

## Contexto

`public/index.html` renderiza el itinerario de 16 días desde el array `dayData`. Cada día ya tiene:
- `poi`: tuplas `[icono, categoría, nombre, descripción]`, una por parada, en el mismo orden que `steps`.
- `steps`: `[hora, "nombre — descripción"]`, mismo orden/longitud que `poi`.
- `curiosities`: lista de 10-13 `[título, texto]` por día, **sin vínculo con ninguna parada específica** y actualmente sin renderizar (`const curiosHtml = '';` en `renderDay()`).
- `photos`, `optional`: sin cambios en este trabajo.

Este documento cubre tres cambios:
1. Mostrar las curiosidades, ancladas a la parada del timeline con la que se relacionan.
2. Agregar una tarjeta "Cómo moverte hoy" con el resumen de traslados del día.
3. Agregar un botón que abre la ruta completa del día en Google Maps.

## 1. Curiosidades por parada

### Modelo de datos
Cada tupla de `poi` gana un 5° elemento **opcional**: un array de pares `[título, texto]`.

```js
['寺','Templo','Senso-ji de noche','iluminado, sin las multitudes del día — sello goshuin disponible',
  [
    ['El primer templo budista de Tokio','Senso-ji ya existía cuando Tokio (entonces Edo) era solo una aldea pesquera...'],
    ['Humo que cura, según la tradición','Frente a Senso-ji hay un gran incensario...']
  ]
],
```

Paradas sin curiosidad asociada simplemente no tienen 5° elemento (`poiItem[4]` es `undefined`).

### Curación de contenido
Para cada uno de los 16 días, se recorre el array `curiosities` existente y cada entrada se reasigna a la parada de `poi` más relacionada temáticamente (por lugar/nombre mencionado). Reglas:
- Paradas puramente logísticas (Traslado, Trámite, check-in/check-out) normalmente no llevan curiosidad.
- Paradas temáticas (Templo, Santuario, Castillo, Naturaleza, Foto, Recorrido, Actividad relevante) pueden llevar 1, 2 o hasta 3 curiosidades si varias del día original le corresponden.
- Ninguna curiosidad existente se descarta: toda curiosidad debe terminar asignada a alguna parada de ese mismo día, incluso si la relación es aproximada (ej. una curiosidad general del barrio va a la primera parada relevante de ese barrio).
- Una vez migrado un día, se elimina la propiedad `curiosities:` de ese objeto de día.

### Render
En `renderDay()`, dentro del `.map` que construye `timeline` (donde hoy se hace `const poiItem = d.poi[i];`), si `poiItem[4]` existe, se agrega dentro de la misma tarjeta (después de `desc`) un bloque por curiosidad:

```html
<div class="mt-3 pt-3 border-t border-outline-variant/20 flex gap-2">
  <span class="material-symbols-outlined text-tertiary-fixed-dim !text-base">lightbulb</span>
  <div>
    <p class="text-xs font-bold text-on-surface">${titulo}</p>
    <p class="text-xs text-on-surface-variant">${texto}</p>
  </div>
</div>
```

Estilo consistente con las tarjetas de timeline existentes (mismo tipo de letra/tamaño que se usa en `optionalHtml`). Se elimina la variable muerta `curiosHtml` y su referencia en el template de `wrap.innerHTML`.

## 2. Tarjeta "Cómo moverte hoy"

### Datos
Ninguno nuevo. Se deriva en tiempo de render filtrando `d.poi` (junto con su `step` correspondiente para la hora) por `categoria === "Traslado"`.

### Render
Nueva función `transportSummary(d)` llamada desde `renderDay()`, insertada en el template de `wrap.innerHTML` **entre la sección de encabezado del día (con `goshuinBadge`) y la galería de fotos**. Si el día no tiene ninguna parada de tipo Traslado, la sección no se renderiza (string vacío), igual que hace hoy `optionalHtml` cuando `d.optional` está vacío.

Estructura visual: tarjeta con título "Cómo moverte hoy", ícono `train`, y una lista compacta hora + nombre + descripción de cada traslado (mismo look que las demás tarjetas: `bg-surface-container-lowest`, `rounded-xl`, `border-outline-variant/20`).

Esta misma tarjeta incluye, al final, el botón de Google Maps del punto 3 (una sola tarjeta, dos contenidos).

## 3. Botón "Abrir ruta del día en Google Maps"

### Datos
Cada día gana un array nuevo de nivel superior:

```js
route: [
  "Narita International Airport, Japan",
  "Senso-ji Temple, Asakusa, Tokyo",
  "Kaminarimon Gate, Tokyo",
  ...
],
```

Curado a mano por día a partir de las paradas más representativas (templos, miradores, distritos, y los puntos de origen/destino de los traslados principales) usando nombres buscables en Google Maps (nombre propio + ciudad/barrio), no las etiquetas cortas de `poi`. Tope de ~10 puntos por día (límite práctico de Google Maps para rutas multi-parada); si un día tiene más lugares relevantes que el tope, se priorizan los puntos de mayor peso (templos/miradores/distritos) sobre paradas menores (compras, arcades repetidos).

### Construcción del link
Función `mapsRouteUrl(route)`:

```js
function mapsRouteUrl(route) {
  const enc = s => encodeURIComponent(s);
  const [origin, ...rest] = route;
  const destination = rest.pop();
  const params = new URLSearchParams({
    api: '1',
    travelmode: 'transit',
    origin,
    destination,
  });
  if (rest.length) params.set('waypoints', rest.join('|'));
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
```

### Render
Botón `<a href="${mapsRouteUrl(d.route)}" target="_blank" rel="noopener">` con ícono `map` dentro de la tarjeta "Cómo moverte hoy". Si `d.route` no existe o tiene menos de 2 puntos, el botón no se renderiza.

## Fuera de alcance
- No se agregan mapas embebidos (iframe) — solo el botón de enlace, según lo decidido.
- No se toca el detalle de cada parada de traslado individual (andén, transbordo, costo) — quedó descartado en la conversación de diseño.
- No se agrega selector de días, modo oscuro, PWA/offline, ni el resto de puntos mencionados en la revisión inicial — quedan para una ronda posterior.

## Plan de implementación (a alto nivel)
1. Migrar curiosidades → paradas para los 16 días (edición de datos).
2. Curar `route: [...]` para los 16 días (edición de datos).
3. Implementar `transportSummary(d)`, `mapsRouteUrl(route)`, y el render de curiosidades por parada en el timeline.
4. Insertar ambas piezas en `renderDay()` y eliminar `curiosHtml`/`curiosities` muertos.
5. Verificación manual en navegador: revisar unos días representativos (d1, d6 sin traslados variados, d15/d16) y confirmar que los links de Maps abren rutas razonables.
