import { mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { join } from "path";

import { listEntries, resetEntries } from "@/app/api/v1/_data/entries";

resetEntries();

const seeded = listEntries({ includeDrafts: true, org: "default" });
const outputDir = join(process.cwd(), "data");
const outputFile = join(outputDir, "seeded-entries.json");

mkdirSync(outputDir, { recursive: true });

await writeFile(outputFile, JSON.stringify(seeded, null, 2), "utf8");

console.log(`Seeded ${seeded.length} entries into in-memory store and wrote ${outputFile}`);
