import variables from '@/styles/global.module.scss'

export const useDesign = () => {
  const scssVariables = variables

  /**
   * @param scope Class name
   * @returns Return space name-class name
   */
  const getPrefixCls = (scope: string) => {
    return `${scssVariables.namespace}-${scope}`
  }

  return {
    variables: scssVariables,
    getPrefixCls
  }
}
