import { Context } from "hono"
import { z, ZodError, ZodSchema } from "zod"

import type { ValidationTargets } from 'hono'
import { zValidator as zv } from '@hono/zod-validator'
import { AppError } from "../errors"






export const customZodValidator = <T extends ZodSchema, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T
) =>
  zv(target, schema, (result, c) => {
    if (!result.success) {
      throw  result.error
    }
  })