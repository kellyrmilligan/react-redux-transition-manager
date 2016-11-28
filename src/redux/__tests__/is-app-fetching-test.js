/* global describe, it, expect */

import isAppFetching, { toggleAppFetching, TOGGLE_IS_APP_FETCHING, getFetching } from '../is-app-fetching'

describe('app fetching action', () => {
  it('should create an action to toggle fetching', () => {
    const expectedAction = {
      type: TOGGLE_IS_APP_FETCHING
    }
    expect(toggleAppFetching()).toEqual(expectedAction)
  })
})

describe('app fetching reducer', () => {
  it('will return default state if no action type matches', () => {
    expect(isAppFetching(undefined, {})).toEqual({ isAppFetching: false })
  })
  it('should handle toggling', () => {
    expect(isAppFetching(undefined, {
      type: TOGGLE_IS_APP_FETCHING
    })).toEqual({
      isAppFetching: true
    })
  })
})

describe('select fetching', () => {
  let state = { isAppFetching: { isAppFetching: false } }
  it('will get the value of fetching from the state', () => {
    expect(getFetching(state)).toEqual({
      isAppFetching: false
    })
  })
  it('will get the the other value when state changes', () => {
    // simulate what combine reducers does
    state = {
      isAppFetching: isAppFetching(undefined, {
        type: TOGGLE_IS_APP_FETCHING
      })
    }
    expect(getFetching(state)).toEqual({ isAppFetching: true })
    expect(getFetching.recomputations()).toEqual(2)
  })
})
