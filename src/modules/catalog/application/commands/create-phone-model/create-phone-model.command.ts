/**
 * Command — a plain data holder describing intent.
 *
 * WHY: The HTTP layer turns a request body into a command. The handler
 * executes the command. Nothing in the command knows about HTTP.
 */
export class CreatePhoneModelCommand {
  constructor(
    public readonly organizationId: string,
    public readonly brand: string,
    public readonly modelName: string,
    public readonly storage: string | null,
    public readonly color: string | null,
    public readonly sku: string,
    public readonly basePrice: number,
    public readonly currency: string,
  ) {}
}