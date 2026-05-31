import { ReadColumnDTO } from '../../column/dtos/read-column.dto';

export interface ReadTaskDTO {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  position: number;
  assignedTo?: ReadTaskUserDTO;
  creator: ReadTaskUserDTO;
  column: ReadColumnDTO;
}

export interface ReadTaskUserDTO {
  id: string;
  name: string;
  email: string;
}

export interface ReadParentTaskDTO {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  position: number;
}
