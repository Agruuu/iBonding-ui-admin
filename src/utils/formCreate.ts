/**
 * A utility class encapsulated for https://github.com/xaboy/form-create-designer.
 */

// Encoding Form Conf
export const encodeConf = (designerRef: object) => {
  // @ts-ignore
  return JSON.stringify(designerRef.value.getOption())
}

// Encoding Form Fields
export const encodeFields = (designerRef: object) => {
  // @ts-ignore
  const rule = designerRef.value.getRule()
  const fields: string[] = []
  rule.forEach((item) => {
    fields.push(JSON.stringify(item))
  })
  return fields
}

// Decoding Form Fields
export const decodeFields = (fields: string[]) => {
  const rule: object[] = []
  fields.forEach((item) => {
    rule.push(JSON.parse(item))
  })
  return rule
}

// Set the Conf and Fields of the form, which is applicable to the FcDesigner scenario.
export const setConfAndFields = (designerRef: object, conf: string, fields: string) => {
  // @ts-ignore
  designerRef.value.setOption(JSON.parse(conf))
  // @ts-ignore
  designerRef.value.setRule(decodeFields(fields))
}

// Set the Conf and Fields of the form, which is applicable to the form-create scenario.
export const setConfAndFields2 = (
  detailPreview: object,
  conf: string,
  fields: string[],
  value?: object
) => {
  if (isRef(detailPreview)) {
    // @ts-ignore
    detailPreview = detailPreview.value
  }
  // @ts-ignore
  detailPreview.option = JSON.parse(conf)
  // @ts-ignore
  detailPreview.rule = decodeFields(fields)
  if (value) {
    // @ts-ignore
    detailPreview.value = value
  }
}
