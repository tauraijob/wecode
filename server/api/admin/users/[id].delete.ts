import prisma from '~~/server/utils/db'
import { getCurrentUser } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  if (!user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  
  const userId = getRouterParam(event, 'id')
  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID required' })
  }
  
  // Prevent deleting yourself
  if (userId === user.id) {
    throw createError({ statusCode: 400, statusMessage: 'Cannot delete your own account' })
  }
  
  // Check if user exists
  const userToDelete = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true }
  })
  
  if (!userToDelete) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }
  
  // Delete related records that don't have cascade delete
  // Delete in order to respect foreign key constraints
  // Use a transaction to ensure all-or-nothing deletion
  
  await prisma.$transaction(async (tx) => {
    // 1. Delete enrollments first (they may reference invoices, but invoiceId is optional)
    // This will cascade delete related records (progress, exam attempts, etc.)
    await tx.enrollment.deleteMany({
      where: { userId }
    })
    
    // 2. Delete invoices (after enrollments are deleted)
    // This will cascade delete related payments
    await tx.invoice.deleteMany({
      where: { userId }
    })
    
    // 3. Delete requests (which may have had invoices, but we deleted invoices first)
    await tx.request.deleteMany({
      where: { userId }
    })
    
    // 4. Delete quotes
    await tx.quote.deleteMany({
      where: { userId }
    })
    
    // 5. Delete magic links
    await tx.magicLink.deleteMany({
      where: { userId }
    })
    
    // 6. Delete subscriptions
    await tx.subscription.deleteMany({
      where: { userId }
    })
    
    // 7. Update schools to remove owner (set to null)
    await tx.school.updateMany({
      where: { ownerId: userId },
      data: { ownerId: null }
    })
    
    // 8. Delete user (cascade will handle remaining records with onDelete: Cascade)
    await tx.user.delete({
      where: { id: userId }
    })
  })
  
  return { success: true, message: 'User deleted successfully' }
})

