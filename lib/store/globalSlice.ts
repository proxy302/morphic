import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '.'

interface GlobalStateProps {
  api_key: string
  info: string
  code: string
}

export const globalStateSlice = createSlice({
  name: 'global',
  initialState: {
    api_key: '',
    info: '',
    code: ''
  },
  reducers: {
    setGlobalState: (
      state,
      action: PayloadAction<{
        [key in keyof GlobalStateProps]?: GlobalStateProps[key]
      }>
    ) => {
      const { api_key, info, code } = action.payload
      if (api_key) state.api_key = api_key
      if (info !== undefined) state.info = info
      if (code !== undefined) state.code = code
    }
  }
})

export const { setGlobalState } = globalStateSlice.actions
export const selectGlobal = (state: RootState) => state.global
export default globalStateSlice.reducer
