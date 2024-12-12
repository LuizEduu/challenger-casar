import { UserWithFollowersAndPosts } from '@/domain/feed/enterprise/entities/value-objects/user-with-followers-and-posts'

export class HttpUsersPresenter {
  static toHTTP(user: UserWithFollowersAndPosts) {
    return {
      name: user.name,
      ingressedAt: user.ingressedAt,
      numberOfFollowers: user.numberOfFollowers,
      numberOfFolloweds: user.numberOfFolloweds,
      numberOfPosts: user.numberOfPosts,
      followedUsers: user.followedUsers.map((user) => ({
        userId: user.userId.toString(),
        name: user.name,
      })),
    }
  }
}
