import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import sharp from "sharp";

// One-time import from the supplied gallery, extracted PowerPoint, and AI edits.
const [galleryDir, mediaDir, editedDir, bookPath, converterPath] = process.argv.slice(2);
if (!converterPath) throw new Error("Provide gallery, PPT media, AI edits, book, and HEIC converter paths.");
const convertHeic = createRequire(import.meta.url)(converterPath);
const output = "public/assets/images/work-gallery";
await fs.mkdir(output, { recursive: true });
const edits = {
  "Building Leadership Presence and Strategic Influence in a High-Growth Telecommunications Environment": "exec-2bfbc21d-c288-4ce2-986c-f17353a75271.png",
  "Harnessing Strategic Storytelling and Persuasive Communication to Inspire and Drive Alignment": "exec-30773490-5279-4bbc-8aee-dffa4d0b2e8f.png",
  "Mastering Executive Gravitas, Strategic Influence, and Boardroom Authority": "exec-7fd5b568-8a2e-40f8-9fa9-1193f48476bf.png",
  "Mastering Non-Verbal Communication and Leadership Presence for Strategic Impact": "exec-7cbe8b85-d9f3-4a43-8850-b68788d13b58.png",
};
const groups = new Map();
const files = (await fs.readdir(galleryDir)).filter(n => /\.(jpe?g|heic)$/i.test(n)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
for (const file of files) {
  const title = path.parse(file).name.replace(/\s+\d+$/, "").trim();
  if (!groups.has(title)) groups.set(title, { id: `work-${String(groups.size + 1).padStart(2,"0")}`, title, images: [] });
  const group = groups.get(title);
  const name = `${group.id}-${group.images.length + 1}${edits[title] ? "-neutral" : ""}`;
  let input = await fs.readFile(edits[title] ? path.join(editedDir, edits[title]) : path.join(galleryDir, file));
  if (/\.heic$/i.test(file)) input = Buffer.from(await convertHeic({buffer:input,format:"JPEG",quality:0.95}));
  const full = await sharp(input).rotate().resize({width:1800,height:1800,fit:"inside",withoutEnlargement:true}).webp({quality:88}).toFile(`${output}/${name}.webp`);
  await sharp(input).rotate().resize({width:720,height:720,fit:"inside",withoutEnlargement:true}).webp({quality:82}).toFile(`${output}/${name}-thumb.webp`);
  group.images.push({src:`/assets/images/work-gallery/${name}.webp`,thumbnail:`/assets/images/work-gallery/${name}-thumb.webp`,width:full.width,height:full.height});
}
await fs.writeFile("src/data/workGallery.ts", `// Labels and groupings follow the supplied photo filenames.\nexport const workGallery = ${JSON.stringify([...groups.values()],null,2)};\n`);
await sharp(bookPath).rotate().resize({width:1080,withoutEnlargement:true}).webp({quality:90}).toFile("public/assets/images/your-turn-to-rise.webp");
const logos = [
  ["Pepe Jeans","image1.jpeg"],["Landmark Group","image2.jpeg"],["Estée Lauder","image3.png"],["Reliance Retail","image4.jpeg"],["Restaurant Brands Asia","image5.png"],
  ["SUGAR Cosmetics","image6.png"],["Wockhardt","image7.jpeg"],["Kaya Clinic","image8.png"],["Zydus","image9.png"],["Glenmark","image10.png"],
  ["Dr. Reddy’s","image11.png"],["IndoSpace","image12.png"],["Pipeline Infrastructure Limited","image13.png"],["Kalpataru Projects International","image14.png"],["Tata Power","image15.png"],
  ["Inorbit","image16.png"],["K Raheja Corp","image17.png"],["JSW","image18.jpeg"],["Mumbai Port Authority","image19.jpeg"],["RPG","image20.png"],
  ["Welspun","image21.png"],["Vi","image22.svg"],["BankDhofar","image23.png"],["CFA Institute","image24.svg"],["OakNorth","image25.png"],
];
await fs.mkdir("public/assets/images/logos/clients",{recursive:true});
const manifest=[];
for (const [name,file] of logos) {
  const slug=name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-$/,"" );
  const filename=slug+(/\.svg$/.test(file)?".svg":".webp");
  const dest=`public/assets/images/logos/clients/${filename}`;
  if(file.endsWith(".svg")) await fs.copyFile(path.join(mediaDir,file),dest);
  else await sharp(path.join(mediaDir,file)).flatten({background:"#ffffff"}).trim({background:"#ffffff",threshold:12}).resize({width:500,height:240,fit:"inside",withoutEnlargement:true}).webp({quality:95}).toFile(dest);
  manifest.push({name,src:`/assets/images/logos/clients/${filename}`});
}
await fs.writeFile("src/data/clientLogos.ts",`// Exact client set from Updated Client slide.pptx.\nexport const clientLogos = ${JSON.stringify(manifest,null,2)} as const;\n`);
console.log(`Imported ${files.length} photos in ${groups.size} groups, ${logos.length} client logos, and the book photograph.`);
