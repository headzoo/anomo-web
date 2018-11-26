## Authentication
All endpoints except the login endpoints must have an `Authoriztion` header, which includes the token returned by the login endpoints. The format of the header is as follows:

```
Authorization: token {token}
```

Where `{token}` is the token value returned by the login endpoint.

## Feeds

##### GET /api/v1/feeds/{name}
Returns a list of activities in the `{name}` feed. Possible values for `{name}` are "recent", "following", and "popular".

Query params:
* `lastActivityID={number}` Return activities with an ID greater than this number. Defaults to 0.

##### GET /api/v1/feeds/users/{userID}
Returns a list of activities for the given user.

Query params:
* `lastActivityID={number}` Return activities with an ID greater than this number. Defaults to 0.

##### GET /api/v1/feeds/hashtags/{hashtag}
Returns a list of activities with the `{hashtag}` hashtag.

##### GET /api/v1/feeds/hashtags/_trending
Returns a list of trending hashtags.

## Activities

##### POST /api/v1/activities
Submits a new activity.

POST params:
* `ProfileStatus={json}`
* `IsAnonymous={number}`
* `TopicID={number}`

When uploading a picture or video use the following POST params:
* `PictureCaption={string}`
* `Photo={file}`
* `Video={file}`

##### DELETE /api/v1/activities/{activityID}
Deletes the activity with the given ID.

##### GET /api/v1/activities/{refID}/{actionType}
Returns the activity with the given refID and actionType.

##### GET /api/v1/activities/{refID}/{actionType}/likes
Returns a list of users that liked the activity.

##### PUT /api/v1/activities/{refID}/{actionType}/likes
Like or unlike the given activity.

##### PUT /api/v1/activities/{refID}/{actionType}/notifications
Turns notifications on/off for the given activity.

##### PUT /api/v1/activities/polls/{pollID}/{answerID}
Answers the given poll with the given answer.

## Comments

##### POST /api/v1/comments
Submits a new comment.

POST params:
* `ActionType={number}`
* `RefID={number}`
* `Content={string}`
* `IsAnonymous={number}`

##### DELETE /api/v1/comments/{commentID}
Deletes the comment with the given ID.

##### GET /api/v1/comments/{commentID}/{actionType}/likes
Returns a list of users who liked the given comment.

##### PUT /api/v1/comments/{commentID}/{actionType}/likes
Likes or unlikes the given comment.

## Notifications

##### GET /api/v1/notifications
Returns a list of unread notifications.

##### DELETE /api/v1/notifications
Marks all notifications as read.

##### DELETE /api/v1/notifications/{notificationID}
Marks the given notifications as read.

## Users

##### POST /api/v1/users/login
Logs a user into the app.

POST params:
* `UserName={string}`
* `Password={string}`

##### POST /api/v1/users/login/facebook
Logs a user in using credentials from Facebook.

POST params:
* `Email={string}`
* `FacebookID={number}`
* `FbAccessToken={string}`

##### POST /api/v1/users/logout
Logs the user out of the app.

##### GET /api/v1/users/{userID}
Returns the details of the given user.

##### POST /api/v1/users/{userID}
Updates the profile of the given user.

##### POST /api/v1/users/{userID}/password
Updates the user's password.

POST params:
* `OldPassword={string}`
* `NewPassword={string}`

##### POST /api/v1/users/{userID}/privacy
Updates the user's privacy settings.

##### GET /api/v1/users/{userID}/following
Returns a list of users the given user is following.

Query params:
* `page={number}`

##### GET /api/v1/users/{userID}/followers
Returns a list of users following the given user.

##### PUT /api/v1/users/{userID}/followers
Adds to the given user's list of followers.

POST params:
* `userID={number}` ID of the user to follow

##### GET /api/v1/users/{userID}/blocked
Returns a list of users the given user has blocked.

##### PUT /api/v1/users/{userID}/blocked
Adds a blocked user to the given user.

POST params:
* `userID={number}` ID of the user to block

## Anomo

##### GET /api/v1/anomo/intents
Returns a list of anomo intents.

##### GET /api/v1/anomo/interest
Returns a list of anomo interests.

## Search

##### GET /api/v1/search/users/{userID}/{latitude}/{longitude}
Searches for users.
