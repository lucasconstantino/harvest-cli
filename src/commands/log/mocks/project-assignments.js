export const projectAssignmentsResponse = {
  project_assignments: [
    {
      id: 125068554,
      is_project_manager: true,
      is_active: true,
      use_default_rates: true,
      budget: null,
      created_at: '2017-06-26T22:32:52Z',
      updated_at: '2017-06-26T22:32:52Z',
      hourly_rate: 100.0,
      project: {
        id: 14308069,
        name: 'Online Store - Phase 1',
        code: 'OS1'
      },
      client: {
        id: 5735776,
        name: '123 Industries'
      },
      task_assignments: [
        {
          id: 155505013,
          billable: true,
          is_active: true,
          created_at: '2017-06-26T21:52:18Z',
          updated_at: '2017-06-26T21:52:18Z',
          hourly_rate: 100.0,
          budget: null,
          task: {
            id: 8083365,
            name: 'Graphic Design'
          }
        },
        {
          id: 155505014,
          billable: true,
          is_active: true,
          created_at: '2017-06-26T21:52:18Z',
          updated_at: '2017-06-26T21:52:18Z',
          hourly_rate: 100.0,
          budget: null,
          task: {
            id: 8083366,
            name: 'Programming'
          }
        },
        {
          id: 155505015,
          billable: true,
          is_active: true,
          created_at: '2017-06-26T21:52:18Z',
          updated_at: '2017-06-26T21:52:18Z',
          hourly_rate: 100.0,
          budget: null,
          task: {
            id: 8083368,
            name: 'Project Management'
          }
        },
        {
          id: 155505016,
          billable: false,
          is_active: true,
          created_at: '2017-06-26T21:52:18Z',
          updated_at: '2017-06-26T21:54:06Z',
          hourly_rate: 100.0,
          budget: null,
          task: {
            id: 8083369,
            name: 'Research'
          }
        }
      ]
    },
    {
      id: 125068553,
      is_project_manager: true,
      is_active: true,
      use_default_rates: false,
      budget: null,
      created_at: '2017-06-26T22:32:52Z',
      updated_at: '2017-06-26T22:32:52Z',
      hourly_rate: 100.0,
      project: {
        id: 14307913,
        name: 'Marketing Website',
        code: 'MW'
      },
      client: {
        id: 5735774,
        name: 'ABC Corp'
      },
      task_assignments: [
        {
          id: 155502709,
          billable: true,
          is_active: true,
          created_at: '2017-06-26T21:36:23Z',
          updated_at: '2017-06-26T21:36:23Z',
          hourly_rate: 100.0,
          budget: null,
          task: {
            id: 8083365,
            name: 'Graphic Design'
          }
        },
        {
          id: 155502710,
          billable: true,
          is_active: true,
          created_at: '2017-06-26T21:36:23Z',
          updated_at: '2017-06-26T21:36:23Z',
          hourly_rate: 100.0,
          budget: null,
          task: {
            id: 8083366,
            name: 'Programming'
          }
        },
        {
          id: 155502711,
          billable: true,
          is_active: true,
          created_at: '2017-06-26T21:36:23Z',
          updated_at: '2017-06-26T21:36:23Z',
          hourly_rate: 100.0,
          budget: null,
          task: {
            id: 8083368,
            name: 'Project Management'
          }
        },
        {
          id: 155505153,
          billable: false,
          is_active: true,
          created_at: '2017-06-26T21:53:20Z',
          updated_at: '2017-06-26T21:54:31Z',
          hourly_rate: 100.0,
          budget: null,
          task: {
            id: 8083369,
            name: 'Research'
          }
        }
      ]
    }
  ],
  per_page: 100,
  total_pages: 1,
  total_entries: 2,
  next_page: null,
  previous_page: null,
  page: 1,
  links: {
    first:
      'https://api.harvestapp.com/v2/users/1782959/project_assignments?page=1&per_page=100',
    next: null,
    previous: null,
    last:
      'https://api.harvestapp.com/v2/users/1782959/project_assignments?page=1&per_page=100'
  }
}
