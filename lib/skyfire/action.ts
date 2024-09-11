// src/contexts/skyfire/action.ts

import { SkyfireState } from "./type"

export enum ActionType {
  UPDATE_SKYFIRE_INFO = "UPDATE_SKYFIRE_INFO",
}

export type SkyfireAction = {
  type: ActionType.UPDATE_SKYFIRE_INFO
  payload: SkyfireState
}

export const updateSkyfireInfo = (data: SkyfireState): SkyfireAction => ({
  type: ActionType.UPDATE_SKYFIRE_INFO,
  payload: data,
})
