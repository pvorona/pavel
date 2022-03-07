export type Comparison = {
  id: string
  name: string
  features: Feature[]
  optionIds: string[]
  isLocked: boolean
  ownerId: string
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
