export default class CSS {
  constructor(rules) {
    this.rules = rules;
  }

  toString() {
    const ruleNames = Object.keys(this.rules);
    const rules = ruleNames.map(key => ([key, this.rules[key]]))
    .map(([className, properties]) => {
      const styles = Object.keys(properties)
      .map(key => ([key, properties[key]]))
      .map(([name, value]) => `        ${name}: ${value};`);
      return `      ${className} {
${styles.join('\n')}
      }`;
    });
    return `  <style type="text/css">
  <![CDATA[
${rules.join('\n')}
  ]]>
}
</style>`;
  }
}
