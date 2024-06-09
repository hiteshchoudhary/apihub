export async function importJson(filePath) {
  const nodeVersionString = process.env.NODE_VERSION || process.version;
  const majorNodeVersion = +nodeVersionString.replace("v", "").split(".")[0];

  if (majorNodeVersion >= 17) {
    // Dynamic import for newer Node.js versions
    return (await import(filePath, { assert: { type: "json" } })).default;
  } else if (majorNodeVersion >= 22 || majorNodeVersion < 17) {
    // For older versions, use a workaround to dynamically import JSON
    const fs = await import("fs/promises");
    const path = await import("path");
    const fileUrl = new URL(path.resolve(filePath), import.meta.url);
    const jsonString = await fs.readFile(fileUrl, "utf-8");
    return JSON.parse(jsonString);
  }
}
