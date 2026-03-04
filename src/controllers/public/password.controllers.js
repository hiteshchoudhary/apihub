import { randomBytes } from "crypto";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const generatePassword = asyncHandler(async (req, res) => {
  const length = +(req.query.length || 16);
  const includeUppercase = req.query.includeUppercase === "true";
  const includeLowercase = req.query.includeLowercase !== "false";
  const includeNumbers = req.query.includeNumbers !== "false";
  const includeSymbols = req.query.includeSymbols !== "false";

  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let charset = "";
  if (includeLowercase) charset += lowercaseChars;
  if (includeUppercase) charset += uppercaseChars;
  if (includeNumbers) charset += numberChars;
  if (includeSymbols) charset += symbolChars;

  if (!charset) {
    charset = lowercaseChars;
  }

  const password = randomBytes(length)
    .toString("base64")
    .slice(0, length)
    .split("")
    .map((char) => {
      const charsetIndex = charset.indexOf(char);
      return charsetIndex !== -1
        ? char
        : charset[charsetIndex % charset.length];
    })
    .join("");

  const finalPassword = password
    .split("")
    .map((char) => {
      if (includeUppercase && Math.random() > 0.5) {
        return char.toUpperCase();
      }
      return char;
    })
    .join("")
    .slice(0, length);

  const charsetArr = charset.split("");
  let securedPassword = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetArr.length);
    securedPassword += charsetArr[randomIndex];
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        password: securedPassword,
        length: length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
      },
      "Password generated successfully"
    )
  );
});

export { generatePassword };
