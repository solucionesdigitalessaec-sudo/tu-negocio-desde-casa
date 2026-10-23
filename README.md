# Tu negocio desde casa — Masterclass

Landing page de la masterclass **«Tu negocio desde casa»** de Homeschool Cristiano Chile, junto a Maura Abarcia.

- 📅 22 de noviembre 2026 · 17:00 Chile · 14:00 México · 15:00 Colombia y Ecuador
- ⏱️ 120 minutos · grabación online por una semana · libro digital imprimible
- 💳 $10.000 CLP / 10 USD

## Desarrollo

```sh
npm install
npm run dev
```

## Publicar en Vercel

1. Entra a <https://vercel.com/new> e importa este repositorio.
2. Vercel detecta Vite automáticamente (build: `npm run build`, salida: `dist`).
3. Presiona **Deploy**.

## Editar contenido

- Formulario de inscripción: constante `FORM_URL` en `src/App.tsx`.
- Fecha y hora del evento: `EVENT_START` / `EVENT_END` en `src/App.tsx` (en UTC).
- Imágenes: `src/assets/`.
