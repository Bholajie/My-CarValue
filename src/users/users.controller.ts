import { Body, Controller, Post, Get, Patch,Param, 
    Query, Delete, NotFoundException, Session, UseGuards} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ){}

    @Get('/whoami')
    @UseGuards(AuthGuard)
    WhoAmI(@CurrentUser() user:User){
        return user;
    }

    @Post('/signup')
    async createuser(@Body() body: CreateUserDto, @Session() session: any){
        const user = await this.authService.Signup(body.email,body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any){
        const user = await this.authService.Signin(body.email,body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signout')
    SignOut(@Session() session:any){
        session.userId = null;
    }
    
    @Get('/:id')
    async findUser(@Param('id') id:string){
        const user = await this.userService.findOne(parseInt(id));
        if(!user){
            throw new NotFoundException('user not found');
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email:string){
        return this.userService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id:string){
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id:string, @Body() body:UpdateUserDto){
        this.userService.update(parseInt(id), body);
    }
}
