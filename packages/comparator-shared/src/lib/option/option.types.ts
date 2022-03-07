export type Option = {
  id: string
  ownerId: string
  name: string
  // Compare apples to apples
  // type: string
  features: Record<string, OptionFeature>
}

export type OptionFeature = string
