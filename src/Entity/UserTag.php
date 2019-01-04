<?php
namespace App\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="user_tag")
 * @ORM\Entity(repositoryClass="App\Repository\UserTagRepository")
 */
class UserTag
{
    /**
     * @var int
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="bigint", options={"unsigned" = true})
     */
    private $id;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User", cascade={"all"})
     * @ORM\JoinColumn(name="user_to_id", onDelete="CASCADE", referencedColumnName="id")
     */
    private $userTo;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User", cascade={"all"})
     * @ORM\JoinColumn(name="user_from_id", onDelete="CASCADE", referencedColumnName="id")
     */
    private $userFrom;

    /**
     * @var string
     * @ORM\Column(type="string", length=60, nullable=false)
     */
    private $tag;

    /**
     * @var DateTime
     * @ORM\Column(type="datetime", nullable=false)
     */
    private $dateCreated;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->dateCreated = new DateTime();
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return User
     */
    public function getUserTo(): User
    {
        return $this->userTo;
    }

    /**
     * @param User $userTo
     * @return UserTag
     */
    public function setUserTo(User $userTo): UserTag
    {
        $this->userTo = $userTo;
        return $this;
    }

    /**
     * @return User
     */
    public function getUserFrom(): User
    {
        return $this->userFrom;
    }

    /**
     * @param User $userFrom
     * @return UserTag
     */
    public function setUserFrom(User $userFrom): UserTag
    {
        $this->userFrom = $userFrom;
        return $this;
    }

    /**
     * @return string
     */
    public function getTag(): string
    {
        return $this->tag;
    }

    /**
     * @param string $tag
     * @return UserTag
     */
    public function setTag(string $tag): UserTag
    {
        $this->tag = $tag;
        return $this;
    }

    /**
     * @return DateTime
     */
    public function getDateCreated(): DateTime
    {
        return $this->dateCreated;
    }

    /**
     * @param DateTime $dateCreated
     * @return UserTag
     */
    public function setDateCreated(DateTime $dateCreated): UserTag
    {
        $this->dateCreated = $dateCreated;
        return $this;
    }
}
