import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '.'

interface GlobalStateProps {
  api_key: string
  created_by: string
  current_date_cost: number
  limit_daily_cost: number
  model_name: string
}

export const globalStateSlice = createSlice({
  name: 'global',
  initialState: {
    api_key: '',
    created_by: '',
    current_date_cost: 0,
    limit_daily_cost: 0,
    model_name: ''
  },
  reducers: {
    setGlobalState: (
      state,
      action: PayloadAction<{
        [key in keyof GlobalStateProps]?: GlobalStateProps[key]
      }>
    ) => {
      const {
        api_key,
        created_by,
        current_date_cost,
        limit_daily_cost,
        model_name
      } = action.payload
      if (api_key) state.api_key = api_key
      if (created_by) state.created_by = created_by
      if (current_date_cost) state.current_date_cost = current_date_cost
      if (limit_daily_cost) state.limit_daily_cost = limit_daily_cost
      if (model_name) state.model_name = model_name
    }
  }
})

export const { setGlobalState } = globalStateSlice.actions
export const selectGlobal = (state: RootState) => state.global
export default globalStateSlice.reducer
