<?php
namespace App\Repository;

use App\Entity\Comment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class CommentRepository
 */
class CommentRepository extends ServiceEntityRepository
{
    /**
     * Constructor
     *
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Comment::class);
    }

    /**
     * @param int $id
     *
     * @return Comment|object
     */
    public function findById($id)
    {
        return $this->find($id);
    }

    /**
     * @param int $anomoId
     * @return Comment|object
     */
    public function findByAnomoId($anomoId)
    {
        return $this->findOneBy(['anomoId' => $anomoId]);
    }
}
