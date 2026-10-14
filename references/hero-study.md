# Hero study 01

Jan supplied IMG_5391.jpg on 10 October 2026. The original is preserved in assets/01 Jan/IMG_5391-original.jpg. The separate hero study lives at site/hero-motion.html. The earlier palette explorer remains at site/index.html.

The hero uses an AI edited transparent portrait, oversized decorative lettering behind the subject, two scroll layers, an understated bronze outline, and the actual Magic UI BlurFade component from the installed repository. The rest of the composition uses custom CSS and React. There is a pause control and explicit support for reduced motion preferences. The logo strip currently uses a static layout with six existing company assets.

The edited portrait is a draft. Image generation can alter fine face, clothing, or edge details. Review against the original before production. The original remains the source of truth.

Built in image generation prompt:

Use case: background extraction. Remove only the forest background, including background between arms and shoulders. Preserve Jan's identity, face, smile, eyes, beard, pose, hands, fingers, hoodie folds, ON VACATION lettering, and all visible torso and elbows. Keep natural photographic colors and lighting. No beautification, redrawing, added anatomy, illustration, shadow, solid background, or baked checkerboard. Produce genuine transparent PNG edges.

The generated asset has an alpha range from 0 to 254 and transparent sampled background pixels. It is saved as assets/01 Jan/jan-hero-cutout-v1.png and site/hero/assets/jan-cutout.png. Color restraint and the bottom fade are CSS treatments, leaving the asset itself unchanged.

Source code is in site/hero-lab. A copy of the build script is beside it. The build uses esbuild from the installed Magic UI workspace, creates site/hero/app.js and app.css, and refreshes the chat preview. Magic UI's MIT license is preserved with the preview.

Verified in the browser at desktop and mobile widths. Image assets load, layouts have no horizontal overflow at the inspected widths, the pause control disables layer transforms, and scroll movement produces different transforms for the portrait and background lettering. Copy is provisional. Nothing has been published.
