import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/typeorm.js';
import { User, UserRole } from '../entities/User.js';

const router = Router();

/**
 * Update user role to ADMIN
 * POST /api/v1/admin-utils/make-admin
 * Body: { "email": "user@example.com" }
 */
router.post('/make-admin', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);

    // Find user by email
    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: `User with email ${email} not found`,
      });
      return;
    }

    // Check if already admin
    if (user.role === UserRole.ADMIN) {
      res.json({
        success: true,
        message: `User ${email} is already an ADMIN`,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
      return;
    }

    // Update role to ADMIN
    user.role = UserRole.ADMIN;
    await userRepository.save(user);

    res.json({
      success: true,
      message: `Successfully updated ${email} to ADMIN role`,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Make admin error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update user role',
    });
  }
});

/**
 * List all users with their roles
 * GET /api/v1/admin-utils/users
 */
router.get('/users', async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const users = await userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive'],
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch users',
    });
  }
});

export default router;
