/* Everything the page shows lives here: titles, rows, and the profile "tracks" that
   reorder them. Edit this file, not the markup. */

const PROFILE = {
  name: "Digvijay Singh Parihar",
  short: "Digvijay",
  handle: "dsp81",
  tagline: "Dual degree M.Tech CSE + B.Tech EE, IIT Gandhinagar",
  blurb:
    "I build generative and decision-making models for satellite imagery — and I care about " +
    "what the numbers actually say afterwards. First-author at BMVC 2026, currently writing a " +
    "master's thesis on controllable foundation models for Earth observation.",
  email: "digvijaysingh.parihar@iitgn.ac.in",
  github: "https://github.com/dsp81",
  linkedin: "https://www.linkedin.com/in/digvijay-singh-parihar-b73536259/",
  resume:
    "https://drive.google.com/file/d/1XvmNF9L68KHgZl6YI5KaVUmrREIg5Exw/view?usp=drive_link",
  advisor: "Prof. Nipun Batra",
  lab: "Sustainability Lab, IIT Gandhinagar",
};

const TITLES = [
  {
    id: "flowsat",
    kind: "feature",
    title: "FlowSat",
    sub: "Flow-matching diffusion transformers for satellite imagery",
    year: "2026",
    rating: "BMVC 2026",
    match: 98,
    duration: "Published · first author",
    tags: ["Generative AI", "Diffusion & Flow Matching", "Remote Sensing", "PyTorch"],
    art: "assets/art/flowsat_gallery_05.jpg",
    backdrop: "assets/art/hero_flowsat.jpg",
    logline:
      "Tell it a caption, a place, a date and a ground sample distance — it paints the satellite " +
      "image that should be there.",
    synopsis:
      "A flow-matching diffusion transformer that conditions on seven metadata fields — longitude, " +
      "latitude, month, day, year, ground sample distance, cloud cover — by encoding each one on " +
      "its own geometry (a sphere for coordinates, a circle for dates) and grafting it into the " +
      "pretrained modulation pathway through zero-initialised layers, so nothing is unlearned on " +
      "the way in. Flow matching replaces denoising, which is what buys the 20-step sampling.",
    stats: [
      ["FID 28.74", "FMoW-RGB @ 512px, 20 steps"],
      ["CLIP 0.3019", "prompt fidelity"],
      ["20 steps", "vs 100 for DiffusionSat (FID 35.27)"],
      ["11× fewer", "metadata-encoder parameters than SatCLIP"],
    ],
    episodes: [
      ["Geometry-aware metadata", "Coordinates live on a sphere and dates on a circle; encode them that way instead of as bare floats."],
      ["Zero-initialised grafts", "New conditioning enters the pretrained AdaLN modulation pathway at exactly zero, so the first training step cannot damage the base model."],
      ["Flow matching, not denoising", "A straight-line probability path gets usable samples in 20 steps rather than 100."],
      ["It generalises", "Trained on FMoW-RGB, still coherent zero-shot on the out-of-domain RSICD benchmark."],
    ],
    links: [
      ["Open the project page", "https://dsp81.github.io/flowsat-satellite-image/", "play"],
      ["Code", "https://github.com/dsp81/flowsat-satellite-image", "code"],
    ],
    related: ["diffusion-guide", "povrl", "thesis"],
  },
  {
    id: "povrl",
    kind: "feature",
    title: "Poverty Mapping by Reinforcement Learning",
    sub: "Buy 13.7% of the satellite imagery, keep 70.7% of what matters",
    year: "2025",
    rating: "Reproduction",
    match: 96,
    duration: "AAAI 2021 reproduction · 318 Uganda clusters",
    tags: ["Reinforcement Learning", "Remote Sensing", "Object Detection", "Honest Results"],
    art: "assets/art/povrl_hr2.jpg",
    backdrop: "assets/art/hero_povrl.jpg",
    logline:
      "High-resolution imagery is sold by the tile. A policy network looks at the free blurry " +
      "image and decides which tiles are worth paying for.",
    synopsis:
      "A from-scratch reimplementation of Ayush et al. (AAAI 2021): a REINFORCE policy sees only " +
      "free Sentinel-2 imagery, picks which of 256 high-resolution subtiles to buy, a YOLOv3 " +
      "fine-tuned from COCO onto xView counts what is in them, and a gradient-boosted regressor " +
      "predicts cluster consumption. Seven seeds, held-out splits, every number published.",
    stats: [
      ["70.7%", "of all detected objects recovered"],
      ["13.7%", "of the imagery actually bought"],
      ["0.449", "detector mAP@50 on xView"],
      ["7 seeds", "held-out, with the error bars shown"],
    ],
    episodes: [
      ["The acquisition works", "At a matched budget the learned policy beats every hand-designed baseline, and 13.7% of the imagery still captures 70.7% of the objects."],
      ["The negative result, published anyway", "A regressor given only the free Sentinel-2 image scores r² 0.326; adding everything bought moves it to 0.314 — inside the ±0.078 seed spread."],
      ["Coverage, not cleverness", "Counts over all 256 subtiles reach r² 0.125 against 0.033 over the 15.7% bought: the signal is diffuse, not concentrated."],
      ["Everything is inspectable", "The site is static HTML with the full tables, per-cluster predictions and the raw run JSON."],
    ],
    links: [
      ["Open the report", "https://dsp81.github.io/RL---Adaptive-Tile-Selection/", "play"],
      ["Code", "https://github.com/dsp81/RL---Adaptive-Tile-Selection", "code"],
    ],
    related: ["flowsat", "thesis", "yourtts"],
  },
  {
    id: "yourtts",
    kind: "feature",
    title: "YourTTS Hindi",
    sub: "Zero-shot voice cloning that speaks Devanagari",
    year: "2025",
    rating: "MOS 4.44",
    match: 94,
    duration: "NLP · speech synthesis",
    tags: ["Speech Synthesis", "NLP", "Fine-tuning", "PyTorch"],
    art: "assets/art/tts_spec_gen_female_dark.png",
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
      ["4.44 / 5", "naturalness MOS, 48 human ratings"],
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
    related: ["diffusion-guide", "flowsat", "povrl"],
  },
  {
    id: "diffusion-guide",
    kind: "feature",
    title: "Diffusion Models, Explained",
    sub: "Removing noise to make an image",
    year: "2026",
    rating: "Interactive",
    match: 97,
    duration: "8 chapters · written & built solo",
    tags: ["Writing", "Interactive Visualisation", "Diffusion", "Teaching"],
    art: "assets/art/diffusion_card.jpg",
    backdrop: "assets/art/hero_flowsat.jpg",
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
    related: ["flowsat", "yourtts", "povrl"],
  },
  {
    id: "thesis",
    kind: "continue",
    title: "Controllable Foundation Models for Earth Observation",
    sub: "Master's thesis · Sustainability Lab",
    year: "2026 —",
    rating: "In production",
    match: 99,
    progress: 45,
    duration: "Jan 2026 – present",
    tags: ["Research", "Generative Models", "Remote Sensing", "Causality"],
    art: "assets/art/fs_10.jpg",
    backdrop: "assets/art/hero_mixed.jpg",
    logline:
      "If a generative model claims to be conditioned on the world, make it prove the world moved " +
      "when you asked it to.",
    synopsis:
      "Ongoing thesis work with " + PROFILE.advisor + " at the " + PROFILE.lab + ": controllable, " +
      "metadata-conditioned generative models for Earth observation, a controllability benchmark " +
      "that quantifies per-field causal effects, and extensions of the flow-matching transformer " +
      "into image-to-image — temporal inpainting, temporal generation, GSD-controlled " +
      "super-resolution and change-guided generation.",
    stats: [
      ["Controllability", "per-field causal effects, measured"],
      ["Image-to-image", "temporal, super-resolution, change-guided"],
      ["In progress", "thesis in writing"],
    ],
    episodes: [
      ["A benchmark for control", "Turn a metadata dial and measure what actually changed — per field, causally."],
      ["Temporal inpainting", "Fill a gap in a time series of one place instead of hallucinating a new one."],
      ["GSD-controlled super-resolution", "Resolution as a conditioning field rather than a fixed training choice."],
      ["Change-guided generation", "Generate the after, given the before and the change you asked for."],
    ],
    links: [["Lab", "https://sustainability-lab.github.io/", "play"]],
    related: ["flowsat", "povrl", "diffusion-guide"],
  },
  {
    id: "zelite",
    kind: "behind",
    title: "LLM Research Agent",
    sub: "Software engineering intern · Zelite Solutions",
    year: "2025",
    rating: "Shipped",
    match: 92,
    duration: "May – June 2025",
    tags: ["LLM Agents", "Retrieval", "Structured Extraction", "Benchmarking"],
    art: "assets/art/flowsat_gallery_09.jpg",
    backdrop: "assets/art/flowsat_compare_a.jpg",
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
    related: ["thesis", "diffusion-guide"],
  },
];

const SKILLS = [
  ["PyTorch", "Diffusers · Accelerate · W&B"],
  ["Diffusion & flow matching", "DiT, AdaLN, samplers"],
  ["Remote sensing", "Sentinel-2, fMoW, xView, rasterio"],
  ["Reinforcement learning", "REINFORCE, policy gradients"],
  ["LLM agents", "retrieval, schema-driven extraction"],
  ["Speech synthesis", "VITS, YourTTS, speaker encoders"],
  ["Computer vision", "detection, super-resolution"],
  ["Python · C++ · MATLAB", "and Verilog, when provoked"],
  ["Data science", "XGBoost, scikit-learn, pandas"],
  ["Explaining things", "guides, reports, visualisations"],
];

const FACTS = [
  ["Dual degree", "M.Tech Computer Science + B.Tech Electrical Engineering, IIT Gandhinagar (2022–2027)"],
  ["Dean's List", "Awarded in semesters 1 and 2 for academic performance"],
  ["Student Guide", "Selected to mentor incoming first-years, coordinating with 40 guides"],
  ["Inter-IIT cricket", "Represented IIT Gandhinagar; quarter-finalists in the 56th and 57th editions"],
];

/* Each profile is a different edit of the same material. */
const TRACKS = {
  recruiter: {
    label: "Recruiter",
    hero: "flowsat",
    pitch:
      "Published first-author work at BMVC 2026, a shipped LLM automation platform, and three " +
      "projects you can open and poke at right now.",
    rows: ["featured", "publications", "generative", "skills", "continue", "behind"],
  },
  researcher: {
    label: "Researcher",
    hero: "flowsat",
    pitch:
      "Generative models for Earth observation, a reproduction that reports its own negative " +
      "result, and a diffusion guide written to be argued with.",
    rows: ["publications", "featured", "continue", "generative", "skills", "behind"],
  },
  engineer: {
    label: "Engineer",
    hero: "povrl",
    pitch:
      "Everything here runs: static sites with no build step, reproducible runs, and code you can " +
      "read without a setup guide.",
    rows: ["featured", "generative", "skills", "publications", "continue", "behind"],
  },
  browsing: {
    label: "Just browsing",
    hero: "diffusion-guide",
    pitch:
      "Start with the diffusion guide — it is the one that explains the rest, and it has things " +
      "to drag.",
    rows: ["generative", "featured", "publications", "continue", "skills", "behind"],
  },
};

const ROWS = {
  featured:     { label: "Digvijay originals",        ids: ["flowsat", "povrl", "yourtts", "diffusion-guide", "thesis"] },
  publications: { label: "Published & peer-reviewed", ids: ["flowsat", "povrl", "thesis"] },
  generative:   { label: "Generative models",         ids: ["flowsat", "diffusion-guide", "yourtts", "thesis"] },
  continue:     { label: "Continue watching",         ids: ["thesis", "flowsat"] },
  behind:       { label: "Behind the scenes",         ids: ["zelite", "yourtts", "povrl"] },
  skills:       { label: "Top 10 skills today",       kind: "skills" },
};
