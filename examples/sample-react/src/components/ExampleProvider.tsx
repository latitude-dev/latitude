import { createContext, useContext, ReactNode, FunctionComponent } from 'react'

interface ExampleContextProps {
  headerHeight: number
}

const ExampleContext = createContext<ExampleContextProps | undefined>(undefined)

const useExample = () => {
  const context = useContext(ExampleContext)
  if (context === undefined) {
    throw new Error('useExample must be used within a ExampleProvider')
  }
  return context
}

interface ExampleProviderProps {
  headerHeight: number
  children: ReactNode
}

export const ExampleProvider: FunctionComponent<ExampleProviderProps> = ({
  children,
  headerHeight,
}) => {
  return (
    <ExampleContext.Provider value={{ headerHeight }}>
      {children}
    </ExampleContext.Provider>
  )
}

export { useExample }
