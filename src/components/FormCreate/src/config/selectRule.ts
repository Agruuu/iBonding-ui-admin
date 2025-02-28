const selectRule = [
  {
    type: 'select',
    field: 'selectType',
    title: 'Selector Type ',
    value: 'select',
    options: [
      { label: 'Select', value: 'select' },
      { label: 'Radio ', value: 'radio' },
      { label: 'Checkbox ', value: 'checkbox' }
    ],
    // reference resources https://www.form-create.com/v3/guide/control Component linkage，Multiple choice and multiple-choice boxes do not require multiple selection attributes
    control: [
      {
        value: 'select',
        condition: '==',
        method: 'hidden',
        rule: [
          'multiple',
          'clearable',
          'collapseTags',
          'multipleLimit',
          'allowCreate',
          'filterable',
          'noMatchText',
          'remote',
          'remoteMethod',
          'reserveKeyword',
          'defaultFirstOption',
          'automaticDropdown'
        ]
      }
    ]
  },
  {
    type: 'switch',
    field: 'filterable',
    title: 'Filterable'
  },
  { type: 'switch', field: 'multiple', title: 'Multiple Choice or Not' },
  {
    type: 'switch',
    field: 'disabled',
    title: 'Disabled'
  },
  { type: 'switch', field: 'clearable', title: 'Is it possible to clear the options' },
  {
    type: 'switch',
    field: 'collapseTags',
    title: 'Should the selected values be displayed in text format when making multiple selections'
  },
  {
    type: 'inputNumber',
    field: 'multipleLimit',
    title: 'The maximum number of items that users can select when making multiple selections，by 0 There are no restrictions',
    props: { min: 0 }
  },
  {
    type: 'input',
    field: 'autocomplete',
    title: 'Autocomplete Attribute'
  },
  { type: 'input', field: 'placeholder', title: 'Placeholder ' },
  { type: 'switch', field: 'allowCreate', title: 'Allow users to create new entries' },
  {
    type: 'input',
    field: 'noMatchText',
    title: 'The text displayed when there is no match for the search criteria'
  },
  { type: 'input', field: 'noDataText', title: 'Text displayed when the option is empty' },
  {
    type: 'switch',
    field: 'reserveKeyword',
    title: 'When multiple selections are made and searchable，Do you want to keep the current search keywords after selecting an option'
  },
  {
    type: 'switch',
    field: 'defaultFirstOption',
    title: 'Press Enter in the input box，Select the first matching item'
  },
  {
    type: 'switch',
    field: 'popperAppendToBody',
    title: 'Do you want to insert the pop-up box into body element',
    value: true
  },
  {
    type: 'switch',
    field: 'automaticDropdown',
    title: 'For non searchable items select，Does the option menu automatically pop up after the input box gains focus'
  }
]

const apiSelectRule = [
  {
    type: 'input',
    field: 'url',
    title: 'Url',
    props: {
      placeholder: '/system/user/simple-list'
    }
  },
  {
    type: 'select',
    field: 'method',
    title: 'Request Type',
    value: 'GET',
    options: [
      { label: 'GET', value: 'GET' },
      { label: 'POST', value: 'POST' }
    ],
    control: [
      {
        value: 'GET',
        condition: '!=',
        method: 'hidden',
        rule: [
          {
            type: 'input',
            field: 'data',
            title: 'Request parameters JSON format',
            props: {
              autosize: true,
              type: 'textarea',
              placeholder: '{"type": 1}'
            }
          }
        ]
      }
    ]
  },
  {
    type: 'input',
    field: 'labelField',
    title: 'label Attribute',
    info: 'Have access to el expression：${attribute}，To achieve complex data combination。as：${nickname}-${id}',
    props: {
      placeholder: 'nickname'
    }
  },
  {
    type: 'input',
    field: 'valueField',
    title: 'value Attribute',
    info: 'Have access to el expression：${attribute}，To achieve complex data combination。as：${nickname}-${id}',
    props: {
      placeholder: 'id'
    }
  },
  {
    type: 'input',
    field: 'parseFunc',
    title: 'Option Parsing Function',
    info: `data For the interface return value, an anonymous function needs to be written to parse the return value into a selector options list.,
    (data: any)=>{ label: string; value: any }[]`,
    props: {
      autosize: true,
      rows: { minRows: 2, maxRows: 6 },
      type: 'textarea',
      placeholder: `
        function (data) {
            console.log(data)
            return data.list.map(item=> ({label: item.nickname,value: item.id}))
        }`
    }
  },
  {
    type: 'switch',
    field: 'remote',
    info: 'Is it Searchable',
    title: 'Are the options loaded remotely from the server'
  },
  {
    type: 'input',
    field: 'remoteField',
    title: 'Request Parameters',
    info: 'Parameter names carried in remote requests，as：name'
  }
]

export { selectRule, apiSelectRule }
