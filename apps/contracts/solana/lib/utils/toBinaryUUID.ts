export function toBinaryUUID(uuid: string): Buffer {
  const buf = Buffer.from(uuid.replace(/-/g, ""), "hex");
  return Buffer.concat([
    buf.slice(6, 8),
    buf.slice(4, 6),
    buf.slice(0, 4),
    buf.slice(8, 16),
  ]);
}
