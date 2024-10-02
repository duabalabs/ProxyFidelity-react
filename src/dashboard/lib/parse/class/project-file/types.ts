import Parse from 'parse'
import { User } from '../user';
import { Project } from '../project';

export interface IProjectFile extends Parse.Object {
  project: Project;
  file: Parse.File;
  name: string;
  description: string;
}
