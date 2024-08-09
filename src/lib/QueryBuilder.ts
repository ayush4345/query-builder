import { Rule, RuleGroup } from "@/models/rules.model";


export class QueryBuilder {
  private ruleGroup: RuleGroup;

  constructor() {
    this.ruleGroup = {
      children: [],
      conjunction: 'AND',
      not: false,
      type: 'rule_group'
    };
  }

  addRule(rule: Rule): this {
    this.ruleGroup.children.push(rule);
    return this;
  }

  addRuleGroup(ruleGroup: RuleGroup): this {
    this.ruleGroup.children.push(ruleGroup);
    return this;
  }

  setConjunction(conjunction: 'AND' | 'OR'): this {
    this.ruleGroup.conjunction = conjunction;
    return this;
  }

  setNot(not: boolean): this {
    this.ruleGroup.not = not;
    return this;
  }

  getRuleGroupObject(): RuleGroup {
    return this.ruleGroup;
  }

  getRuleGroupString(): string {
    const { children, conjunction, not } = this.ruleGroup;

    if (!children.length) return '';

    const childStrings = children.map(child => {
      if (child.type === 'rule_group') {
        const qb = new QueryBuilder();
        child.children.map((data) => {
          qb.addRule(data as Rule);
        })
        return `(${qb.getRuleGroupString()})`;
      } else {
        const { field, condition, value } = child as Rule;
        const valueStr = value ? value.join(', ') : '';
        return `${field} ${condition} ${valueStr}`;
      }
    });

    const result = childStrings.join(` ${conjunction} `);
    return not ? `NOT (${result})` : result;
  }
}
