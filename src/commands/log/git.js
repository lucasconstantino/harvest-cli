import cli from 'cli-ux'
import { number } from 'yup'
import git from 'simple-git/promise'
import emojic from 'emojic'

import { HarvestCommand } from '~lib/harvest/command'
import { prompt, validator } from '~lib/prompt'
import { edit } from '~lib/editor'

const projectToChoice = value => ({
  name: value,
  message: value.project.name
})

const taskToChoice = value => ({ name: value, message: value.task.name })
class LogGitCommand extends HarvestCommand {
  async run () {
    const {
      args: { ref }
    } = this.parse(LogGitCommand)

    const [from, to] = ref.split('..')

    const repo = git(process.cwd())
    const commits = (await repo.log({ from, to: to || 'HEAD' })).all

    const notes = await edit(commits.map(({ message }) => message).join('\n'))

    this.newLine()

    cli.action.start('Loading your projects and tasks')

    const projects = await this.loadProjects()

    cli.action.stop('done!')

    const { project, task, hours } = await prompt([
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
      }
    ])

    if (hours > 8) {
      const { confirm } = await prompt({
        type: 'confirm',
        name: 'confirm',
        message: `${
          emojic.scream
        }  You inserted ${hours} hours!!! Are you sure this is right?`
      })

      if (!confirm) {
        this.log('Please, do it again then!')
        this.exit()
      }
    }

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
    } catch (err) {
      cli.action.stop('oh, no!')

      this.newLine()

      this.error(err)
    }
  }
}

LogGitCommand.description = `Log from Git
...
Registers a new time-tracking log using Git commit messages as notes
`

LogGitCommand.args = [
  {
    name: 'ref',
    required: true,
    description: 'a valid git reference to use as source',
    default: 'HEAD^..HEAD'
  }
]

export default LogGitCommand
