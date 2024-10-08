import { AxiosResponse } from "axios"

import { ActionType, SkyfireAction } from "./action"
import { SkyfireState } from "./type"

export const initialState: SkyfireState = {
  localAPIKey: "",
  isAPIKeyInitialized: false,
  wallet: null,
  balance: null,
  claims: null,
  loading: false,
  error: null,
  responses: [],
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
        isAPIKeyInitialized: true,
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
    case ActionType.LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    case ActionType.UPDATE_ERROR:
      return {
        ...state,
        error: action.payload,
      }
    case ActionType.ADD_RESPONSE:
      return {
        ...state,
        responses: [...state.responses, action.payload],
      }
    case ActionType.CLEAR_RESPONSES:
      return {
        ...state,
        responses: [],
      }
    default:
      return state
  }
}
