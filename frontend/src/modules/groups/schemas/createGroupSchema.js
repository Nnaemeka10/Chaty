// import { z } from "zod";

// export const createGroupSchema = z.object({
//   // Step 1 - Basic Info
//   name: z
//     .string()
//     .min(3, "Group name must be at least 3 characters")
//     .max(50, "Group name must be at most 50 characters")
//     .refine(
//       (val) => val.trim().length > 0,
//       "Group name cannot be empty or just spaces"
//     ),

//   description: z
//     .string()
//     .min(10, "Description must be at least 10 characters")
//     .max(500, "Description must be at most 500 characters")
//     .refine(
//       (val) => val.trim().length > 0,
//       "Description cannot be empty or just spaces"
//     ),

//   privacy: z.enum(["public", "private"]).default("public"),

//   avatar: z.instanceof(File).nullable().optional(),

//   // Step 2 - Rules & Access
//   joinPolicy: z
//     .enum(["instant", "approval"])
//     .default("instant"),

//   allowInviteLink: z.boolean().default(true),
//   onlyAdminsCanAddMembers: z.boolean().default(false),

//   // Step 3 - Advanced Settings
//   messageRetention: z
//     .enum(["30days", "forever"])
//     .default("30days"),

//   maxMembers: z
//     .number()
//     .min(2, "Minimum members must be at least 2")
//     .max(10000, "Maximum members cannot exceed 10000")
//     .default(50),

//   enableGoals: z.boolean().default(false),

//   groupGoal: z
//     .string()
//     .max(200, "Goal description must be at most 200 characters")
//     .optional()
//     .or(z.literal("")),

//   enableScheduling: z.boolean().default(true),
// });

// export const createGroupStepOneSchema = createGroupSchema.pick({
//   name: true,
//   description: true,
//   privacy: true,
//   avatar: true,
// });

// export const createGroupStepTwoSchema = createGroupSchema.pick({
//   joinPolicy: true,
//   allowInviteLink: true,
//   onlyAdminsCanAddMembers: true,
// });

// export const createGroupStepThreeSchema = createGroupSchema.pick({
//   messageRetention: true,
//   maxMembers: true,
//   enableGoals: true,
//   groupGoal: true,
//   enableScheduling: true,
// });


import { z } from "zod";

// Safely reference File only in environments that have it (browser runtime).
// Using z.instanceof(File) directly crashes in SSR / Jest / Node environments.
const FileSchema =
  typeof File !== "undefined"
    ? z.instanceof(File)
    : z.any();

export const createGroupSchema = z.object({
  // ─── Step 1 · Basic Info ──────────────────────────────────────────────────
  name: z
    .string()
    .min(3, "Group name must be at least 3 characters")
    .max(50, "Group name must be at most 50 characters")
    .refine((val) => val.trim().length > 0, "Group name cannot be only spaces"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters")
    .refine((val) => val.trim().length > 0, "Description cannot be only spaces"),

  privacy: z.enum(["public", "private"]).default("public"),

  avatar: FileSchema.nullable().optional(),

  // ─── Step 2 · Rules & Access ─────────────────────────────────────────────
  joinPolicy: z.enum(["instant", "approval"]).default("instant"),
  allowInviteLink: z.boolean().default(true),
  onlyAdminsCanAddMembers: z.boolean().default(false),

  // ─── Step 3 · Advanced Settings ──────────────────────────────────────────
  messageRetention: z.enum(["30days", "forever"]).default("30days"),

  maxMembers: z
    .number()
    .min(2, "Minimum members must be at least 2")
    .max(10000, "Maximum members cannot exceed 10,000")
    .default(50),

  enableGoals: z.boolean().default(false),

  groupGoal: z
    .string()
    .max(200, "Goal description must be at most 200 characters")
    .optional()
    .or(z.literal("")),

  enableScheduling: z.boolean().default(true),
});

// Per-step subschemas used by CreateGroupStepper for isolated step validation.
export const createGroupStepOneSchema = createGroupSchema.pick({
  name: true,
  description: true,
  privacy: true,
  avatar: true,
});

export const createGroupStepTwoSchema = createGroupSchema.pick({
  joinPolicy: true,
  allowInviteLink: true,
  onlyAdminsCanAddMembers: true,
});

export const createGroupStepThreeSchema = createGroupSchema.pick({
  messageRetention: true,
  maxMembers: true,
  enableGoals: true,
  groupGoal: true,
  enableScheduling: true,
});

// Field names grouped by step — single source of truth consumed by the stepper.
export const STEP_FIELDS = /** @type {const} */ ([
  ["name", "description", "privacy", "avatar"],           // Step 0
  ["joinPolicy", "allowInviteLink", "onlyAdminsCanAddMembers"], // Step 1
  ["messageRetention", "maxMembers", "enableGoals", "groupGoal", "enableScheduling"], // Step 2
]);