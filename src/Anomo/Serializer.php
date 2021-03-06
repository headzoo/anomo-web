<?php
namespace App\Anomo;

use App\Entity\Activity;
use App\Entity\Comment;
use App\Entity\User;
use App\Entity\UserTag;
use App\Repository\UserTagRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class Serializer
 */
class Serializer
{
    /**
     * @var EntityManagerInterface
     */
    private $em;

    /**
     * @var UserTagRepository
     */
    private $repoUserTag;

    /**
     * Constructor
     *
     * @param EntityManagerInterface $em
     */
    public function __construct(EntityManagerInterface $em)
    {
        $this->em          = $em;
        $this->repoUserTag = $em->getRepository(UserTag::class);
    }

    /**
     * @param array $activities
     * @return Activity[]
     */
    public function unserializeActivities(array $activities)
    {
        $activityEntities = [];
        foreach($activities as $a) {
            $activity = $this->unserializeActivity($a);
            if ($activity) {
                $activityEntities[] = $activity;
            }
        }

        return $activityEntities;
    }

    /**
     * @param array $activity
     * @return Activity
     */
    public function unserializeActivity(array $activity)
    {
        $activityRepo = $this->em->getRepository(Activity::class);

        $activity = array_merge([
            'Type'           => 0,
            'Like'           => 0,
            'Image'          => '',
            'Message'        => '',
            'Comment'        => 0,
            'VideoID'        => 0,
            'VideoSource'    => '',
            'VideoURL'       => '',
            'VideoThumbnail' => '',
            'IsAnonymous'    => 0
        ], $activity);
        if (!$activity['Type']) {
            $activity['Type'] = $activity['ActionType'];
        }
        if (!$activity['Message']) {
            $activity['Message'] = json_encode(['message' => '', 'message_tags' => []]);
        }

        $activityEntity = $activityRepo->findByAnomoId($activity['ActivityID']);
        if (!$activityEntity) {
            $user = $this->unserializeUser($activity);
            if (!$user) {
                return null;
            }

            $message = json_decode($activity['Message'], true);
            if (!isset($message['message_tags']) || !is_array($message['message_tags'])) {
                $message['message_tags'] = [];
            }

            $activityEntity = (new Activity())
                ->setAnomoId($activity['ActivityID'])
                ->setRefId($activity['RefID'])
                ->setActionType($activity['ActionType'])
                ->setType($activity['Type'])
                ->setIsAnonymous($activity['IsAnonymous'])
                ->setUser($user)
                ->setImage($activity['Image'])
                ->setMessage($message['message'])
                ->setTags(json_encode($message['message_tags']))
                ->setImage($activity['Image'])
                ->setVideoId($activity['VideoID'])
                ->setVideoSource($activity['VideoSource'])
                ->setVideoURL($activity['VideoURL'])
                ->setVideoThumbnail($activity['VideoThumbnail'])
                ->setNumComments($activity['Comment'])
                ->setNumLikes($activity['Like'])
                ->setDateCreated(new DateTime($activity['CreatedDate']));
        } else {
            $activityEntity->setNumComments($activity['Comment']);
            $activityEntity->setNumLikes($activity['Like']);
        }

        return $activityEntity;
    }

    /**
     * @param array $comment
     * @param Activity $activity
     * @return Comment|object
     */
    public function unserializeComment(array $comment, Activity $activity)
    {
        $commentRepo = $this->em->getRepository(Comment::class);

        $comment = array_merge([
            'Content'      => '',
            'NumberOfLike' => 0,
            'IsAnonymous'  => 0
        ], $comment);

        $commentEntity = $commentRepo->findByAnomoId($comment['ID']);
        if (!$commentEntity) {
            $commentEntity = (new Comment())
                ->setAnomoId($comment['ID'])
                ->setContent($comment['Content'])
                ->setIsAnonymous($comment['IsAnonymous'])
                ->setNumLikes($comment['NumberOfLike'])
                ->setActivity($activity)
                ->setDateCreated(new DateTime($comment['CreatedDate']));
        } else {
            $commentEntity->setNumLikes($comment['NumberOfLike']);
        }

        return $commentEntity;
    }

    /**
     * @param array $user
     * @return User
     */
    public function unserializeUser(array $user)
    {
        if (!empty($user['IsAnonymous'])) {
            $user['UserID']         = 0;
            $user['UserName']       = 'anonymous';
            $user['Avatar']         = '';
            $user['Gender']         = 0;
            $user['NeighborhoodID'] = 0;
            $user['BirthDate']      = date('Y-m-d H:i:s');
        }

        $anomoId = isset($user['UserID']) ? $user['UserID'] : $user['FromUserID'];
        if (empty($user['UserName']) && empty($user['FromUserName'])) {
            $username = $anomoId;
        } else {
            $username = isset($user['UserName']) ? $user['UserName'] : $user['FromUserName'];
        }
        if (empty($user['NeighborhoodID'])) {
            $user['NeighborhoodID'] = 0;
        }
        if (empty($user['Avatar'])) {
            $user['Avatar'] = '';
        }

        $userRepo   = $this->em->getRepository(User::class);
        $userEntity = $userRepo->findByAnomoId($anomoId);

        if (!$userEntity) {
            $userEntity = (new User())
                ->setAnomoId($anomoId)
                ->setUsername($username)
                ->setAvatar($user['Avatar'])
                ->setGender($user['Gender'])
                ->setNeighborhoodId($user['NeighborhoodID'])
                ->setDateBirth(new DateTime($user['BirthDate']));
        } else {
            $userEntity
                ->setUsername($username)
                ->setAvatar($user['Avatar'])
                ->setGender($user['Gender'])
                ->setNeighborhoodId($user['NeighborhoodID'])
                ->setDateBirth(new DateTime($user['BirthDate']));
        }

        return $userEntity;
    }

    /**
     * @param Activity[] $activities
     * @param array $original
     * @return array
     */
    public function serializeActivities(array $activities, array $original)
    {
        $serialized = [];
        for($i = 0, $l = count($activities); $i < $l; $i++) {
            if ($activities[$i]->getActionType() !== 28) {
                $serialized[] = $this->serializeActivity($activities[$i], $original[$i]);
            }
        }

        return $serialized;
    }

    /**
     * @param Activity $activity
     * @param array $original
     * @return array
     */
    public function serializeActivity(Activity $activity, array $original)
    {
        $original = array_merge([
            'Type'           => 0,
            'Like'           => 0,
            'Image'          => '',
            'Message'        => '',
            'Comment'        => 0,
            'VideoID'        => 0,
            'VideoSource'    => '',
            'VideoURL'       => '',
            'VideoThumbnail' => '',
            'IsAnonymous'    => 0,
            'IsFavorite'     => 0,
            'IsLike'         => 0
        ], $original);

        $user = $this->serializeUser($activity->getUser());

        $serialized = [
            'ActivityID'     => $activity->getAnomoId(),
            'Image'          => $activity->getImage(),
            'RefID'          => $activity->getRefId(),
            'Type'           => $activity->getType(),
            'ActionType'     => $activity->getActionType(),
            'CreatedDate'    => $activity->getDateCreated()->format('Y-m-d H:i:s'),
            'Gender'         => $user['Gender'],
            'BirthDate'      => $user['BirthDate'],
            'NeighborhoodID' => $user['NeighborhoodID'],
            'Avatar'         => $user['Avatar'],
            'IsAnonymous'    => $original['IsAnonymous'],
            'IsFavorite'     => $original['IsFavorite'],
            'IsLike'         => $original['IsLike'],
            'Like'           => $original['Like'],
            'Comment'        => $original['Comment'],
            'ImageHeight'    => $activity->getImageHeight(),
            'ImageWidth'     => $activity->getImageWidth(),
            'VideoID'        => $activity->getVideoId(),
            'VideoSource'    => $activity->getVideoSource(),
            'VideoThumbnail' => $activity->getVideoThumbnail(),
            'VideoURL'       => $activity->getVideoURL(),
            'Message'        => json_encode([
                'message'      => $activity->getMessage(),
                'message_tags' => json_decode($activity->getTags(), true)
            ])
        ];

        if (isset($original['FromUserID'])) {
            $serialized['FromUserID']   = $user['UserID'];
            $serialized['FromUserName'] = $user['UserName'];
        } else if (isset($original['UserID'])) {
            $serialized['UserID']   = $user['UserID'];
            $serialized['UserName'] = $user['UserName'];
        }

        if (isset($original['Poll'])) {
            $serialized['Poll'] = $original['Poll'];
        }

        return $serialized;
    }

    /**
     * @param User $user
     * @param array $original
     * @return array
     */
    public function serializeUser(User $user, array $original = [])
    {
        // $tags = $this->repoUserTag->findForUserTo($user);

        return array_merge($original, [
            'UserID'         => $user->getAnomoId(),
            'UserName'       => $user->getUsername(),
            'Gender'         => $user->getGender(),
            'BirthDate'      => $user->getDateBirth()->format('Y-m-d'),
            'NeighborhoodID' => $user->getNeighborhoodId(),
            'Avatar'         => $user->getAvatar()
        ]);
    }
}
