import MyProcessViewer from './ProcessViewer.vue'

MyProcessViewer.install = function (Vue) {
  Vue.component(MyProcessViewer.name, MyProcessViewer)
}

// Viewer for flowcharts，Not editable
export default MyProcessViewer
