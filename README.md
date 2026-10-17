# Osogbo Dealership — 3D Automotive Experience

A React + Vite automotive dealership experience focused on interactive real-time 3D, Nigerian-market vehicles, and a premium showroom aesthetic for Osogbo, Osun State.

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
- Verify the build and review the change before opening a pull request.
- Merge only after the stage has been reviewed. If a stage is unusable, leave `main` untouched and delete the stage branch.

## Current stages

1. `stage/realistic-3d-vehicles` — improve the real-time 3D vehicle geometry and add automated production-build verification.
2. Future: detailed licensed GLB/GLTF models and asset loading.
3. Future: expanded showroom environment and camera transitions.
4. Future: inventory search, filters, vehicle detail pages, and enquiry integration.
5. Future: mobile performance/accessibility QA and deployment.

## Important inventory note

Vehicle names, prices, and availability currently serve as sample content. They must be confirmed by the dealership before the website is used commercially. Replace the placeholder WhatsApp contact with the dealership's verified number before launch.


## Real 3D vehicle previews

The inventory's interactive models are loaded as GLB files from the public `pedrosoandre/carros` asset repository, pinned to source commit `0a56de377f02f2574d781f6920fed08d6423ec2f` to avoid floating branch updates. The source repository provides optimized GLB models with CC BY 4.0 attribution requirements. Credits and links to each original Sketchfab model are shown in the website footer.

- Toyota Camry 40 — source model by Ford mondeo
- Lexus RX 350 MK2 — source model by Merc_TV
- Toyota RAV4 Hybrid — source model by tonielpro520
- Honda CR-V — source model by Palma123 JAAT
- Hyundai Elantra N — source model by Maroi Mister Let Me Think Official 3D Studio
- Toyota Corolla Cross — source model by Nieve5677

These are representative 3D previews, not proof that those exact vehicles are in stock. Confirm actual inventory, model year, condition, price, and the dealership's contact details before launch. The source library's models were optimized for web delivery; original creator credits and the CC BY 4.0 license are linked in the footer.
