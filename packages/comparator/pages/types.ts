export type Option = {
  id: string
  name: string
  features: Record<string, OptionFeature>
}

export type Comparison = {
  id: string
  name: string
  features: Feature[]
  optionIds: string[]
}

export type Feature = {
  name: string
  type: FeatureType
  description?: string
  expanded: boolean
}

export type FeatureType = 'text'

export type OptionFeature = string
