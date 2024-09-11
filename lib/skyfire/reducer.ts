// src/contexts/skyfire/reducer.ts

import { ActionType, SkyfireAction } from "./action"
import { SkyfireState } from "./type"

export const initialState: SkyfireState = {}

export const skyfireReducer = (
  state: SkyfireState,
  action: SkyfireAction
): SkyfireState => {
  switch (action.type) {
    case ActionType.UPDATE_SKYFIRE_INFO:
      return {
        ...action.payload,
      }
    default:
      return state
  }
}
