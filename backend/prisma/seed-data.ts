// Pure data constants for prisma/seed.ts. No DB calls here.

import { ORDER_STATUSES, USER_ROLES } from '../src/domain/constants.js';

// Fixed timestamp applied to all seeded rows (createdAt/updatedAt) so that
// re-running the seed produces byte-identical data. The historical order has
// its own fixed date below.
export const SEED_TIMESTAMP = '2026-06-01T09:00:00Z';

export interface CategoryData {
  name: string;
  slug: string;
}

export const categories: CategoryData[] = [
  { name: 'CPUs', slug: 'cpus' },
  { name: 'Graphics Cards', slug: 'graphics-cards' },
  { name: 'Motherboards', slug: 'motherboards' },
  { name: 'RAM', slug: 'ram' },
  { name: 'SSDs', slug: 'ssds' },
  { name: 'Hard Drives', slug: 'hard-drives' },
  { name: 'PC Cases', slug: 'pc-cases' },
  { name: 'Power Supplies', slug: 'power-supplies' },
  { name: 'CPU Coolers', slug: 'cpu-coolers' },
  { name: 'Case Fans', slug: 'case-fans' },
  { name: 'Monitors', slug: 'monitors' },
  { name: 'Keyboards', slug: 'keyboards' },
  { name: 'Mice', slug: 'mice' },
  { name: 'Headsets', slug: 'headsets' },
];

export interface ProductData {
  name: string;
  slug: string;
  description: string;
  pricePence: number;
  stock: number;
  isActive: boolean;
  imageUrl: string;
  categorySlug: string;
}

// Flagged for later tests: exactly one out-of-stock (but active) product,
// and exactly one inactive (discontinued) product.
export const OUT_OF_STOCK_PRODUCT_SLUG = 'wd-red-plus-6tb-nas-hdd';
export const INACTIVE_PRODUCT_SLUG = 'cooler-master-hyper-212-black-edition';

export const products: ProductData[] = [
  // CPUs
  {
    name: 'AMD Ryzen 9 9950X',
    slug: 'amd-ryzen-9-9950x',
    description: '16-core, 32-thread flagship desktop CPU for gaming and heavy multitasking.',
    pricePence: 54999,
    stock: 18,
    isActive: true,
    imageUrl: '/images/products/amd-ryzen-9-9950x.jpg',
    categorySlug: 'cpus',
  },
  {
    name: 'Intel Core i9-14900K',
    slug: 'intel-core-i9-14900k',
    description:
      'Intel flagship 24-core CPU with high boost clocks for gaming and content creation.',
    pricePence: 56999,
    stock: 15,
    isActive: true,
    imageUrl: '/images/products/intel-core-i9-14900k.jpg',
    categorySlug: 'cpus',
  },
  {
    name: 'AMD Ryzen 7 9700X',
    slug: 'amd-ryzen-7-9700x',
    description: '8-core, 16-thread CPU offering strong gaming performance at a mid-range price.',
    pricePence: 32999,
    stock: 27,
    isActive: true,
    imageUrl: '/images/products/amd-ryzen-7-9700x.jpg',
    categorySlug: 'cpus',
  },
  {
    name: 'Intel Core i5-14600K',
    slug: 'intel-core-i5-14600k',
    description: 'Popular mid-range CPU with 14 cores, great for gaming builds.',
    pricePence: 26999,
    stock: 33,
    isActive: true,
    imageUrl: '/images/products/intel-core-i5-14600k.jpg',
    categorySlug: 'cpus',
  },
  {
    name: 'AMD Ryzen 5 7600',
    slug: 'amd-ryzen-5-7600',
    description: 'Affordable 6-core CPU that punches above its price point for gaming.',
    pricePence: 17999,
    stock: 40,
    isActive: true,
    imageUrl: '/images/products/amd-ryzen-5-7600.jpg',
    categorySlug: 'cpus',
  },
  {
    name: 'Intel Core i3-14100',
    slug: 'intel-core-i3-14100',
    description: 'Budget quad-core CPU suitable for entry-level office and gaming PCs.',
    pricePence: 10999,
    stock: 50,
    isActive: true,
    imageUrl: '/images/products/intel-core-i3-14100.jpg',
    categorySlug: 'cpus',
  },

  // Graphics Cards
  {
    name: 'NVIDIA GeForce RTX 4090',
    slug: 'nvidia-geforce-rtx-4090',
    description: 'The fastest consumer GPU available, built for 4K gaming and creative workloads.',
    pricePence: 159999,
    stock: 8,
    isActive: true,
    imageUrl: '/images/products/nvidia-geforce-rtx-4090.jpg',
    categorySlug: 'graphics-cards',
  },
  {
    name: 'NVIDIA GeForce RTX 4080 Super',
    slug: 'nvidia-geforce-rtx-4080-super',
    description: 'High-end GPU delivering smooth 4K gaming with ray tracing.',
    pricePence: 99999,
    stock: 12,
    isActive: true,
    imageUrl: '/images/products/nvidia-geforce-rtx-4080-super.jpg',
    categorySlug: 'graphics-cards',
  },
  {
    name: 'AMD Radeon RX 7900 XTX',
    slug: 'amd-radeon-rx-7900-xtx',
    description: "AMD's flagship GPU with 24GB VRAM, excellent for 4K gaming.",
    pricePence: 89999,
    stock: 10,
    isActive: true,
    imageUrl: '/images/products/amd-radeon-rx-7900-xtx.jpg',
    categorySlug: 'graphics-cards',
  },
  {
    name: 'NVIDIA GeForce RTX 4070',
    slug: 'nvidia-geforce-rtx-4070',
    description: 'Well-balanced GPU for 1440p gaming with DLSS support.',
    pricePence: 54999,
    stock: 22,
    isActive: true,
    imageUrl: '/images/products/nvidia-geforce-rtx-4070.jpg',
    categorySlug: 'graphics-cards',
  },
  {
    name: 'AMD Radeon RX 7600',
    slug: 'amd-radeon-rx-7600',
    description: 'Solid 1080p gaming GPU at an accessible price.',
    pricePence: 26999,
    stock: 30,
    isActive: true,
    imageUrl: '/images/products/amd-radeon-rx-7600.jpg',
    categorySlug: 'graphics-cards',
  },
  {
    name: 'NVIDIA GeForce RTX 4060',
    slug: 'nvidia-geforce-rtx-4060',
    description: 'Efficient entry-level ray tracing GPU for 1080p gaming.',
    pricePence: 29999,
    stock: 28,
    isActive: true,
    imageUrl: '/images/products/nvidia-geforce-rtx-4060.jpg',
    categorySlug: 'graphics-cards',
  },

  // Motherboards
  {
    name: 'ASUS ROG Strix X670E-E Gaming WiFi',
    slug: 'asus-rog-strix-x670e-e-gaming-wifi',
    description: 'Premium AM5 motherboard with PCIe 5.0 and built-in WiFi 6E.',
    pricePence: 44999,
    stock: 12,
    isActive: true,
    imageUrl: '/images/products/asus-rog-strix-x670e-e-gaming-wifi.jpg',
    categorySlug: 'motherboards',
  },
  {
    name: 'MSI MPG B650 Carbon WiFi',
    slug: 'msi-mpg-b650-carbon-wifi',
    description: 'Mid-range AM5 board with strong VRMs and WiFi 6E.',
    pricePence: 25999,
    stock: 20,
    isActive: true,
    imageUrl: '/images/products/msi-mpg-b650-carbon-wifi.jpg',
    categorySlug: 'motherboards',
  },
  {
    name: 'Gigabyte Z790 Aorus Elite AX',
    slug: 'gigabyte-z790-aorus-elite-ax',
    description: 'Reliable Intel LGA1700 board with good overclocking headroom.',
    pricePence: 22999,
    stock: 18,
    isActive: true,
    imageUrl: '/images/products/gigabyte-z790-aorus-elite-ax.jpg',
    categorySlug: 'motherboards',
  },
  {
    name: 'ASRock B760M Pro RS',
    slug: 'asrock-b760m-pro-rs',
    description: 'Budget-friendly micro-ATX board for Intel 12th/13th/14th gen CPUs.',
    pricePence: 10999,
    stock: 25,
    isActive: true,
    imageUrl: '/images/products/asrock-b760m-pro-rs.jpg',
    categorySlug: 'motherboards',
  },
  {
    name: 'ASUS TUF Gaming A620M-Plus',
    slug: 'asus-tuf-gaming-a620m-plus',
    description: 'Affordable AM5 micro-ATX motherboard for budget Ryzen builds.',
    pricePence: 11999,
    stock: 24,
    isActive: true,
    imageUrl: '/images/products/asus-tuf-gaming-a620m-plus.jpg',
    categorySlug: 'motherboards',
  },

  // RAM
  {
    name: 'Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz',
    slug: 'corsair-vengeance-ddr5-32gb-6000mhz',
    description: 'Popular DDR5 kit offering great performance for gaming and productivity.',
    pricePence: 10999,
    stock: 45,
    isActive: true,
    imageUrl: '/images/products/corsair-vengeance-ddr5-32gb-6000mhz.jpg',
    categorySlug: 'ram',
  },
  {
    name: 'G.Skill Trident Z5 RGB 32GB (2x16GB) 6400MHz',
    slug: 'gskill-trident-z5-rgb-32gb-6400mhz',
    description: 'High-speed RGB DDR5 memory kit for enthusiast builds.',
    pricePence: 13999,
    stock: 30,
    isActive: true,
    imageUrl: '/images/products/gskill-trident-z5-rgb-32gb-6400mhz.jpg',
    categorySlug: 'ram',
  },
  {
    name: 'Kingston Fury Beast DDR5 16GB (2x8GB) 5200MHz',
    slug: 'kingston-fury-beast-ddr5-16gb-5200mhz',
    description: 'Reliable entry-level DDR5 kit for budget builds.',
    pricePence: 5999,
    stock: 50,
    isActive: true,
    imageUrl: '/images/products/kingston-fury-beast-ddr5-16gb-5200mhz.jpg',
    categorySlug: 'ram',
  },
  {
    name: 'Corsair Vengeance LPX DDR4 16GB (2x8GB) 3200MHz',
    slug: 'corsair-vengeance-lpx-ddr4-16gb-3200mhz',
    description: 'Long-time favourite DDR4 kit for older platform upgrades.',
    pricePence: 4499,
    stock: 60,
    isActive: true,
    imageUrl: '/images/products/corsair-vengeance-lpx-ddr4-16gb-3200mhz.jpg',
    categorySlug: 'ram',
  },
  {
    name: 'G.Skill Ripjaws S5 DDR5 64GB (2x32GB) 6000MHz',
    slug: 'gskill-ripjaws-s5-ddr5-64gb-6000mhz',
    description: 'High-capacity DDR5 kit for content creators and workstations.',
    pricePence: 22999,
    stock: 14,
    isActive: true,
    imageUrl: '/images/products/gskill-ripjaws-s5-ddr5-64gb-6000mhz.jpg',
    categorySlug: 'ram',
  },

  // SSDs
  {
    name: 'Samsung 990 Pro 2TB NVMe SSD',
    slug: 'samsung-990-pro-2tb-nvme-ssd',
    description: 'Top-tier PCIe 4.0 NVMe SSD with excellent sustained read/write speeds.',
    pricePence: 14999,
    stock: 35,
    isActive: true,
    imageUrl: '/images/products/samsung-990-pro-2tb-nvme-ssd.jpg',
    categorySlug: 'ssds',
  },
  {
    name: 'WD Black SN850X 1TB NVMe SSD',
    slug: 'wd-black-sn850x-1tb-nvme-ssd',
    description: 'Fast gaming-focused NVMe SSD with low latency.',
    pricePence: 8499,
    stock: 42,
    isActive: true,
    imageUrl: '/images/products/wd-black-sn850x-1tb-nvme-ssd.jpg',
    categorySlug: 'ssds',
  },
  {
    name: 'Crucial P3 Plus 2TB NVMe SSD',
    slug: 'crucial-p3-plus-2tb-nvme-ssd',
    description: 'Good value PCIe 4.0 NVMe SSD for everyday use.',
    pricePence: 10999,
    stock: 38,
    isActive: true,
    imageUrl: '/images/products/crucial-p3-plus-2tb-nvme-ssd.jpg',
    categorySlug: 'ssds',
  },
  {
    name: 'Samsung 870 EVO 1TB SATA SSD',
    slug: 'samsung-870-evo-1tb-sata-ssd',
    description: 'Dependable SATA SSD for upgrading older systems.',
    pricePence: 6999,
    stock: 40,
    isActive: true,
    imageUrl: '/images/products/samsung-870-evo-1tb-sata-ssd.jpg',
    categorySlug: 'ssds',
  },
  {
    name: 'Kingston NV2 500GB NVMe SSD',
    slug: 'kingston-nv2-500gb-nvme-ssd',
    description: 'Budget NVMe SSD ideal as a fast boot drive.',
    pricePence: 3499,
    stock: 55,
    isActive: true,
    imageUrl: '/images/products/kingston-nv2-500gb-nvme-ssd.jpg',
    categorySlug: 'ssds',
  },

  // Hard Drives
  {
    name: 'Seagate BarraCuda 4TB HDD',
    slug: 'seagate-barracuda-4tb-hdd',
    description: 'Reliable 3.5" desktop hard drive for bulk storage.',
    pricePence: 7499,
    stock: 30,
    isActive: true,
    imageUrl: '/images/products/seagate-barracuda-4tb-hdd.jpg',
    categorySlug: 'hard-drives',
  },
  {
    name: 'WD Blue 2TB HDD',
    slug: 'wd-blue-2tb-hdd',
    description: 'Everyday desktop hard drive with solid reliability.',
    pricePence: 5499,
    stock: 34,
    isActive: true,
    imageUrl: '/images/products/wd-blue-2tb-hdd.jpg',
    categorySlug: 'hard-drives',
  },
  {
    name: 'Seagate IronWolf 8TB NAS HDD',
    slug: 'seagate-ironwolf-8tb-nas-hdd',
    description: 'NAS-rated drive built for continuous 24/7 operation.',
    pricePence: 16999,
    stock: 16,
    isActive: true,
    imageUrl: '/images/products/seagate-ironwolf-8tb-nas-hdd.jpg',
    categorySlug: 'hard-drives',
  },
  {
    // Deliberately out of stock but still listed (active) so tests can
    // exercise the "out of stock" UI/behaviour.
    name: 'WD Red Plus 6TB NAS HDD',
    slug: OUT_OF_STOCK_PRODUCT_SLUG,
    description: 'NAS-rated drive optimised for reliability in always-on storage servers.',
    pricePence: 13999,
    stock: 0,
    isActive: true,
    imageUrl: '/images/products/wd-red-plus-6tb-nas-hdd.jpg',
    categorySlug: 'hard-drives',
  },

  // PC Cases
  {
    name: 'NZXT H7 Flow',
    slug: 'nzxt-h7-flow',
    description: 'Mid-tower case with high-airflow mesh front panel.',
    pricePence: 10999,
    stock: 20,
    isActive: true,
    imageUrl: '/images/products/nzxt-h7-flow.jpg',
    categorySlug: 'pc-cases',
  },
  {
    name: 'Lian Li O11 Dynamic EVO',
    slug: 'lian-li-o11-dynamic-evo',
    description: 'Popular dual-chamber case with excellent build-quality and cooling options.',
    pricePence: 16999,
    stock: 15,
    isActive: true,
    imageUrl: '/images/products/lian-li-o11-dynamic-evo.jpg',
    categorySlug: 'pc-cases',
  },
  {
    name: 'Fractal Design Meshify 2 Compact',
    slug: 'fractal-design-meshify-2-compact',
    description: 'Compact airflow-focused case with clean cable management.',
    pricePence: 11999,
    stock: 22,
    isActive: true,
    imageUrl: '/images/products/fractal-design-meshify-2-compact.jpg',
    categorySlug: 'pc-cases',
  },
  {
    name: 'Corsair 4000D Airflow',
    slug: 'corsair-4000d-airflow',
    description: 'Best-selling mid-tower case with strong airflow at a low price.',
    pricePence: 9499,
    stock: 28,
    isActive: true,
    imageUrl: '/images/products/corsair-4000d-airflow.jpg',
    categorySlug: 'pc-cases',
  },
  {
    name: 'be quiet! Pure Base 500DX',
    slug: 'be-quiet-pure-base-500dx',
    description: 'Quiet-running case with tempered glass and ARGB fans included.',
    pricePence: 9999,
    stock: 18,
    isActive: true,
    imageUrl: '/images/products/be-quiet-pure-base-500dx.jpg',
    categorySlug: 'pc-cases',
  },

  // Power Supplies
  {
    name: 'Corsair RM850x 850W 80+ Gold',
    slug: 'corsair-rm850x-850w',
    description: 'Fully modular ATX power supply with quiet, reliable operation.',
    pricePence: 12999,
    stock: 25,
    isActive: true,
    imageUrl: '/images/products/corsair-rm850x-850w.jpg',
    categorySlug: 'power-supplies',
  },
  {
    name: 'EVGA SuperNOVA 750 G6 750W 80+ Gold',
    slug: 'evga-supernova-750-g6-750w',
    description: 'Compact fully modular PSU with a 10-year warranty.',
    pricePence: 10999,
    stock: 20,
    isActive: true,
    imageUrl: '/images/products/evga-supernova-750-g6-750w.jpg',
    categorySlug: 'power-supplies',
  },
  {
    name: 'be quiet! Straight Power 12 1000W 80+ Platinum',
    slug: 'be-quiet-straight-power-12-1000w',
    description: 'High-wattage platinum-rated PSU for demanding multi-GPU builds.',
    pricePence: 18999,
    stock: 10,
    isActive: true,
    imageUrl: '/images/products/be-quiet-straight-power-12-1000w.jpg',
    categorySlug: 'power-supplies',
  },
  {
    name: 'Corsair CV650 650W 80+ Bronze',
    slug: 'corsair-cv650-650w',
    description: 'Budget non-modular PSU suitable for entry-level builds.',
    pricePence: 5999,
    stock: 35,
    isActive: true,
    imageUrl: '/images/products/corsair-cv650-650w.jpg',
    categorySlug: 'power-supplies',
  },
  {
    name: 'MSI MAG A850GL 850W 80+ Gold',
    slug: 'msi-mag-a850gl-850w',
    description: 'Solid mid-range fully modular gold-rated PSU.',
    pricePence: 9999,
    stock: 22,
    isActive: true,
    imageUrl: '/images/products/msi-mag-a850gl-850w.jpg',
    categorySlug: 'power-supplies',
  },

  // CPU Coolers
  {
    name: 'Noctua NH-D15 chromax.black',
    slug: 'noctua-nh-d15-chromax-black',
    description: 'Legendary dual-tower air cooler with class-leading quiet performance.',
    pricePence: 10999,
    stock: 20,
    isActive: true,
    imageUrl: '/images/products/noctua-nh-d15-chromax-black.jpg',
    categorySlug: 'cpu-coolers',
  },
  {
    name: 'Corsair iCUE H150i Elite LCD XT 360mm AIO',
    slug: 'corsair-icue-h150i-elite-lcd-xt-360mm',
    description: 'High-end 360mm liquid cooler with a customisable LCD display.',
    pricePence: 24999,
    stock: 12,
    isActive: true,
    imageUrl: '/images/products/corsair-icue-h150i-elite-lcd-xt-360mm.jpg',
    categorySlug: 'cpu-coolers',
  },
  {
    name: 'Arctic Liquid Freezer III 240',
    slug: 'arctic-liquid-freezer-iii-240',
    description: 'Excellent value 240mm AIO cooler with strong thermal performance.',
    pricePence: 9999,
    stock: 25,
    isActive: true,
    imageUrl: '/images/products/arctic-liquid-freezer-iii-240.jpg',
    categorySlug: 'cpu-coolers',
  },
  {
    // Deliberately discontinued/inactive despite remaining stock, so tests
    // can exercise "hidden from storefront" behaviour.
    name: 'Cooler Master Hyper 212 Black Edition',
    slug: INACTIVE_PRODUCT_SLUG,
    description: 'Long-running budget air cooler, a reliable entry point for first builds.',
    pricePence: 3499,
    stock: 8,
    isActive: false,
    imageUrl: '/images/products/cooler-master-hyper-212-black-edition.jpg',
    categorySlug: 'cpu-coolers',
  },
  {
    name: 'NZXT Kraken Elite 280',
    slug: 'nzxt-kraken-elite-280',
    description: '280mm AIO cooler with an integrated LCD screen on the pump.',
    pricePence: 21999,
    stock: 14,
    isActive: true,
    imageUrl: '/images/products/nzxt-kraken-elite-280.jpg',
    categorySlug: 'cpu-coolers',
  },

  // Case Fans
  {
    name: 'Noctua NF-A12x25 120mm PWM',
    slug: 'noctua-nf-a12x25-120mm-pwm',
    description: 'Premium 120mm fan renowned for its airflow-to-noise ratio.',
    pricePence: 2999,
    stock: 60,
    isActive: true,
    imageUrl: '/images/products/noctua-nf-a12x25-120mm-pwm.jpg',
    categorySlug: 'case-fans',
  },
  {
    name: 'Corsair LL120 RGB 120mm Fan (3-Pack)',
    slug: 'corsair-ll120-rgb-120mm-3-pack',
    description: 'RGB fan bundle with a controller hub included.',
    pricePence: 8999,
    stock: 30,
    isActive: true,
    imageUrl: '/images/products/corsair-ll120-rgb-120mm-3-pack.jpg',
    categorySlug: 'case-fans',
  },
  {
    name: 'Arctic P12 PWM PST 120mm (5-Pack)',
    slug: 'arctic-p12-pwm-pst-120mm-5-pack',
    description: 'Affordable pressure-optimised fans, sold as a daisy-chainable 5-pack.',
    pricePence: 3499,
    stock: 40,
    isActive: true,
    imageUrl: '/images/products/arctic-p12-pwm-pst-120mm-5-pack.jpg',
    categorySlug: 'case-fans',
  },
  {
    name: 'be quiet! Silent Wings 4 140mm',
    slug: 'be-quiet-silent-wings-4-140mm',
    description: 'Whisper-quiet 140mm fan built for silent PC builds.',
    pricePence: 2499,
    stock: 45,
    isActive: true,
    imageUrl: '/images/products/be-quiet-silent-wings-4-140mm.jpg',
    categorySlug: 'case-fans',
  },

  // Monitors
  {
    name: 'LG UltraGear 27GR95QE-B',
    slug: 'lg-ultragear-27gr95qe-b',
    description: '27" QHD OLED monitor with a 240Hz refresh rate for competitive gaming.',
    pricePence: 79999,
    stock: 10,
    isActive: true,
    imageUrl: '/images/products/lg-ultragear-27gr95qe-b.jpg',
    categorySlug: 'monitors',
  },
  {
    name: 'Samsung Odyssey G7 32"',
    slug: 'samsung-odyssey-g7-32',
    description: 'Curved 32" QHD gaming monitor with a 240Hz refresh rate.',
    pricePence: 54999,
    stock: 14,
    isActive: true,
    imageUrl: '/images/products/samsung-odyssey-g7-32.jpg',
    categorySlug: 'monitors',
  },
  {
    name: 'Dell S2721DGF 27"',
    slug: 'dell-s2721dgf-27',
    description: 'Well-reviewed 27" QHD 165Hz monitor with accurate colours.',
    pricePence: 32999,
    stock: 18,
    isActive: true,
    imageUrl: '/images/products/dell-s2721dgf-27.jpg',
    categorySlug: 'monitors',
  },
  {
    name: 'ASUS TUF Gaming VG249Q1A 24"',
    slug: 'asus-tuf-gaming-vg249q1a-24',
    description: 'Fast 165Hz 1080p monitor at a budget-friendly price.',
    pricePence: 14999,
    stock: 24,
    isActive: true,
    imageUrl: '/images/products/asus-tuf-gaming-vg249q1a-24.jpg',
    categorySlug: 'monitors',
  },
  {
    name: 'AOC 24G2 24"',
    slug: 'aoc-24g2-24',
    description: 'Popular entry-level 144Hz 1080p monitor.',
    pricePence: 11999,
    stock: 26,
    isActive: true,
    imageUrl: '/images/products/aoc-24g2-24.jpg',
    categorySlug: 'monitors',
  },

  // Keyboards
  {
    name: 'Keychron Q1 Pro Wireless',
    slug: 'keychron-q1-pro-wireless',
    description: 'Premium wireless mechanical keyboard with a gasket-mounted design.',
    pricePence: 16999,
    stock: 20,
    isActive: true,
    imageUrl: '/images/products/keychron-q1-pro-wireless.jpg',
    categorySlug: 'keyboards',
  },
  {
    name: 'Logitech G Pro X Mechanical',
    slug: 'logitech-g-pro-x-mechanical',
    description: 'Tournament-grade tenkeyless mechanical keyboard with swappable switches.',
    pricePence: 12999,
    stock: 24,
    isActive: true,
    imageUrl: '/images/products/logitech-g-pro-x-mechanical.jpg',
    categorySlug: 'keyboards',
  },
  {
    name: 'Razer BlackWidow V4 Pro',
    slug: 'razer-blackwidow-v4-pro',
    description: 'Full-size mechanical gaming keyboard with a command dial and macro keys.',
    pricePence: 22999,
    stock: 15,
    isActive: true,
    imageUrl: '/images/products/razer-blackwidow-v4-pro.jpg',
    categorySlug: 'keyboards',
  },
  {
    name: 'Corsair K70 RGB Pro',
    slug: 'corsair-k70-rgb-pro',
    description: 'Durable full-size mechanical keyboard with per-key RGB lighting.',
    pricePence: 15999,
    stock: 18,
    isActive: true,
    imageUrl: '/images/products/corsair-k70-rgb-pro.jpg',
    categorySlug: 'keyboards',
  },
  {
    name: 'SteelSeries Apex 3',
    slug: 'steelseries-apex-3',
    description: 'Budget-friendly water-resistant membrane gaming keyboard.',
    pricePence: 5499,
    stock: 30,
    isActive: true,
    imageUrl: '/images/products/steelseries-apex-3.jpg',
    categorySlug: 'keyboards',
  },

  // Mice
  {
    name: 'Logitech G Pro X Superlight 2',
    slug: 'logitech-g-pro-x-superlight-2',
    description: 'Ultra-lightweight wireless gaming mouse used by esports professionals.',
    pricePence: 13999,
    stock: 25,
    isActive: true,
    imageUrl: '/images/products/logitech-g-pro-x-superlight-2.jpg',
    categorySlug: 'mice',
  },
  {
    name: 'Razer DeathAdder V3',
    slug: 'razer-deathadder-v3',
    description: 'Ergonomic gaming mouse with a high-precision optical sensor.',
    pricePence: 6999,
    stock: 30,
    isActive: true,
    imageUrl: '/images/products/razer-deathadder-v3.jpg',
    categorySlug: 'mice',
  },
  {
    name: 'SteelSeries Rival 3',
    slug: 'steelseries-rival-3',
    description: 'Affordable and comfortable everyday gaming mouse.',
    pricePence: 2999,
    stock: 40,
    isActive: true,
    imageUrl: '/images/products/steelseries-rival-3.jpg',
    categorySlug: 'mice',
  },
  {
    name: 'Corsair Dark Core RGB Pro SE',
    slug: 'corsair-dark-core-rgb-pro-se',
    description: 'Wireless gaming mouse with Qi wireless charging support.',
    pricePence: 8999,
    stock: 18,
    isActive: true,
    imageUrl: '/images/products/corsair-dark-core-rgb-pro-se.jpg',
    categorySlug: 'mice',
  },
  {
    name: 'Logitech MX Master 3S',
    slug: 'logitech-mx-master-3s',
    description: 'Productivity-focused wireless mouse with a quiet click and precise scroll wheel.',
    pricePence: 9999,
    stock: 22,
    isActive: true,
    imageUrl: '/images/products/logitech-mx-master-3s.jpg',
    categorySlug: 'mice',
  },

  // Headsets
  {
    name: 'SteelSeries Arctis Nova Pro Wireless',
    slug: 'steelseries-arctis-nova-pro-wireless',
    description: 'Flagship wireless gaming headset with active noise cancellation.',
    pricePence: 32999,
    stock: 12,
    isActive: true,
    imageUrl: '/images/products/steelseries-arctis-nova-pro-wireless.jpg',
    categorySlug: 'headsets',
  },
  {
    name: 'HyperX Cloud III',
    slug: 'hyperx-cloud-iii',
    description: 'Comfortable wired gaming headset with clear directional audio.',
    pricePence: 8999,
    stock: 28,
    isActive: true,
    imageUrl: '/images/products/hyperx-cloud-iii.jpg',
    categorySlug: 'headsets',
  },
  {
    name: 'Logitech G435 Lightspeed Wireless',
    slug: 'logitech-g435-lightspeed-wireless',
    description: 'Lightweight wireless headset ideal for long gaming sessions.',
    pricePence: 4999,
    stock: 35,
    isActive: true,
    imageUrl: '/images/products/logitech-g435-lightspeed-wireless.jpg',
    categorySlug: 'headsets',
  },
  {
    name: 'Razer BlackShark V2',
    slug: 'razer-blackshark-v2',
    description: 'Esports-tuned wired headset with a detachable noise-cancelling mic.',
    pricePence: 6999,
    stock: 26,
    isActive: true,
    imageUrl: '/images/products/razer-blackshark-v2.jpg',
    categorySlug: 'headsets',
  },
  {
    name: 'Corsair Virtuoso RGB Wireless XT',
    slug: 'corsair-virtuoso-rgb-wireless-xt',
    description: 'High-fidelity wireless headset with a broadcast-quality microphone.',
    pricePence: 16999,
    stock: 16,
    isActive: true,
    imageUrl: '/images/products/corsair-virtuoso-rgb-wireless-xt.jpg',
    categorySlug: 'headsets',
  },
];

export interface UserData {
  email: string;
  passwordHash: string;
  name: string;
  role: string;
}

// Bcrypt hashes (cost 10) precomputed for the plaintext demo passwords below,
// so re-seeding always produces byte-identical data. Plaintext passwords are
// documented in backend/README.md.
// admin@bytecore.test    -> Admin123!
// customer@bytecore.test -> Customer123!
export const users: UserData[] = [
  {
    email: 'admin@bytecore.test',
    passwordHash: '$2b$10$FJj5fMR7VQZVoMwOeXzMrO.W7YqeGIDbcA28n6Ub.zexd7DebVCve',
    name: 'Admin User',
    role: USER_ROLES.ADMIN,
  },
  {
    email: 'customer@bytecore.test',
    passwordHash: '$2b$10$xVTtYk5uH97JaKfejA8yDe5Idtw3F/HLvse4RGS4TM97NSXwE7mhS',
    name: 'Sam Customer',
    role: USER_ROLES.CUSTOMER,
  },
];

export interface HistoricalOrderItemData {
  productSlug: string;
  productName: string;
  unitPricePence: number;
  quantity: number;
}

export interface HistoricalOrderData {
  orderNumber: string;
  customerEmail: string;
  status: string;
  createdAt: string;
  shippingName: string;
  shippingLine1: string;
  shippingLine2: string | null;
  shippingCity: string;
  shippingPostcode: string;
  items: HistoricalOrderItemData[];
}

// totalPence = 17999 + (10999 * 2) + 14999 = 54996
export const historicalOrder: HistoricalOrderData = {
  orderNumber: 'ORD-1001',
  customerEmail: 'customer@bytecore.test',
  status: ORDER_STATUSES.DELIVERED,
  createdAt: '2026-06-01T10:00:00Z',
  shippingName: 'Sam Customer',
  shippingLine1: '12 Example Street',
  shippingLine2: 'Flat 4',
  shippingCity: 'London',
  shippingPostcode: 'SW1A 1AA',
  items: [
    {
      productSlug: 'amd-ryzen-5-7600',
      productName: 'AMD Ryzen 5 7600',
      unitPricePence: 17999,
      quantity: 1,
    },
    {
      productSlug: 'corsair-vengeance-ddr5-32gb-6000mhz',
      productName: 'Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz',
      unitPricePence: 10999,
      quantity: 2,
    },
    {
      productSlug: 'samsung-990-pro-2tb-nvme-ssd',
      productName: 'Samsung 990 Pro 2TB NVMe SSD',
      unitPricePence: 14999,
      quantity: 1,
    },
  ],
};

export const historicalOrderTotalPence = historicalOrder.items.reduce(
  (sum, item) => sum + item.unitPricePence * item.quantity,
  0,
);
