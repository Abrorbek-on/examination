import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // @Post()
    // CreateUser(@Body() payload: CreateUserDto){
    //     return this.userService.CreateUser(payload)
    // }

    // @Get()
    // ReadUser() {
    //     return this.userService.ReadUser()
    // }

    // @Put()
    // UpdateUser(@Param("id") payload: UpdateUserDto) {
    //     return this.userService.UpdateUser(payload)
    // }

    // @Delete()
    // DeleteUser(@Param('id') payload: UpdateUserDto) {
    //     return this.userService.DeleteUser(payload)
    // }


}
