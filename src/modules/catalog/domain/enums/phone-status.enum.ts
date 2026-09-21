/**
 * PhoneStatus — the lifecycle state of a physical phone unit.
 *
 * WHY: Kept separate from Prisma's enum so the domain doesn't import
 * generated code. The infrastructure layer maps between the two.
 */
export enum PhoneStatus {
  InStock = 'IN_STOCK',
  Sold = 'SOLD',
  Reserved = 'RESERVED',
  Defective = 'DEFECTIVE',
}

export enum PhoneCondition {
  New = 'NEW',
  Used = 'USED',
  Refurbished = 'REFURBISHED',
}