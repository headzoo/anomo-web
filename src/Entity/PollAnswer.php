<?php
namespace App\Entity;

use DateTime;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="poll_answer")
 * @ORM\Entity
 */
class PollAnswer
{
    /**
     * @var int
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="bigint", options={"unsigned" = true})
     */
    private $id;

    /**
     * @var Collection
     * @ORM\ManyToOne(targetEntity="Poll", cascade={"all"})
     * @ORM\JoinColumn(name="poll_id", onDelete="CASCADE", referencedColumnName="id")
     */
    private $poll;

    /**
     * @var int
     * @ORM\Column(type="bigint", nullable=false, options={"unsigned" = true})
     */
    private $anomoId;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $answer;

    /**
     * @var float
     * @ORM\Column(type="decimal", precision=4, scale=2)
     */
    private $percent;

    /**
     * @var int
     * @ORM\Column(type="smallint", nullable=false, options={"unsigned" = true})
     */
    private $numVotes;

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
        $this->numVotes    = 0;
        $this->percent     = 0.0;
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
     * @return Collection
     */
    public function getPoll(): Collection
    {
        return $this->poll;
    }

    /**
     * @param Collection $poll
     * @return PollAnswer
     */
    public function setPoll(Collection $poll): PollAnswer
    {
        $this->poll = $poll;
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
     * @return PollAnswer
     */
    public function setAnomoId(int $anomoId): PollAnswer
    {
        $this->anomoId = $anomoId;
        return $this;
    }

    /**
     * @return string
     */
    public function getAnswer(): string
    {
        return $this->answer;
    }

    /**
     * @param string $answer
     * @return PollAnswer
     */
    public function setAnswer(string $answer): PollAnswer
    {
        $this->answer = $answer;
        return $this;
    }

    /**
     * @return float
     */
    public function getPercent(): float
    {
        return $this->percent;
    }

    /**
     * @param float $percent
     * @return PollAnswer
     */
    public function setPercent(float $percent): PollAnswer
    {
        $this->percent = $percent;
        return $this;
    }

    /**
     * @return int
     */
    public function getNumVotes(): int
    {
        return $this->numVotes;
    }

    /**
     * @param int $numVotes
     * @return PollAnswer
     */
    public function setNumVotes(int $numVotes): PollAnswer
    {
        $this->numVotes = $numVotes;
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
     * @return PollAnswer
     */
    public function setDateCreated(DateTime $dateCreated): PollAnswer
    {
        $this->dateCreated = $dateCreated;
        return $this;
    }
}
