<?php
namespace App\Controller\Api;

use App\Anomo\Anomo;
use App\Anomo\Serializer;
use App\Entity\Activity;
use App\Entity\User;
use App\Http\Exception\BadRequestException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * Class Controller
 */
class Controller extends AbstractController
{
    /**
     * @var EntityManagerInterface
     */
    protected $em;

    /**
     * @var Anomo
     */
    protected $anomo;

    /**
     * @var Serializer
     */
    protected $serializer;

    /**
     * Constructor
     *
     * @param EntityManagerInterface $em
     * @param Anomo $anomo
     * @param Serializer $serializer
     */
    public function __construct(EntityManagerInterface $em, Anomo $anomo, Serializer $serializer)
    {
        $this->em         = $em;
        $this->anomo      = $anomo;
        $this->serializer = $serializer;
    }

    /**
     * @return mixed
     */
    protected function getUser()
    {
        $user = $this->get('session')->get('user');
        if ($user) {
            $user = unserialize($user);
        }

        return $user;
    }

    /**
     * @param array $values
     * @param array $required
     * @return array
     */
    protected function getRequired(array $values, array $required)
    {
        foreach($required as $name) {
            if (!isset($values[$name])) {
                throw $this->createBadRequestException();
            }
        }

        return $values;
    }

    /**
     * @param string $message
     * @param \Exception|null $previous
     * @return BadRequestException
     */
    public function createBadRequestException(string $message = 'Bad Request.', \Exception $previous = null): BadRequestException
    {
        return new BadRequestException($message, $previous);
    }

    /**
     * @param array $activities
     * @return Activity[]
     */
    protected function saveActivities(array $activities)
    {
        $activityEntities = $this->serializer->unserializeActivities($activities);
        foreach($activityEntities as $ae) {
            $this->em->persist($ae);
        }
        $this->em->flush();

        return $activityEntities;
    }

    /**
     * @param array $activity
     * @return Activity
     */
    protected function saveActivity(array $activity)
    {
        $activityEntity = $this->serializer->unserializeActivity($activity);
        if ($activityEntity) {
            $this->em->persist($activityEntity);
            $this->em->flush();
        }

        return $activityEntity;
    }

    /**
     * @param array $user
     * @return User
     */
    protected function saveUser(array $user)
    {
        $userEntity = $this->serializer->unserializeUser($user);
        $this->em->persist($userEntity);
        $this->em->flush();

        return $userEntity;
    }
}
