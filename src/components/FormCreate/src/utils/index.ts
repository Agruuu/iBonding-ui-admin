export function makeRequiredRule() {
  return {
    type: 'Required',
    field: 'formCreate$required',
    title: 'Is it Required'
  }
}

export const localeProps = (t, prefix, rules) => {
  return rules.map((rule) => {
    if (rule.field === 'formCreate$required') {
      rule.title = t('props.required') || rule.title
    } else if (rule.field && rule.field !== '_optionType') {
      rule.title = t('components.' + prefix + '.' + rule.field) || rule.title
    }
    return rule
  })
}

/**
 * Parse fields such as field and title of form components (recursively if the component contains sub - components).
 * 
 * @param rule  Generation rules for components https://www.form-create.com/v3/guide/rule
 * @param fields Parsed form component fields
 * @param parentTitle  If it is a sub form，The title of the sub form，Default to empty
 */
export const parseFormFields = (
  rule: Record<string, any>,
  fields: Array<Record<string, any>> = [],
  parentTitle: string = ''
) => {
  const { type, field, $required, title: tempTitle, children } = rule
  if (field && tempTitle) {
    let title = tempTitle
    if (parentTitle) {
      title = `${parentTitle}.${tempTitle}`
    }
    let required = false
    if ($required) {
      required = true
    }
    fields.push({
      field,
      title,
      type,
      required
    })
    // TODO Subform  Need to process sub form fields
    // if (type === 'group' && rule.props?.rule && Array.isArray(rule.props.rule)) {
    //   // Analyze the fields of the sub form
    //   rule.props.rule.forEach((item) => {
    //     parseFields(item, fieldsPermission, title)
    //   })
    // }
  }
  if (children && Array.isArray(children)) {
    children.forEach((rule) => {
      parseFormFields(rule, fields)
    })
  }
}
