# Product Requirements Document (PRD): Power Lens Portfolio

## Product

Power Lens is an editorial photography portfolio for Edwards Godspower. It presents a curated gallery, featured hero frame, image lightbox, photographer dossier, and contact links.

## Technical stack

* **Frontend:** Next.js App Router, React, Tailwind CSS, Framer Motion
* **Storage:** Neon PostgreSQL for owner sessions, work metadata, publication state, and ordering
* **Image management:** Direct signed Cloudinary uploads and responsive delivery transformations
* **Deployment:** Vercel or another Next.js-compatible host

## Cloudinary content contract

Gallery uploads use the `power-lens-gallery` tag and may use the `power-lens` folder prefix. Cloudinary context fields support `title`, `altText`, `caption`, `category`, `featured`, `orientation`, `cameraSpec`, `location`, and `hardware`.

Cloudinary Admin API credentials remain server-only. The browser receives normalized portfolio data through `/api/content`, while image URLs use Cloudinary `f_auto,q_auto` delivery.

## Admin workflow

The owner signs in at `/admin` with a database-backed email/password account. New works are uploaded directly to Cloudinary using a short-lived server signature, then stored in Neon as drafts with title, slug, alt text, caption, category, orientation, camera details, location, hardware, featured state, and editorial order. Only published works are returned by the public content endpoint. The owner can publish, unpublish, feature, and archive works from the protected panel.