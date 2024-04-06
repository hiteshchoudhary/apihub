import { z } from "zod";

export const editProfileSchema = z
  .object({
    firstName: z.optional(z.string()),
    lastName: z.optional(z.string()),
    bio: z.optional(z.string()),
    dob: z.optional(z.date()),
    countryCode: z.optional(z.string()),
    phoneNumber: z.optional(z.string()),
    location: z.optional(z.string()),
  })
  .superRefine((data, ctx) => {
    if (data.countryCode && !data.phoneNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phone number is required with Country Code",
      });
    } else if (data.phoneNumber && !data.countryCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Country code is required with phone number",
      });
    }
  });

export type EditProfileInterface = z.infer<typeof editProfileSchema>;
