# Recomendaciones de desayuno, comida y cena por zona

## Contexto

El itinerario se hospeda en 4 zonas a lo largo del viaje:

| Zona (`mealZone`) | Hotel | Días |
|---|---|---|
| `asakusa` | The Kanzashi, Asakusa | 1-4 |
| `namba` | GRIDS Premium Namba, Osaka | 5-7 |
| `kyoto` | Rihga Gran Kyoto | 8-11 |
| `shinjuku` | WPÜ Hotel Shinjuku | 12-16 |

Se agrega una tarjeta "Dónde comer hoy" a cada día con recomendaciones de desayuno, comida y cena, agrupadas por zona (no por día individual) ya que el lugar donde se come depende de dónde está el hotel esa noche, no del día específico.

## Modelo de datos

Nuevo objeto de nivel superior, junto a `HOTELS` y `DATES`:

```js
const MEAL_ZONES = {
  asakusa: {
    label: 'Asakusa',
    breakfast: [
      ['Nombre del lugar', 'Descripción corta de una línea', 'Nombre buscable en Google Maps'],
      // 6-8 items
    ],
    lunch: [ /* 6-8 items, mismo formato */ ],
    dinner: [ /* 6-8 items, mismo formato */ ],
  },
  namba: { label: 'Namba / Dotonbori', breakfast: [...], lunch: [...], dinner: [...] },
  kyoto: { label: 'Kioto', breakfast: [...], lunch: [...], dinner: [...] },
  shinjuku: { label: 'Shinjuku', breakfast: [...], lunch: [...], dinner: [...] },
};
```

Cada uno de los 16 objetos de `dayData` gana un campo nuevo `mealZone` con la clave correspondiente (`'asakusa'`, `'namba'`, `'kyoto'` o `'shinjuku'`) según la tabla de arriba.

**Restricción de contenido:** ninguna opción recomendada debe tener mariscos como ingrediente principal (se excluyen sushi de pescado crudo, kaiten-zushi, izakayas centrados en mariscos, unagi, etc.), por la nota ya existente en el README ("Evitar mariscos en restaurantes"). Se prioriza ramen, gyudon, curry japonés, tonkatsu, yakiniku, teishoku de carne, panaderías/cafés para desayuno, etc.

## Render

Nueva función `mealSummary(d)`, siguiendo el mismo patrón que `transportSummary(d)`:

```js
function mapsSearchUrl(place) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
}

function mealSummary(d) {
  const zone = MEAL_ZONES[d.mealZone];
  if (!zone) return '';
  const section = (title, icon, items) => `
    <details class="group">
      <summary class="flex items-center justify-between cursor-pointer list-none py-2">
        <span class="flex items-center gap-2 font-bold text-sm">
          <span class="material-symbols-outlined !text-lg">${icon}</span> ${title}
        </span>
        <span class="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
      </summary>
      <div class="space-y-3 pb-2">
        ${items.map(([name, desc, mapsQuery]) => `
          <div class="pl-2 border-l-2 border-outline-variant/30">
            <p class="text-sm font-bold text-on-surface">${name}</p>
            <p class="text-xs text-on-surface-variant">${desc}</p>
            <a href="${mapsSearchUrl(mapsQuery)}" target="_blank" rel="noopener" class="text-[11px] font-bold text-secondary">📍 Ver en Google Maps</a>
          </div>`).join('')}
      </div>
    </details>`;
  return `
    <section class="px-6 mb-6">
      <div class="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/10 divide-y divide-outline-variant/20">
        <div class="flex items-center gap-2 mb-1">
          <span class="material-symbols-outlined text-secondary">restaurant</span>
          <h3 class="font-headline-md text-body-lg font-bold text-primary">Dónde comer hoy</h3>
        </div>
        ${section('Desayuno', 'coffee', zone.breakfast)}
        ${section('Comida', 'lunch_dining', zone.lunch)}
        ${section('Cena', 'dinner_dining', zone.dinner)}
      </div>
    </section>`;
}
```

Se inserta en `renderDay()` justo debajo de `${transportSummary(d)}` y antes de la galería de fotos.

`<details>`/`<summary>` nativos manejan el acordeón sin JS adicional; los tres empiezan cerrados por defecto.

## Fuera de alcance
- No se generan recomendaciones distintas por día individual, solo por zona.
- No se filtra por precio ni se agregan horarios de apertura.
- No se agregan las 4 zonas como configurables por el usuario final (es contenido fijo, igual que el resto del itinerario).
