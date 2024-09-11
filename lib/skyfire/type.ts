export interface SkyfireState {
  // Define your state shape here
}

export type SkyfireAction = {
  type: "UPDATE_SKYFIRE_INFO"
  payload: SkyfireState
}
// Add other action types as needed
