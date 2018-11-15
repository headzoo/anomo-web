<?php
namespace App\Controller\Api;

use App\Anomo\Anomo;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/feeds", name="api_feeds_")
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
     * @Route("/{name}", name="fetch")
     *
     * @param Anomo $anomo
     * @param string $name
     * @return string
     */
    public function fetchAction(Anomo $anomo, $name)
    {
        $url = $anomo->endpoint('activityFetch', [
            'token'          => 'abc',
            'lastActivityID' => 0
        ]);
        $resp = $anomo->get($url);

        return $name;
    }
}
