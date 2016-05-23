import Gewesten from '../Gewesten';

describe('Gewesten', () => {
  it('should find 3 Gewesten', done => Gewesten.list()
    .then(list => [...new Set(list.map(gewest => gewest.id))])
    .then(list => expect(list.length).toEqual(3)).then(done));
});
