# lashora-tryon# Lashora Virtual Lash Try-On – Developer README

## Project Goal

Create a luxury-themed virtual lash try-on experience for Lashora, inspired by Lashify’s platform. The app will use real-time webcam input with MediaPipe FaceMesh to overlay 13 lash styles on the user’s eyes. It must be mobile responsive, fast, and feel like a premium cosmetic tech product. Final integration will embed into Shopify via iframe.

## Tech Stack

- React + Vite
- MediaPipe FaceMesh
- Tailwind CSS
- Vercel (frontend deployment)
- GitHub (daily commits required)

## Project Structure

## Mobile UI Layout Reference

This project must closely replicate the mobile user interface of Lashify's Virtual Try-On, including:

- Top camera overlay with clear "Virtual Try-On" title
- Interactive lash adjustment panel:
  - **Lash Map** selector
  - **Color** dropdown (e.g. Black)
  - **Length** adjuster (e.g. Medium + / -)
  - **Style** carousel (e.g. AMPLIFY, Luna Line, etc.)
- **Add to Bag** button (prominent and centered)
- **"Select Individual Lengths"** secondary CTA (can be excluded in MVP if not needed)
- Floating icons:
  - Zoom
  - Hide lashes
  - Fullscreen toggle
- Must be touch-friendly, buttery smooth, and responsive on iPhone and Android.

📸 *[Screenshot provided in project assets folder for visual reference. Refer to `/docs/mobile-layout.jpg`]*
# Lashora Virtual Lash Try-On

## Project Overview

This project aims to fully replicate the look, feel, and functionality of the Virtual Try-On experience from [Lashify.com](https://www.lashify.com). The goal is to create a polished, mobile-friendly lash try-on tool tailored to Lashora’s luxury branding (beige/gold tones, elegant fonts, and icons).

## Key Requirements

- Real-time camera-based virtual lash overlay using MediaPipe FaceMesh
- Accurate PNG overlays (left/right eye) for 13 lash styles
- Style selection via grid (not horizontal scroll)
- "Add Lash Map to Bag" button per style (Shopify-compatible)
- Mobile-first design, optimized for responsiveness
- Seamless Shopify iframe embed via Vercel
- Smooth UI transitions and celebratory feedback (sparkle/sound)
- Match Lashify’s interface layout and UX as closely as possible
- Biometric Notice modal (replica of Lashify biometric policy flow)
- Fallback photo upload support if needed
- Daily GitHub commits and staging previews on Vercel

## Notes for Developer

Please feel free to do whatever is technically necessary to match Lashify's Virtual Try-On experience. Lashify.com is your reference for layout, responsiveness, and polish.

We will provide all necessary lash PNGs and support assets throughout the build.

