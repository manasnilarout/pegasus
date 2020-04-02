import { Body, Get, JsonController, Param, Post } from 'routing-controllers';

import { User } from '../../../models/User';
import { UserService } from '../../../services/UserService';
import { User as Route } from '../../routes/http';

@JsonController(Route.BASE)
export class DeviceController {
    constructor(
        private userService: UserService
    ) { }

    @Post()
    public async createMR(@Body() user: User): Promise<User> {
        return await this.userService.createMR(user);
    }

    @Get(Route.ID)
    public async getUserById(@Param('userId') userId: string): Promise<User> {
        return await this.userService.getUserById(Number(userId));
    }
}
