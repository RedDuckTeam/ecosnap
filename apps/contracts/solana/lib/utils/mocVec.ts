export function createMockVec(length: number): number[][] {
  const vec: number[][] = [];
  for (let i = 0; i < length; i++) {
    const arr = new Uint8Array(32);
    for (let j = 0; j < 32; j++) {
      arr[j] = Math.floor(Math.random() * 256);
    }
    vec.push(Array.from(arr)); // Преобразуем Uint8Array в number[]
  }
  return vec;
}
