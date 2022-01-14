import CLI from './src/cli';
import commander, { Command } from 'commander';

const command: commander.Command = new Command();

new CLI(command).setUI().enableCreateAPIUserCommand().build();
