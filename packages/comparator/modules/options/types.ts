export type OptionsState = {
  byId: Record<string, Option>
}

export type Option = {
  id: string
  name: string
  features: Record<string, OptionFeature>
}

export type OptionFeature = string
