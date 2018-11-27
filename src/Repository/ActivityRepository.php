<?php
namespace App\Repository;

use App\Entity\Activity;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class ActivityRepository
 */
class ActivityRepository extends ServiceEntityRepository
{
    /**
     * Constructor
     *
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Activity::class);
    }

    /**
     * @param int $id
     *
     * @return Activity|object
     */
    public function findById($id)
    {
        return $this->find($id);
    }

    /**
     * @param int $anomoId
     * @return Activity|object
     */
    public function findByAnomoId($anomoId)
    {
        return $this->findOneBy(['anomoId' => $anomoId]);
    }
}
