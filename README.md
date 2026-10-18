# Osogbo Dealership — 3D Automotive Experience

A React + Vite automotive dealership experience for Osogbo, Osun State, built around interactive real-time 3D vehicle previews, a virtual showroom, vehicle inspection, enquiry/booking flows, and a mobile-first browsing experience.

## Stack

- React + Vite
- Three.js
- React Three Fiber
- Drei
- Lucide React

## Run locally

```bash
npm install
npm run dev
```

Verify a production build with:

```bash
npm run build
npm run preview
```

## Development safety rules

- `main` is the stable branch.
- Risky or substantial work goes into a named `stage/*` branch.
- Verify the production build and review the change before opening a pull request.
- Merge only after the stage has been reviewed. If a stage is unusable, leave `main` untouched and delete the stage branch.

## Current project stages

- `stage/realistic-3d-vehicles` — real-time 3D vehicle foundation and build verification.
- `stage/realshop-upload` — updated dealership experience and inventory integration.
- `stage/mobile-3d-qa` — mobile 3D performance, adaptive rendering, touch interaction and Instagram-style progressive loading.
- `stage/dealership-conversion-polish` — final customer journey and mobile dealership UX polish.

## Product experience

- Real-time 3D dealership showroom with camera/view switching.
- Interactive vehicle cards with lazy-loaded 3D previews.
- Vehicle inspection overlay with exterior, cabin, boot and engine-area views.
- Vehicle search and category filtering.
- Viewing/test-drive booking flow.
- WhatsApp, phone, email and Google Maps actions when dealership environment variables are configured.
- Osogbo dealership location and opening-hours presentation.
- Illustrative finance calculator.
- Responsive navigation and touch-friendly showroom controls.
- Progressive section loading and lightweight skeleton states so the page shell appears before heavy 3D assets.
- Graceful 3D model fallback when an external GLB cannot load.

## Production configuration

Copy `.env.example` to `.env` and set the verified dealership details before launch:

- `VITE_SHOP_NAME`
- `VITE_SHOP_TAGLINE`
- `VITE_WHATSAPP`
- `VITE_PHONE`
- `VITE_EMAIL`
- `VITE_ADDRESS`
- `VITE_MAP_QUERY`

Do not commit private credentials or unverified contact information.

## Important inventory note

Vehicle names, prices and availability are sample catalogue content. They must be confirmed by the dealership before commercial use. A vehicle entry being displayed does not mean that Osogbo Dealership currently owns or has that exact vehicle in stock. Prices intentionally fall back to **Ask for price** until verified figures are supplied.

## Real 3D vehicle previews

The inventory's interactive models are loaded as GLB files from the public `pedrosoandre/carros` asset repository, pinned to source commit `0a56de377f02f2574d781f6920fed08d6423ec2f` to avoid floating branch updates. The source repository provides optimized GLB models with CC BY 4.0 attribution requirements. Creator/source credits are retained in the project documentation and website footer.

Current representative models:

- Toyota Camry 40
- Lexus RX 350 MK2
- Toyota RAV4 Hybrid
- Honda CR-V
- Hyundai Elantra N
- Toyota Corolla Cross

These are representative 3D previews, not proof that those exact vehicles are in stock. Confirm actual inventory, model year, condition, price and dealership contact details before launch.

## Launch checklist

1. Verify every vehicle against actual dealership stock.
2. Add verified prices or intentionally keep **Ask for price**.
3. Configure verified WhatsApp, phone, email and address values.
4. Confirm opening hours and map location.
5. Confirm the 3D asset credits/license requirements remain satisfied.
6. Run `npm run build` and review the deployed site on Android and desktop.
7. Only then merge the reviewed stage into `main` and deploy.
