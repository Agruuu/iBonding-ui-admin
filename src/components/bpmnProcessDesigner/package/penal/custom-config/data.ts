import UserTaskCustomConfig from './components/UserTaskCustomConfig.vue'
import BoundaryEventTimer from './components/BoundaryEventTimer.vue'

export const CustomConfigMap = {
  UserTask: {
    name: 'User Task',
    componet: UserTaskCustomConfig
  },
  BoundaryEventTimerEventDefinition: {
    name: 'Timer Boundary Event(Non Interrupted)',
    componet: BoundaryEventTimer
  }
}
