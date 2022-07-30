import Ajv, { ValidateFunction } from "ajv";
import Err from "./../types/error";

class AJVLib {
  ajv: Ajv;
  compiledSchema: { [key: string]: ValidateFunction };

  constructor() {
    this.ajv = new Ajv();
    this.compiledSchema = {};
  }

  validate<T>(schema: object, data: T): boolean {
    const schemaName = JSON.stringify(schema);
    if (!this.compiledSchema[schemaName]) {
      this.compiledSchema[JSON.stringify(schema)] = this.ajv.compile(schema);
    }
    return this.compiledSchema[schemaName]!(data);
  }
  validateRequest<T>(schema: object, data: T): void {
    const schemaName = JSON.stringify(schema);
    if (!this.validate<T>(schema, data)) {
      const message = this.compiledSchema[schemaName]!.errors?.map((item) => {
        return item.message;
      }).join(", ");
      throw new Err.BadRequestError(message);
    }
  }
}

export default new AJVLib();
