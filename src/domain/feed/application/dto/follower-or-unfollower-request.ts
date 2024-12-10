export type FollowerOrUnfollowerRequest = {
  userId: string
  followerUserId: string
  follower: boolean
}
