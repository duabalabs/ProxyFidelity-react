import { SubClass } from '../initialize';
import { Address, ADDRESS_CLASSNAME } from './address';
import { Project, PROJECT_CLASSNAME } from './project';
import { ProjectFile, PROJECTFILE_CLASSNAME } from './projectFile';
import { User, USER_CLASSNAME } from './user';


const CustomSubClasses: SubClass[] = [
  {
    className: ADDRESS_CLASSNAME,
    class: Address as any,
  },
  {
    className: PROJECT_CLASSNAME,
    class: Project as any,
  },
  {
    className: PROJECTFILE_CLASSNAME,
    class: ProjectFile as any,
  },
  {
    className: USER_CLASSNAME,
    class: User as any,
  },
];
export const SubClasses: SubClass[] = [
  ...CustomSubClasses
];


export * from './address'
export * from './chat'
export * from './project'
export * from './projectFile'
export * from './user'