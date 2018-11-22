<?php
namespace App\Controller\Api;

use App\Anomo\Anomo;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route(
 *     "/feeds",
 *     name="api_feeds_",
 *     options={"expose"=true},
 *     defaults={"lastActivityID": 0, "page": 1},
 *     requirements={"lastActivityID": "\d+"}
 * )
 */
class FeedsController extends Controller
{
    /**
     * @Route("", name="index")
     */
    public function indexAction()
    {
        return ['recent', 'following', 'popular', 'hashtags'];
    }

    /**
     * @Route("/hashtags/trending", name="hashtags_trending", methods={"GET"})
     *
     * @param Anomo $anomo
     * @return array
     */
    public function hashtagsAction(Anomo $anomo)
    {
        return $anomo->get('trendingHashtags');
    }

    /**
     * @Route("/{name}/{lastActivityID}", name="fetch", methods={"GET"})
     *
     * @param Anomo $anomo
     * @param string $name
     * @param int $lastActivityID
     * @return array
     */
    public function fetchAction(Anomo $anomo, $name, $lastActivityID)
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

        return $anomo->get('feed', [
            'gender'         => 0,
            'minAge'         => 13,
            'maxAge'         => 100,
            'actionType'     => 1,
            'feedType'       => $feedTypes[$name],
            'lastActivityID' => $lastActivityID
        ]);
    }
}