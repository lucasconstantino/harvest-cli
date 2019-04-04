import git from 'simple-git/promise'

import { prompt } from '~lib/prompt'
import { edit } from '~lib/editor'

import LogCreateCommand from './index'

class LogGitCommand extends LogCreateCommand {
  async run () {
    const {
      args: { ref }
    } = this.parse(LogGitCommand)

    const [from, to] = ref.split('..')

    const repo = git(process.cwd())
    const commits = (await repo.log({ from, to: to || 'HEAD' })).all

    const notes = await edit(commits.map(({ message }) => message).join('\n'))

    this.newLine()

    const projects = await this.loadProjects()
    const { project, task, hours } = await prompt(this.getPrompts({ projects }))

    await this.confirmData({ project, task, hours, notes })
    await this.logEntry({ project, task, hours, notes })
  }

  getPrompts ({ projects }) {
    return super.getPrompts({ projects }).filter(({ name }) => name !== 'notes')
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
