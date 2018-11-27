<?php
namespace App\Entity;

use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="activity")
 * @ORM\Entity(repositoryClass="App\Repository\ActivityRepository")
 */
class Activity
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
     * @ORM\JoinColumn(name="user_id", onDelete="CASCADE", referencedColumnName="id")
     */
    private $user;

    /**
     * @var int
     * @ORM\Column(type="bigint", nullable=false, options={"unsigned" = true})
     */
    private $anomoId;

    /**
     * @var int
     * @ORM\Column(type="bigint", nullable=false, options={"unsigned" = true})
     */
    private $refId;

    /**
     * @var int
     * @ORM\Column(type="smallint", nullable=false, options={"unsigned" = true})
     */
    private $actionType;

    /**
     * @var int
     * @ORM\Column(type="smallint", nullable=false, options={"unsigned" = true})
     */
    private $type;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $image;

    /**
     * @var int
     * @ORM\Column(type="smallint", nullable=false, options={"unsigned" = true})
     */
    private $imageHeight;

    /**
     * @var int
     * @ORM\Column(type="smallint", nullable=false, options={"unsigned" = true})
     */
    private $imageWidth;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $videoURL;

    /**
     * @var string
     * @ORM\Column(type="string", length=60, nullable=false)
     */
    private $videoId;

    /**
     * @var string
     * @ORM\Column(type="string", length=60, nullable=false)
     */
    private $videoSource;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $videoThumbnail;

    /**
     * @var int
     * @ORM\Column(type="smallint", nullable=false, options={"unsigned" = true})
     */
    private $numLikes;

    /**
     * @var int
     * @ORM\Column(type="smallint", nullable=false, options={"unsigned" = true})
     */
    private $numComments;

    /**
     * @var string
     * @ORM\Column(type="string", length=520, nullable=false)
     */
    private $message;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $tags;

    /**
     * @var Poll
     * @ORM\OneToOne(targetEntity="Poll", mappedBy="activity")
     */
    private $poll;

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
        $this->imageHeight = 0;
        $this->imageWidth  = 0;
        $this->tags        = new ArrayCollection();
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
    public function getUser(): User
    {
        return $this->user;
    }

    /**
     * @param User $user
     * @return Activity
     */
    public function setUser(User $user): Activity
    {
        $this->user = $user;
        return $this;
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
     * @return Activity
     */
    public function setAnomoId(int $anomoId): Activity
    {
        $this->anomoId = $anomoId;
        return $this;
    }

    /**
     * @return int
     */
    public function getRefId(): int
    {
        return $this->refId;
    }

    /**
     * @param int $refId
     * @return Activity
     */
    public function setRefId(int $refId): Activity
    {
        $this->refId = $refId;
        return $this;
    }

    /**
     * @return int
     */
    public function getActionType(): int
    {
        return $this->actionType;
    }

    /**
     * @param int $actionType
     * @return Activity
     */
    public function setActionType(int $actionType): Activity
    {
        $this->actionType = $actionType;
        return $this;
    }

    /**
     * @return int
     */
    public function getType(): int
    {
        return $this->type;
    }

    /**
     * @param int $type
     * @return Activity
     */
    public function setType(int $type): Activity
    {
        $this->type = $type;
        return $this;
    }

    /**
     * @return string
     */
    public function getImage(): string
    {
        return $this->image;
    }

    /**
     * @param string $image
     * @return Activity
     */
    public function setImage(string $image): Activity
    {
        $this->image = $image;
        return $this;
    }

    /**
     * @return int
     */
    public function getImageHeight(): int
    {
        return $this->imageHeight;
    }

    /**
     * @param int $imageHeight
     * @return Activity
     */
    public function setImageHeight(int $imageHeight): Activity
    {
        $this->imageHeight = $imageHeight;
        return $this;
    }

    /**
     * @return int
     */
    public function getImageWidth(): int
    {
        return $this->imageWidth;
    }

    /**
     * @param int $imageWidth
     * @return Activity
     */
    public function setImageWidth(int $imageWidth): Activity
    {
        $this->imageWidth = $imageWidth;
        return $this;
    }

    /**
     * @return string
     */
    public function getVideoURL(): string
    {
        return $this->videoURL;
    }

    /**
     * @param string $videoURL
     * @return Activity
     */
    public function setVideoURL(string $videoURL): Activity
    {
        $this->videoURL = $videoURL;
        return $this;
    }

    /**
     * @return string
     */
    public function getVideoId(): string
    {
        return $this->videoId;
    }

    /**
     * @param string $videoId
     * @return Activity
     */
    public function setVideoId(string $videoId): Activity
    {
        $this->videoId = $videoId;
        return $this;
    }

    /**
     * @return string
     */
    public function getVideoSource(): string
    {
        return $this->videoSource;
    }

    /**
     * @param string $videoSource
     * @return Activity
     */
    public function setVideoSource(string $videoSource): Activity
    {
        $this->videoSource = $videoSource;
        return $this;
    }

    /**
     * @return string
     */
    public function getVideoThumbnail(): string
    {
        return $this->videoThumbnail;
    }

    /**
     * @param string $videoThumbnail
     * @return Activity
     */
    public function setVideoThumbnail(string $videoThumbnail): Activity
    {
        $this->videoThumbnail = $videoThumbnail;
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
     * @return Activity
     */
    public function setNumLikes(int $numLikes): Activity
    {
        $this->numLikes = $numLikes;
        return $this;
    }

    /**
     * @return int
     */
    public function getNumComments(): int
    {
        return $this->numComments;
    }

    /**
     * @param int $numComments
     * @return Activity
     */
    public function setNumComments(int $numComments): Activity
    {
        $this->numComments = $numComments;
        return $this;
    }

    /**
     * @return string
     */
    public function getMessage(): string
    {
        return $this->message;
    }

    /**
     * @param string $message
     * @return Activity
     */
    public function setMessage(string $message): Activity
    {
        $this->message = $message;
        return $this;
    }

    /**
     * @return string
     */
    public function getTags(): string
    {
        return $this->tags;
    }

    /**
     * @param string $tags
     * @return Activity
     */
    public function setTags(string $tags): Activity
    {
        $this->tags = $tags;
        return $this;
    }

    /**
     * @return Poll
     */
    public function getPoll(): Poll
    {
        return $this->poll;
    }

    /**
     * @param Poll $poll
     * @return Activity
     */
    public function setPoll(Poll $poll): Activity
    {
        $this->poll = $poll;
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
     * @return Activity
     */
    public function setDateCreated(DateTime $dateCreated): Activity
    {
        $this->dateCreated = $dateCreated;
        return $this;
    }
}
