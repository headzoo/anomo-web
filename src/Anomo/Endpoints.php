<?php

namespace App\Anomo;

/**
 * Class Endpoints
 */
class Endpoints
{
    const BASE_URL = 'https://ws.anomo.com/v101/index.php/webservice';

    /**
     * @var array
     */
    protected static $endpoints = [
        'user'                 => '/user/get_user_info/{token}/{userID}',
        'userLogin'            => '/user/login',
        'userFBLogin'          => '/user/login_with_fb',
        'userLogout'           => '/user/logout/{token}',
        'userBlock'            => '/user/block_user/{token}/{userID}',
        'userBlocked'          => '/user/get_blocked_users/{token}/{userID}',
        'userFollow'           => '/user/follow/{token}/{userID}',
        'userFollowers'        => '/user/get_list_follower/{token}/{userID}/{page}',
        'userFollowing'        => '/user/get_list_following/{token}/{userID}/{page}',
        'userStatus'           => '/user/post_status/{token}',
        'userSearch'           => '/user/search_user/{token}/{userID}/{latitude}/{longitude}/1/0/18/100',
        'userPicture'          => '/user/post_picture_activity/{token}',
        'userUpdate'           => '/user/update/{token}',
        'userUpdatePassword'   => '/profile/change_password/{token}',
        'userUpdatePrivacy'    => '/user/update_privacy/{token}/{userID}',
        'anomoListIntent'      => '/user/list_intent',
        'anomoListInterest'    => '/user/list_interests',
        'feed'                 => '/activity/get_activities/{token}/{actionType}/{feedType}/-1/{gender}/{minAge}/{maxAge}/{lastActivityID}/0',
        'feedProfile'          => '/profile/get_user_post/{token}/{userID}/0/{lastActivityID}',
        'feedHashtag'          => '/activity/get_activities/{token}/{page}/0/-1/0/18/100/0/0',
        'activity'             => '/activity/detail/{token}/{refID}/{actionType}',
        'activityDelete'       => '/user/delete_activity/{token}/{activityID}',
        'activityLike'         => '/activity/like/{token}/{refID}/{actionType}/false',
        'activityLikeList'     => '/activity/likelist/{token}/{refID}/{actionType}',
        'activityAnswerPoll'   => '/poll/answer_poll/{token}/{pollID}/{answerID}',
        'comment'              => '/activity/comment/{token}/{refID}/{actionType}',
        'commentLike'          => '/comment/like/{token}/{commentID}/{actionType}',
        'commentLikeList'      => '/comment/likelist/{token}/{commentID}/{actionType}',
        'commentDelete'        => '/comment/delete/{token}/{commentID}',
        'commentStopNotify'    => '/comment/stop_receive_notify/{token}/{refID}/{actionType}',
        'trendingHashtags'     => '/activity/trending_hashtag/{token}/0',
        'notificationsHistory' => '/push_notification/get_notification_history/{token}/{status}/{page}',
        'notificationsRead'    => '/push_notification/read/{token}/{notificationID}/46/33'
    ];

    /**
     * @var array
     */
    protected $defaultParams = [];

    /**
     * @param string $name
     * @param string $value
     * @return $this
     */
    public function setDefaultParam($name, $value)
    {
        $this->defaultParams[$name] = $value;
        return $this;
    }

    /**
     * @param string $endpoint
     * @param array $params
     * @return string
     */
    public function create($endpoint, $params = [])
    {
        $url = self::$endpoints[$endpoint];
        foreach (array_merge($this->defaultParams, $params) as $name => $value) {
            $url = str_replace('{' . $name . '}', $value, $url);
        }

        return self::BASE_URL . $url;
    }
}
