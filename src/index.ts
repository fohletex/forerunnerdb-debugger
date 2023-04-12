type _ForerunnerCollection<T> = {
  find: (data: T, opts?: { $limit?: number }) => T[];
};
type _ForerunnerDb<T> = { _collection: Record<string, _ForerunnerCollection<T>> };

export class ForerunnerDbDebugger {
  protected _db: _ForerunnerDb<unknown>;

  protected get _collections(): Record<string, _ForerunnerCollection<unknown>> {
    return { ...this._db._collection };
  }

  constructor(db: NonNullable<unknown>) {
    if (typeof db !== 'object') {
      throw new Error(`Cannot create ForerunnerDbDebugger for a database which is a non-object!`);
    }

    const collections = (db as unknown as Partial<_ForerunnerDb<unknown>>)._collection;
    if (typeof collections !== 'object') {
      throw new Error('Cannot create ForerunnerDbDebugger for a database that has no _collection reference!');
    }

    this._db = db as unknown as _ForerunnerDb<unknown>;
  }

  get collectionNames(): string[] {
    return Object.keys(this._collections);
  }

  toJSON(limit?: number): Record<string, Record<string, unknown>[]> {
    const data: Record<string, Record<string, unknown>[]> = {};
    Object.entries(this._collections).forEach(([collectionName, collection]) => {
      data[collectionName] = [];

      const collectionData = collection.find({}, { $limit: limit });
      Object.entries(collectionData).forEach(([index, value]) => {
        if (index.startsWith('$') || index.startsWith('_')) return;
        if (typeof value !== 'object' || value === null) {
          // shouldn't happen
          return;
        }

        data[collectionName][parseInt(index)] = { ...value };
      });
    });

    return data;
  }

  prettyPrint(limit?: number): void {
    let output = '';
    Object.entries(this.toJSON(limit)).forEach(([collectionName, collectionData]) => {
      output += '=====================================================\n';
      output += `= ${collectionName}\n`;
      output += '=====================================================\n';

      Object.entries(collectionData).forEach(([index, value]) => {
        output += `${index} | ${JSON.stringify(value)}\n`;
      });
    });

    console.log(output);
  }
}
