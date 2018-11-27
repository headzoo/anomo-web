<?php
namespace App\Entity;

use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="poll")
 * @ORM\Entity(repositoryClass="App\Repository\PollRepository")
 */
class Poll
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
     * @ORM\OneToOne(targetEntity="Activity", cascade={"all"})
     * @ORM\JoinColumn(name="activity_id", onDelete="CASCADE", referencedColumnName="id")
     */
    private $activity;

    /**
     * @var string
     * @ORM\Column(type="string", length=520, nullable=false)
     */
    private $question;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="PollAnswer", mappedBy="poll")
     */
    private $answers;

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
        $this->answers     = new ArrayCollection();
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
     * @return Poll
     */
    public function setAnomoId(int $anomoId): Poll
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
     * @return Poll
     */
    public function setActivity(Activity $activity): Poll
    {
        $this->activity = $activity;
        return $this;
    }

    /**
     * @return string
     */
    public function getQuestion(): string
    {
        return $this->question;
    }

    /**
     * @param string $question
     * @return Poll
     */
    public function setQuestion(string $question): Poll
    {
        $this->question = $question;
        return $this;
    }

    /**
     * @return Collection
     */
    public function getAnswers(): Collection
    {
        return $this->answers;
    }

    /**
     * @param Collection $answers
     * @return Poll
     */
    public function setAnswers(Collection $answers): Poll
    {
        $this->answers = $answers;
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
     * @return Poll
     */
    public function setDateCreated(DateTime $dateCreated): Poll
    {
        $this->dateCreated = $dateCreated;
        return $this;
    }
}
