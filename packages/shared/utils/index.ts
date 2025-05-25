import { z } from "zod";

export * from "./date"



// Types for the result object with discriminated union
type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

// Main wrapper function
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}


export const validateMultipleSchemas = <T extends z.ZodSchema>({
  map,
  key,
  data
}: {
  map: Record<any, T>,
  key: any,
  data: any
}) => {
  const schema = map[key]

  if (!schema) {
    throw new Error(`No schema found for key: ${key}`)
  }

  const result = schema.safeParse(data)

  if (!result.success) {
    throw new Error(result.error.message)
  }
  return result.data as z.infer<T>
}