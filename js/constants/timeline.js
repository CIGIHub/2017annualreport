
export const defautlLineTemplates = [
  { label: '08/16', position: 0 },
  { label: '', position: 1 / 4 },
  { label: '', position: 1 / 2 },
  { label: '', position: 3 / 4 },
  { label: '08/17', position: 1 },
];

export const monthlyViewLineTemplates = [
  { label: 'August 2016', month: 7, year: 2016 },
  { label: 'September 2016', month: 8, year: 2016 },
  { label: 'October 2016', month: 9, year: 2016 },
  { label: 'November 2016', month: 10, year: 2016 },
  { label: 'December 2016', month: 11, year: 2016 },
  { label: 'January 2017', month: 0, year: 2017 },
  { label: 'February 2017', month: 1, year: 2017 },
  { label: 'March 2017', month: 2, year: 2017 },
  { label: 'April 2017', month: 3, year: 2017 },
  { label: 'May 2017', month: 4, year: 2017 },
  { label: 'June 2017', month: 5, year: 2017 },
  { label: 'July 2017', month: 6, year: 2017 },
  { label: 'August 2017', month: 7, year: 2017 },
];

export const researchTypeFilters = {
  label: 'Refine by Research Type',
  types: [
    {
      name: 'Trade & Finance',
      color: '#B53535', //red
    },
    {
      name: 'Summits & Institutions',
      color: '#DFA92B', //yellow
    },
    {
      name: 'Internet Governance & Jurisdiction',
      color: '#9B557A', //purple
    },
    {
      name: 'Innovation & Productivity',
      color: '#55639B', //indigo
    },
    {
      name: 'Environment & Energy',
      color: '#2D6C40', //green
    },
    {
      name: 'Conflict Management & Security',
      color: '#D0663A', //orange
    },
  ],
};

export const programViews = {
  label: 'Views',
  filters: [
    {
      name: 'Combined',
      selected: true,
    },
    {
      name: 'By programs',
      selected: false,
    },
  ],
};

export const programTypes = [
  'International Law',
  'Global Economy',
  'Global Security & Politics',
];