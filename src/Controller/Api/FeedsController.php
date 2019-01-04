<?php
namespace App\Controller\Api;

use App\Http\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route(
 *     "/feeds",
 *     name="api_feeds_",
 *     options={"expose"=true},
 *     requirements={"userID": "\d+"}
 * )
 */
class FeedsController extends Controller
{
    /**
     * @Route("", name="index", methods={"GET"})
     */
    public function indexAction()
    {
        return ['recent', 'following', 'popular', 'hashtags'];
    }

    /**
     * @Route("/users/{userID}", name="user", methods={"GET"})
     *
     * @param Request $request
     * @param int $userID
     * @return array
     */
    public function userAction(Request $request, $userID)
    {
        $feed = $this->anomo->get('feedProfile', [
            'userID'         => $userID,
            'lastActivityID' => $request->query->get('lastActivityID', 0)
        ]);

        $this->saveActivities($feed['Activities']);

        return $feed;
    }

    /**
     * @Route("/hashtags/_trending", name="hashtags_trending", methods={"GET"})
     *
     * @return array
     */
    public function trendingHashtagsAction()
    {
        return $this->anomo->get('trendingHashtags');
    }

    /**
     * @Route("/hashtags/{hashtag}", name="hashtag", methods={"GET"})
     *
     * @param Request $request
     * @param string $hashtag
     * @return array
     */
    public function hashtagAction(Request $request, $hashtag)
    {
        $feed = $this->anomo->post('feedHashtag', [
            'page'   => $request->query->get('page', 1),
            'minAge' => 13,
            'maxAge' => 100
        ], [
            'HashTag' => $hashtag
        ]);

        $this->saveActivities($feed['Activities']);

        return $feed;
    }

    /**
     * @Route("/{name}", name="fetch", methods={"GET"})
     *
     * @param Request $request
     * @param string $name
     * @return array
     */
    public function fetchAction(Request $request, $name)
    {
        $name = strtolower($name);
        $feedTypes = [
            'recent'    => 0,
            'popular'   => 2,
            'following' => 3
        ];
        if (!isset($feedTypes[$name])) {
            throw $this->createNotFoundException();
        }

        $feeds = $this->anomo->get('feed', [
            'gender'         => 0,
            'minAge'         => 13,
            'maxAge'         => 100,
            'actionType'     => 1,
            'feedType'       => $feedTypes[$name],
            'lastActivityID' => $request->query->get('lastActivityID', 0)
        ]);

        if ($name === 'recent') {
            $activity = [
                'ActivityID' => '1578597',
                'FromUserID' => '316610',
                'Image' => '',
                'RefID' => '1433781',
                'Type' => '27',
                'ActionType' => '27',
                'CreatedDate' => '2018-11-27 15:38:38',
                'Gender' => '2',
                'BirthDate' => '1985-03-11',
                'NeighborhoodID' => '60296',
                'Mention' => '',
                'Avatar' => 'http://anomo-production1.s3.amazonaws.com/upload/36e8a60dba3c27955d8751c4babb0422.jpg',
                'FromUserName' => 'fornicake',
                'IsFavorite' => '1',
                'Like' => '0',
                'Comment' => '0',
                'EventEndDate' => '',
                'EventLat' => '0',
                'EventLong' => '0',
                'NumberIamGoing' => '0',
                'AmIGoing' => '0',
                'ImageHeight' => 300,
                'ImageWidth' => 200,
                'IsDeleted' => false,
                'DeleteIsSending' => false,
                'LikeIsLoading' => false,
                'LikeList' => [],
                'ListComment' => [],
                'Message' => json_encode([
                    'message' => 'Hi there. https://i.scnstr.com/comic23.gif
How goes it?',
                    'message_tags' => []
                ])
            ];
            // array_unshift($feeds['Activities'], $activity);
        }

        if (!empty($feeds['Activities'])) {
            $activities = $this->saveActivities($feeds['Activities']);
            $feeds['Activities'] = $this->serializer->serializeActivities($activities, $feeds['Activities']);
        }

        return $feeds;
    }
}
