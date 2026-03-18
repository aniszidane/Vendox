// VendoX Backend — Auth DTOs

import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ── Register ──────────────────────────────────────────────────────
export class RegisterDto {
  @ApiProperty({ example: 'user@example.dz' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'MyPassword123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @ApiProperty({ example: 'Anis Beloufa' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @ApiPropertyOptional({ example: 'anis_b' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' })
  username?: string;
}

// ── Login ─────────────────────────────────────────────────────────
export class LoginDto {
  @ApiProperty({ example: 'user@example.dz' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'MyPassword123!' })
  @IsString()
  @MinLength(1)
  password: string;
}

// ── Refresh Token ─────────────────────────────────────────────────
export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

// ── Forgot Password ───────────────────────────────────────────────
export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.dz' })
  @IsEmail()
  email: string;
}

// ── Reset Password ────────────────────────────────────────────────
export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  newPassword: string;
}
