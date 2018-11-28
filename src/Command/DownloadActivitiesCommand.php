<?php
namespace App\Command;

use App\Anomo\Anomo;
use App\Anomo\Serializer;
use App\Entity\Activity;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Class DownloadFeedsCommand
 */
class DownloadActivitiesCommand extends Command
{
    /**
     * @var Anomo
     */
    protected $anomo;

    /**
     * @var Serializer
     */
    protected $serializer;

    /**
     * @var EntityManagerInterface
     */
    protected $em;

    /**
     * Constructor
     *
     * @param Anomo $anomo
     * @param Serializer $serializer
     * @param EntityManagerInterface $em
     */
    public function __construct(Anomo $anomo, Serializer $serializer, EntityManagerInterface $em)
    {
        $this->anomo      = $anomo;
        $this->serializer = $serializer;
        $this->em         = $em;

        parent::__construct();
    }

    /**
     *
     */
    protected function configure()
    {
        $this
            ->setName('app:download-activities')
            ->setDescription('Downloads recent activities.')
            ->addOption('username', null, InputOption::VALUE_OPTIONAL, 'Authentication username.')
            ->addOption('password', null, InputOption::VALUE_OPTIONAL, 'Authentication password.')
            ->addOption('token', null, InputOption::VALUE_OPTIONAL, 'Authentication token.');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int|null|void
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $token = $this->login(
            $input->getOption('token'),
            $input->getOption('username'),
            $input->getOption('password')
        );
        if (!$token) {
            $output->writeln('Could not log in and no token supplied.');
            return;
        }
        $output->writeln('Logged in with token: ' . $token);

        $feed = $this->anomo->get('feed', [
            'gender'         => 0,
            'minAge'         => 13,
            'maxAge'         => 100,
            'actionType'     => 1,
            'feedType'       => 'recent',
            'lastActivityID' => 0
        ]);

        foreach($feed['Activities'] as $activity) {
            $output->writeln(sprintf('Saving %s', $activity['ActivityID']));
            $this->saveActivity($activity);
        }
    }

    /**
     * @param string $token
     * @param string $username
     * @param string $password
     * @return string
     */
    private function login($token, $username, $password)
    {
        if (!$token) {
            $resp = $this->anomo->post('userLogin', [], [
                'UserName' => $username,
                'Password' => md5($password)
            ]);
            if ($resp['token']) {
                $token = $resp['token'];
            }
        }
        if ($token) {
            $this->anomo->getEndpoints()->setDefaultParam('token', $token);
        }

        return $token;
    }

    /**
     * @param array $activity
     * @return Activity
     */
    protected function saveActivity(array $activity)
    {
        $activityEntity = $this->serializer->unserializeActivity($activity);
        $this->em->persist($activityEntity);

        if (isset($activity['ListComment'])) {
            foreach($activity['ListComment'] as $comment) {
                $commentEntity = $this->serializer->unserializeComment($comment, $activityEntity);
                $this->em->persist($commentEntity);
            }
        }

        $this->em->flush();

        return $activityEntity;
    }
}
