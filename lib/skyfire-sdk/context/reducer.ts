import { ActionType, SkyfireAction } from "./action"
import { SkyfireState } from "./type"

export const initialState: SkyfireState = {
  localAPIKey: "",
  wallet: null,
  balance: null,
  claims: null,
}

export const skyfireReducer = (
  state: SkyfireState,
  action: SkyfireAction
): SkyfireState => {
  switch (action.type) {
    case ActionType.UPDATE_SKYFIRE_INFO:
      return {
        ...state,
        ...action.payload,
      }
    case ActionType.SAVE_LOCAL_API_KEY:
      return {
        ...state,
        localAPIKey: action.payload,
      }
    case ActionType.UPDATE_WALLET_INFO:
      return {
        ...state,
        wallet: action.payload.wallet,
        balance: action.payload.balance,
      }
    case ActionType.UPDATE_CLAIMS_INFO:
      return {
        ...state,
        claims: action.payload.claims,
      }
    default:
      return state
  }
}
