<?php
namespace App\Repository;

use App\Entity\User;
use App\Entity\UserTag;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class UserTagRepository
 */
class UserTagRepository extends ServiceEntityRepository
{
    /**
     * Constructor
     *
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, UserTag::class);
    }

    /**
     * @param int $id
     *
     * @return UserTag|object
     */
    public function findById($id)
    {
        return $this->find($id);
    }

    /**
     * @param User $userTo
     * @param User $userFrom
     * @return UserTag[]|array
     */
    public function findForUserTo(User $userTo, User $userFrom)
    {
        return $this->findBy([
            'userTo'   => $userTo,
            'userFrom' => $userFrom
        ]);
    }
}
