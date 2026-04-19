import Ajv from "ajv";
import addFormats from "ajv-formats";
import schema from "./recipe-schema.json";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

export function validateImportPayload(payload: unknown): { ok: true; data: any } | { ok: false; errors: string[] } {
  const ok = validate(payload);
  if (!ok) {
    return {
      ok: false,
      errors: (validate.errors ?? []).map((e) => `${e.instancePath || "payload"} ${e.message}`)
    };
  }
  return { ok: true, data: payload as any };
}
