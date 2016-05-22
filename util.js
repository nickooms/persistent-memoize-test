const returning = f => x => (f(x) && undefined) || x;

export { returning };
