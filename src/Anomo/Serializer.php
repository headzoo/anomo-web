<?php
namespace App\Anomo;

use App\Entity\Activity;
use App\Entity\User;
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
     * Constructor
     *
     * @param EntityManagerInterface $em
     */
    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @param array $activities
     * @return Activity[]
     */
    public function unserializeActivities(array $activities)
    {
        $activityEntities = [];
        foreach($activities as $a) {
            $activityEntities[] = $this->unserializeActivity($a);
        }

        return $activityEntities;
    }

    /**
     * @param array $a
     * @return Activity
     */
    public function unserializeActivity(array $a)
    {
        $activityRepo = $this->em->getRepository(Activity::class);

        $a = array_merge([
            'Type'           => 0,
            'Like'           => 0,
            'Image'          => '',
            'Message'        => '',
            'Comment'        => 0,
            'VideoID'        => 0,
            'VideoSource'    => '',
            'VideoURL'       => '',
            'VideoThumbnail' => ''
        ], $a);
        if (!$a['Type']) {
            $a['Type'] = $a['ActionType'];
        }
        if (!$a['Message']) {
            $a['Message'] = json_encode(['message' => '', 'message_tags' => []]);
        }

        $activity = $activityRepo->findByAnomoId($a['ActivityID']);
        if (!$activity) {
            $user     = $this->unserializeUser($a);
            $message  = json_decode($a['Message'], true);
            if (!isset($message['message_tags']) || !is_array($message['message_tags'])) {
                $message['message_tags'] = [];
            }

            $activity = (new Activity())
                ->setAnomoId($a['ActivityID'])
                ->setRefId($a['RefID'])
                ->setActionType($a['ActionType'])
                ->setType($a['Type'])
                ->setUser($user)
                ->setImage($a['Image'])
                ->setMessage($message['message'])
                ->setTags(join(',', $message['message_tags']))
                ->setImage($a['Image'])
                ->setVideoId($a['VideoID'])
                ->setVideoSource($a['VideoSource'])
                ->setVideoURL($a['VideoURL'])
                ->setVideoThumbnail($a['VideoThumbnail'])
                ->setNumComments($a['Comment'])
                ->setNumLikes($a['Like']);
        } else {
            $activity->setNumComments($a['Comment']);
            $activity->setNumLikes($a['Like']);
        }

        return $activity;
    }

    /**
     * @param array $user
     * @return User
     */
    public function unserializeUser(array $user)
    {
        $anomoId    = isset($user['UserID']) ? $user['UserID'] : $user['FromUserID'];
        $username   = isset($user['UserName']) ? $user['UserName'] : $user['FromUserName'];
        $userRepo   = $this->em->getRepository(User::class);
        $userEntity = $userRepo->findByAnomoId($anomoId);

        if (!$userEntity) {
            $userEntity = (new User())
                ->setAnomoId($anomoId)
                ->setUsername($username)
                ->setAvatar($user['Avatar'])
                ->setGender($user['Gender'])
                ->setNeighborhoodId($user['NeighborhoodID'])
                ->setDateBirth(new \DateTime($user['BirthDate']));
        } else {
            $userEntity
                ->setUsername($username)
                ->setAvatar($user['Avatar'])
                ->setGender($user['Gender'])
                ->setNeighborhoodId($user['NeighborhoodID'])
                ->setDateBirth(new \DateTime($user['BirthDate']));
        }

        return $userEntity;
    }
}
