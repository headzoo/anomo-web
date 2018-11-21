<?php
namespace App\Controller\Api;

use App\Anomo\Anomo;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/feeds", name="api_feeds_", options={"expose"=true})
 */
class FeedsController extends Controller
{
    /**
     * @Route("", name="index")
     */
    public function indexAction()
    {
        return ['recent', 'following', 'popular'];
    }

    /**
     * @Route(
     *     "/anomo/{name}/{lastActivityID<\d+>}",
     *     defaults={"lastActivityID": 0},
     *     name="anomo",
     *     methods={"GET"}
     * )
     *
     * @param Anomo $anomo
     * @param string $name
     * @param int $lastActivityID
     * @return array
     */
    public function anomoAction(Anomo $anomo, $name, $lastActivityID)
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
