import Parse from 'parse'

import { Project } from '../project';

export interface IProjectFile extends Parse.Object {
  project?: Project;
  file?: Parse.File;
  name?: string;
  type?: string;
  url?: string;
  description?: string;
  originalUrl?: string;
  cdnUrl?: string;
}
