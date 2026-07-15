# Guía de Viaje Japón — App

Página web completa con tu itinerario interactivo de Japón — **16 días**, 25 ago al 11 sept 2026 — lista para desplegar en [Render](https://render.com).

Diseño premium (Tailwind + Material Symbols + Noto Serif/Manrope): galería tipo bento, timeline con íconos de color por categoría, barra de hoteles con el activo resaltado según el día, navegación inferior con flechas ← →, insignia de sellos goshuin, y templos opcionales.

## 📸 Cómo agregar tus fotos

**No vienen imágenes pre-cargadas** — las carpetas ya están listas (`public/images/d1/` a `public/images/d16/`), solo falta que pongas tus fotos ahí.

### Regla de nombres
En cada carpeta, nombra tus fotos como números en orden: `1.jpg`, `2.jpg`, `3.jpg`... hasta `6.jpg` (máximo 6 fotos por día, es lo que muestra la galería).

Si una foto no existe, ese espacio simplemente no se muestra (no rompe nada) — puedes ir completando poco a poco.

### Qué representa cada número, por día

| Día | 1.jpg | 2.jpg | 3.jpg | 4.jpg | 5.jpg | 6.jpg |
|---|---|---|---|---|---|---|
| **d1** | Aterrizaje en Narita | Narita Express | Llegada a Asakusa | Uniqlo Asakusa | Senso-ji de noche | Kaminarimon iluminada |
| **d2** | Yodobashi-Akiba | Templo Senso-ji | Goshuincho | Puerta Kaminarimon | Nakamise-dori | Pokémon Café |
| **d3** | Tren a Kamakura | Gran Buda de Kamakura | Komachi-dori | Tsurugaoka Hachimangu | Playa de Yuigahama | Tren Enoden |
| **d4** | Autobús a Kawaguchiko | Fuji-Q Highland | Fujiyama | Fuji desde Kawaguchiko | Teleférico Kachi Kachi | Mirador Chureito |
| **d5** | Shinkansen a Osaka | Templo Katsuo-ji | Postal de sellos Katsuo-ji | Neones de Dotonbori | Glico Man | Shinsaibashi-suji |
| **d6** | Tren a USJ | Super Nintendo World | Mundo de Harry Potter | Jurassic Park The Ride | Minion Park | CityWalk |
| **d7** | Venados de Nara | Todai-ji | Kasuga Taisha | Mochi de Nakatanidou | Castillo de Osaka | Shinsekai de noche |
| **d8** | Tren Osaka-Kioto | Kiyomizu-dera | Escenario de madera | Sannenzaka | Pagoda Yasaka | Higashiyama |
| **d9** | Tren a Arashiyama | Bosque de bambú | Templo Tenryu-ji | Puente Togetsukyo | Jardín de musgo | Mercado de Nishiki |
| **d10** | Tren a Fushimi Inari | Fushimi Inari | Senda de toriis | Zorros de piedra | Kinkaku-ji | Estanque del espejo |
| **d11** | Castillo de Nijo | Distrito de Gion | Hanami-koji | Pontocho Alley | Río Kamo | Santuario Yasaka |
| **d12** | Shinkansen a Tokio | Museo Snoopy | PEANUTS Café | Omoide Yokocho | Gato gigante LED | Golden Gai |
| **d13** | Tren a Akihabara | Akihabara | Tiendas de anime | Arcade retro | teamLab Borderless | Odaiba |
| **d14** | Tren a Toyosu | teamLab Planets | Meiji Jingu | Takeshita-dori | Cruce de Shibuya | Estatua de Hachiko |
| **d15** | Tren a Mitaka | Museo Ghibli | Templo Jindaiji | Última compra | Lugar favorito revisitado | Última cena japonesa |
| **d16** | Último desayuno | Check-out del hotel | Narita Express | Terminal del aeropuerto | Duty-free | Onigiri de despedida |

Ejemplo: para poner tu foto del Gran Buda de Kamakura, guárdala como `public/images/d3/2.jpg`.

## Opción A — Desplegar como "Web Service" (Node + Express) — recomendada

1. Sube esta carpeta a un repositorio de **GitHub**.
2. Entra a [render.com](https://render.com) → **New +** → **Web Service** → conecta el repositorio.
3. Render detecta automáticamente `render.yaml` (build: `npm install`, start: `npm start`).
4. En **Environment** agrega la variable `MAPBOX_TOKEN` con tu access token público de Mapbox (así el mapa interactivo del día funciona; el token nunca queda en el código ni en GitHub, solo vive en esta variable de entorno).
5. En 2-3 minutos tendrás tu URL pública.

### Correr en tu computadora
Para probar localmente, define la variable de entorno antes de arrancar:
```
MAPBOX_TOKEN=tu_token_aqui npm start
```

## Opción B — "Static Site" (más simple, sin servidor, nunca se duerme)

1. Sube la carpeta a GitHub igual que arriba.
2. En Render: **New +** → **Static Site** → conecta el repositorio.
3. En **Publish Directory** escribe: `public`
4. Deja Build Command vacío.

## Notas
- Habilitado el **auto-deploy**: cada vez que subas cambios a GitHub (`git push`), Render actualiza la página sola.
- Todas las habitaciones de tus hoteles deben ser tipo **twin** (2 camas separadas).
- Evitar mariscos en restaurantes.
