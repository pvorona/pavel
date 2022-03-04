export type OptionsState = {
  byId: Record<string, Option>
}

export type Option = {
  id: string
  name: string
  // Compare apples to apples
  type: string
  features: Record<string, OptionFeature>
}

export type OptionFeature = string
