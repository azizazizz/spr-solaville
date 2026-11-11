export const units = [
  {
    id: "tipe-36",
    nama: "Tipe 36/72",
    luasTanah: 72,
    luasBangunan: 36,
  },
]

export function getUnitById(id) {
  return units.find((unit) => unit.id === id)
}
