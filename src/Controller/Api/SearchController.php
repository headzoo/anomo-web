<?php
namespace App\Controller\Api;

use App\Anomo\Anomo;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route(
 *     "/search",
 *     name="api_search_",
 *     options={"expose"=true}
 * )
 */
class SearchController
{
    /**
     * @Route("/users/{userID}/{latitude}/{longitude}", name="users", methods={"GET"})
     *
     * @param Anomo $anomo
     * @param int $userID
     * @param float $latitude
     * @param float $longitude
     * @return array
     */
    public function usersAction(Anomo $anomo, $userID, $latitude, $longitude)
    {
        return $anomo->get('userSearch', [
            'minAge'    => 13,
            'maxAge'    => 100,
            'userID'    => $userID,
            'latitude'  => $latitude,
            'longitude' => $longitude
        ]);
    }
}
