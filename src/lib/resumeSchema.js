// The canonical shape of a resume's data. Every template renders this same
// shape — templates differ in presentation (theme), never in what fields
// they expect. This is what keeps 20 templates from becoming 20 separate
// data models to maintain.

export function createEmptyResume() {
  return {
    personal: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
      photoUrl: '',
    },
    summary: '',
    experience: [], // { id, title, company, location, startDate, endDate, current, bullets: [] }
    education: [], // { id, degree, school, location, startDate, endDate, notes }
    projects: [], // { id, name, description, technologies: [], link }
    skills: { technical: [], soft: [], languages: [] },
    certificates: [], // { id, name, org, date }
    extras: {
      awards: [], // { id, title, org, date }
      publications: [], // { id, title, publisher, date }
      volunteer: [], // { id, role, org, date, description }
      custom: [], // { id, sectionTitle, items: [{ id, text }] }
    },
  }
}

function id(prefix, i) {
  return `${prefix}-${i}`
}

// A complete, realistic sample profile — used to test the rendering engine
// end-to-end and as the default preview content across all 20 templates.
export function createSampleResume() {
  return {
    personal: {
      name: 'Amara Osei',
      title: 'Senior Product Designer',
      email: 'amara@osei.io',
      phone: '(415) 555-0148',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/amaraosei',
      portfolio: 'amaraosei.design',
      photoUrl: '',
    },
    summary:
      'Product designer with 7 years building healthcare and fintech tools used by millions. Focused on turning ambiguous problems into interfaces people trust on the first try.',
    experience: [
      {
        id: id('exp', 1),
        title: 'Lead Product Designer',
        company: 'Nova Health',
        location: 'San Francisco, CA',
        startDate: '2022',
        endDate: '',
        current: true,
        bullets: [
          'Redesigned the core patient intake flow, cutting completion time by 34%.',
          'Led a team of 5 designers across two product lines.',
          'Introduced a research-review ritual now used by every product pod at the company.',
        ],
      },
      {
        id: id('exp', 2),
        title: 'Product Designer',
        company: 'Fieldstone',
        location: 'Oakland, CA',
        startDate: '2019',
        endDate: '2022',
        current: false,
        bullets: [
          'Built the design system now used across 4 product teams, cutting new-feature design time by 40%.',
          'Ran the first structured usability study program at the company.',
        ],
      },
      {
        id: id('exp', 3),
        title: 'UI/UX Designer',
        company: 'Beacon Labs',
        location: 'Remote',
        startDate: '2017',
        endDate: '2019',
        current: false,
        bullets: ['Designed onboarding flows that lifted week-1 retention by 18%.'],
      },
    ],
    education: [
      {
        id: id('edu', 1),
        degree: 'B.S. in Human-Computer Interaction',
        school: 'University of Washington',
        location: 'Seattle, WA',
        startDate: '2013',
        endDate: '2017',
        notes: 'Graduated with honors',
      },
    ],
    projects: [
      {
        id: id('proj', 1),
        name: 'Clarity — accessible design tokens',
        description:
          'An open-source design token library focused on WCAG-compliant color pairing out of the box.',
        technologies: ['Figma API', 'TypeScript'],
        link: 'github.com/aosei/clarity',
      },
    ],
    skills: {
      technical: ['Figma', 'Design Systems', 'Prototyping', 'Design Tokens'],
      soft: ['User Research', 'Workshop Facilitation', 'Cross-functional Leadership'],
      languages: ['English (native)', 'Twi (conversational)'],
    },
    certificates: [
      { id: id('cert', 1), name: 'Certified Usability Analyst', org: 'HFI', date: '2021' },
    ],
    extras: {
      awards: [
        { id: id('award', 1), title: 'Design of the Year — Healthcare', org: 'Fast Company', date: '2023' },
      ],
      publications: [],
      volunteer: [
        {
          id: id('vol', 1),
          role: 'Design Mentor',
          org: 'ADPList',
          date: '2020 — Present',
          description: 'Mentor early-career designers transitioning into product design.',
        },
      ],
      custom: [],
    },
  }
}
