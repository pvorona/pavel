export type ComparisonsState = {
  byId: Record<string, Comparison>
  currentComparisonId: string
}

export type Comparison = {
  id: string
  name: string
  features: Feature[]
  optionIds: string[]
  isLocked: boolean
  isNew: boolean
}

export type Feature = {
  id: string
  name: string
  type: FeatureType
  description: string
  isDescriptionExpanded: boolean
  isExpanded: boolean
}

export type FeatureType = 'text'
