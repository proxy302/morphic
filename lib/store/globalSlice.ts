import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '.'

interface GlobalStateProps {
  api_key: string
  model_name: string
  code: string
}

export const globalStateSlice = createSlice({
  name: 'global',
  initialState: {
    api_key: '',
    model_name: '',
    code: ''
  },
  reducers: {
    setGlobalState: (
      state,
      action: PayloadAction<{
        [key in keyof GlobalStateProps]?: GlobalStateProps[key]
      }>
    ) => {
      const { api_key, code, model_name } = action.payload
      if (api_key !== undefined) state.api_key = api_key
      if (code !== undefined) state.code = code
      if (model_name !== undefined) state.model_name = model_name
    }
  }
})

export const { setGlobalState } = globalStateSlice.actions
export const selectGlobal = (state: RootState) => state.global
export default globalStateSlice.reducer
