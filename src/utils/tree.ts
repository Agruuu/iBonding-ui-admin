interface TreeHelperConfig {
  id: string
  children: string
  pid: string
}

const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  pid: 'pid'
}
export const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id',
  isLeaf: 'leaf',
  emitPath: false // For the Cascader component: When the selected node changes, determine whether to return an array composed of the values of all levels of menus where the node is located. If set to `false`, only return the value of the node.
}

const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config)

// tree from list
export const listToTree = <T = any>(list: any[], config: Partial<TreeHelperConfig> = {}): T[] => {
  const conf = getConfig(config) as TreeHelperConfig
  const nodeMap = new Map()
  const result: T[] = []
  const { id, children, pid } = conf

  for (const node of list) {
    node[children] = node[children] || []
    nodeMap.set(node[id], node)
  }
  for (const node of list) {
    const parent = nodeMap.get(node[pid])
    ;(parent ? parent.children : result).push(node)
  }
  return result
}

export const treeToList = <T = any>(tree: any, config: Partial<TreeHelperConfig> = {}): T => {
  config = getConfig(config)
  const { children } = config
  const result: any = [...tree]
  for (let i = 0; i < result.length; i++) {
    if (!result[i][children!]) continue
    result.splice(i + 1, 0, ...result[i][children!])
  }
  return result
}

export const findNode = <T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {}
): T | null => {
  config = getConfig(config)
  const { children } = config
  const list = [...tree]
  for (const node of list) {
    if (func(node)) return node
    node[children!] && list.push(...node[children!])
  }
  return null
}

export const findNodeAll = <T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {}
): T[] => {
  config = getConfig(config)
  const { children } = config
  const list = [...tree]
  const result: T[] = []
  for (const node of list) {
    func(node) && result.push(node)
    node[children!] && list.push(...node[children!])
  }
  return result
}

export const findPath = <T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {}
): T | T[] | null => {
  config = getConfig(config)
  const path: T[] = []
  const list = [...tree]
  const visitedSet = new Set()
  const { children } = config
  while (list.length) {
    const node = list[0]
    if (visitedSet.has(node)) {
      path.pop()
      list.shift()
    } else {
      visitedSet.add(node)
      node[children!] && list.unshift(...node[children!])
      path.push(node)
      if (func(node)) {
        return path
      }
    }
  }
  return null
}

export const findPathAll = (tree: any, func: Fn, config: Partial<TreeHelperConfig> = {}) => {
  config = getConfig(config)
  const path: any[] = []
  const list = [...tree]
  const result: any[] = []
  const visitedSet = new Set(),
    { children } = config
  while (list.length) {
    const node = list[0]
    if (visitedSet.has(node)) {
      path.pop()
      list.shift()
    } else {
      visitedSet.add(node)
      node[children!] && list.unshift(...node[children!])
      path.push(node)
      func(node) && result.push([...path])
    }
  }
  return result
}

export const filter = <T = any>(
  tree: T[],
  func: (n: T) => boolean,
  config: Partial<TreeHelperConfig> = {}
): T[] => {
  config = getConfig(config)
  const children = config.children as string

  function listFilter(list: T[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter((node) => {
        node[children] = node[children] && listFilter(node[children])
        return func(node) || (node[children] && node[children].length)
      })
  }

  return listFilter(tree)
}

export const forEach = <T = any>(
  tree: T[],
  func: (n: T) => any,
  config: Partial<TreeHelperConfig> = {}
): void => {
  config = getConfig(config)
  const list: any[] = [...tree]
  const { children } = config
  for (let i = 0; i < list.length; i++) {
    // func Return `true` to terminate the traversal, avoiding meaningless loops in scenarios with a large number of nodes, which could cause the browser to freeze.
    if (func(list[i])) {
      return
    }
    children && list[i][children] && list.splice(i + 1, 0, ...list[i][children])
  }
}

/**
 * @description: Extract tree specified structure
 */
export const treeMap = <T = any>(
  treeData: T[],
  opt: { children?: string; conversion: Fn }
): T[] => {
  return treeData.map((item) => treeMapEach(item, opt))
}

/**
 * @description: Extract tree specified structure
 */
export const treeMapEach = (
  data: any,
  { children = 'children', conversion }: { children?: string; conversion: Fn }
) => {
  const haveChildren = Array.isArray(data[children]) && data[children].length > 0
  const conversionData = conversion(data) || {}
  if (haveChildren) {
    return {
      ...conversionData,
      [children]: data[children].map((i: number) =>
        treeMapEach(i, {
          children,
          conversion
        })
      )
    }
  } else {
    return {
      ...conversionData
    }
  }
}

/**
 * Recursive traversal of tree structure
 * @param treeDatas tree
 * @param callBack Callback
 * @param parentNode Parent Node
 */
export const eachTree = (treeDatas: any[], callBack: Fn, parentNode = {}) => {
  treeDatas.forEach((element) => {
    const newNode = callBack(element, parentNode) || element
    if (element.children) {
      eachTree(element.children, callBack, newNode)
    }
  })
}

/**
 * Construct tree structured data
 * @param {*} data data source
 * @param {*} id id field default 'id'
 * @param {*} parentId Parent node field default 'parentId'
 * @param {*} children Child node field default 'children'
 */
export const handleTree = (data: any[], id?: string, parentId?: string, children?: string) => {
  if (!Array.isArray(data)) {
    console.warn('data must be an array')
    return []
  }
  const config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  }

  const childrenListMap = {}
  const nodeIds = {}
  const tree: any[] = []

  for (const d of data) {
    const parentId = d[config.parentId]
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = []
    }
    nodeIds[d[config.id]] = d
    childrenListMap[parentId].push(d)
  }

  for (const d of data) {
    const parentId = d[config.parentId]
    if (nodeIds[parentId] == null) {
      tree.push(d)
    }
  }

  for (const t of tree) {
    adaptToChildrenList(t)
  }

  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]]
    }
    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c)
      }
    }
  }

  return tree
}

/**
 * Construct tree structured data
 * @param {*} data data source
 * @param {*} id id field default 'id'
 * @param {*} parentId Parent node field default 'parentId'
 * @param {*} children Child node field default 'children'
 * @param {*} rootId rootId default 0
 */
// @ts-ignore
export const handleTree2 = (data, id, parentId, children, rootId) => {
  id = id || 'id'
  parentId = parentId || 'parentId'
  // children = children || 'children'
  rootId =
    rootId ||
    Math.min(
      ...data.map((item) => {
        return item[parentId]
      })
    ) ||
    0
  // Deep cloning of source data
  const cloneData = JSON.parse(JSON.stringify(data))
  // Loop all items
  const treeData = cloneData.filter((father) => {
    const branchArr = cloneData.filter((child) => {
      // Return the sub array of each item
      return father[id] === child[parentId]
    })
    branchArr.length > 0 ? (father.children = branchArr) : ''
    // Return to the first layer
    return father[parentId] === rootId
  })
  return treeData !== '' ? treeData : data
}

/**
 * Verify the selected nodes，Is it specified level
 *
 * @param tree Tree structured data to be manipulated
 * @param nodeId Need to determine at what level of data
 * @param level Level of inspection, Default check to level 2
 * @return true yes；false no
 */
export const checkSelectedNode = (tree: any[], nodeId: any, level = 2): boolean => {
  if (typeof tree === 'undefined' || !Array.isArray(tree) || tree.length === 0) {
    console.warn('tree must be an array')
    return false
  }

  // Verify if it is a primary node
  if (tree.some((item) => item.id === nodeId)) {
    return false
  }

  // Recursive counting
  let count = 1

  // Deep level verification
  function performAThoroughValidation(arr: any[]): boolean {
    count += 1
    for (const item of arr) {
      if (item.id === nodeId) {
        return true
      } else if (typeof item.children !== 'undefined' && item.children.length !== 0) {
        if (performAThoroughValidation(item.children)) {
          return true
        }
      }
    }
    return false
  }

  for (const item of tree) {
    count = 1
    if (performAThoroughValidation(item.children)) {
      // Find and compare whether it is the expected level
      if (count >= level) {
        return true
      }
    }
  }

  return false
}

/**
 * Obtain the complete structure of the node
 * @param tree Tree data
 * @param nodeId node id
 */
export const treeToString = (tree: any[], nodeId) => {
  if (typeof tree === 'undefined' || !Array.isArray(tree) || tree.length === 0) {
    console.warn('tree must be an array')
    return ''
  }
  // Verify if it is a primary node
  const node = tree.find((item) => item.id === nodeId)
  if (typeof node !== 'undefined') {
    return node.name
  }
  let str = ''

  function performAThoroughValidation(arr) {
    if (typeof arr === 'undefined' || !Array.isArray(arr) || arr.length === 0) {
      return false
    }
    for (const item of arr) {
      if (item.id === nodeId) {
        str += ` / ${item.name}`
        return true
      } else if (typeof item.children !== 'undefined' && item.children.length !== 0) {
        str += ` / ${item.name}`
        if (performAThoroughValidation(item.children)) {
          return true
        }
      }
    }
    return false
  }

  for (const item of tree) {
    str = `${item.name}`
    if (performAThoroughValidation(item.children)) {
      break
    }
  }
  return str
}
