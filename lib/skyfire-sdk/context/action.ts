import { PaymentClaimResponse, SkyfireState, WalletDataResponse } from "./type"

export enum ActionType {
  UPDATE_SKYFIRE_INFO = "UPDATE_SKYFIRE_INFO",
  SAVE_LOCAL_API_KEY = "SAVE_LOCAL_API_KEY",
  UPDATE_WALLET_INFO = "UPDATE_WALLET_INFO",
  UPDATE_CLAIMS_INFO = "UPDATE_CLAIMS_INFO",
  LOADING = "LOADING",
}

interface UpdateSkyfireInfoAction {
  type: ActionType.UPDATE_SKYFIRE_INFO
  payload: Partial<SkyfireState>
}

interface SaveLocalAPIKeyAction {
  type: ActionType.SAVE_LOCAL_API_KEY
  payload: SkyfireState["localAPIKey"]
}

interface UpdateWalletInfoAction {
  type: ActionType.UPDATE_WALLET_INFO
  payload: WalletDataResponse
}

interface UpdateClaimsInfoAction {
  type: ActionType.UPDATE_CLAIMS_INFO
  payload: PaymentClaimResponse
}

interface LoadingAction {
  type: ActionType.LOADING
  payload: boolean
}

// Actions Types
export type SkyfireAction =
  | UpdateSkyfireInfoAction
  | SaveLocalAPIKeyAction
  | UpdateWalletInfoAction
  | UpdateClaimsInfoAction
  | LoadingAction

// Actions
export const updateSkyfireInfo = (data: SkyfireState): SkyfireAction => ({
  type: ActionType.UPDATE_SKYFIRE_INFO,
  payload: data,
})

export const updateSkyfireAPIKey = (
  data: SkyfireState["localAPIKey"]
): SkyfireAction => ({
  type: ActionType.SAVE_LOCAL_API_KEY,
  payload: data,
})

export const updateSkyfireWallet = (
  data: WalletDataResponse
): SkyfireAction => ({
  type: ActionType.UPDATE_WALLET_INFO,
  payload: data,
})

export const updateSkyfireClaims = (
  data: PaymentClaimResponse
): SkyfireAction => ({
  type: ActionType.UPDATE_CLAIMS_INFO,
  payload: data,
})

export const loading = (data: boolean): SkyfireAction => ({
  type: ActionType.LOADING,
  payload: data,
})
