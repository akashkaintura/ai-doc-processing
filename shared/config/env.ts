import { z } from 'zod';

export const EnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']),
    OPENAI_API_KEY: z.string().min(32),
    DATABASE_URL: z.string().url(),
    WASM_MEMORY: z.number().default(256)
});

export type Env = z.infer<typeof EnvSchema>;