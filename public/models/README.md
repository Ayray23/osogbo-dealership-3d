# 3D vehicle assets

This directory is reserved for optimized glTF 2.0 binary assets (`.glb`) used by the interactive vehicle viewer.

## Asset naming

- `sedan.glb` — sedan model
- `suv.glb` — SUV model
- `luxury-sedan.glb` — luxury sedan model

The current app includes a reusable loader at `src/components/GLBVehicle.jsx`. To enable a model, add a licensed GLB file here and set that inventory item's `modelUrl` to its public path (for example, `/models/sedan.glb`).

## Asset requirements

- Use models with a documented license that permits commercial website use.
- Prefer optimized GLB files with embedded textures; aim for under 8 MB per vehicle.
- Keep the model centered and inspect orientation, scale, materials, and shadows in the viewer.
- Do not label a generic model as a specific Toyota, Lexus, Mercedes-Benz, or other trademarked model unless the geometry actually represents that vehicle and its use is authorized.

No binary vehicle assets are included in this stage yet. Until a model is added and checked, the viewer intentionally uses the existing procedural 3D vehicle rather than requesting a missing file.
