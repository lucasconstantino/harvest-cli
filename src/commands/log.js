import { Command, flags } from '@oclif/command'
import cli from 'cli-ux'
import inquirer from 'inquirer'
import { authenticate } from '../lib/harvest'

class LogCommand extends Command {
  async run () {
    this.harvest = await authenticate()

    const { project, task, hours, notes } = await this.prompt()

    cli.action.start('logging time-track entry')

    await this.harvest.timeEntries.create({
      hours,
      notes,
      project_id: project.project.id,
      task_id: task.task.id,
      spent_date: new Date().toISOString()
    })

    cli.action.stop()
  }

  getProjects = async () => {
    cli.action.start('loading projects & tasks')

    const projects = await this.harvest.projectAssignments
      .me()
      // eslint-disable-next-line camelcase
      .then(({ project_assignments }) => project_assignments)

    cli.action.stop()

    return projects
  }

  prompt = () =>
    inquirer.prompt([
      {
        type: 'list',
        pageSize: 20,
        name: 'project',
        message: 'Project',
        choices: this.projectChoices
      },
      {
        type: 'list',
        pageSize: 20,
        name: 'task',
        message: 'Task',
        choices: this.taskChoices
      },
      {
        type: 'number',
        name: 'hours',
        message: 'Hours',
        validate: number => (Number.isNaN(number) ? 'Must be a number' : true)
      },
      {
        type: 'input',
        name: 'notes',
        message: 'Notes (optional)'
      }
    ])

  projectChoices = async () =>
    (await this.getProjects()).map(value => ({
      name: value.project.name,
      value
    }))

  taskChoices = ({ project }) =>
    project.task_assignments.map(value => ({ name: value.task.name, value }))
}

LogCommand.description = `Log time
...
Generate a new time-tracking log.
`

LogCommand.flags = {
  name: flags.string({ char: 'n', description: 'name to print' })
}

module.exports = LogCommand
