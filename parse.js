const Tags = {
  table: ["<table border='1' cellspacing='0'>", '</table>'],
  tr: ['<tr>', '</tr>'],
  td: ['<td>', '</td>'],
  b: ['<b>', '</b>'],
};

const createTag = ([open, close]) => ({ open, close });

const Tag = {
  table: createTag(Tags.table),
  tr: createTag(Tags.tr),
  td: createTag(Tags.td),
  b: createTag(Tags.b),
};

const start = tag => html => html.indexOf(tag.open) + tag.open.length;
const end = tag => html => html.lastIndexOf(tag.close);
const element = tag => html => html.slice(start(tag)(html), end(tag)(html));
const elements = tag => html => element(tag)(html).split(tag.close + tag.open);
const table = html => element(Tag.table)(html);
const tr = html => elements(Tag.tr)(html);
const td = html => elements(Tag.td)(html);
const b = html => element(Tag.b)(html);
const getCols = html => td(tr(table(html))[0]).map(b);
const getRows = html => tr(table(html)).slice(1).map(td);
const parse = html => {
  const names = getCols(html);
  return getRows(html).map(row => {
    const cols = row.map((col, i) => ({ [names[i]]: col }));
    return cols.reduce((col, prev) => Object.assign(col, prev), {});
  });
};

export { parse };
