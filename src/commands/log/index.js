import cli from 'cli-ux'
import { number } from 'yup'
import emojic from 'emojic'

import { HarvestCommand } from '~lib/harvest/command'
import { prompt, validator } from '~lib/prompt'

const projectToChoice = value => ({
  name: value,
  message: value.project.name
})

const taskToChoice = value => ({ name: value, message: value.task.name })

class LogCreateCommand extends HarvestCommand {
  async run () {
    const projects = await this.loadProjects()

    const { project, task, hours, notes } = await prompt(
      this.getPrompts({ projects })
    )

    await this.confirmData({ project, task, hours, notes })
    await this.logEntry({ project, task, hours, notes })
  }

  async logEntry ({ project, task, hours, notes }) {
    try {
      cli.action.start('Logging entry')

      await this.harvest.timeEntries.create({
        hours,
        notes,
        project_id: project.project.id,
        task_id: task.task.id,
        spent_date: new Date().toISOString()
      })

      cli.action.stop('there it goes!')
    } catch (err) /* istanbul ignore next */ {
      cli.action.stop('oh, no!')

      this.newLine()

      this.error(err)
    }
  }

  async confirmData ({ hours }) {
    if (hours > 8) {
      const { confirm } = await prompt({
        type: 'confirm',
        name: 'confirm',
        message: `${
          emojic.scream
        }  You inserted ${hours} hours!!! Are you sure this is right?`
      })

      /* istanbul ignore else */
      if (!confirm) {
        this.log('Please, do it again then!')
        this.exit()
      }
    }
  }

  /* istanbul ignore next */
  getPrompts ({ projects }) {
    return [
      {
        type: 'select',
        pageSize: 20,
        name: 'project',
        message: 'Project',
        format: value => (value && value.project ? value.project.name : value),
        choices: projects.map(projectToChoice)
      },
      {
        type: 'select',
        pageSize: 20,
        name: 'task',
        message: 'Task',
        format: value => (value && value.task ? value.task.name : value),
        choices () {
          return this.state.answers.project.task_assignments.map(taskToChoice)
        }
      },
      {
        type: 'input',
        name: 'hours',
        message: 'Hours',
        validate: validator(
          number()
            .min(0.1)
            .required()
        ),
        result: Number
      },
      {
        type: 'input',
        name: 'notes',
        message: 'Notes (optional)'
      }
    ]
  }
}

LogCreateCommand.description = `Log time
...
Registers a new time-tracking log
`

export default LogCreateCommand
