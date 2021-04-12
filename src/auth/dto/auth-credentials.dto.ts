import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {

    @IsString()
    @MinLength(4)
    @MaxLength(25)
    username: string;


    @IsString()
    @MinLength(8)
    @MaxLength(25)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'password too weak' }
    )
    password: string
}