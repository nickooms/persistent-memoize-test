import Gemeenten from '../Gemeenten';

const brusselsGewest = { GewestId: 1 };

describe('Gemeenten', () => {
  it('should find Gemeenten', done => Gemeenten.list(brusselsGewest)
    .then(list => expect(list.length).toBeGreaterThan(10)).then(done));
});
