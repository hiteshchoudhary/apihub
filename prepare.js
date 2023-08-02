import { spawnSync } from "child_process";
import os from "os";
import fs from "fs";

// Function to run commands depending on the OS
const runCommand = (command, args) => {
  const isWindows = os.platform() === "win32";
  const shell = isWindows ? true : false;
  const commandArgs = isWindows ? ["/C", command, ...args] : [...args];

  const result = spawnSync(isWindows ? "cmd" : command, commandArgs, {
    stdio: "inherit",
    shell,
  });

  return result.status;
};

// Function to prepare Husky
const prepareHusky = () => {
  // Run husky install
  const huskyInstallStatus = runCommand("npx", ["husky", "install"]);

  // Check if .husky directory exists, if not, create it
  fs.mkdir(".husky", (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(".husky directory created successfully!");
    }
  });

  // Set permissions for husky on macOS/Linux
  if (os.platform() !== "win32") {
    const setPermissionsStatus = runCommand("chmod", ["-R", "ug+x", ".husky"]);
    if (setPermissionsStatus !== 0) {
      console.error("Setting permissions failed");
      process.exit(1);
    }
  }

  // Exit with appropriate status code based on husky install status
  if (huskyInstallStatus === 0) {
    console.log("Husky preparation executed successfully!");
    process.exit(0);
  } else {
    console.error("Husky installation failed");
    process.exit(1);
  }
};

prepareHusky();
