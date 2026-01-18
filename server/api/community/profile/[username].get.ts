/**
 * Get Public Profile by Username
 * GET /api/community/profile/[username]
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const username = getRouterParam(event, 'username')

    if (!username) {
        throw createError({ statusCode: 400, statusMessage: 'Username is required' })
    }

    try {
        const profile = await prisma.communityProfile.findUnique({
            where: { username: username.toLowerCase() },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        createdAt: true,
                        _count: {
                            select: {
                                forumPosts: true,
                                forumComments: true
                            }
                        }
                    }
                }
            }
        })

        if (!profile) {
            throw createError({ statusCode: 404, statusMessage: 'Profile not found' })
        }

        if (!profile.isPublic) {
            throw createError({ statusCode: 403, statusMessage: 'This profile is private' })
        }

        return {
            username: profile.username,
            profession: profile.profession,
            experienceLevel: profile.experienceLevel,
            languages: profile.languages ? profile.languages.split(',').map(l => l.trim()) : [],
            bio: profile.bio,
            location: profile.location,
            githubUrl: profile.githubUrl,
            linkedinUrl: profile.linkedinUrl,
            websiteUrl: profile.websiteUrl,
            avatarUrl: profile.avatarUrl,
            user: {
                id: profile.user.id,
                name: profile.user.name,
                role: profile.user.role,
                joinedAt: profile.user.createdAt,
                stats: {
                    posts: profile.user._count.forumPosts,
                    comments: profile.user._count.forumComments
                }
            }
        }
    } catch (error: any) {
        if (error.statusCode) throw error
        console.error('Profile fetch error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch profile'
        })
    }
})
