import type { APIContext } from 'astro';

// Cloudflare runtime bindings (secrets, KV, D1) do not live in
// `import.meta.env` — that is baked in at build time from .env.
//
// Astro v6 removed `Astro.locals.runtime.env`; the supported way to read a
// Worker's bindings is the `cloudflare:workers` module, which exists only
// inside the Workers runtime. So it is imported dynamically and guarded: in a
// Node process (a plain build, a test) the import fails and we fall back to
// the build-time value, which is what local development uses.
export async function runtimeEnv(): Promise<Record<string, unknown>> {
  try {
    // @ts-expect-error -- resolved by the Workers runtime, not by TypeScript.
    const mod = await import('cloudflare:workers');
    return ((mod as any)?.env ?? {}) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function envValue(
  _context: APIContext | { locals: App.Locals } | undefined,
  name: string,
  buildTimeFallback?: string,
): Promise<string | undefined> {
  const runtime = await runtimeEnv();
  const fromRuntime = runtime[name];
  if (typeof fromRuntime === 'string' && fromRuntime.length > 0) return fromRuntime;
  return buildTimeFallback;
}