<?php
namespace App\Repository;

use App\Entity\Poll;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class PollRepository
 */
class PollRepository extends ServiceEntityRepository
{
    /**
     * Constructor
     *
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Poll::class);
    }

    /**
     * @param int $id
     *
     * @return Poll|object
     */
    public function findById($id)
    {
        return $this->find($id);
    }
}
