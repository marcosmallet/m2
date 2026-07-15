const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const brandDir = path.join(root, "assets", "brand");
const imagesDir = path.join(root, "assets", "images");
const sourceLogo = path.join(brandDir, "logo-mark-header.png");

const colors = {
  navy950: "#020617",
  navy900: "#071629",
  navy800: "#0B1D36",
  slate50: "#F8FAFC",
  slate200: "#E2E8F0",
  cyan400: "#22D3EE",
  sky500: "#0EA5E9",
  blue600: "#2563EB",
  violet600: "#7C3AED",
  orange500: "#F97316",
};

const gradientStops = `
  <stop stop-color="${colors.cyan400}"/>
  <stop offset="0.46" stop-color="${colors.sky500}"/>
  <stop offset="0.78" stop-color="${colors.violet600}"/>
  <stop offset="1" stop-color="${colors.orange500}"/>
`;

function dataUri(buffer, mime = "image/png") {
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

async function logoBuffer({ lightMark = false, width, height }) {
  let image = sharp(sourceLogo).ensureAlpha();

  if (lightMark) {
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

    for (let index = 0; index < data.length; index += info.channels) {
      const alpha = data[index + 3];
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];

      if (alpha > 0 && red < 42 && green < 62 && blue < 82) {
        data[index] = 248;
        data[index + 1] = 250;
        data[index + 2] = 252;
      }
    }

    image = sharp(data, { raw: info });
  }

  if (!width || !height) {
    return image.png().toBuffer();
  }

  return image.resize(width, height, { fit: "contain" }).png().toBuffer();
}

async function svgFile(name, svg) {
  await fs.writeFile(path.join(brandDir, name), `${svg.trim()}\n`, "utf8");
}

async function pngFile(filePath, buffer) {
  await fs.writeFile(filePath, buffer);
}

async function createTransparentSquare(originalLogoUri) {
  const svg = `
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
      <title id="title">M2 Solucoes com IA</title>
      <desc id="desc">Simbolo quadrado da marca M2 Solucoes com IA no novo padrao visual.</desc>
      <image href="${originalLogoUri}" x="72" y="88" width="880" height="815" preserveAspectRatio="xMidYMid meet"/>
    </svg>
  `;

  await svgFile("logo-square.svg", svg);
  await sharp(Buffer.from(svg)).png().toFile(path.join(brandDir, "logo-square.png"));
}

async function createHorizontalLogo(originalLogoUri) {
  const svg = `
    <svg width="400" height="120" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
      <title id="title">M2 Solucoes com IA</title>
      <desc id="desc">Logo horizontal da M2 Solucoes com IA no novo padrao visual.</desc>
      <defs>
        <linearGradient id="ia" x1="348" y1="69" x2="383" y2="69" gradientUnits="userSpaceOnUse">
          <stop stop-color="${colors.cyan400}"/>
          <stop offset="1" stop-color="${colors.violet600}"/>
        </linearGradient>
      </defs>
      <image href="${originalLogoUri}" x="18" y="15" width="96" height="89" preserveAspectRatio="xMidYMid meet"/>
      <text x="128" y="70" fill="${colors.navy900}" font-family="Poppins, Open Sans, Arial, sans-serif" font-size="22" font-weight="800" letter-spacing="2.4" textLength="202" lengthAdjust="spacingAndGlyphs">SOLU&#199;&#213;ES COM</text>
      <text x="346" y="70" fill="url(#ia)" font-family="Poppins, Open Sans, Arial, sans-serif" font-size="22" font-weight="800" letter-spacing="2.4">IA</text>
    </svg>
  `;

  await svgFile("logo-horizontal.svg", svg);
  await sharp(Buffer.from(svg)).png().toFile(path.join(brandDir, "logo-horizontal.png"));
}

function appIconSvg(lightLogoUri, size = 1024) {
  const scale = size / 1024;
  const logoX = 110 * scale;
  const logoY = 104 * scale;
  const logoW = 804 * scale;
  const logoH = 745 * scale;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
      <title id="title">M2 Solucoes com IA</title>
      <desc id="desc">Icone da marca M2 Solucoes com IA no novo padrao visual.</desc>
      <defs>
        <linearGradient id="bg" x1="${80 * scale}" y1="${72 * scale}" x2="${940 * scale}" y2="${952 * scale}" gradientUnits="userSpaceOnUse">
          <stop stop-color="${colors.navy950}"/>
          <stop offset="0.55" stop-color="${colors.navy900}"/>
          <stop offset="1" stop-color="${colors.navy800}"/>
        </linearGradient>
        <linearGradient id="rim" x1="${78 * scale}" y1="${86 * scale}" x2="${945 * scale}" y2="${930 * scale}" gradientUnits="userSpaceOnUse">
          ${gradientStops}
        </linearGradient>
        <filter id="shadow" x="${70 * scale}" y="${60 * scale}" width="${884 * scale}" height="${884 * scale}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feDropShadow dx="0" dy="${32 * scale}" stdDeviation="${34 * scale}" flood-color="${colors.navy950}" flood-opacity="0.36"/>
        </filter>
      </defs>
      <rect x="${24 * scale}" y="${24 * scale}" width="${976 * scale}" height="${976 * scale}" rx="${216 * scale}" fill="url(#bg)"/>
      <rect x="${42 * scale}" y="${42 * scale}" width="${940 * scale}" height="${940 * scale}" rx="${198 * scale}" stroke="url(#rim)" stroke-width="${22 * scale}" fill="none"/>
      <g filter="url(#shadow)">
        <image href="${lightLogoUri}" x="${logoX}" y="${logoY}" width="${logoW}" height="${logoH}" preserveAspectRatio="xMidYMid meet"/>
      </g>
    </svg>
  `;
}

async function createAppIcons(lightLogoUri) {
  await svgFile("favicon.svg", appIconSvg(lightLogoUri, 1024));

  const favicon32 = await sharp(Buffer.from(appIconSvg(lightLogoUri, 1024))).resize(32, 32).png().toBuffer();
  const favicon96 = await sharp(Buffer.from(appIconSvg(lightLogoUri, 1024))).resize(96, 96).png().toBuffer();
  const appleTouch = await sharp(Buffer.from(appIconSvg(lightLogoUri, 1024))).resize(180, 180).png().toBuffer();

  await pngFile(path.join(brandDir, "favicon.png"), favicon32);
  await pngFile(path.join(brandDir, "favicon-96.png"), favicon96);
  await pngFile(path.join(root, "favicon.png"), favicon96);
  await pngFile(path.join(root, "apple-touch-icon.png"), appleTouch);

  const icoPngs = await Promise.all(
    [16, 32, 48, 96].map((size) =>
      sharp(Buffer.from(appIconSvg(lightLogoUri, 1024))).resize(size, size).png().toBuffer(),
    ),
  );
  await pngFile(path.join(root, "favicon.ico"), createIco(icoPngs, [16, 32, 48, 96]));
}

function createIco(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const headerSize = 6 + count * 16;
  const header = Buffer.alloc(headerSize);

  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  let offset = headerSize;
  pngBuffers.forEach((buffer, index) => {
    const entryOffset = 6 + index * 16;
    const size = sizes[index];

    header[entryOffset] = size === 256 ? 0 : size;
    header[entryOffset + 1] = size === 256 ? 0 : size;
    header[entryOffset + 2] = 0;
    header[entryOffset + 3] = 0;
    header.writeUInt16LE(1, entryOffset + 4);
    header.writeUInt16LE(32, entryOffset + 6);
    header.writeUInt32LE(buffer.length, entryOffset + 8);
    header.writeUInt32LE(offset, entryOffset + 12);

    offset += buffer.length;
  });

  return Buffer.concat([header, ...pngBuffers]);
}

async function createSocialPreview(originalLogoUri) {
  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
      <title id="title">M2 Solucoes com IA</title>
      <desc id="desc">Imagem social da M2 Solucoes com IA com o novo logo.</desc>
      <defs>
        <linearGradient id="bar" x1="500" y1="130" x2="1020" y2="130" gradientUnits="userSpaceOnUse">
          ${gradientStops}
        </linearGradient>
        <radialGradient id="glowA" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1000 108) rotate(120) scale(410 350)">
          <stop stop-color="${colors.cyan400}" stop-opacity="0.2"/>
          <stop offset="1" stop-color="${colors.cyan400}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="glowB" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(970 560) rotate(-120) scale(460 390)">
          <stop stop-color="${colors.violet600}" stop-opacity="0.28"/>
          <stop offset="1" stop-color="${colors.violet600}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="${colors.navy900}"/>
      <rect width="1200" height="630" fill="url(#glowA)"/>
      <rect width="1200" height="630" fill="url(#glowB)"/>
      <g opacity="0.12" stroke="${colors.slate200}">
        ${Array.from({ length: 15 }, (_, index) => `<path d="M${index * 90} 0V630"/>`).join("")}
        ${Array.from({ length: 8 }, (_, index) => `<path d="M0 ${index * 90}H1200"/>`).join("")}
      </g>
      <rect x="74" y="74" width="1052" height="482" rx="26" fill="#061225" fill-opacity="0.76" stroke="#38BDF8" stroke-opacity="0.18"/>
      <rect x="112" y="116" width="298" height="298" rx="34" fill="${colors.slate50}"/>
      <image href="${originalLogoUri}" x="145" y="144" width="232" height="215" preserveAspectRatio="xMidYMid meet"/>
      <rect x="500" y="126" width="520" height="10" rx="5" fill="url(#bar)"/>
      <text x="500" y="230" fill="${colors.slate50}" font-family="Poppins, Open Sans, Arial, sans-serif" font-size="54" font-weight="800">M2 Solu&#231;&#245;es com IA</text>
      <text x="500" y="310" fill="#CBD5E1" font-family="Open Sans, Arial, sans-serif" font-size="34" font-weight="700">Sites, bots e automa&#231;&#245;es</text>
      <text x="500" y="362" fill="#CBD5E1" font-family="Open Sans, Arial, sans-serif" font-size="34" font-weight="700">para neg&#243;cios</text>
      <text x="500" y="456" fill="${colors.cyan400}" font-family="Poppins, Open Sans, Arial, sans-serif" font-size="26" font-weight="800" letter-spacing="3">IA PR&#193;TICA PARA VENDER MAIS</text>
    </svg>
  `;

  await sharp(Buffer.from(svg)).png().toFile(path.join(brandDir, "social-preview.png"));
}

async function createReviewPreview(originalLogoUri) {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const x = 505 + index * 70;
    return `<path d="m${x} 402 11.4 23.1 25.5 3.7-18.5 18 4.4 25.4-22.8-12-22.8 12 4.4-25.4-18.5-18 25.5-3.7L${x} 402Z"/>`;
  }).join("");

  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
      <title id="title">Avalie sua experiência com a M2 Soluções com IA</title>
      <desc id="desc">Imagem para compartilhamento da página de avaliação da M2 Soluções com IA.</desc>
      <defs>
        <linearGradient id="bar" x1="500" y1="130" x2="1020" y2="130" gradientUnits="userSpaceOnUse">
          ${gradientStops}
        </linearGradient>
        <radialGradient id="glowA" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1000 108) rotate(120) scale(410 350)">
          <stop stop-color="${colors.cyan400}" stop-opacity="0.2"/>
          <stop offset="1" stop-color="${colors.cyan400}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="glowB" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(970 560) rotate(-120) scale(460 390)">
          <stop stop-color="${colors.violet600}" stop-opacity="0.28"/>
          <stop offset="1" stop-color="${colors.violet600}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="${colors.navy900}"/>
      <rect width="1200" height="630" fill="url(#glowA)"/>
      <rect width="1200" height="630" fill="url(#glowB)"/>
      <g opacity="0.12" stroke="${colors.slate200}">
        ${Array.from({ length: 15 }, (_, index) => `<path d="M${index * 90} 0V630"/>`).join("")}
        ${Array.from({ length: 8 }, (_, index) => `<path d="M0 ${index * 90}H1200"/>`).join("")}
      </g>
      <line x1="420" y1="126" x2="420" y2="516" stroke="#38BDF8" stroke-opacity="0.24" stroke-width="2"/>
      <image href="${originalLogoUri}" x="100" y="155" width="270" height="310" preserveAspectRatio="xMidYMid meet"/>
      <rect x="468" y="126" width="572" height="8" rx="4" fill="url(#bar)"/>
      <text x="468" y="220" fill="${colors.slate50}" font-family="Poppins, Open Sans, Arial, sans-serif" font-size="46" font-weight="800">M2 Solu&#231;&#245;es com IA</text>
      <text x="468" y="310" fill="${colors.slate50}" font-family="Poppins, Open Sans, Arial, sans-serif" font-size="42" font-weight="800">Avalie sua experi&#234;ncia</text>
      <text x="468" y="370" fill="#CBD5E1" font-family="Open Sans, Arial, sans-serif" font-size="24" font-weight="600">Sua opini&#227;o &#233; muito importante para n&#243;s.</text>
      <g fill="${colors.orange500}">${stars}</g>
      <text x="468" y="538" fill="${colors.cyan400}" font-family="Poppins, Open Sans, Arial, sans-serif" font-size="21" font-weight="800" letter-spacing="2.5">OBRIGADO PELA CONFIAN&#199;A</text>
    </svg>
  `;

  await sharp(Buffer.from(svg)).png().toFile(path.join(root, "og-avaliacao-google.png"));
}

async function createWhatsAppIcon(lightLogoUri) {
  const svg = `
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
      <title id="title">M2 Solucoes com IA no WhatsApp</title>
      <desc id="desc">Icone customizado do WhatsApp com o novo logo da M2 Solucoes com IA.</desc>
      <defs>
        <linearGradient id="bg" x1="54" y1="34" x2="468" y2="488" gradientUnits="userSpaceOnUse">
          <stop stop-color="${colors.navy950}"/>
          <stop offset="1" stop-color="${colors.navy800}"/>
        </linearGradient>
        <linearGradient id="bubble" x1="78" y1="96" x2="424" y2="420" gradientUnits="userSpaceOnUse">
          ${gradientStops}
        </linearGradient>
        <filter id="shadow" x="56" y="64" width="400" height="390" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feDropShadow dx="0" dy="24" stdDeviation="24" flood-color="${colors.navy950}" flood-opacity="0.42"/>
        </filter>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#bg)"/>
      <path d="M104 394L126 316C106 282 101 240 115 200C138 132 204 88 276 94C354 100 417 161 424 239C431 321 376 394 296 410C252 419 207 411 171 388L104 394Z" stroke="url(#bubble)" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
      <g filter="url(#shadow)">
        <image href="${lightLogoUri}" x="116" y="132" width="286" height="265" preserveAspectRatio="xMidYMid meet"/>
      </g>
    </svg>
  `;

  await svgFile("whatsapp-icon.svg", svg);
  await sharp(Buffer.from(svg)).png().toFile(path.join(brandDir, "whatsapp-icon.png"));
}

async function updateHero(lightLogoUri) {
  const heroPath = path.join(imagesDir, "hero-ai-automation.png");
  const centralBadge = `
    <svg width="312" height="312" viewBox="0 0 312 312" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rim" x1="18" y1="20" x2="294" y2="292" gradientUnits="userSpaceOnUse">
          ${gradientStops}
        </linearGradient>
      </defs>
      <rect width="312" height="312" fill="#061225"/>
      <g>
        <rect x="6" y="6" width="300" height="300" rx="58" fill="${colors.navy900}"/>
        <rect x="8" y="8" width="296" height="296" rx="56" stroke="url(#rim)" stroke-width="4" fill="none"/>
        <image href="${lightLogoUri}" x="42" y="48" width="228" height="211" preserveAspectRatio="xMidYMid meet"/>
      </g>
    </svg>
  `;
  const miniLogo = `
    <svg width="58" height="48" viewBox="0 0 58 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="58" height="48" fill="#061225"/>
      <rect width="58" height="48" rx="6" fill="${colors.navy900}"/>
      <image href="${lightLogoUri}" x="3" y="3" width="52" height="42" preserveAspectRatio="xMidYMid meet"/>
    </svg>
  `;

  const hero = await sharp(heroPath)
    .composite([
      { input: Buffer.from(centralBadge), left: 690, top: 296 },
      { input: Buffer.from(miniLogo), left: 174, top: 121 },
      { input: Buffer.from(miniLogo), left: 1018, top: 534 },
    ])
    .png()
    .toBuffer();

  await pngFile(heroPath, hero);
}

async function exportAssets() {
  const originalLogo = await logoBuffer({ width: 435, height: 403 });
  const lightLogo = await logoBuffer({ lightMark: true, width: 435, height: 403 });
  const originalLogoUri = dataUri(originalLogo);
  const lightLogoUri = dataUri(lightLogo);

  await createTransparentSquare(originalLogoUri);
  await createHorizontalLogo(originalLogoUri);
  await createAppIcons(lightLogoUri);
  await createSocialPreview(originalLogoUri);
  await createReviewPreview(lightLogoUri);
  await createWhatsAppIcon(lightLogoUri);
  await updateHero(lightLogoUri);
}

exportAssets().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
