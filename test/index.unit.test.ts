import ForerunnerDb from 'forerunnerdb';
import { ForerunnerDbDebugger } from '../src';

interface _ForerunnerDbCollection<T> {
  insert: (data: T | T[]) => {
    deferred: boolean;
    inserted: T[];
    failed: T[];
  };
}

interface _ForerunnerDb {
  collection: <T>(name: string) => _ForerunnerDbCollection<T>;
}

interface TestData {
  hello: string;
}

describe('ForerunnerDbDebugger', () => {
  let fdb;
  let db: _ForerunnerDb;
  let fdbgr: ForerunnerDbDebugger;

  beforeEach(() => {
    fdb = new ForerunnerDb();
    db = fdb.db('test');
    fdbgr = new ForerunnerDbDebugger(db);
  });

  describe('collectionNames', () => {
    it('has no collections to list', () => {
      expect(fdbgr.collectionNames).toStrictEqual([]);
    });
  });

  describe('toJSON', () => {
    it('returns an empty JSON object', () => {
      expect(fdbgr.toJSON()).toStrictEqual({});
    });
  });

  describe('... -> with a collection added', () => {
    let testCollection: _ForerunnerDbCollection<TestData>;

    beforeEach(() => {
      testCollection = db.collection('testCollection');
    });

    describe('collectionNames', () => {
      it('has the test collection in list', () => {
        expect(fdbgr.collectionNames).toStrictEqual(['testCollection']);
      });
    });

    describe('toJSON', () => {
      it('returns a JSON object with an empty array for the test collection', () => {
        const json = fdbgr.toJSON();
        expect(json.testCollection).toBeDefined();
        expect(json.testCollection.length).toBe(0);
      });
    });

    describe('... -> with data added', () => {
      beforeEach(() => {
        const { inserted } = testCollection.insert({ hello: 'world' });
        if (inserted.length != 1) {
          throw new Error(`Something went wrong when inserting the test dataset. Test cannot be continued!`);
        }
      });

      describe('toJSON', () => {
        it('returns a JSON object with a correctly filled data-array for the test collection', () => {
          const json = fdbgr.toJSON();
          expect(json.testCollection).toBeDefined();
          expect(json.testCollection.length).toBe(1);
          expect(json.testCollection[0].hello).toBe('world');
          expect(json.testCollection[0]._id).toBeDefined(); // we wanna keep the id field for debug purposes
        });
      });
    });
  });
});
