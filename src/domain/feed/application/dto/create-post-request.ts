export type CreatePostRequest = {
  content: string
  ownerId: string
  originalPostId?: string | null
}