<?php
namespace App\Entity;

use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Table(name="user")
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User implements UserInterface
{
    /**
     * @var int
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="bigint", options={"unsigned" = true})
     */
    private $id;

    /**
     * @var int
     * @ORM\Column(type="bigint", nullable=false, options={"unsigned" = true})
     */
    private $anomoId;

    /**
     * @var string
     * @ORM\Column(type="string", length=60, nullable=false)
     */
    private $username;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $avatar;

    /**
     * @var int
     * @ORM\Column(type="smallint", nullable=false, options={"unsigned" = true})
     */
    private $gender;

    /**
     * @var DateTime
     * @ORM\Column(type="datetime", nullable=false)
     */
    private $dateBirth;

    /**
     * @var int
     * @ORM\Column(type="integer", nullable=false, options={"unsigned" = true})
     */
    private $neighborhoodId;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="Activity", mappedBy="user")
     */
    private $activities;

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
        $this->gender         = 0;
        $this->neighborhoodId = 0;
        $this->dateBirth      = new DateTime();
        $this->dateCreated    = new DateTime();
        $this->activities     = new ArrayCollection();
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return int
     */
    public function getAnomoId(): int
    {
        return $this->anomoId;
    }

    /**
     * @param int $anomoId
     * @return User
     */
    public function setAnomoId(int $anomoId): User
    {
        $this->anomoId = $anomoId;
        return $this;
    }

    /**
     * @return string
     */
    public function getUsername(): string
    {
        return $this->username;
    }

    /**
     * @param string $username
     * @return User
     */
    public function setUsername(string $username): User
    {
        $this->username = $username;
        return $this;
    }

    /**
     * @return string
     */
    public function getAvatar(): string
    {
        return $this->avatar;
    }

    /**
     * @param string $avatar
     * @return User
     */
    public function setAvatar(string $avatar): User
    {
        $this->avatar = $avatar;
        return $this;
    }

    /**
     * @return int
     */
    public function getGender(): int
    {
        return $this->gender;
    }

    /**
     * @param int $gender
     * @return User
     */
    public function setGender(int $gender): User
    {
        $this->gender = $gender;
        return $this;
    }

    /**
     * @return DateTime
     */
    public function getDateBirth(): DateTime
    {
        return $this->dateBirth;
    }

    /**
     * @param DateTime $dateBirth
     * @return User
     */
    public function setDateBirth(DateTime $dateBirth): User
    {
        $this->dateBirth = $dateBirth;
        return $this;
    }

    /**
     * @return int
     */
    public function getNeighborhoodId(): int
    {
        return $this->neighborhoodId;
    }

    /**
     * @param int $neighborhoodId
     * @return User
     */
    public function setNeighborhoodId(int $neighborhoodId): User
    {
        $this->neighborhoodId = $neighborhoodId;
        return $this;
    }

    /**
     * @return Collection
     */
    public function getActivities(): Collection
    {
        return $this->activities;
    }

    /**
     * @param Collection $activities
     * @return User
     */
    public function setActivities(Collection $activities): User
    {
        $this->activities = $activities;
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
     * @return User
     */
    public function setDateCreated(DateTime $dateCreated): User
    {
        $this->dateCreated = $dateCreated;
        return $this;
    }

    /**
     * Returns the roles granted to the user.
     *
     *     public function getRoles()
     *     {
     *         return array('ROLE_USER');
     *     }
     *
     * Alternatively, the roles might be stored on a ``roles`` property,
     * and populated in any number of different ways when the user object
     * is created.
     *
     * @return (Role|string)[] The user roles
     */
    public function getRoles()
    {
        return [];
    }

    /**
     * Returns the password used to authenticate the user.
     *
     * This should be the encoded password. On authentication, a plain-text
     * password will be salted, encoded, and then compared to this value.
     *
     * @return string The password
     */
    public function getPassword()
    {
        return '';
    }

    /**
     * Returns the salt that was originally used to encode the password.
     *
     * This can return null if the password was not encoded using a salt.
     *
     * @return string|null The salt
     */
    public function getSalt()
    {
        return '';
    }

    /**
     * Removes sensitive data from the user.
     *
     * This is important if, at any given point, sensitive information like
     * the plain-text password is stored on this object.
     */
    public function eraseCredentials()
    {
        
    }
}
