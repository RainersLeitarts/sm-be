#TODO

- Send tokens in auth headers, maybe
- Make the findXbyX models optionally throw an error if results are not found
  to avoid having to check results in services
- Make another column in the posts table "isEdited" to signify if post has been edited
  or check if "createdAt" matched "modifiedAt" when querying
- Implement body validation schemas for posts and elsewhere
- Make an error for when .env or some part of it is not provided
- Store user id in the auth and refresh tokens
- Implement blacklist for invalidated access tokens
- user related error message collection
