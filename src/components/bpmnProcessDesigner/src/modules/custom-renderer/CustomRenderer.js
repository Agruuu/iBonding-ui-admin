import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer'

export default function CustomRenderer(config, eventBus, styles, pathMap, canvas, textRenderer) {
  BpmnRenderer.call(this, config, eventBus, styles, pathMap, canvas, textRenderer, 2000)

  this.handlers['label'] = function () {
    return null
  }
}

const F = function () {} // core，Using empty objects as intermediaries；
F.prototype = BpmnRenderer.prototype // core，Assign the prototype of the parent class to an empty objectF；
CustomRenderer.prototype = new F() // Core: Assign an instance of F to the subclass.
CustomRenderer.prototype.constructor = CustomRenderer // Fix the constructor reference of the subclass `CustomRenderer` to prevent confusion in the prototype chain.
