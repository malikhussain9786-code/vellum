// Realistic, fully-filled sample content used anywhere the product shows a
// preview of a resume. Never blank, never generic lorem-ipsum — every
// achievement is written the way a real recruiter-facing bullet reads.

export const sampleResumes = [
  {
    id: 'amara-osei',
    name: 'Amara Osei',
    role: 'Senior Product Designer',
    location: 'San Francisco, CA',
    experience: [
      {
        title: 'Lead Product Designer',
        company: 'Nova Health',
        period: '2022 — Present',
        bullets: [
          'Redesigned the core patient intake flow, cutting completion time by 34%.',
          'Led a team of 5 designers across two product lines.',
        ],
      },
      {
        title: 'Product Designer',
        company: 'Fieldstone',
        period: '2019 — 2022',
        bullets: ['Built the design system now used across 4 product teams.'],
      },
    ],
    skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
  },
  {
    id: 'daniel-reyes',
    name: 'Daniel Reyes',
    role: 'Senior Software Engineer',
    location: 'Austin, TX',
    experience: [
      {
        title: 'Backend Lead',
        company: 'Fluxwave',
        period: '2021 — Present',
        bullets: [
          'Rebuilt the payments pipeline, reducing p95 latency by 42%.',
          'Migrated core services to Kubernetes, cutting infra cost 28%.',
        ],
      },
      {
        title: 'Software Engineer',
        company: 'Datalane',
        period: '2018 — 2021',
        bullets: ['Shipped the core API now serving 200K+ daily active users.'],
      },
    ],
    skills: ['Go', 'Kubernetes', 'PostgreSQL', 'gRPC'],
  },
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    role: 'Marketing Lead',
    location: 'Toronto, ON',
    experience: [
      {
        title: 'Marketing Lead',
        company: 'Heron & Co',
        period: '2022 — Present',
        bullets: ['Grew organic acquisition 3x over 18 months.'],
      },
      {
        title: 'Senior Marketing Manager',
        company: 'Fable',
        period: '2019 — 2022',
        bullets: ['Led the rebrand that lifted signups by 27% quarter over quarter.'],
      },
    ],
    skills: ['Brand Strategy', 'Lifecycle Marketing', 'Analytics'],
  },
]
