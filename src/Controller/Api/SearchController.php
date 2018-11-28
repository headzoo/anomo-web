<?php
namespace App\Controller\Api;

use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route(
 *     "/search",
 *     name="api_search_",
 *     options={"expose"=true}
 * )
 */
class SearchController extends Controller
{
    /**
     * @Route("/users/{userID}/{latitude}/{longitude}", name="users", methods={"GET"})
     *
     * @param int $userID
     * @param float $latitude
     * @param float $longitude
     * @return array
     */
    public function usersAction($userID, $latitude, $longitude)
    {
        return $this->anomo->get('userSearch', [
            'minAge'    => 13,
            'maxAge'    => 100,
            'userID'    => $userID,
            'latitude'  => $latitude,
            'longitude' => $longitude
        ]);
    }
}
