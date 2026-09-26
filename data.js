/* Everything the page shows lives here: the series, the titles, the rows and the profile
   "cuts" that reorder them. Edit this file, not the markup. */

const PROFILE = {
  name: "Digvijay Singh Parihar",
  short: "Digvijay",
  handle: "dsp81",
  initials: "DSP",
  tagline: "Dual degree M.Tech CSE + B.Tech EE, IIT Gandhinagar",
  location: "Gandhinagar, India",
  availability: "Open to ML research & engineering roles — internships now, full-time from 2027.",
  blurb:
    "I build generative and decision-making models for satellite imagery — and I care about " +
    "what the numbers actually say afterwards. First author at BMVC 2026, currently writing a " +
    "master's thesis on controllable foundation models for Earth observation.",
  email: "digvijaysingh.parihar@iitgn.ac.in",
  phone: "+91 70434 29178",
  phoneHref: "tel:+917043429178",
  github: "https://github.com/dsp81",
  linkedin: "https://www.linkedin.com/in/digvijay-singh-parihar-b73536259/",
  resume:
    "https://drive.google.com/file/d/1XvmNF9L68KHgZl6YI5KaVUmrREIg5Exw/view?usp=drive_link",
  advisor: "Prof. Nipun Batra",
  lab: "Sustainability Lab, IIT Gandhinagar",
  photo: "",            // drop a path here (e.g. assets/me.jpg) and it replaces the monogram
};

/* ── the billboard: the series is the person ─────────────────────────────────── */
const SERIES = {
  title: "Digvijay Singh Parihar",
  badge: "BMVC 2026 · first-author paper",
  year: "2022 —",
  rating: "TV-ML",
  seasons: "3 Seasons",
  genres: ["Generative AI", "Earth Observation", "Research that ships"],
  moods: ["Investigative", "Technical", "Curious"],
  backdrops: [
    "assets/art/hero_ports.jpg",
    "assets/art/hero_grid.jpg",
    "assets/art/hero_sweeps.jpg",
  ],
  logline:
    "He put a first-author paper into BMVC 2026 — then went back and proved his own model " +
    "was barely listening to the metadata it was given, and is rebuilding it on a " +
    "4-billion-parameter backbone. Generative models for Earth observation, from someone who " +
    "checks what the numbers actually mean.",
  cast: [
    ["Digvijay Singh Parihar", "lead · writer · every GPU hour"],
    ["Prof. Nipun Batra", "thesis advisor · Sustainability Lab"],
    ["Rishabh Mondal", "co-author · FlowSat"],
    ["Prof. Shanmuganathan Raman", "advisor · spectral diffusion, CVIG"],
  ],
};

/* The trailer: one line per shot, every number traceable to a title below. */
const TRAILER = [
  { bg: "assets/art/hero_ports.jpg", kicker: "A DSP Original",
    line: "257,248 satellite images.",
    sub: "198 countries, 57,294 distinct places, one curated training set. The job: teach a model what the planet looks like.",
    title: "flowsat-c" },
  { bg: "assets/art/hero_grid.jpg", kicker: "FlowSat",
    line: "Name a place, a date, a resolution.",
    sub: "It paints the satellite image that should be there.",
    title: "flowsat" },
  { bg: "assets/art/hero_flowsat.jpg", kicker: "BMVC 2026 · first author",
    frames: ["assets/art/flowsat_gallery_01.jpg", "assets/art/fs_02.jpg", "assets/art/flowsat_compare_a.jpg"],
    line: "20 steps. The baseline needs 100.",
    sub: "FID 28.74 on the released checkpoint (31.10 as submitted) against DiffusionSat's 35.27. Weights are public.",
    title: "flowsat" },
  { bg: "assets/art/hero_sweeps.jpg", kicker: "Then",
    line: "He asked the uncomfortable question.",
    sub: "In his own BMVC model, turn the resolution dial and the image zooms; turn season or cloud and almost nothing happens.",
    title: "flowsat-c" },
  { bg: "assets/art/flowsatc_geo.jpg", kicker: "FlowSat-C · master's thesis", frames: ["assets/art/flowsatc_geo.jpg"],
    line: "It wasn't. So he's rebuilding it.",
    sub: "Metadata gets its own tokens on a 4B-parameter FLUX.2 backbone. A third pathway he built was measured against the data first — and cut.",
    title: "flowsat-c" },
  { bg: "assets/art/tts_spec_gen_female_dark.png", kicker: "YourTTS Hindi",
    frames: ["assets/art/tts_spec_ref_male_dark.png", "assets/art/tts_spec_gen_female_dark.png"],
    line: "Six seconds of a stranger's voice.",
    sub: "Answered in Hindi, by a model never trained on Devanagari. Listeners rated naturalness 4.44 / 5.",
    title: "yourtts" },
  { bg: "assets/art/hero_povrl.jpg", kicker: "Poverty mapping by RL",
    frames: [["assets/art/povrl_lr.jpg", "Free · Sentinel-2"], ["assets/art/povrl_hr.jpg", "Bought · high-res tile"]],
    framesRow: true,
    line: "Buy 13.7% of the imagery. Keep 70.7% of the objects.",
    sub: "And when the purchased imagery didn't beat the free baseline, he reported that too.",
    title: "povrl" },
  { bg: "assets/art/diffusion_card.jpg", kicker: "Diffusion Models, Explained",
    frames: ["assets/art/diffusion_guide.png"],
    line: "Every image is a point.",
    sub: "And almost no points are images. Eight interactive chapters, written and built solo.",
    title: "diffusion-guide" },
  { bg: "assets/art/zelite_card.jpg", kicker: "Zelite Solutions",
    line: "Hours of research. Under five minutes.",
    sub: "An LLM research agent, shipped during an internship at a Microsoft Solutions Partner.",
    title: "zelite" },
];

const TITLES = [
  {
    id: "flowsat",
    kind: "feature",
    title: "FlowSat",
    sub: "Flow-matching diffusion transformers for satellite imagery",
    year: "2026",
    rating: "BMVC 2026",
    badge: "BMVC 2026",
    match: 98,
    duration: "Published · first author",
    tags: ["Generative AI", "Diffusion & Flow Matching", "Remote Sensing", "PyTorch"],
    genres: ["Generative AI", "Remote Sensing", "Peer-reviewed"],
    moods: ["Elegant", "Fast", "Geometric"],
    contains: "spherical coordinates, zero-initialised layers, 20-step sampling",
    cast: "Digvijay Singh Parihar (first author), Rishabh Mondal, Nipun Batra · Sustainability Lab, IIT Gandhinagar",
    dial: true,
    bibtex: "@inproceedings{parihar2026flowsat,\n  title     = {FlowSat: Flow-Matching Diffusion Transformers with Metadata\n               Conditioning for Satellite Image Generation},\n  author    = {Parihar, Digvijay Singh and Mondal, Rishabh and Batra, Nipun},\n  booktitle = {British Machine Vision Conference (BMVC)},\n  year      = {2026}\n}",
    art: "assets/art/flowsat_gallery_05.jpg",
    poster: "assets/art/flowsat_gallery_01.jpg",
    backdrop: "assets/art/hero_grid.jpg",
    logline:
      "Give it a caption plus where, when and at what resolution — it paints the satellite image. " +
      "Resolution it obeys reliably; season, cloud and place far less, which became the thesis.",
    synopsis:
      "A flow-matching diffusion transformer built on Sana-0.6B that conditions on seven metadata " +
      "fields — longitude, latitude, month, day, year, ground sample distance, cloud cover — by " +
      "encoding each one on its own geometry (a sphere for coordinates, a circle for dates) and " +
      "grafting it into the pretrained AdaLN modulation through zero-initialised layers, so at " +
      "step zero the network is byte-identical to the base model and nothing is unlearned on the " +
      "way in. Flow matching replaces denoising, which is what buys the 20-step sampling. The " +
      "project page reports both the submitted FID (31.10) and the released checkpoint's (28.74), " +
      "with the exact protocol to reproduce either; the weights are public on Hugging Face. " +
      "Measured afterwards, the metadata control is uneven: GSD is strong, cloud and season are " +
      "weak, and geography is close to null. The dial below shows it, and FlowSat-C is the fix.",
    stats: [
      ["FID 28.74", "released checkpoint · 31.10 as submitted"],
      ["CLIP 0.3019", "prompt fidelity · 10k FMoW test samples"],
      ["20 steps", "vs 100 for DiffusionSat (FID 35.27)"],
      ["11× fewer", "metadata-encoder parameters than SatCLIP"],
    ],
    episodes: [
      ["Geometry-aware metadata", "Coordinates live on a sphere and dates on a circle; encode them that way instead of as bare floats.", "assets/art/flowsat_gallery_01.jpg"],
      ["Zero-initialised grafts", "New conditioning enters the pretrained AdaLN modulation pathway at exactly zero, so the first training step cannot damage the base model.", "assets/art/fs_02.jpg"],
      ["Flow matching, not denoising", "A straight-line probability path gets usable samples in 20 steps rather than 100. 125K optimiser steps, bf16, multi-GPU with Accelerate.", "assets/art/flowsat_gallery_07.jpg"],
      ["It generalises", "Trained on FMoW-RGB, still coherent zero-shot on the out-of-domain RSICD benchmark.", "assets/art/flowsat_gallery_03.jpg"],
    ],
    links: [
      ["Open the project page", "https://dsp81.github.io/flowsat-satellite-image/", "play"],
      ["Code", "https://github.com/dsp81/flowsat-satellite-image", "code"],
      ["Weights", "https://huggingface.co/Djisgod/flowsat-fmow-512", "weights"],
    ],
    related: ["flowsat-c", "diffusion-guide", "hsi", "povrl"],
  },
  {
    id: "flowsat-c",
    kind: "continue",
    title: "FlowSat-C",
    sub: "Making a 4B generative model actually listen to metadata",
    year: "2026 —",
    rating: "Master's thesis",
    badge: "New episodes",
    match: 97,
    progress: 45,
    duration: "Master's thesis · Sustainability Lab",
    tags: ["Generative AI", "Diffusion & Flow Matching", "Remote Sensing", "Research",
           "Interpretability"],
    genres: ["Generative AI", "Interpretability", "Thesis"],
    moods: ["Investigative", "Ambitious", "Self-critical"],
    contains: "spherical harmonics, a model caught ignoring its inputs, one deleted pathway",
    cast: "Digvijay Singh Parihar · advised by Prof. Nipun Batra",
    art: "assets/art/flowsatc_geo.jpg",
    poster: "assets/art/flowsatc_season.jpg",
    backdrop: "assets/art/hero_sweeps.jpg",
    dial: true,
    logline:
      "A falling FID and a finished progress bar are perfectly compatible with the model " +
      "ignoring every dial you gave it. This is the rebuild.",
    synopsis:
      "Metadata conditioning rebuilt on FLUX.2-klein-base-4B. FlowSat — the BMVC model — accepted " +
      "latitude, longitude, GSD, cloud and date but was barely controllable by most of them; measured ordering was " +
      "GSD > cloud > season > geography (≈ null). Two causes, both structural: rich captions " +
      "already described season and biome, so the model used text (redundancy); and metadata " +
      "entered as one global vector in the shared AdaLN modulation, which cannot express a " +
      "spatially varying effect (bandwidth). The rebuild keeps the zero-initialised graft for " +
      "global effects, gives metadata its own tokens in joint attention for spatial ones, and " +
      "strips captions of anything the metadata already says. A third, spectral pathway was " +
      "built, then measured against the data with pre-registered criteria — and removed. " +
      "Training data: 257,248 curated FMoW images from 57,294 locations in 198 countries. It is training now; " +
      "controllability results will be posted when they are validated.",
    stats: [
      ["FLUX.2-klein", "4B flow-matching backbone"],
      ["257,248", "curated images · 198 countries"],
      ["2 pathways", "graft + tokens · a third was measured and cut"],
      ["GSD > cloud > season > geo ≈ 0", "measured control ordering in FlowSat"],
      ["Results pending", "training now · per-field probes built"],
    ],
    episodes: [
      ["Diagnose, do not patch",
       "FlowSat's failure was invisible to the metrics being watched: loss fell, FID fell, CLIP rose, controllability sat at zero. Every diagnostic in the rebuild exists so that cannot recur.",
       "assets/art/flowsatc_geo.jpg"],
      ["Take the information out of the captions",
       "If the caption already says “autumn, temperate forest”, the metadata vector is redundant and the model routes around it. Captions are now metadata-agnostic by construction.",
       "assets/art/flowsatc_season.jpg"],
      ["Give conditioning somewhere to go",
       "Metadata as tokens in joint attention, so a field can act differently on a port than on a field of wheat — the one thing a global scale-and-shift can never express.",
       "assets/art/flowsatc_gsd.jpg"],
      ["Kill your darling",
       "A spectral pathway — GSD as a Nyquist cutoff, cloud as an atmospheric MTF — was built, then tested: its gains collapsed onto a global mean shift, and a pre-registered test on 3,000 real chips showed the statistic it targeted isn't in the data (1 of 4 criteria passed). It was deleted. Measure the target on the data before building the pathway.",
       "assets/art/hero_sweeps.jpg"],
      ["Encode each field on its own geometry",
       "Real spherical harmonics for coordinates, cyclic day-of-year and sun azimuth, log₂ GSD, learned nulls rather than zero-fill, and no Fourier basis on the year so unseen years cannot wrap onto old ones.",
       "assets/art/flowsatc_season.jpg"],
      ["Measure control, not just quality",
       "Location-level validation splits, fixed stratified timesteps, per-field response probes, attention-mass tracking, and a checkpoint selector that scores FID minus controllability.",
       "assets/art/flowsatc_geo.jpg"],
    ],
    gallery: [
      ["assets/art/flowsatc_geo.jpg", "Same scene, geography dialled across the row — the field that was inert in FlowSat."],
      ["assets/art/flowsatc_gsd.jpg", "Ground sample distance sweep — the one field FlowSat did respond to."],
      ["assets/art/flowsatc_season.jpg", "Season sweep on fixed scenes and seeds."],
    ],
    links: [["Sustainability Lab", "https://sustainability-lab.github.io/", "code"]],
    related: ["flowsat", "geodiff", "diffusion-guide"],
  },
  {
    id: "povrl",
    kind: "feature",
    title: "Poverty Mapping by RL",
    sub: "The imagery wasn't worth buying — and seven seeds say so",
    year: "2025",
    rating: "Reproduction",
    match: 95,
    duration: "AAAI 2021 reproduction · 318 Uganda clusters",
    tags: ["Reinforcement Learning", "Remote Sensing", "Object Detection", "Honest Results"],
    genres: ["Reinforcement Learning", "Remote Sensing", "AI for social good"],
    moods: ["Frugal", "Rigorous", "Candid"],
    contains: "policy gradients, seven random seeds, a negative result reported anyway",
    cast: "Digvijay Singh Parihar",
    art: "assets/art/povrl_hr2.jpg",
    poster: "assets/art/povrl_hr.jpg",
    backdrop: "assets/art/hero_povrl.jpg",
    logline:
      "A policy looks at free blurry imagery and buys 13.7% of the sharp tiles, keeping 70.7% of " +
      "the detected objects. The acquisition works — and the purchase still doesn't improve the poverty estimate.",
    synopsis:
      "A from-scratch reimplementation of Ayush et al. (AAAI 2021): a REINFORCE policy sees only " +
      "free Sentinel-2 imagery, picks which of 256 high-resolution subtiles to buy, a YOLOv3 " +
      "fine-tuned from COCO onto xView counts what is in them, and a gradient-boosted regressor " +
      "predicts cluster consumption. Seven seeds, held-out splits, every number published.",
    stats: [
      ["70.7%", "of all detected objects recovered"],
      ["13.7%", "of the imagery actually bought"],
      ["0.449", "detector mAP@50 on xView"],
      ["r² 0.326 vs 0.314", "free imagery alone vs with purchases (±0.078 across 7 seeds)"],
    ],
    episodes: [
      ["The acquisition works", "At a matched budget the learned policy beats every hand-designed baseline, and 13.7% of the imagery still captures 70.7% of the objects.", "assets/art/povrl_hr.jpg"],
      ["The negative result, reported anyway", "A regressor given only the free Sentinel-2 image scores r² 0.326; adding everything bought moves it to 0.314 — inside the ±0.078 seed spread.", "assets/art/povrl_lr.jpg"],
      ["Coverage, not cleverness", "Object counts over all 256 subtiles reach r² 0.125, against 0.033 for the tiles a matched-budget policy buys: the signal is diffuse, not concentrated.", "assets/art/povrl_hr2.jpg"],
      ["Everything is inspectable", "The site is static HTML with the full tables, per-cluster predictions and the raw run JSON.", "assets/art/hero_povrl.jpg"],
    ],
    links: [
      ["Open the report", "https://dsp81.github.io/RL---Adaptive-Tile-Selection/", "play"],
      ["Code", "https://github.com/dsp81/RL---Adaptive-Tile-Selection", "code"],
    ],
    related: ["flowsat", "flowsat-c", "hsi"],
  },
  {
    id: "yourtts",
    kind: "feature",
    title: "YourTTS Hindi",
    sub: "Zero-shot voice cloning that speaks Devanagari",
    year: "2025",
    rating: "MOS 4.44",
    match: 93,
    duration: "NLP · speech synthesis · team project",
    tags: ["Speech Synthesis", "NLP", "Fine-tuning", "PyTorch"],
    genres: ["Speech", "NLP", "Generative AI"],
    moods: ["Multilingual", "Hands-on", "Audible"],
    contains: "a 190-symbol alphabet, frozen speaker encoders, twelve audio clips",
    cast: "NLP course group project, IIT Gandhinagar",
    audio: [
      ["Male voice — reference prompt", "https://dsp81.github.io/YourTTS-Hindi/assets/audio/ref_male.wav"],
      ["Male voice — generated Hindi", "https://dsp81.github.io/YourTTS-Hindi/assets/audio/gen_male.wav"],
      ["Female voice — reference prompt", "https://dsp81.github.io/YourTTS-Hindi/assets/audio/ref_female.wav"],
      ["Female voice — generated Hindi", "https://dsp81.github.io/YourTTS-Hindi/assets/audio/gen_female.wav"],
    ],
    art: "assets/art/tts_spec_gen_female_dark.png",
    poster: "assets/art/tts_spec_ref_male_dark.png",
    backdrop: "assets/art/tts_spec_ref_male_dark.png",
    logline:
      "Hand it six seconds of a voice it has never heard, in a language it was never trained on, " +
      "and it answers in Hindi.",
    synopsis:
      "YourTTS (VITS) rebuilt for Hindi: the 165-symbol vocabulary was replaced with a " +
      "190-symbol Devanagari set, phoneme processing swapped for graphemes, the language " +
      "embedding disabled for single-language conditioning, and the whole thing fine-tuned on " +
      "IndicTTS-Hindi. The 512-d speaker encoder stays frozen, which is what keeps zero-shot " +
      "cloning alive after the switch.",
    stats: [
      ["4.44 / 5", "naturalness MOS · 48 ratings, 8 listeners"],
      ["4.75 / 5", "speaker similarity (SIM-MOS)"],
      ["165 → 190", "symbols, rebuilt for Devanagari"],
      ["11.8k", "IndicTTS-Hindi training samples"],
    ],
    episodes: [
      ["Rebuild the alphabet", "A vocabulary designed for Latin script does not survive contact with Devanagari; it was rebuilt symbol by symbol."],
      ["Graphemes over phonemes", "No reliable Hindi phonemiser in the loop, so the model reads characters directly."],
      ["Freeze the speaker encoder", "Identity stays external in a 512-d embedding, so cloning a new voice needs no retraining."],
      ["Listen for yourself", "Twelve rendered clips with reference prompts and spectrograms on the project page."],
    ],
    links: [
      ["Hear the samples", "https://dsp81.github.io/YourTTS-Hindi/", "play"],
      ["Code", "https://github.com/dsp81/YourTTS-Hindi", "code"],
    ],
    related: ["diffusion-guide", "flowsat", "zelite"],
  },
  {
    id: "diffusion-guide",
    kind: "feature",
    title: "Diffusion Models, Explained",
    sub: "Removing noise to make an image",
    year: "2026",
    rating: "Interactive",
    match: 96,
    duration: "8 chapters · written & built solo",
    tags: ["Writing", "Interactive Visualisation", "Diffusion", "Teaching"],
    genres: ["Explainer", "Interactive", "Diffusion"],
    moods: ["Clear", "Playful", "Draggable"],
    contains: "a 786,432-dimensional space, draggable noise schedules",
    cast: "Written, illustrated and built by Digvijay Singh Parihar",
    art: "assets/art/diffusion_card.jpg",
    poster: "assets/art/diffusion_guide.png",
    backdrop: "assets/art/hero_mixed.jpg",
    logline:
      "“Every image is a point, and almost no points are images.” Eight chapters that build " +
      "diffusion from that one sentence.",
    synopsis:
      "A long-form interactive guide to diffusion models, from why noise is the right thing to " +
      "destroy, through the forward and reverse processes, the loss derivation, a single timestep " +
      "in full, why the noise is Gaussian, and where flow matching goes next. Draggable noise " +
      "schedules, playable sampling trajectories, and a conversational voice that assumes " +
      "curiosity rather than a measure-theory course.",
    stats: [
      ["8 chapters", "problem → derivation → flow matching"],
      ["Interactive", "draggable schedules, playable sampling"],
      ["From scratch", "written, illustrated and built solo"],
    ],
    episodes: [
      ["1–2 · The problem and the idea", "Images as points in a 786,432-dimensional space, and why almost none of those points are images."],
      ["3–4 · Forward and reverse", "Adding noise on a schedule, then learning to walk it back."],
      ["5–6 · Derivation and one timestep", "The loss, and then a single denoising step in full detail."],
      ["7–8 · Why Gaussians, what next", "The reason for the distribution, then flow matching and where the field went."],
    ],
    links: [["Read the guide", "https://diffusionguidedj.netlify.app/", "play"]],
    related: ["flowsat", "yourtts", "hsi"],
  },
  {
    id: "hsi",
    kind: "feature",
    title: "Spectral Diffusion",
    sub: "Unmixing priors for hyperspectral image denoising",
    year: "2025",
    rating: "Research poster",
    match: 91,
    duration: "Research project · CVIG Lab, IIT Gandhinagar",
    tags: ["Diffusion", "Hyperspectral Imaging", "Computer Vision", "PyTorch"],
    genres: ["Diffusion", "Computer Vision", "Remote Sensing"],
    moods: ["Technical", "Spectral", "Self-supervised"],
    contains: "endmembers, SVD thresholding, a perceptual loss borrowed from VGG16",
    cast: "Digvijay Singh Parihar · Akbar Ali · advised by Prof. Shanmuganathan Raman",
    art: "assets/art/hsi_bands.jpg",
    poster: "assets/art/hsi_bands.jpg",
    backdrop: "assets/art/hsi_results.jpg",
    logline:
      "A hyperspectral image has hundreds of bands and no clean reference. Denoise it anyway — " +
      "by diffusing the materials, not the pixels.",
    synopsis:
      "Built on Diff-Unmix (CVPR 2024): the noisy hyperspectral cube is decomposed into spectral " +
      "endmembers (pure material spectra) and abundance maps, and a DDPM-based reverse process " +
      "denoises the abundances while the spectra stay intact. The additions: SVD thresholding on " +
      "the abundance maps to strip small singular values before diffusion, a spectral transformer " +
      "block for band-wise self-attention, and a multi-loss objective mixing MSE with a VGG16 " +
      "perceptual term. Self-supervised — it never needs a clean ground truth.",
    stats: [
      ["+3.6 dB", "PSNR over the Diff-Unmix baseline, as reported on the poster"],
      ["0.925 → 0.947", "SSIM, baseline → ours"],
      ["0 clean refs", "self-supervised end to end"],
    ],
    episodes: [
      ["Decompose first", "Split the cube into endmembers and abundance maps, so noise is attacked where it lives instead of across hundreds of correlated bands.", "assets/art/hsi_bands.jpg"],
      ["Threshold the singular values", "SVD on the abundance maps, small singular values dropped — noise filtered before the diffusion model ever sees it."],
      ["Attend across bands", "A spectral transformer unit refines abundances with self-attention over spectral dependencies."],
      ["Loss that sees structure", "MSE plus a VGG16 perceptual term: higher PSNR and SSIM than the Diff-Unmix baseline, and a visibly cleaner restoration.", "assets/art/hsi_results.jpg"],
    ],
    gallery: [
      ["assets/art/hsi_results.jpg", "Ground truth, noisy input, restored output."],
      ["assets/art/hsi_bands.jpg", "False-colour renderings of hyperspectral bands."],
    ],
    links: [["Code", "https://github.com/dsp81/Denoising-Hyperspectral-Imagery", "play"]],
    related: ["flowsat", "diffusion-guide", "povrl"],
  },
  {
    id: "zelite",
    kind: "behind",
    title: "LLM Research Agent",
    sub: "Software engineering intern · Zelite Solutions",
    year: "2025",
    rating: "Internship",
    match: 92,
    duration: "Internship · May – June 2025",
    tags: ["LLM Agents", "Retrieval", "Structured Extraction", "Benchmarking"],
    genres: ["LLM Agents", "Industry", "Automation"],
    moods: ["Pragmatic", "Fast", "Production-minded"],
    contains: "four-plus language models, schema-driven JSON, a stopwatch",
    cast: "Digvijay Singh Parihar · Zelite Solutions (Microsoft Solutions Partner)",
    art: "assets/art/zelite_card.jpg",
    poster: "assets/art/zelite_card.jpg",
    backdrop: "assets/art/zelite_card.jpg",
    logline: "Multi-hour company research, compressed to under five minutes.",
    synopsis:
      "An end-to-end automation platform at a Microsoft Solutions Partner that orchestrates web " +
      "retrieval, LLM inference and structured extraction. The agent is modular: search depth, " +
      "query strategy and context budget are all adjustable, output is schema-driven JSON, and " +
      "local models (DeepSeek-R1, Mistral-7B, Phi-3) were benchmarked head to head against " +
      "cloud OpenAI models.",
    stats: [
      ["Hours → minutes", "under five, end to end"],
      ["4+ models", "local and cloud, benchmarked"],
      ["Schema-driven", "JSON out, not prose"],
    ],
    episodes: [
      ["Retrieval", "Configurable depth and query strategy rather than one fixed pipeline."],
      ["Inference", "Local and hosted models behind one interface, chosen per task."],
      ["Extraction", "Schema-first JSON so downstream systems can actually consume it."],
    ],
    links: [],
    noLinks: true,
    related: ["yourtts", "node-editor"],
    relatedText: "Client work, so no public link — the details are on the résumé.",
  },
  {
    id: "node-editor",
    kind: "pilot",
    title: "Node Graph Image Editor",
    sub: "C++ · Qt · OpenCV — image processing as a wired graph",
    year: "2025",
    rating: "Pilot",
    badge: "Pilot",
    match: 86,
    duration: "Side project · C++17",
    tags: ["C++", "Qt", "OpenCV", "Graph execution"],
    genres: ["Systems", "Tooling", "Computer Vision"],
    moods: ["Hands-on", "Architectural", "Low-level"],
    contains: "a DAG, a topological sort, pointers",
    cast: "Digvijay Singh Parihar",
    art: "assets/art/node_card.jpg",
    poster: "assets/art/node_card.jpg",
    backdrop: "assets/art/node_card.jpg",
    logline:
      "Instead of filter → undo → retry, wire blur, threshold and blend nodes into a graph and " +
      "let a DAG engine evaluate it.",
    synopsis:
      "A desktop image-manipulation tool in C++ with Qt for the canvas and OpenCV for the " +
      "operations. Each node is an atomic operation with its own parameters; connections compile " +
      "into a directed acyclic graph that is topologically sorted and executed. The pilot ships " +
      "the CMake build, the Qt canvas and the node infrastructure; the execution engine is the " +
      "next episode.",
    stats: [
      ["C++ · Qt", "custom canvas and node rendering"],
      ["DAG engine", "topological execution of OpenCV ops"],
      ["CMake", "cross-platform build"],
    ],
    episodes: [
      ["Setup", "CMake build, Qt window, custom canvas and event loop."],
      ["Node infrastructure", "Base class and registry, pins, drag interaction."],
      ["Operations", "Grayscale, blur, sharpen, edges — each a node with sliders."],
      ["Execution engine", "Parse the wiring into a DAG, sort it, run it."],
    ],
    links: [["Code", "https://github.com/dsp81/Node-based-image-processor", "play"]],
    related: ["zelite", "hsi"],
  },
  {
    id: "geodiff",
    kind: "coming",
    title: "GeoDiff",
    sub: "Diffusion that draws a city's roads from its terrain",
    year: "Coming soon",
    rating: "In development",
    badge: "Coming soon",
    match: 94,
    progress: 20,
    duration: "Research · in development",
    tags: ["Diffusion", "Graph Generation", "Geospatial"],
    genres: ["Generative AI", "Graphs", "Geospatial"],
    moods: ["Ambitious", "Spatial", "Early"],
    contains: "graph diffusion, elevation fields, what-if generation",
    cast: "Digvijay Singh Parihar",
    art: "assets/art/geodiff_roads.jpg",
    poster: "assets/art/geodiff_roads.jpg",
    backdrop: "assets/art/geodiff_roads.jpg",
    logline:
      "Give it elevation, water and population. It draws the road network — and redraws it " +
      "when you move the river.",
    synopsis:
      "Conditional diffusion for spatially embedded road-network graphs, conditioned on " +
      "continuous geographic fields. Two stages: one diffuses node positions, the other diffuses " +
      "the adjacency. The point is what baselines cannot do — complete a half-drawn network, and " +
      "answer what-if questions by perturbing the terrain and resampling.",
    stats: [],
    episodes: [
      ["Field binding", "First gate: prove the model actually responds to the terrain before scaling anything."],
      ["Real cities", "Then real road networks and elevation data."],
    ],
    links: [],
    noLinks: true,
    related: ["flowsat-c", "flowsat"],
    relatedText: "Early-stage research. Ask about it in an interview.",
  },
];


/* ── what a visitor can say they are looking for ────────────────────────────── */
/* Ticking these recomputes every match score and reorders the rails. Each title lists the
   traits it genuinely has; the score is overlap, not decoration. */
const TRAITS = [
  ["generative",      "Generative models"],
  ["diffusion",       "Diffusion & flow matching"],
  ["remote-sensing",  "Satellite & remote sensing"],
  ["vision",          "Computer vision"],
  ["rl",              "Reinforcement learning"],
  ["speech",          "Speech & NLP"],
  ["agents",          "LLM agents & tooling"],
  ["evaluation",      "Evaluation & interpretability"],
  ["writing",         "Writing & teaching"],
  ["shipping",        "Shipped production code"],
  ["software",        "Software engineering"],
  ["research",        "Peer-reviewed research"],
];

/* Weighted: 1.0 is what the work is mostly about. */
const TRAIT_MAP = {
  "flowsat":         { generative: 1.0, diffusion: 1.0, "remote-sensing": 1.0, research: 1.0,
                       vision: 0.8, evaluation: 0.6, software: 0.4 },
  "flowsat-c":       { evaluation: 1.0, generative: 0.9, diffusion: 0.9, "remote-sensing": 0.9,
                       research: 0.7, vision: 0.7, software: 0.6 },
  "povrl":           { rl: 1.0, evaluation: 0.9, "remote-sensing": 0.8, vision: 0.7,
                       shipping: 0.8, software: 0.8, research: 0.5 },
  "yourtts":         { speech: 1.0, generative: 0.6, evaluation: 0.5, software: 0.5 },
  "diffusion-guide": { writing: 1.0, diffusion: 0.8, shipping: 0.7, software: 0.7,
                       generative: 0.6 },
  "hsi":             { diffusion: 0.9, vision: 1.0, "remote-sensing": 0.7, generative: 0.6,
                       research: 0.6, evaluation: 0.4 },
  "zelite":          { agents: 1.0, software: 1.0, shipping: 1.0, speech: 0.3, evaluation: 0.5 },
  "node-editor":     { software: 1.0, vision: 0.6, shipping: 0.3 },
  "geodiff":         { generative: 0.9, diffusion: 0.9, research: 0.5, "remote-sensing": 0.5 },
};

/* ── the series, season by season ────────────────────────────────────────────── */
const SEASONS = [
  {
    label: "Season 1", years: "2022 – 2024", name: "Origins",
    blurb: "An electrical engineer walks into a computer science degree and does not leave.",
    eps: [
      ["IIT Gandhinagar", "2022", "Joins the dual-degree programme: B.Tech Electrical Engineering + M.Tech Computer Science.", null],
      ["Dean's List, twice", "2022 – 23", "Semesters one and two, for an SPI of 8.5 and above.", null],
      ["Specialist", "", "Reaches Specialist on Codeforces, in C++. Still thinks in complexity classes.", null],
      ["Student Guide", "", "Selected to mentor incoming first-years, one of 40 guides.", null],
      ["The new ball", "", "Opens the bowling for IIT Gandhinagar at the Inter-IIT Sports Meet — quarter-finals in the 56th and 57th editions.", null],
    ],
  },
  {
    label: "Season 2", years: "2025", name: "The build-up",
    blurb: "Speech, spectra, agents and policies — five different fields in one year, on purpose.",
    eps: [
      ["Node Graph Image Editor", "Apr 2025", "A C++/Qt/OpenCV side project: image processing as a wired DAG.", "node-editor"],
      ["Zelite Solutions", "May – Jun 2025", "Ships an LLM research agent at a Microsoft Solutions Partner. Hours become minutes.", "zelite"],
      ["Spectral Diffusion", "Jun 2025", "Hyperspectral denoising with unmixing priors at CVIG, with Prof. Shanmuganathan Raman.", "hsi"],
      ["YourTTS Hindi", "2025", "Zero-shot voice cloning, taught Devanagari. MOS 4.44.", "yourtts"],
      ["Poverty Mapping by RL", "2025", "Reproduces an AAAI paper from scratch and reports the negative result.", "povrl"],
      ["CCL'25", "2025", "Captains Mighty Mambas to the title. Unrelated to machine learning; related to leadership.", null],
    ],
  },
  {
    label: "Season 3", years: "2026 —", name: "The research years",
    blurb: "First author at BMVC, then a thesis about why the first paper's model wasn't listening.",
    eps: [
      ["FlowSat", "2026", "Flow-matching transformers for satellite imagery, with Rishabh Mondal and Nipun Batra. Accepted at BMVC 2026, first author.", "flowsat"],
      ["Diffusion Models, Explained", "2026", "Eight interactive chapters, written and built solo.", "diffusion-guide"],
      ["FlowSat-C", "Jan 2026 —", "Master's thesis at the Sustainability Lab: controllable metadata conditioning on a 4B backbone.", "flowsat-c"],
      ["GeoDiff", "Coming soon", "Diffusion over road-network graphs, conditioned on terrain.", "geodiff"],
    ],
  },
];

/* ── experience ─────────────────────────────────────────────────────────────── */
const EXPERIENCE = [
  {
    role: "Student Researcher — Master's thesis",
    org: "Sustainability Lab, IIT Gandhinagar",
    when: "Jan 2026 — present",
    advisor: "Advisor: Prof. Nipun Batra",
    points: [
      "Leading thesis work on controllable, metadata-conditioned generative models for Earth observation on a 4B-parameter FLUX.2 backbone.",
      "Designing a controllability benchmark that quantifies per-field causal effects instead of trusting FID.",
      "Extending the flow-matching transformer to image-to-image: temporal inpainting, temporal generation, GSD-controlled super-resolution and change-guided generation.",
    ],
    title: "flowsat-c",
    traits: { research: 1.0, generative: 1.0, diffusion: 0.9, "remote-sensing": 0.9,
              evaluation: 0.9, software: 0.5 },
  },
  {
    role: "Software Engineering Intern",
    org: "Zelite Solutions (Microsoft Solutions Partner)",
    when: "May — June 2025",
    advisor: "LLM-powered automation platform",
    points: [
      "Designed and built an end-to-end AI automation platform orchestrating web retrieval, LLM inference and structured information extraction.",
      "Engineered a modular agent with adjustable search depth, query strategies and context budgets, token-efficient prompting and schema-driven JSON generation.",
      "Benchmarked local models (DeepSeek-R1, Mistral-7B, Phi-3) against cloud OpenAI models, taking multi-hour company research workflows to under five minutes.",
    ],
    title: "zelite",
    traits: { software: 1.0, agents: 1.0, shipping: 1.0, evaluation: 0.5 },
  },
  {
    role: "Research Project — Hyperspectral denoising",
    org: "CVIG Lab, IIT Gandhinagar",
    when: "2025",
    advisor: "Advisor: Prof. Shanmuganathan Raman",
    points: [
      "Extended Diff-Unmix (CVPR 2024) with SVD thresholding, a spectral transformer unit and a perceptual multi-loss.",
      "Improved on the Diff-Unmix baseline by +3.6 dB PSNR and SSIM 0.925 → 0.947 (as reported on the project poster), fully self-supervised.",
    ],
    title: "hsi",
    traits: { vision: 1.0, diffusion: 0.9, research: 0.7, generative: 0.6, "remote-sensing": 0.6 },
  },
];

/* ── by the numbers ─────────────────────────────────────────────────────────── */
/* [value, label, title id]. Plain text, no count-up: a number that animates through wrong
   values on its way to the right one is a number someone will screenshot mid-flight. */
const NUMBERS = [
  ["BMVC", "2026 · first-author paper, FlowSat",           "flowsat"],
  ["257,248", "satellite images curated for training",     "flowsat-c"],
  ["4B", "parameter backbone in the thesis",               "flowsat-c"],
  ["20", "sampling steps — DiffusionSat needs 100",        "flowsat"],
  ["4.44", "/ 5 naturalness from listeners, Hindi TTS",     "yourtts"],
  ["70.7%", "of objects found buying 13.7% of imagery",    "povrl"],
  ["7", "seeds behind every RL number, error bars shown", "povrl"],
  ["8.07", "CPI, dual degree at IIT Gandhinagar",          null],
];

/* ── academics ──────────────────────────────────────────────────────────────── */
const ACADEMICS = [
  ["Dual degree — M.Tech CSE + B.Tech EE", "Indian Institute of Technology Gandhinagar", "2022 — 2027", "CPI 8.07"],
  ["Class XII (CBSE)", "Delhi Public School, Bopal", "—", "95.2%"],
  ["Class X (CBSE)", "Delhi Public School, Bopal", "—", "97%"],
];

const HONOURS = [
  ["BMVC 2026", "First-author paper accepted"],
  ["Dean's List", "IIT Gandhinagar — semesters 1 and 2, for academic performance (SPI 8.5+)"],
  ["Codeforces Specialist", "Competitive programming in C++"],
  ["Student Guide", "Selected to mentor incoming first-years, one of 40 guides"],
  ["Captain, CCL'25 champions", "Led Mighty Mambas to the title"],
  ["Inter-IIT Sports Meet", "Cricket — quarter-finalists in the 56th and 57th editions"],
];

const COURSES = [
  ["Machine Learning", "core"],
  ["Deep Learning", "core"],
  ["Artificial Intelligence", "core"],
  ["Computer Vision", "core"],
  ["Natural Language Processing", "core"],
  ["AI for Social Good", "applied"],
  ["Data Science", "applied"],
  ["Probability & Statistics", "maths"],
  ["Data Structures & Algorithms I", "systems"],
  ["Data Structures & Algorithms II", "systems"],
];


/* ── because you watched ────────────────────────────────────────────────────── */
const CINEMA = [
  {
    film: "The Handmaiden",
    maker: "Park Chan-wook · 2016",
    tint: "linear-gradient(140deg,#7a1020,#2a0a12 70%)",
    reading:
      "The same events, told a second time from a different vantage point — and the second " +
      "telling is the one that is true. The first pass was not lying so much as showing you " +
      "only what it had chosen to show.",
    lesson: "Read the run twice.",
    pairs: "flowsat-c",
    why:
      "FlowSat-C exists because v1's first telling looked perfect: loss falling, FID falling, " +
      "CLIP rising — and controllability sitting at zero the whole time. Every diagnostic in " +
      "the rebuild is there to force the second telling.",
  },
  {
    film: "Millennium Actress",
    maker: "Satoshi Kon · 2001",
    tint: "linear-gradient(140deg,#123a63,#0a1626 70%)",
    reading:
      "A life assembled out of eras that keep cutting into each other: the same figure, the " +
      "same chase, restaged across decades until the periods stop being separate things.",
    lesson: "One place, every era.",
    pairs: "flowsat",
    why:
      "That is the metadata sweep. Fix the scene and the seed, then move the year, the month, " +
      "the ground sample distance — the same site restaged along an axis, which is exactly the " +
      "control FlowSat is built to give you.",
  },
  {
    film: "Arrival",
    maker: "Denis Villeneuve · 2016",
    tint: "linear-gradient(140deg,#1d5b4c,#08201c 70%)",
    reading:
      "Learn an unfamiliar representation and you do not just gain a translation — you gain a " +
      "different way of perceiving the thing it describes.",
    lesson: "The notation is the idea.",
    pairs: "diffusion-guide",
    why:
      "The diffusion guide is built on one sentence — every image is a point, and almost no " +
      "points are images. Accept that representation and the rest of the field stops being a " +
      "pile of equations and becomes obvious.",
  },
];

/* ── off the clock ──────────────────────────────────────────────────────────── */
const INTERESTS = [
  {
    id: "cricket",
    label: "Cricket",
    headline: "Opening spell, and then the top order",
    body:
      "Fast bowler who takes the new ball, and a top-order batsman when the innings turns " +
      "around. Represented IIT Gandhinagar at the Inter-IIT Sports Meet — quarter-finalists in " +
      "the 56th and 57th editions — and captained Mighty Mambas to the CCL'25 title.",
    stats: [["CCL'25", "won it, as captain"], ["Inter-IIT", "56th & 57th, quarter-finals"],
            ["New ball", "opening spell"], ["Top order", "with the bat"]],
    links: [["Record on CricHeroes", "https://chshare.link/player/dF7quJ"]],
  },
  {
    id: "writing",
    label: "Writing",
    headline: "Stories, when the GPUs are busy",
    body:
      "I write short fiction. It is the same instinct as the diffusion guide — work out what " +
      "the reader already believes, then decide which sentence changes it.",
    stats: [],
  },
];

/* Skills are genres: each one filters the catalogue to the work that actually uses it. */
const SKILLS = [
  ["PyTorch", "Diffusers · Accelerate · W&B · multi-GPU bf16", "pytorch", "#e50914"],
  ["Diffusion & flow matching", "DiT, AdaLN, FLUX, Sana, samplers", "diffusion", "#b81d7a"],
  ["Remote sensing", "Sentinel-2, fMoW, xView, hyperspectral", "remote sensing", "#1f7a5a"],
  ["Computer vision", "detection, denoising, super-resolution", "vision", "#2b5fb8"],
  ["Reinforcement learning", "REINFORCE, policy gradients", "reinforcement", "#b86b1d"],
  ["LLM agents", "retrieval, schema-driven extraction", "llm", "#6b3fb8"],
  ["Speech synthesis", "VITS, YourTTS, speaker encoders", "speech", "#1d8fb8"],
  ["Evaluation", "controllability probes, seeds, error bars", "evaluation", "#8a8a1d"],
  ["Python · C++ · MATLAB", "and Verilog, when provoked", "c++", "#555566"],
  ["Explaining things", "guides, reports, visualisations", "writing", "#b83a3a"],
];

/* ── questions a recruiter actually has ─────────────────────────────────────── */
const FAQ = [
  ["What is Digvijay looking for?",
   "ML research and engineering roles — generative models, computer vision, remote sensing, and LLM tooling. Internships now; the dual degree finishes in 2027, so full-time roles from then."],
  ["What is the strongest thing here?",
   "FlowSat, the BMVC 2026 first-author paper — and FlowSat-C, the thesis that followed it, because it shows the rarer skill: noticing that a model with great metrics was ignoring half its inputs, and proving why."],
  ["Can he ship, or only publish?",
   "Both. The Zelite internship built an LLM automation platform that took multi-hour company research to under five minutes, and four projects here are live pages you can open right now — FlowSat with public weights, the RL report, the Hindi audio samples, the diffusion guide — with code for more."],
  ["What does he train on?",
   "Multi-GPU PyTorch with Accelerate and bf16, on A100-class hardware — from a 0.6B Sana DiT fine-tuned for 125K steps to a 4B FLUX.2 backbone, over a 257K-image curated dataset."],
  ["Why is this a streaming service?",
   "Because a portfolio should be something you want to browse, not something you have to read. Also: he likes films more than résumé templates. The % match is a real overlap score between what you pick in Tune results and each project — a sorting aid, not a verdict. Everything else is taken from the work itself."],
  ["How do I reach him?",
   "Email is fastest: digvijaysingh.parihar@iitgn.ac.in. LinkedIn, GitHub and the résumé are one click away in the contact card below."],
];

/* Each profile is a different edit of the same material. */
const TRACKS = {
  recruiter: {
    label: "Recruiter",
    pitch:
      "First author at BMVC 2026, an LLM automation platform built in industry, four live project " +
      "pages plus code and weights. If you watch one thing, make it the 45-second trailer.",
    rows: ["top", "numbers", "experience", "continue", "skills", "vault", "academics", "cinema", "interests"],
  },
  researcher: {
    label: "Researcher",
    pitch:
      "Flow-matching transformers for Earth observation, a controllability benchmark that does " +
      "not trust FID, and a reproduction that publishes its own negative result.",
    rows: ["top", "numbers", "experience", "continue", "vault", "skills", "cinema", "academics", "interests"],
  },
  engineer: {
    label: "Engineer",
    pitch:
      "Multi-GPU training over 257K images, an LLM research agent built in industry, and " +
      "four live project pages plus public code and weights.",
    rows: ["top", "skills", "experience", "continue", "numbers", "vault", "academics", "interests", "cinema"],
  },
  browsing: {
    label: "Just browsing",
    pitch:
      "Start with the trailer — then the diffusion guide, which explains the rest and has " +
      "things to drag.",
    rows: ["top", "cinema", "numbers", "interests", "skills", "experience", "continue", "vault", "academics"],
  },
};


const ROWS = {
  mylist:     { label: "My List", kind: "mylist" },
  continue:   { label: "In production", ids: ["flowsat-c", "geodiff"], kind: "continue" },
  top:        { label: "Top 5 projects today", ids: ["flowsat", "flowsat-c", "povrl", "yourtts", "diffusion-guide"], kind: "top" },
  picks:      { label: "{picks}", kind: "picks" },
  numbers:    { label: "By the numbers", kind: "numbers" },
  experience: { label: "Experience", kind: "experience" },
  skills:     { label: "Browse by skill", kind: "skills",
                note: "Pick one and the catalogue filters to the work that uses it." },
  vault:      { label: "More from the vault", ids: ["hsi", "zelite", "node-editor", "diffusion-guide"] },
  academics:  { label: "Academics & honours", kind: "academics" },
  interests:  { label: "Off the clock", kind: "interests" },
  cinema:     { label: "Because you watched…", kind: "cinema",
                note: "Three films, and the thing each one taught me about doing the work." },
};

/* ── turn the dial: real FlowSat v1 sweeps, one seed, one field moved at a time ─ */
const DIAL = [
  { key: "gsd", label: "Resolution (GSD)", scene: "Rotterdam coordinates · dense urban prompt · seed 1234",
    frames: [["3.0 m", "assets/dial/gsd_3.0.jpg"], ["2.0 m", "assets/dial/gsd_2.0.jpg"],
             ["1.5 m", "assets/dial/gsd_1.5.jpg"], ["1.0 m", "assets/dial/gsd_1.0.jpg"],
             ["0.6 m", "assets/dial/gsd_0.6.jpg"], ["0.3 m", "assets/dial/gsd_0.3.jpg"]],
    verdict: "Responds. Drag it and the model zooms — GSD is the one field captions never mention, so the model had to learn it from the metadata." },
  { key: "month", label: "Month", scene: "Valencia coordinates · farmland prompt · seed 1234",
    frames: [["Jan", "assets/dial/month_01.jpg"], ["Mar", "assets/dial/month_03.jpg"],
             ["May", "assets/dial/month_05.jpg"], ["Jul", "assets/dial/month_07.jpg"],
             ["Sep", "assets/dial/month_09.jpg"], ["Nov", "assets/dial/month_11.jpg"]],
    verdict: "Barely responds. The training captions already described the season, so the model read it from the text and ignored the dial." },
  { key: "cloud", label: "Cloud cover", scene: "Seattle coordinates · airfield prompt · seed 1234",
    frames: [["0%", "assets/dial/cloud_00.jpg"], ["10%", "assets/dial/cloud_10.jpg"],
             ["25%", "assets/dial/cloud_25.jpg"], ["50%", "assets/dial/cloud_50.jpg"],
             ["75%", "assets/dial/cloud_75.jpg"], ["90%", "assets/dial/cloud_90.jpg"]],
    verdict: "A faint haze at most. A single global vector can dim an image; it cannot place a cloud. That gap is what FlowSat-C is built to close." },
];
