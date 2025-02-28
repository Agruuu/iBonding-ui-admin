import MyProcessDesigner from './ProcessDesigner.vue'

MyProcessDesigner.install = function (Vue) {
  Vue.component(MyProcessDesigner.name, MyProcessDesigner)
}

// Designer for flowcharts，Editable
export default MyProcessDesigner
