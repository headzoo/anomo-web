<?php
namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class UserRepository
 */
class UserRepository extends ServiceEntityRepository
{
    /**
     * Constructor
     *
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * @param int $id
     *
     * @return User|object
     */
    public function findById($id)
    {
        return $this->find($id);
    }

    /**
     * @param int $anomoId
     * @return User|object
     */
    public function findByAnomoId($anomoId)
    {
        return $this->findOneBy(['anomoId' => $anomoId]);
    }
}
