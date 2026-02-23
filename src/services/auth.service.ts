import { AppDataSource } from '../config/typeorm.js';
import { User, UserRole } from '../entities/User.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.utils.js';
import type { RegisterRequest, LoginRequest, AuthResponse } from '../types/index.js';

// ============================================
// Authentication Service
// ============================================

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const userRepository = AppDataSource.getRepository(User);

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Check if phone number is already in use
    if (data.phone) {
      const existingPhone = await userRepository.findOne({
        where: { phone: data.phone },
      });

      if (existingPhone) {
        throw new Error('User with this phone number already exists');
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = userRepository.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || null,
      role: UserRole.CUSTOMER, // Default role
    });

    await userRepository.save(user);

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
  }

  /**
   * Login a user
   */
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const userRepository = AppDataSource.getRepository(User);

    // Find user by email
    const user = await userRepository.findOne({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Your account has been deactivated. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string) {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'phone',
        'role',
        'isActive',
        'createdAt',
      ],
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
