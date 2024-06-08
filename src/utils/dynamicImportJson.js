// dynamic function to handle assert keyword with different versions of node
export async function importJson(filePath) {
  if (typeof process !== "undefined" && process.version) {
    const [majorVersion] = process.version.replace("v", "").split(".");
    if (+majorVersion >= 17) {
      // Dynamic import for newer Node.js versions
      return (await import(filePath, { assert: { type: "json" } })).default;
    }
  }
  // Use require for older Node.js versions
  return require(filePath);
}
