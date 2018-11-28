<?php
namespace App\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="comment")
 * @ORM\Entity(repositoryClass="App\Repository\CommentRepository")
 */
class Comment
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
     * @var Activity
     * @ORM\ManyToOne(targetEntity="Activity", cascade={"all"})
     * @ORM\JoinColumn(name="activity_id", onDelete="CASCADE", referencedColumnName="id")
     */
    private $activity;

    /**
     * @var string
     * @ORM\Column(type="string", length=520, nullable=false)
     */
    private $content;

    /**
     * @var int
     * @ORM\Column(type="smallint", nullable=false, options={"unsigned" = true})
     */
    private $isAnonymous;

    /**
     * @var int
     * @ORM\Column(type="smallint", nullable=false, options={"unsigned" = true})
     */
    private $numLikes;

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
        $this->isAnonymous = 0;
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
     * @return int
     */
    public function getAnomoId(): int
    {
        return $this->anomoId;
    }

    /**
     * @param int $anomoId
     * @return Comment
     */
    public function setAnomoId(int $anomoId): Comment
    {
        $this->anomoId = $anomoId;
        return $this;
    }

    /**
     * @return Activity
     */
    public function getActivity(): Activity
    {
        return $this->activity;
    }

    /**
     * @param Activity $activity
     * @return Comment
     */
    public function setActivity(Activity $activity): Comment
    {
        $this->activity = $activity;
        return $this;
    }

    /**
     * @return string
     */
    public function getContent(): string
    {
        return $this->content;
    }

    /**
     * @param string $content
     * @return Comment
     */
    public function setContent(string $content): Comment
    {
        $this->content = $content;
        return $this;
    }

    /**
     * @return int
     */
    public function isAnonymous(): int
    {
        return $this->isAnonymous;
    }

    /**
     * @param int $isAnonymous
     * @return Comment
     */
    public function setIsAnonymous(int $isAnonymous): Comment
    {
        $this->isAnonymous = $isAnonymous;
        return $this;
    }

    /**
     * @return int
     */
    public function getNumLikes(): int
    {
        return $this->numLikes;
    }

    /**
     * @param int $numLikes
     * @return Comment
     */
    public function setNumLikes(int $numLikes): Comment
    {
        $this->numLikes = $numLikes;
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
     * @return Comment
     */
    public function setDateCreated(DateTime $dateCreated): Comment
    {
        $this->dateCreated = $dateCreated;
        return $this;
    }
}
