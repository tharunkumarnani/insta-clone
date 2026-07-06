import React from 'react'

const Context = React.createContext({
  search: '',
  updateSearch: () => {},
})

export default Context
