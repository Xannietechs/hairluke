# Free on-device hair-colour studio

This feature uses Google's MediaPipe ImageSegmenter HairSegmenter model to detect existing hair and apply an approximate colour tint. It does not generate a new wig, alter length, add volume, or reproduce an exact product. No OpenAI key, paid image API or per-generation service is connected.

Photos are decoded and resized in browser memory (maximum 1024 px edge), processed with a locally served model, and never uploaded. They are not put in Supabase, local storage or analytics. Remove photo clears it; leaving the page releases it. Downloads happen only when the customer requests them. Hosting/model bandwidth is still subject to the host's plan and mobile data charges. The AI library and model download only when the user analyses a photo.

Supported uploads: JPG/PNG/WebP up to 8 MB. HEIC is not supported; export it as JPG first. An up-to-date browser with WebAssembly and WebGL is required; unsupported devices get an explanatory message. This is best-effort across modern phones, tablets and computers, not a promise of compatibility with every old device.

Builds run scripts/prepare-vision.mjs to copy the installed MediaPipe WASM runtime and download the official version-1 hair model. Generated public/vision assets are ignored by Git and included in Vite's static build. No user image is used at build time.

Source and documentation: https://developers.google.com/edge/mediapipe/solutions/vision/image_segmenter/web_js and https://developers.google.com/edge/mediapipe/solutions/vision/image_segmenter . Model: https://storage.googleapis.com/mediapipe-models/image_segmenter/hair_segmenter/float32/1/hair_segmenter.tflite . MediaPipe is an open-source Google AI Edge project; retain package license notices.

Before analysis, customers explicitly opt in to MediaPipe processing and its performance/utilization metrics. Google may receive basic metrics; photo inputs stay on the device. Privacy notice: https://developers.google.com/edge/mediapipe/solutions/tasks .
