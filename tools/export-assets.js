const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const brandDir = path.join(root, "assets", "brand");

const assets = [
  { input: "logo-horizontal.svg", output: "logo-horizontal.png", width: 400, height: 120 },
  { input: "logo-square.svg", output: "logo-square.png", width: 1024, height: 1024 },
  { input: "favicon.svg", output: "favicon.png", width: 32, height: 32 },
  { input: "whatsapp-icon.svg", output: "whatsapp-icon.png", width: 512, height: 512 },
];

async function exportAssets() {
  await Promise.all(
    assets.map((asset) =>
      sharp(path.join(brandDir, asset.input))
        .resize(asset.width, asset.height, { fit: "contain" })
        .png()
        .toFile(path.join(brandDir, asset.output)),
    ),
  );
}

exportAssets().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
