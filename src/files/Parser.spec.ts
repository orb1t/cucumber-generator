import * as path from 'path';
import { Parser } from './Parser';
import { messages } from 'cucumber-messages';

const GherkinDocument = messages.GherkinDocument;

describe('Parser', () => {
  const root = path.join(__dirname, '..', 'fixtures');
  let parser: Parser;
  beforeEach(() => (parser = new Parser(root)));

  it('should parse features', async () => {
    const features = ['Simple', 'auth/Login'];
    await Promise.all(
      features.map(async (feature) => {
        const doc = await parser.parse(feature + '.feature');
        expect(doc).toEqual(expect.arrayContaining([expect.any(GherkinDocument)]));
      })
    );
  });

  it('should get features from simple parse result', async () => {
    const doc = await parser.parse('Simple.feature');
    const feature = Parser.toFeatures(doc);
    expect(feature).toEqual(
      expect.arrayContaining([
        {
          label: 'Simple feature name',
          scenarios: [
            {
              label: '1st scenario name',
              stops: expect.arrayContaining([
                { stop: 'given', label: '1st Given stop' },
                { stop: 'given', label: '2nd Given stop' },
                { stop: 'when', label: 'Condition stop' },
                { stop: 'and', label: 'Conjuncture stop' },
                { stop: 'then', label: 'Result stop' },
              ]),
            },
            {
              label: '2nd scenario name',
              stops: expect.arrayContaining([
                { stop: 'given', label: 'Given stop' },
                { stop: 'when', label: 'Action stop' },
                { stop: 'then', label: 'Final stop' },
              ]),
            },
          ],
        },
      ])
    );
  });
});