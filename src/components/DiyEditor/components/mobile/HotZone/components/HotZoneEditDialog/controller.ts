import { HotZoneItemProperty } from '@/components/DiyEditor/components/mobile/HotZone/config'
import { StyleValue } from 'vue'

// Minimum width and height of the hot zone
export const HOT_ZONE_MIN_SIZE = 100

// Types of control
export enum CONTROL_TYPE_ENUM {
  LEFT,
  TOP,
  WIDTH,
  HEIGHT
}

// Define the control points for the hot zone
export interface ControlDot {
  position: string
  types: CONTROL_TYPE_ENUM[]
  style: StyleValue
}

// The 8 control points of the hot area.
export const CONTROL_DOT_LIST = [
  {
    position: 'Top Left Corner',
    types: [
      CONTROL_TYPE_ENUM.LEFT,
      CONTROL_TYPE_ENUM.TOP,
      CONTROL_TYPE_ENUM.WIDTH,
      CONTROL_TYPE_ENUM.HEIGHT
    ],
    style: { left: '-5px', top: '-5px', cursor: 'nwse-resize' }
  },
  {
    position: 'Upper Middle',
    types: [CONTROL_TYPE_ENUM.TOP, CONTROL_TYPE_ENUM.HEIGHT],
    style: { left: '50%', top: '-5px', cursor: 'n-resize', transform: 'translateX(-50%)' }
  },
  {
    position: 'Top Right Corner',
    types: [CONTROL_TYPE_ENUM.TOP, CONTROL_TYPE_ENUM.WIDTH, CONTROL_TYPE_ENUM.HEIGHT],
    style: { right: '-5px', top: '-5px', cursor: 'nesw-resize' }
  },
  {
    position: 'Right Middle',
    types: [CONTROL_TYPE_ENUM.WIDTH],
    style: { right: '-5px', top: '50%', cursor: 'e-resize', transform: 'translateX(-50%)' }
  },
  {
    position: 'Bottom Right Corner',
    types: [CONTROL_TYPE_ENUM.WIDTH, CONTROL_TYPE_ENUM.HEIGHT],
    style: { right: '-5px', bottom: '-5px', cursor: 'nwse-resize' }
  },
  {
    position: 'Bottom Middle',
    types: [CONTROL_TYPE_ENUM.HEIGHT],
    style: { left: '50%', bottom: '-5px', cursor: 's-resize', transform: 'translateX(-50%)' }
  },
  {
    position: 'Lower Left Quarter',
    types: [CONTROL_TYPE_ENUM.LEFT, CONTROL_TYPE_ENUM.WIDTH, CONTROL_TYPE_ENUM.HEIGHT],
    style: { left: '-5px', bottom: '-5px', cursor: 'nesw-resize' }
  },
  {
    position: 'Left Middle',
    types: [CONTROL_TYPE_ENUM.LEFT, CONTROL_TYPE_ENUM.WIDTH],
    style: { left: '-5px', top: '50%', cursor: 'w-resize', transform: 'translateX(-50%)' }
  }
] as ControlDot[]

//region Scaling of the hot zone
// Scale ratio of hot zone
export const HOT_ZONE_SCALE_RATE = 2
// narrow：Retract to a size suitable for mobile phone screens
export const zoomOut = (list?: HotZoneItemProperty[]) => {
  return (
    list?.map((hotZone) => ({
      ...hotZone,
      left: (hotZone.left /= HOT_ZONE_SCALE_RATE),
      top: (hotZone.top /= HOT_ZONE_SCALE_RATE),
      width: (hotZone.width /= HOT_ZONE_SCALE_RATE),
      height: (hotZone.height /= HOT_ZONE_SCALE_RATE)
    })) || []
  )
}
// enlarge：The purpose is to facilitate editing on the computer screen
export const zoomIn = (list?: HotZoneItemProperty[]) => {
  return (
    list?.map((hotZone) => ({
      ...hotZone,
      left: (hotZone.left *= HOT_ZONE_SCALE_RATE),
      top: (hotZone.top *= HOT_ZONE_SCALE_RATE),
      width: (hotZone.width *= HOT_ZONE_SCALE_RATE),
      height: (hotZone.height *= HOT_ZONE_SCALE_RATE)
    })) || []
  )
}
//endregion

/**
 * Package hot zone drag and drop
 *
 * notes：Why not use useDraggable from VueUse? In this scenario, its usage is rather complicated.
 * @param hotZone Hot Zone
 * @param downEvent Mouse press event
 * @param callback Callback function
 */
export const useDraggable = (
  hotZone: HotZoneItemProperty,
  downEvent: MouseEvent,
  callback: (
    left: number,
    top: number,
    width: number,
    height: number,
    moveWidth: number,
    moveHeight: number
  ) => void
) => {
  // Prevent event bubbling
  downEvent.stopPropagation()

  // Mouse coordinates before movement
  const { clientX: startX, clientY: startY } = downEvent
  // Coordinates of the hot zone before moving、size
  const { left, top, width, height } = hotZone

  // Monitor mouse movement
  document.onmousemove = (e) => {
    // Moving width
    const moveWidth = e.clientX - startX
    // Moving height
    const moveHeight = e.clientY - startY
    // Mobile callback
    callback(left, top, width, height, moveWidth, moveHeight)
  }

  // After releasing the mouse，End drag and drop
  document.onmouseup = () => {
    document.onmousemove = null
    document.onmouseup = null
  }
}
