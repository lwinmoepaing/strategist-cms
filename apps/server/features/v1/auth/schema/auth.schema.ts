/**
 * ========================
 * Auth Schema
 * ========================
 * Validation Schema with Zod
 */

import { TypeOf, z } from "zod";

import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

const { object, string } = z;

extendZodWithOpenApi(z);

export const createUserSchema = z
  .object({
    body: object({
      firstName: string({
        required_error: "First name is required",
      }).openapi({ example: "First Name" }),
      lastName: string({
        required_error: "Last name is required",
      }).openapi({ example: "Last Name" }),
      password: string({
        required_error: "Password is required",
      })
        .min(6, "Password must be at least 6 characters")
        .openapi({ example: "Password" }),
      passwordConfirmation: string({
        required_error: "Password Confirmation is required",
      }).openapi({ example: "Confirm" }),
      email: string({
        required_error: "Email is required",
      })
        .email("Not a valid email address")
        .openapi({ example: "Email" }),
    }).refine((data) => data.password === data.passwordConfirmation, {
      message: "Password do not match",
      path: ["passwordConfirmation"],
    }),
  })
  .openapi("CreateUserSchema");

export const verifyUserSchema = z.object({
  query: z.object({
    id: string(),
    verificationCode: string(),
  }),
});

export const forgetPasswordSchema = z.object({
  body: z.object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email address"),
  }),
});

export const resetPasswordSchema = z.object({
  params: object({
    id: string(),
    passwordResetCode: string(),
  }),
  body: object({
    password: string({
      required_error: "Password is required",
    }).min(6, "Password must be at least 6 characters"),
    passwordConfirmation: string({
      required_error: "Password Confirmation is required",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Password do not match",
    path: ["passwordConfirmation"],
  }),
});

export const createUserSessionSchema = z.object({
  body: z.object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email address"),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password must be at least 6 characters"),
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["query"];

export type ForgotPasswordInput = TypeOf<typeof forgetPasswordSchema>["body"];

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;

export type CreateUserSessionInput = TypeOf<
  typeof createUserSessionSchema
>["body"];
