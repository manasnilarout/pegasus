import {
    Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams
} from 'routing-controllers';

import UserFindRequest from '../../../api/request/UserFindRequest';
import FindResponse from '../../../api/response/FindResponse';
import { User } from '../../../models/User';
import { UserTokens } from '../../../models/UserTokens';
import { UserService } from '../../../services/UserService';
import { User as Route } from '../../routes/http';
import { LoginCredentials } from '../requests/LoginCredentials';

@JsonController(Route.BASE)
export class DeviceController {
    constructor(
        private userService: UserService
    ) { }

    @Authorized()
    @Post()
    public async createMR(@Body() user: User, @CurrentUser() loggedInUser: User): Promise<User> {
        return await this.userService.createMR(user, loggedInUser);
    }

    @Authorized()
    @Get(Route.ID)
    public async getUserById(@Param('userId') userId: string): Promise<User> {
        return await this.userService.getUserById(Number(userId));
    }

    @Post(Route.LOGIN)
    public async loginUser(@Body() loginDetails: LoginCredentials): Promise<UserTokens> {
        return await this.userService.loginUser(loginDetails);
    }

    @Authorized()
    @Put(Route.ID)
    public async editUser(@Param('userId') userId: string, @Body() user: User): Promise<User> {
        return await this.userService.editUser(Number(userId), user);
    }

    @Authorized()
    @Delete(Route.ID)
    public async deleteUser(@Param('userId') userId: string): Promise<User> {
        return await this.userService.deactivateUser(Number(userId));
    }

    @Authorized()
    @Get()
    public async getUsers(@QueryParams() params: UserFindRequest): Promise<FindResponse<User>> {
        return await this.userService.getUsers(params);
    }
}
