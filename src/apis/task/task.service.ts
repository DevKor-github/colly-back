import { Injectable } from '@nestjs/common';
import { SubTaskRepository, TaskReposiotry } from './task.repository';
import { TaskDetailResDto } from './dtos/taskDetailRes.dto';
import { ListResDto } from 'src/common/dto/listRes.dto';
import { TaskListItemResDto } from './dtos/taskListItemRes.dto';
import { AddTaskReqDto } from './dtos/addTaskReq.dto';
import { MemberService } from '../member/member.service';
import { MsgResDto } from 'src/common/dto/msgRes.dto';
import { AddSubTaskReqDto } from './dtos/addSubTaskReq.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly memberService: MemberService,
    private readonly taskRepository: TaskReposiotry,
    private readonly subTaskRepository: SubTaskRepository,
  ) {}

  async getTaskDetail(taskId: number): Promise<TaskDetailResDto> {
    const task = await this.taskRepository.findTaskDetailById(taskId);

    //만약 subTask목록을 한방에 뽑을거라면 여기서 뽑아오면 될것 같음.

    return task;
  }

  async getTaskListByTeamIdAndState(
    teamId: number,
    state: number,
  ): Promise<ListResDto<TaskListItemResDto>> {
    const tasks = await this.taskRepository.findTaskListWtihCount({
      teamId,
      state,
    });

    return tasks;
  }

  async addTask(teamId: number, req: AddTaskReqDto) {
    const { memberId } = req;
    await this.memberService.checkIsMemberByMemberIdAndTeamId(memberId, teamId);

    await this.taskRepository.insert({
      teamId,
      ...req,
    });
    return MsgResDto.ret();
  }

  async addSubTask(taskId: number, req: AddSubTaskReqDto) {
    await this.subTaskRepository.insert({
      taskId,
      ...req,
    });

    return MsgResDto.ret();
  }
}
