import { Comparison, Option } from '../types'

// export const breadcrumbs = [
//   { id: 'directory 1', title: 'Directory 1' },
//   { id: 'directory 2', title: 'Nested Directory 1' },
//   { id: 'directory 3', title: 'Nested Directory 2' },
//   // { id: 'directory 4', title: 'Nested Directory 3' },
//   // { id: 'directory 5', title: 'Nested Directory 4' },
//   // { id: 'directory 6', title: 'Nested Directory 5' },
//   // { id: 'directory 7', title: 'Nested Directory 6' },
//   // { id: 'directory 8', title: 'Nested Directory 7' },
//   // { id: 'directory 9', title: 'Nested Directory 8' },
//   // { id: 'directory 10', title: 'Nested Directory 9' },
// ]

// export const avatars = [{ id: 'avatar 1' }, { id: 'avatar 2' }]

export const currentComparison: Comparison = {
  id: '1',
  name: 'current comparison',
  optionIds: ['option 1', 'option 2'],
  features: [
    { name: 'Price', type: 'text', expanded: true },
    { name: 'Diagonal', type: 'text', expanded: true },
    { name: 'Offer', type: 'text', expanded: true },
    { name: 'Contact', type: 'text', expanded: true },
    { name: 'Website', type: 'text', expanded: true },
    { name: 'Note', type: 'text', expanded: true },
  ],
}

export const options: Option[] = [
  {
    id: 'option 1',
    name: 'Option 1',
    features: {
      Price: '$600',
      Diagonal: "55''",
      Offer: 'PDF',
      Contact: 'ted@google.com',
      Website: 'https://duckduckgo.com',
      Note: 'This one takes a bit more space that I’d want.',
    },
  },
  {
    id: 'option 2',
    name: 'Option 2',
    features: {
      Price: '$600',
      Diagonal: "65''",
      Offer: 'DOCX',
      Contact: 'ted@google.com',
      Website: 'https://duckduckgo.com',
      Note: 'This one fits pretty well with the rest of the room.',
    },
  },
  // {
  //   id: 'option 3',
  //   name: 'Option 3',
  //   features: {
  //     Price: '$6900',
  //     Diagonal: "165''",
  //     Offer: 'DOCX',
  //     Contact: 'ted@google.com',
  //     Website: 'https://duckduckgo.com',
  //     Note: 'This one fits pretty well with the rest of the room',
  //   },
  // },
  // {
  //   id: 'option 4',
  //   name: 'Option 4',
  //   features: {
  //     Price: '$6900',
  //     Diagonal: "165''",
  //     Offer: 'DOCX',
  //     Contact: 'ted@google.com',
  //     Website: 'https://duckduckgo.com',
  //     Note: 'This one fits pretty well with the rest of the room',
  //   },
  // },
  // {
  //   id: 'option 5',
  //   name: 'Option 5',
  //   features: {
  //     Price: '$6900',
  //     Diagonal: "165''",
  //     Offer: 'DOCX',
  //     Contact: 'ted@google.com',
  //     Website: 'https://duckduckgo.com',
  //     Note: 'This one fits pretty well with the rest of the room',
  //   },
  // },
  // {
  //   id: 'option 6',
  //   name: 'Option 6',
  //   features: {
  //     Price: '$6900',
  //     Diagonal: "165''",
  //     Offer: 'DOCX',
  //     Contact: 'ted@google.com',
  //     Website: 'https://duckduckgo.com',
  //     Note: 'This one fits pretty well with the rest of the room. This one fits pretty well with the rest of the room. This one fits pretty well with the rest of the room. This one fits pretty well with the rest of the room. This one fits pretty well with the rest of the room. This one fits pretty well with the rest of the room. This one fits pretty well with the rest of the room. ',
  //   },
  // },
]
